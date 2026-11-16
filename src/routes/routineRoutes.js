// src/routes/routineRoutes.js
// Endpoint Rutinitas Latihan & Rekomendasi Program (Mockup Layar 6)

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const routineRepository = require('../repositories/routineRepository');
const goalRepository = require('../repositories/goalRepository');
const exerciseRepository = require('../repositories/exerciseRepository');
const workoutRepository = require('../repositories/workoutRepository');
const recommendationService = require('../services/recommendationService');
const { getLocalDateString, addDays } = require('../utils/time');

router.use(authMiddleware);

// GET /api/routines: Mendapatkan semua rutinitas pengguna
router.get('/', (req, res) => {
  let routines = routineRepository.getByUserId(req.user.id);

  // Jika pengguna belum punya rutinitas, buatkan rutinitas default "Push Day" sesuai mockup tampilan 6
  if (routines.length === 0) {
    const defaultRoutine = routineRepository.create({
      userId: req.user.id,
      name: 'Push Day',
      estimatedMinutes: 55
    });

    // Tambahkan 5 gerakan Push Day: Bench Press, Overhead Press, Incline DB Press, Lateral Raise, Triceps Pushdown
    const pushNames = [
      { name: 'Bench Press', sets: 4, reps: '8-10', rest: 90 },
      { name: 'Overhead Press', sets: 4, reps: '6-8', rest: 90 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: 75 },
      { name: 'Lateral Raise', sets: 3, reps: '12-15', rest: 60 },
      { name: 'Triceps Pushdown', sets: 3, reps: '10-12', rest: 60 }
    ];

    pushNames.forEach((item, idx) => {
      const searchRes = exerciseRepository.search(item.name);
      if (searchRes.length > 0) {
        routineRepository.addExerciseToRoutine({
          routineId: defaultRoutine.id,
          exerciseId: searchRes[0].id,
          defaultSets: item.sets,
          defaultReps: item.reps,
          restSeconds: item.rest,
          orderIndex: idx
        });
      }
    });

    routines = routineRepository.getByUserId(req.user.id);
  }

  res.json(routines);
});

// GET /api/routines/recommendation: Mendapatkan rekomendasi pola split & otot belum dilatih 7 hari
router.get('/recommendation', (req, res) => {
  const activeGoal = goalRepository.findActiveByUserId(req.user.id);
  const workoutDays = activeGoal ? activeGoal.workout_days_per_week : 4;
  const goalType = activeGoal ? activeGoal.goal_type : 'bulking';

  // Rekomendasi pola split (Full Body / Upper-Lower / PPL)
  const splitRecommendation = recommendationService.recommendProgramSplit(workoutDays, goalType);

  // Otot yang sudah dilatih 7 hari terakhir
  const today = getLocalDateString(new Date(), req.user.timeZone);
  const sevenDaysAgo = addDays(today, -7);
  const trainedMuscles = workoutRepository.getTrainedMusclesInDateRange(req.user.id, sevenDaysAgo, today);

  // Jika data kosong, gunakan default mockup tampilan kedua & keenam
  const trained = trainedMuscles.length > 0 
    ? trainedMuscles 
    : ['Dada', 'Punggung', 'Bahu', 'Lengan', 'Paha depan', 'Perut'];

  const laggingMuscles = recommendationService.detectLaggingMuscles(trained);
  const catalog = exerciseRepository.getAll();
  const laggingExerciseRecs = recommendationService.recommendExercisesForLaggingMuscles(laggingMuscles, catalog);

  res.json({
    splitRecommendation,
    laggingMuscles,
    laggingExerciseRecs
  });
});

// POST /api/routines: Membuat rutinitas baru
router.post('/', (req, res) => {
  const { name, estimatedMinutes } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Nama rutinitas wajib diisi' });
  }

  const routine = routineRepository.create({
    userId: req.user.id,
    name,
    estimatedMinutes: Number(estimatedMinutes) || 55
  });

  res.status(201).json(routine);
});

// POST /api/routines/:id/exercises: Menambah gerakan ke rutinitas
router.post('/:id/exercises', (req, res) => {
  const routineId = Number(req.params.id);
  const { exerciseId, defaultSets, defaultReps, restSeconds, orderIndex } = req.body;

  if (!exerciseId) {
    return res.status(400).json({ error: 'exerciseId wajib diisi' });
  }

  const exercise = exerciseRepository.getById(Number(exerciseId));
  const sets = defaultSets !== undefined ? Number(defaultSets) : (exercise ? exercise.default_sets : 3);
  const reps = defaultReps || (exercise ? exercise.default_reps : '8-10');
  const rest = restSeconds !== undefined ? Number(restSeconds) : (exercise ? exercise.rest_seconds : 90);

  routineRepository.addExerciseToRoutine({
    routineId,
    exerciseId: Number(exerciseId),
    defaultSets: sets,
    defaultReps: reps,
    restSeconds: rest,
    orderIndex: Number(orderIndex) || 0
  });

  const updated = routineRepository.getById(routineId);
  res.status(201).json(updated);
});

// DELETE /api/routines/:id/exercises/:exerciseRoutineId: Menghapus gerakan dari rutinitas
router.delete('/:id/exercises/:exerciseRoutineId', (req, res) => {
  routineRepository.removeExerciseFromRoutine(Number(req.params.exerciseRoutineId));
  res.json({ message: 'Gerakan berhasil dihapus dari rutinitas' });
});

// DELETE /api/routines/:id: Menghapus seluruh rutinitas
router.delete('/:id', (req, res) => {
  routineRepository.deleteRoutine(Number(req.params.id), req.user.id);
  res.json({ message: 'Rutinitas berhasil dihapus' });
});

module.exports = router;
