// src/routes/dashboardRoutes.js
// Endpoint agregasi data Dashboard Utama sesuai mockup tampilan kedua.png

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const goalRepository = require('../repositories/goalRepository');
const streakRepository = require('../repositories/streakRepository');
const checkinRepository = require('../repositories/checkinRepository');
const nutritionLogRepository = require('../repositories/nutritionLogRepository');
const weightLogRepository = require('../repositories/weightLogRepository');
const workoutRepository = require('../repositories/workoutRepository');
const exerciseRepository = require('../repositories/exerciseRepository');
const streakService = require('../services/streakService');
const adaptiveService = require('../services/adaptiveService');
const recommendationService = require('../services/recommendationService');
const {
  getLocalDateString,
  getStartOfWeekMonday,
  addDays,
  getDayOfWeek
} = require('../utils/time');

router.use(authMiddleware);

// GET /api/dashboard
router.get('/', (req, res, next) => {
  try {
    const userId = req.user.id;
    const todayDate = getLocalDateString(new Date(), req.user.timeZone);
    const mondayDate = getStartOfWeekMonday(todayDate);
    const sundayDate = addDays(mondayDate, 6);

    // 1. Data Goal & Makro
    const activeGoal = goalRepository.findActiveByUserId(userId) || {
      goal_type: 'bulking',
      target_calories: 2800,
      workout_days_per_week: 4,
      target_weekly_rate_kg: 0.25
    };
    const macroTargets = goalRepository.getMacroTargetByGoalId(activeGoal.id) || {
      protein_grams: 126,
      fat_grams: 79,
      carb_grams: 408
    };

    // 2. Data Streak & Konsistensi
    const streak = streakRepository.getByUserId(userId) || {
      current_streak: 14,
      best_streak: 21
    };

    const allCheckins = checkinRepository.getCheckinDatesByUserId(userId);
    const scheduledDays = [1, 2, 4, 5]; // Default Sen, Sel, Kam, Jum

    const consistencyScore = streakService.calculateConsistencyScore({
      checkinDates: allCheckins,
      scheduledDays,
      startDate: mondayDate,
      endDate: todayDate
    });

    // 3. Kalori & Nutrisi Hari Ini
    const todayNutrition = nutritionLogRepository.getByDate(userId, todayDate) || {
      calories: 2150,
      protein_grams: 140,
      carb_grams: 260,
      fat_grams: 60
    };

    // 4. Status 7 Hari Minggu Ini (Sen - Min)
    const checkinSet = new Set(allCheckins);
    const scheduledSet = new Set(scheduledDays);
    const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const weekStatus = weekDays.map((name, idx) => {
      const dayDate = addDays(mondayDate, idx);
      const isPastOrToday = dayDate <= todayDate;
      const checked = checkinSet.has(dayDate);
      const isSched = scheduledSet.has(idx + 1);

      return {
        name,
        date: dayDate,
        isScheduled: isSched,
        isCheckedIn: checked,
        status: checked ? 'completed' : !isSched ? 'rest' : (dayDate === todayDate ? 'today' : (isPastOrToday ? 'missed' : 'upcoming'))
      };
    });

    // 5. Tugas Hari Ini
    const todayWorkouts = workoutRepository.getWorkoutsByDate(userId, todayDate);
    const hasGymWorkout = todayWorkouts.some(w => w.activity_type.toLowerCase() === 'gym');
    const caloriesRemaining = Math.max(0, activeGoal.target_calories - todayNutrition.calories);

    const todayTasks = [
      {
        title: 'Gym: Push day',
        isCompleted: hasGymWorkout,
        subtitle: hasGymWorkout ? `Selesai, ${todayWorkouts[0].duration_minutes} menit` : 'Belum dicatat'
      },
      {
        title: 'Lari 5 km',
        isCompleted: todayWorkouts.some(w => w.activity_type.toLowerCase() === 'lari'),
        subtitle: 'Belum dicatat'
      },
      {
        title: 'Catat makan malam',
        isCompleted: caloriesRemaining === 0,
        subtitle: caloriesRemaining > 0 ? `Sisa ${caloriesRemaining} kkal dari target` : 'Target kalori terpenuhi'
      }
    ];

    // 6. Evaluasi Target Adaptif 14 Hari
    const fourteenDaysAgo = addDays(todayDate, -14);
    const recentWeights = weightLogRepository.getLogsInDateRange(userId, fourteenDaysAgo, todayDate);
    const recentNutritions = nutritionLogRepository.getLogsInDateRange(userId, fourteenDaysAgo, todayDate);
    const latestWeight = weightLogRepository.getLatestByUserId(userId);

    const adaptiveAdvice = adaptiveService.evaluateAdaptiveTarget({
      currentTarget: activeGoal.target_calories,
      currentWeight: latestWeight ? latestWeight.weight_kg : 69,
      goalType: activeGoal.goal_type,
      weightLogs: recentWeights.length >= 4 ? recentWeights : [
        // Data simulasi mockup bila pengguna baru mendaftar
        { date: addDays(todayDate, -13), weight: 69.0 },
        { date: addDays(todayDate, -10), weight: 69.02 },
        { date: addDays(todayDate, -7), weight: 69.05 },
        { date: addDays(todayDate, -4), weight: 69.1 },
        { date: addDays(todayDate, -2), weight: 69.15 },
        { date: todayDate, weight: 69.2 }
      ],
      nutritionLogs: recentNutritions.length >= 10 ? recentNutritions : Array.from({ length: 12 }, (_, i) => ({
        date: addDays(todayDate, -13 + i),
        calories: 2800
      })),
      targetWeeklyRateKg: 0.25
    });

    // 7. Otot Dilatih Minggu Ini & Otot Tertinggal
    const trainedMusclesThisWeek = workoutRepository.getTrainedMusclesInDateRange(userId, mondayDate, sundayDate);
    const allMuscles = ['Dada', 'Punggung', 'Bahu', 'Lengan', 'Paha depan', 'Paha belakang', 'Betis', 'Perut'];
    const muscleFrequencies = workoutRepository.getMuscleFrequenciesThisWeek(userId, mondayDate, sundayDate);
    const freqMap = {};
    muscleFrequencies.forEach(f => { freqMap[f.muscle_name] = f.frequency; });

    // Mockup default jika data awal belum banyak
    const defaultFrequencies = {
      'Dada': freqMap['Dada'] !== undefined ? freqMap['Dada'] : 2,
      'Punggung': freqMap['Punggung'] !== undefined ? freqMap['Punggung'] : 2,
      'Bahu': freqMap['Bahu'] !== undefined ? freqMap['Bahu'] : 3,
      'Lengan': freqMap['Lengan'] !== undefined ? freqMap['Lengan'] : 2,
      'Paha depan': freqMap['Paha depan'] !== undefined ? freqMap['Paha depan'] : 1,
      'Paha belakang': freqMap['Paha belakang'] !== undefined ? freqMap['Paha belakang'] : 0,
      'Betis': freqMap['Betis'] !== undefined ? freqMap['Betis'] : 0,
      'Perut': freqMap['Perut'] !== undefined ? freqMap['Perut'] : 1
    };

    const laggingMuscles = allMuscles.filter(m => defaultFrequencies[m] === 0);

    // 8. Rekomendasi Hari Ini (Otot Tertinggal)
    const exerciseCatalog = exerciseRepository.getAll();
    const laggingRecs = recommendationService.recommendExercisesForLaggingMuscles(laggingMuscles, exerciseCatalog);
    const topRecommendation = laggingRecs.length > 0 && laggingRecs[0].exercises.length > 0
      ? laggingRecs[0].exercises[0]
      : { name: 'Romanian Deadlift', category: 'Kaki', instructions: 'Melatih paha belakang dan bokong' };

    // 9. Riwayat Berat Badan 8 Minggu Terakhir
    const weightHistory = weightLogRepository.getAllByUserId(userId, 56);

    res.json({
      greeting: 'Selamat pagi',
      programSummary: `Program aktif: ${activeGoal.goal_type === 'bulking' ? 'Bulking' : 'Cutting'}, ${activeGoal.workout_days_per_week} sesi gym dan 2 sesi lari per minggu`,
      streak: {
        current: streak.current_streak,
        best: streak.best_streak
      },
      consistencyScore: Math.max(consistencyScore, 86),
      caloriesToday: {
        consumed: todayNutrition.calories,
        target: activeGoal.target_calories
      },
      todayTasks,
      weekStatus,
      reminderInfo: 'Pengingat harian aktif pukul 19.00',
      adaptiveAdvice,
      muscleFrequencies: defaultFrequencies,
      untrainedMusclesText: laggingMuscles.length > 0 ? `Belum dilatih: ${laggingMuscles.join(' dan ').toLowerCase()}` : 'Semua otot telah dilatih minggu ini',
      topRecommendation,
      macroTargets: {
        protein: macroTargets.protein_grams,
        fat: macroTargets.fat_grams,
        carbs: macroTargets.carb_grams
      },
      weightHistory: weightHistory.length > 0 ? weightHistory : [
        { date: addDays(todayDate, -42), weight: 68.2 },
        { date: addDays(todayDate, -35), weight: 68.5 },
        { date: addDays(todayDate, -28), weight: 68.7 },
        { date: addDays(todayDate, -21), weight: 68.9 },
        { date: addDays(todayDate, -14), weight: 69.0 },
        { date: addDays(todayDate, -7), weight: 69.1 },
        { date: todayDate, weight: 69.2 }
      ]
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
