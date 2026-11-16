// src/routes/adminRoutes.js
// Endpoint Administrator (BR-13)
// Aturan: Administrator TIDAK BOLEH membaca data kesehatan (403), semua aksi dicatat di AuditLog.

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin, forbidHealthDataForAdmin } = require('../middleware/roleMiddleware');
const userRepository = require('../repositories/userRepository');
const auditLogRepository = require('../repositories/auditLogRepository');

router.use(authMiddleware);
router.use(requireAdmin);

// GET /api/admin/users: Daftar akun tanpa data kesehatan
router.get('/users', (req, res) => {
  auditLogRepository.logAction({
    adminId: req.user.id,
    action: 'VIEW_USER_LIST',
    details: 'Melihat daftar akun pengguna',
    ipAddress: req.ip
  });

  const users = userRepository.listAllNonSensitive();
  res.json(users);
});

// GET /api/admin/audit-logs: Jejak audit aksi admin
router.get('/audit-logs', (req, res) => {
  const logs = auditLogRepository.getAll();
  res.json(logs);
});

// GET /api/admin/users/:id/health-data: Wajib membalas 403 Forbidden (BR-13)
router.get('/users/:id/health-data', forbidHealthDataForAdmin, (req, res) => {
  // Middleware forbidHealthDataForAdmin akan langsung mencegat dan mengirim status 403
  res.status(403).json({
    error: 'Akses ditolak: Administrator tidak berhak mengakses data kesehatan pengguna (BR-13)'
  });
});

module.exports = router;
