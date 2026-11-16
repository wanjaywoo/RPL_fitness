// src/routes/historyRoutes.js
// Endpoint riwayat gabungan GET /api/history (TUGAS_API_RIWAYAT.md, FR-12, BR-13)

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const historyService = require('../services/historyService');
const { getLocalDateString } = require('../utils/time');

router.use(authMiddleware);

// GET /api/history
router.get('/', async (req, res, next) => {
  try {
    // Administrator tidak boleh membaca data kesehatan pengguna (HTTP 403 Forbidden, BR-13)
    if (req.user.role === 'admin') {
      return res.status(403).json({
        error: 'Administrator dilarang mengakses data kesehatan pengguna (BR-13)'
      });
    }

    const { period, type, page, pageSize } = req.query;
    const today = getLocalDateString(new Date(), req.user.timeZone);

    const historyData = await historyService.getHistory({
      userId: req.user.id,
      period: period !== undefined ? period : 30,
      type: type || 'all',
      page: page !== undefined ? page : 1,
      pageSize: pageSize !== undefined ? pageSize : 8,
      today
    });

    res.json(historyData);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

module.exports = router;
