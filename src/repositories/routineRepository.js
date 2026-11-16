// src/repositories/routineRepository.js
// Penanganan rutinitas latihan ke SQLite. HANYA SQL di sini.

const db = require('../db/connection');

class RoutineRepository {
  getByUserId(userId) {
    const stmt = db.prepare(`
      SELECT * FROM routines
      WHERE user_id = ? AND is_active = 1
      ORDER BY id ASC
    `);
    const routines = stmt.all(userId);

    for (const routine of routines) {
      const exStmt = db.prepare(`
        SELECT re.*, e.name, e.category, e.equipment, e.is_cardio,
               (SELECT GROUP_CONCAT(em.muscle_name, ', ') FROM exercise_muscles em WHERE em.exercise_id = e.id AND em.is_primary = 1) AS primary_muscles
        FROM routine_exercises re
        JOIN exercises e ON re.exercise_id = e.id
        WHERE re.routine_id = ?
        ORDER BY re.order_index ASC
      `);
      routine.exercises = exStmt.all(routine.id);
    }

    return routines;
  }

  getById(id) {
    const stmt = db.prepare('SELECT * FROM routines WHERE id = ?');
    const routine = stmt.get(id);
    if (!routine) return null;

    const exStmt = db.prepare(`
      SELECT re.*, e.name, e.category, e.equipment, e.is_cardio,
             (SELECT GROUP_CONCAT(em.muscle_name, ', ') FROM exercise_muscles em WHERE em.exercise_id = e.id AND em.is_primary = 1) AS primary_muscles
      FROM routine_exercises re
      JOIN exercises e ON re.exercise_id = e.id
      WHERE re.routine_id = ?
      ORDER BY re.order_index ASC
    `);
    routine.exercises = exStmt.all(id);
    return routine;
  }

  create({ userId, name, estimatedMinutes = 55 }) {
    const stmt = db.prepare(`
      INSERT INTO routines (user_id, name, estimated_minutes, is_active)
      VALUES (?, ?, ?, 1)
    `);
    const res = stmt.run(userId, name, estimatedMinutes);
    return this.getById(res.lastInsertRowid);
  }

  addExerciseToRoutine({ routineId, exerciseId, defaultSets = 4, defaultReps = '8-10', restSeconds = 90, orderIndex = 0 }) {
    const stmt = db.prepare(`
      INSERT INTO routine_exercises (routine_id, exercise_id, default_sets, default_reps, rest_seconds, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(routineId, exerciseId, defaultSets, defaultReps, restSeconds, orderIndex);
  }

  removeExerciseFromRoutine(routineExerciseId) {
    const stmt = db.prepare('DELETE FROM routine_exercises WHERE id = ?');
    return stmt.run(routineExerciseId);
  }

  deleteRoutine(routineId, userId) {
    const stmt = db.prepare('DELETE FROM routines WHERE id = ? AND user_id = ?');
    return stmt.run(routineId, userId);
  }
}

module.exports = new RoutineRepository();
