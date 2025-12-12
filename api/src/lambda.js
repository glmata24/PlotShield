'use strict';

const serverless = require('serverless-http');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

let serverlessHandler;

let secretsLoaded = false;

async function loadSecretsOnce() {
  if (secretsLoaded) {
    return;
  }

  // When running offline, use dotenv and skip Secrets Manager entirely
  if (process.env.IS_OFFLINE) {
    try {
      // Lazy-require to avoid unnecessary dependency when running in Lambda
      // and to keep behavior scoped to offline/dev usage.
      require('dotenv').config();
    } catch (err) {
      console.error('Error loading .env in offline mode:', err);
    }
    secretsLoaded = true;
    return;
  }

  const secretId = process.env.SECRETS_ID;
  if (!secretId) {
    // No secret configured; mark as loaded and continue without throwing.
    secretsLoaded = true;
    return;
  }

  try {
    const client = new SecretsManagerClient({});
    const command = new GetSecretValueCommand({ SecretId: secretId });
    const response = await client.send(command);

    let secretString = response.SecretString;

    // For binary secrets, decode the Buffer; though typical env payloads use SecretString.
    if (!secretString && response.SecretBinary) {
      const buff = Buffer.from(response.SecretBinary, 'base64');
      secretString = buff.toString('utf-8');
    }

    if (secretString) {
      try {
        const parsed = JSON.parse(secretString);
        if (parsed && typeof parsed === 'object') {
          Object.assign(process.env, parsed);
        }
      } catch (parseErr) {
        console.error('Failed to parse Secrets Manager JSON:', parseErr);
      }
    }
  } catch (err) {
    // Swallow errors to ensure cold start never throws.
    console.error('Error loading secrets from AWS Secrets Manager:', err);
  } finally {
    secretsLoaded = true;
  }
}

module.exports.handler = async (event, context) => {
  try {
    await loadSecretsOnce();

    if (!serverlessHandler) {
      const app = require('./index');
      serverlessHandler = serverless(app);
    }

    return await serverlessHandler(event, context);
  } catch (err) {
    console.error('Unhandled error in Lambda handler:', err);
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        status: 500,
        error: 'InternalServerError',
        message: err && err.message ? err.message : 'Unknown error',
        requestId: context && context.awsRequestId ? context.awsRequestId : undefined
      })
    };
  }
};
