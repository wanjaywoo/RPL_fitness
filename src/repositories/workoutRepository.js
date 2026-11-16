// src/repositories/workoutRepository.js
// Penanganan data latihan dan gerakan ke SQLite. HANYA SQL di sini.

const db = require('../db/connection');

class WorkoutRepository {
  createWorkout({ userId, loggedDate, activityType, durationMinutes, distanceKm = 0, notes = '' }) {
    const stmt = db.prepare(`
      INSERT INTO workouts (user_id, logged_date, activity_type, duration_minutes, distance_km, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const res = stmt.run(userId, loggedDate, activityType, durationMinutes, distanceKm, notes);
    return res.lastInsertRowid;
  }

  addWorkoutExercise({ workoutId, exerciseId, exerciseName, sets, reps, weightKg = 0, isCompleted = 1, orderIndex = 0 }) {
    const stmt = db.prepare(`
      INSERT INTO workout_exercises (workout_id, exercise_id, exercise_name, sets, reps, weight_kg, is_completed, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(workoutId, exerciseId, exerciseName, sets, reps, weightKg, isCompleted, orderIndex);
  }

  getWorkoutsByDate(userId, loggedDate) {
    const stmt = db.prepare(`
      SELECT * FROM workouts
      WHERE user_id = ? AND logged_date = ?
    `);
    return stmt.all(userId, loggedDate);
  }

  getExercisesByWorkoutId(workoutId) {
    const stmt = db.prepare(`
      SELECT * FROM workout_exercises
      WHERE workout_id = ?
      ORDER BY order_index ASC
    `);
    return stmt.all(workoutId);
  }

  getTrainedMusclesInDateRange(userId, startDate, endDate) {
    const stmt = db.prepare(`
      SELECT DISTINCT em.muscle_name
      FROM workouts w
      JOIN workout_exercises we ON w.id = we.workout_id
      JOIN exercises e ON (we.exercise_id = e.id OR we.exercise_name = e.name)
      JOIN exercise_muscles em ON e.id = em.exercise_id
      WHERE w.user_id = ? AND w.logged_date >= ? AND w.logged_date <= ? AND em.is_primary = 1
    `);
    const rows = stmt.all(userId, startDate, endDate);
    return rows.map(r => r.muscle_name);
  }

  getMuscleFrequenciesThisWeek(userId, startDate, endDate) {
    const stmt = db.prepare(`
      SELECT em.muscle_name, COUNT(DISTINCT w.logged_date) as frequency
      FROM workouts w
      JOIN workout_exercises we ON w.id = we.workout_id
      JOIN exercises e ON (we.exercise_id = e.id OR we.exercise_name = e.name)
      JOIN exercise_muscles em ON e.id = em.exercise_id
      WHERE w.user_id = ? AND w.logged_date >= ? AND w.logged_date <= ? AND em.is_primary = 1
      GROUP BY em.muscle_name
    `);
    return stmt.all(userId, startDate, endDate);
  }
}

module.exports = new WorkoutRepository();
