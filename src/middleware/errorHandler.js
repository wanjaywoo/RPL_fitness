// src/middleware/errorHandler.js
// Middleware penanganan kesalahan terpusat

function errorHandler(err, req, res, next) {
  console.error('[Error Handler]:', err.message || err);

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Terjadi kesalahan internal pada server',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
