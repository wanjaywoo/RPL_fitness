// src/middleware/roleMiddleware.js
// Middleware pengecekan peran (Role-based access control)
// Sesuai BR-13: Administrator tidak boleh membaca data kesehatan pengguna

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses terlarang: Hanya administrator yang diizinkan' });
  }
  next();
}

function forbidHealthDataForAdmin(req, res, next) {
  // BR-13: Administrator TIDAK BOLEH membaca data kesehatan individu pengguna (balas 403)
  if (req.user && req.user.role === 'admin') {
    return res.status(403).json({
      error: 'Akses terlarang: Sesuai aturan BR-13, administrator dilarang membaca data kesehatan pengguna'
    });
  }
  next();
}

module.exports = {
  requireAdmin,
  forbidHealthDataForAdmin
};
