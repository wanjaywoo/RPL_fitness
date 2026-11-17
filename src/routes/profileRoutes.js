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

// POST /api/profile/weight: Mencatat timbangan berat badan baru
router.post('/weight', (req, res, next) => {
  try {
    const { weightKg, date } = req.body;
    if (!weightKg || isNaN(weightKg)) {
      return res.status(400).json({ error: 'Berat badan harus berupa angka valid' });
    }
    const { getLocalDateString } = require('../utils/time');
    const loggedDate = date || getLocalDateString(new Date(), req.user.timeZone);
    weightLogRepository.addLog({
      userId: req.user.id,
      weightKg: Number(weightKg),
      loggedDate
    });
    res.json({ message: 'Berat badan berhasil dicatat', weightKg: Number(weightKg), loggedDate });
  } catch (error) {
    next(error);
  }
});

// GET /api/profile/reminder: Mendapatkan preferensi pengingat & status evaluasi hari ini (BR-07)
router.get('/reminder', (req, res) => {
  const goalRepository = require('../repositories/goalRepository');
  const checkinRepository = require('../repositories/checkinRepository');
  const { getLocalDateString, getDayOfWeek } = require('../utils/time');
  const reminderService = require('../services/reminderService');

  const user = userRepository.findById(req.user.id);
  const todayDate = getLocalDateString(new Date(), user.time_zone);
  const dayOfWeek = getDayOfWeek(todayDate, user.time_zone);

  const goal = goalRepository.findActiveByUserId(user.id);
  const scheduledDays = goal && goal.workout_days_per_week === 5 ? [1, 2, 3, 4, 5] : [1, 2, 4, 5];
  const isScheduledDay = scheduledDays.includes(dayOfWeek);
  const hasCheckedIn = checkinRepository.hasCheckinOnDate(user.id, todayDate);

  const shouldRemind = reminderService.shouldSendReminder({ isScheduledDay, hasCheckedIn });

  res.json({
    reminderHour: 19, // Bawaan 19:00 sesuai mockup tampilan kedua
    timeZone: user.time_zone,
    todayDate,
    dayOfWeek,
    isScheduledDay,
    hasCheckedIn,
    shouldRemind,
    statusText: hasCheckedIn 
      ? 'Sudah check-in hari ini (Pengingat tidak aktif)' 
      : !isScheduledDay 
        ? 'Hari ini adalah hari istirahat netral (Pengingat tidak dikirim)' 
        : 'Hari ini terjadwal latihan (Pengingat aktif pukul 19:00 WIB)'
  });
});

// POST /api/profile/reminder/test: Simulasi pengujian notifikasi pengingat
router.post('/reminder/test', (req, res) => {
  const user = userRepository.findById(req.user.id);
  res.json({
    success: true,
    title: '🔥 FitStreak - Waktunya Latihan!',
    body: `Halo ${user.name}, ini pengingat harianmu. Jaga konsistensi dan streak latihanmu hari ini!`,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
