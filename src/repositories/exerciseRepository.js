// src/repositories/exerciseRepository.js
// Penanganan katalog latihan ke SQLite. HANYA SQL di sini.

const db = require('../db/connection');

class ExerciseRepository {
  getAll() {
    const stmt = db.prepare(`
      SELECT e.*, 
        (SELECT GROUP_CONCAT(muscle_name, ', ') FROM exercise_muscles WHERE exercise_id = e.id AND is_primary = 1) as primary_muscles,
        (SELECT GROUP_CONCAT(muscle_name, ', ') FROM exercise_muscles WHERE exercise_id = e.id AND is_primary = 0) as secondary_muscles
      FROM exercises e
      ORDER BY e.is_cardio ASC, e.id ASC
    `);
    return stmt.all();
  }

  getById(id) {
    const stmt = db.prepare('SELECT * FROM exercises WHERE id = ?');
    const exercise = stmt.get(id);
    if (!exercise) return null;

    const muscleStmt = db.prepare('SELECT muscle_name, is_primary FROM exercise_muscles WHERE exercise_id = ?');
    exercise.muscles = muscleStmt.all(id);
    return exercise;
  }

  search(keyword) {
    const stmt = db.prepare(`
      SELECT e.*,
        (SELECT GROUP_CONCAT(muscle_name, ', ') FROM exercise_muscles WHERE exercise_id = e.id AND is_primary = 1) as primary_muscles,
        (SELECT GROUP_CONCAT(muscle_name, ', ') FROM exercise_muscles WHERE exercise_id = e.id AND is_primary = 0) as secondary_muscles
      FROM exercises e
      WHERE e.name LIKE ? OR e.category LIKE ?
      ORDER BY e.id ASC
    `);
    const pattern = `%${keyword}%`;
    return stmt.all(pattern, pattern);
  }

  getByCategory(category) {
    if (category.toLowerCase() === 'semua') {
      return this.getAll();
    }
    const stmt = db.prepare(`
      SELECT e.*,
        (SELECT GROUP_CONCAT(muscle_name, ', ') FROM exercise_muscles WHERE exercise_id = e.id AND is_primary = 1) as primary_muscles,
        (SELECT GROUP_CONCAT(muscle_name, ', ') FROM exercise_muscles WHERE exercise_id = e.id AND is_primary = 0) as secondary_muscles
      FROM exercises e
      WHERE e.category = ?
      ORDER BY e.id ASC
    `);
    return stmt.all(category);
  }
}

module.exports = new ExerciseRepository();
