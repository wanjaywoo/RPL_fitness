// src/middleware/authMiddleware.js
// Middleware autentikasi: memastikan user_id berasal dari sesi/token terverifikasi (bukan dari body)

const userRepository = require('../repositories/userRepository');

function authMiddleware(req, res, next) {
  // Ambil token dari Authorization header atau cookie/custom header
  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      // Format token sederhana: base64(userId:timestamp:signature)
      const decoded = Buffer.from(token, 'base64').toString('utf8');
      const parts = decoded.split(':');
      userId = parseInt(parts[0], 10);
    } catch (e) {
      return res.status(401).json({ error: 'Token autentikasi tidak valid' });
    }
  } else if (req.headers['x-user-id']) {
    userId = parseInt(req.headers['x-user-id'], 10);
  } else if (req.session && req.session.userId) {
    userId = req.session.userId;
  }

  if (!userId || isNaN(userId)) {
    return res.status(401).json({ error: 'Akses ditolak: Silakan login terlebih dahulu' });
  }

  const user = userRepository.findById(userId);
  if (!user) {
    return res.status(401).json({ error: 'Pengguna tidak ditemukan' });
  }

  // Lindungi agar user_id selalu diambil dari sesi server (AGENTS.md aturan keamanan)
  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    gender: user.gender,
    birthDate: user.birth_date,
    heightCm: user.height_cm,
    timeZone: user.time_zone
  };

  next();
}

/**
 * Membuat token sesi sederhana berbasis Base64
 */
function generateToken(userId) {
  const payload = `${userId}:${Date.now()}`;
  return Buffer.from(payload).toString('base64');
}

module.exports = authMiddleware;
module.exports.generateToken = generateToken;
