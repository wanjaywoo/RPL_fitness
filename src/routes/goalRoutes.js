// src/routes/goalRoutes.js
// Endpoint target kebugaran, kalori, makronutrisi, dan target adaptif (BR-01..BR-03, BR-09, BR-12)

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const goalRepository = require('../repositories/goalRepository');
const weightLogRepository = require('../repositories/weightLogRepository');
const calorieService = require('../services/calorieService');
const macroService = require('../services/macroService');

router.use(authMiddleware);

// GET /api/goals/active
router.get('/active', (req, res) => {
  const goal = goalRepository.findActiveByUserId(req.user.id);
  if (!goal) {
    return res.status(404).json({ error: 'Belum ada target aktif' });
  }

  const macros = goalRepository.getMacroTargetByGoalId(goal.id);
  const latestWeight = weightLogRepository.getLatestByUserId(req.user.id);
  const weightKg = latestWeight ? latestWeight.weight_kg : 70;

  const birth = new Date(req.user.birthDate);
  const age = new Date().getFullYear() - birth.getFullYear();

  const bmr = calorieService.calculateBmr({
    weight: weightKg,
    height: req.user.heightCm,
    age,
    gender: req.user.gender
  });

  const tdee = calorieService.calculateTdee({
    bmr,
    activityLevel: goal.activity_level || 'light'
  });

  res.json({
    goal,
    macros,
    metrics: {
      weightKg,
      heightCm: req.user.heightCm,
      age,
      gender: req.user.gender,
      bmr,
      tdee,
      activityLevel: goal.activity_level || 'light'
    }
  });
});

// POST /api/goals: Menetapkan target baru dengan kalkulasi ulang
router.post('/', (req, res, next) => {
  try {
    const { goalType, activityLevel, workoutDaysPerWeek } = req.body;
    const latestWeight = weightLogRepository.getLatestByUserId(req.user.id);

    if (!latestWeight) {
      return res.status(400).json({ error: 'Data berat badan belum tersedia' });
    }

    const birth = new Date(req.user.birthDate);
    const age = new Date().getFullYear() - birth.getFullYear();

    const bmr = calorieService.calculateBmr({
      weight: latestWeight.weight_kg,
      height: req.user.heightCm,
      age,
      gender: req.user.gender
    });

    const tdee = calorieService.calculateTdee({
      bmr,
      activityLevel: activityLevel || 'light'
    });

    const targetCalories = calorieService.calculateTargetCalories({
      tdee,
      bmr,
      gender: req.user.gender,
      strategy: goalType || 'bulking'
    });

    const newGoal = goalRepository.createGoal({
      userId: req.user.id,
      goalType: goalType || 'bulking',
      targetCalories,
      activityLevel: activityLevel || 'light',
      workoutDaysPerWeek: workoutDaysPerWeek || 4,
      targetWeeklyRateKg: goalType === 'bulking' ? 0.25 : -0.45
    });

    const macros = macroService.calculateMacros({
      targetCalories,
      weight: latestWeight.weight_kg,
      strategy: goalType || 'bulking'
    });

    goalRepository.saveMacroTarget({
      goalId: newGoal.id,
      userId: req.user.id,
      proteinGrams: macros.protein,
      fatGrams: macros.fat,
      carbGrams: macros.carbs
    });

    res.json({
      message: 'Target berhasil diperbarui',
      goal: newGoal,
      macros
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/goals/accept-adaptive: Menerima saran kalori adaptif (Layar 2: Terima saran)
router.post('/accept-adaptive', (req, res, next) => {
  try {
    const { newTargetCalories } = req.body;
    if (!newTargetCalories) {
      return res.status(400).json({ error: 'Nilai target kalori baru wajib diisi' });
    }

    const currentGoal = goalRepository.findActiveByUserId(req.user.id);
    if (!currentGoal) {
      return res.status(404).json({ error: 'Target aktif tidak ditemukan' });
    }

    goalRepository.updateTargetCalories(currentGoal.id, Number(newTargetCalories));

    // Perbarui juga alokasi makro berdasarkan kalori baru
    const latestWeight = weightLogRepository.getLatestByUserId(req.user.id);
    const weight = latestWeight ? latestWeight.weight_kg : 70;

    const macros = macroService.calculateMacros({
      targetCalories: Number(newTargetCalories),
      weight,
      strategy: currentGoal.goal_type
    });

    goalRepository.saveMacroTarget({
      goalId: currentGoal.id,
      userId: req.user.id,
      proteinGrams: macros.protein,
      fatGrams: macros.fat,
      carbGrams: macros.carbs
    });

    res.json({
      message: 'Target kalori adaptif berhasil diterima!',
      newTargetCalories: Number(newTargetCalories),
      macros
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
