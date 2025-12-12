const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Prefer new env names but support legacy/common alternatives for compatibility
const pickEnv = (...keys) => keys.map((k) => process.env[k]).find(Boolean);

const SUPABASE_URL = pickEnv(
  'SUPABASE_URL',
  'SUPABASE_PROJECT_URL',
  'PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
);

// Public/anon key (client-safe)
const SUPABASE_ANON_KEY = pickEnv(
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_ANON_KEY',
  'SUPABASE_PUBLIC_ANON_KEY',
  'PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
);

// Secret key (server-side, replaces legacy service role naming)
const SUPABASE_SERVICE_ROLE_KEY = pickEnv(
  'SUPABASE_SECRET_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_SECRET_SERVICE_ROLE_KEY',
);

// On the server, prefer service role if provided; otherwise use anon
const SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('[supabase] Missing SUPABASE_URL or API key (anon/service role) in environment.');
}

let supabase;
if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false
    }
  });
} else {
  // Avoid crashing the process at import time; fail only when Supabase is actually used.
  supabase = new Proxy(
    {},
    {
      get() {
        throw new Error('Supabase is not configured (missing SUPABASE_URL and/or key).');
      }
    }
  );
}

module.exports = { supabase };
