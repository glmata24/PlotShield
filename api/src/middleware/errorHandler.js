function notFoundHandler(req, res, next) {
  res.status(404).json({ status: 404, error: 'NotFound', message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ status, error: err.code || 'Error', message });
}

module.exports = { errorHandler, notFoundHandler };
