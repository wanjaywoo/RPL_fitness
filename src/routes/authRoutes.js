// src/routes/authRoutes.js
// Endpoint autentikasi: Registrasi dan Login (FR-01, FR-02, BR-09)

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const goalRepository = require('../repositories/goalRepository');
const weightLogRepository = require('../repositories/weightLogRepository');
const streakRepository = require('../repositories/streakRepository');
const calorieService = require('../services/calorieService');
const macroService = require('../services/macroService');
const { generateToken } = require('../middleware/authMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { getLocalDateString } = require('../utils/time');

// Helper menghitung usia
function calculateAge(birthDateStr) {
  const birth = new Date(birthDateStr);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// POST /api/auth/register (FR-01, BR-09)
router.post('/register', async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      birthDate,
      heightCm,
      weightKg,
      activityLevel = 'light',
      goalType = 'bulking',
      timeZone = 'Asia/Jakarta'
    } = req.body;

    if (!name || !email || !password || !gender || !birthDate || !heightCm || !weightKg) {
      return res.status(400).json({ error: 'Semua kolom wajib diisi' });
    }

    // Validasi usia minimal 18 tahun (BR-09)
    const age = calculateAge(birthDate);
    if (age < 18) {
      return res.status(400).json({ error: 'Pengguna harus berusia minimal 18 tahun (BR-09)' });
    }

    // Cek email ganda
    const existing = userRepository.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.' });
    }

    // Hash password dengan bcryptjs
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Simpan pengguna baru
    const newUser = userRepository.create({
      name,
      email,
      passwordHash,
      gender,
      birthDate,
      heightCm: Number(heightCm),
      timeZone
    });

    const todayDate = getLocalDateString(new Date(), timeZone);

    // Simpan berat badan awal ke weight_logs
    weightLogRepository.addLog({
      userId: newUser.id,
      weightKg: Number(weightKg),
      loggedDate: todayDate
    });

    // Inisialisasi streak awal
    streakRepository.upsertStreak({
      userId: newUser.id,
      currentStreak: 0,
      bestStreak: 0,
      lastCheckinDate: null
    });

    // Hitung BMR, TDEE, dan Target Kalori awal via Mifflin-St Jeor
    const bmr = calorieService.calculateBmr({
      weight: Number(weightKg),
      height: Number(heightCm),
      age,
      gender
    });

    const tdee = calorieService.calculateTdee({ bmr, activityLevel });
    const targetCalories = calorieService.calculateTargetCalories({
      tdee,
      bmr,
      gender,
      strategy: goalType
    });

    // Simpan goal aktif
    const goal = goalRepository.createGoal({
      userId: newUser.id,
      goalType,
      targetCalories,
      activityLevel,
      workoutDaysPerWeek: 4,
      targetWeeklyRateKg: goalType === 'bulking' ? 0.25 : -0.45
    });

    // Hitung dan simpan target makronutrisi
    const macros = macroService.calculateMacros({
      targetCalories,
      weight: Number(weightKg),
      strategy: goalType
    });

    goalRepository.saveMacroTarget({
      goalId: goal.id,
      userId: newUser.id,
      proteinGrams: macros.protein,
      fatGrams: macros.fat,
      carbGrams: macros.carbs
    });

    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'Pendaftaran berhasil!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        timeZone: newUser.time_zone
      },
      goal: {
        targetCalories,
        bmr: Math.round(bmr),
        tdee,
        macros
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login (FR-02)
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan kata sandi wajib diisi' });
    }

    const user = userRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email atau kata sandi salah' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email atau kata sandi salah' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        timeZone: user.time_zone
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
