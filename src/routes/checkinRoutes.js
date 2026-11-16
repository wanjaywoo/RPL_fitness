// src/routes/checkinRoutes.js
// Endpoint Check-in Harian (FR-03, BR-04, BR-05, BR-08)
// Sesuai dengan mockup tampilan ketiga.png

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const workoutRepository = require('../repositories/workoutRepository');
const checkinRepository = require('../repositories/checkinRepository');
const streakRepository = require('../repositories/streakRepository');
const nutritionLogRepository = require('../repositories/nutritionLogRepository');
const weightLogRepository = require('../repositories/weightLogRepository');
const goalRepository = require('../repositories/goalRepository');
const streakService = require('../services/streakService');
const { getLocalDateString } = require('../utils/time');

router.use(authMiddleware);

// POST /api/checkins: Menyimpan check-in harian lengkap
router.post('/', (req, res, next) => {
  try {
    const {
      date,
      activityType = 'Gym',
      durationMinutes,
      distanceKm = 0,
      exercises = [],
      calories,
      protein,
      carbs,
      fat,
      weight,
      notes = ''
    } = req.body;

    const checkinDate = date || getLocalDateString(new Date(), req.user.timeZone);

    // Validasi durasi latihan 10-300 menit (BR-04)
    const duration = Number(durationMinutes);
    const validation = streakService.validateWorkoutLogs([{ durationMinutes: duration }]);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.reason });
    }

    // 1. Simpan sesi latihan ke tabel workouts
    const workoutId = workoutRepository.createWorkout({
      userId: req.user.id,
      loggedDate: checkinDate,
      activityType,
      durationMinutes: duration,
      distanceKm: Number(distanceKm) || 0,
      notes
    });

    // 2. Simpan rincian gerakan jika ada
    if (Array.isArray(exercises) && exercises.length > 0) {
      exercises.forEach((ex, idx) => {
        workoutRepository.addWorkoutExercise({
          workoutId,
          exerciseId: ex.exerciseId || null,
          exerciseName: ex.name || ex.exerciseName || 'Gerakan',
          sets: ex.sets || 3,
          reps: ex.reps || '10',
          weightKg: ex.weightKg || 0,
          isCompleted: 1,
          orderIndex: idx
        });
      });
    }

    // 3. Simpan log nutrisi jika diisi
    if (calories) {
      nutritionLogRepository.addOrUpdateLog({
        userId: req.user.id,
        loggedDate: checkinDate,
        calories: Number(calories),
        proteinGrams: Number(protein) || 0,
        carbGrams: Number(carbs) || 0,
        fatGrams: Number(fat) || 0,
        notes
      });
    }

    // 4. Simpan berat badan jika diisi
    if (weight) {
      weightLogRepository.addLog({
        userId: req.user.id,
        weightKg: Number(weight),
        loggedDate: checkinDate
      });
    }

    // 5. Catat check-in sah (BR-04: multiple checkins in a single date count as 1)
    checkinRepository.createCheckin({
      userId: req.user.id,
      checkinDate,
      workoutId,
      isValid: 1
    });

    // 6. Hitung ulang streak pengguna dari riwayat check-in
    const allCheckinDates = checkinRepository.getCheckinDatesByUserId(req.user.id);
    const activeGoal = goalRepository.findActiveByUserId(req.user.id);
    const scheduledDays = activeGoal && activeGoal.workout_days_per_week === 5 
      ? [1, 2, 3, 4, 5] 
      : [1, 2, 4, 5]; // Default 4 hari (Sen, Sel, Kam, Jum)

    const startDate = allCheckinDates.length > 0 ? allCheckinDates[0] : checkinDate;

    const streakResult = streakService.calculateStreak({
      checkinDates: allCheckinDates,
      scheduledDays,
      startDate,
      currentDate: checkinDate
    });

    // Simpan streak ke database
    streakRepository.upsertStreak({
      userId: req.user.id,
      currentStreak: streakResult.currentStreak,
      bestStreak: streakResult.bestStreak,
      lastCheckinDate: checkinDate
    });

    // Hitung skor konsistensi
    const consistencyScore = streakService.calculateConsistencyScore({
      checkinDates: allCheckinDates,
      scheduledDays,
      startDate,
      endDate: checkinDate
    });

    res.status(201).json({
      message: 'Check-in berhasil disimpan!',
      checkinDate,
      currentStreak: streakResult.currentStreak,
      bestStreak: streakResult.bestStreak,
      consistencyScore
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/checkins/status-today: Cek apakah hari ini sudah check-in
router.get('/status-today', (req, res) => {
  const todayDate = getLocalDateString(new Date(), req.user.timeZone);
  const hasCheckedIn = checkinRepository.hasCheckinOnDate(req.user.id, todayDate);
  const streak = streakRepository.getByUserId(req.user.id);

  res.json({
    todayDate,
    hasCheckedIn,
    currentStreak: streak ? streak.current_streak : 0,
    bestStreak: streak ? streak.best_streak : 0
  });
});

// GET /api/checkins/history: Mengambil riwayat lengkap check-in, nutrisi, dan berat badan
router.get('/history', (req, res) => {
  const db = require('../db/connection');
  const userId = req.user.id;

  // 1. Riwayat checkin latihan
  const workoutsStmt = db.prepare(`
    SELECT w.*, c.is_valid,
      (SELECT GROUP_CONCAT(exercise_name || ' (' || sets || 'x' || reps || ')', ', ') 
       FROM workout_exercises WHERE workout_id = w.id) as exercises_summary
    FROM workouts w
    LEFT JOIN checkins c ON (w.user_id = c.user_id AND w.logged_date = c.checkin_date)
    WHERE w.user_id = ?
    ORDER BY w.logged_date DESC, w.id DESC
    LIMIT 30
  `);
  const workouts = workoutsStmt.all(userId);

  // 2. Riwayat nutrisi
  const nutritionStmt = db.prepare(`
    SELECT * FROM nutrition_logs
    WHERE user_id = ?
    ORDER BY logged_date DESC, id DESC
    LIMIT 30
  `);
  const nutrition = nutritionStmt.all(userId);

  // 3. Riwayat timbangan berat badan
  const weightStmt = db.prepare(`
    SELECT * FROM weight_logs
    WHERE user_id = ?
    ORDER BY logged_date DESC, id DESC
    LIMIT 30
  `);
  const weights = weightStmt.all(userId);

  res.json({
    workouts,
    nutrition,
    weights
  });
});

module.exports = router;
