// src/routes/profileRoutes.js
// Endpoint profil pengguna

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userRepository = require('../repositories/userRepository');
const weightLogRepository = require('../repositories/weightLogRepository');

router.use(authMiddleware);

// GET /api/profile
router.get('/', (req, res) => {
  const user = userRepository.findById(req.user.id);
  const latestWeight = weightLogRepository.getLatestByUserId(req.user.id);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    birthDate: user.birth_date,
    heightCm: user.height_cm,
    currentWeightKg: latestWeight ? latestWeight.weight_kg : null,
    timeZone: user.time_zone,
    role: user.role
  });
});

// PUT /api/profile
router.put('/', (req, res, next) => {
  try {
    const { name, heightCm, timeZone } = req.body;
    const updated = userRepository.updateProfile(req.user.id, {
      name,
      heightCm: heightCm ? Number(heightCm) : undefined,
      timeZone
    });

    res.json({
      message: 'Profil berhasil diperbarui',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        heightCm: updated.height_cm,
        timeZone: updated.time_zone
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
