// src/repositories/goalRepository.js
// Penanganan data target kalori dan makronutrisi ke SQLite. HANYA SQL di sini.

const db = require('../db/connection');

class GoalRepository {
  findActiveByUserId(userId) {
    const stmt = db.prepare(`
      SELECT * FROM goals 
      WHERE user_id = ? AND is_active = 1 
      ORDER BY id DESC LIMIT 1
    `);
    return stmt.get(userId);
  }

  createGoal({ userId, goalType, targetCalories, activityLevel, workoutDaysPerWeek = 4, targetWeeklyRateKg = 0.25 }) {
    // Nonaktifkan goal aktif sebelumnya
    const deact = db.prepare('UPDATE goals SET is_active = 0 WHERE user_id = ?');
    deact.run(userId);

    const stmt = db.prepare(`
      INSERT INTO goals (user_id, goal_type, target_calories, activity_level, workout_days_per_week, target_weekly_rate_kg, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);
    const result = stmt.run(userId, goalType, targetCalories, activityLevel, workoutDaysPerWeek, targetWeeklyRateKg);
    return this.findActiveByUserId(userId);
  }

  updateTargetCalories(goalId, newCalories) {
    const stmt = db.prepare(`
      UPDATE goals 
      SET target_calories = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(newCalories, goalId);
  }

  saveMacroTarget({ goalId, userId, proteinGrams, fatGrams, carbGrams }) {
    const stmt = db.prepare(`
      INSERT INTO macro_targets (goal_id, user_id, protein_grams, fat_grams, carb_grams)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(goalId, userId, proteinGrams, fatGrams, carbGrams);
  }

  getMacroTargetByGoalId(goalId) {
    const stmt = db.prepare(`
      SELECT * FROM macro_targets 
      WHERE goal_id = ? 
      ORDER BY id DESC LIMIT 1
    `);
    return stmt.get(goalId);
  }
}

module.exports = new GoalRepository();
