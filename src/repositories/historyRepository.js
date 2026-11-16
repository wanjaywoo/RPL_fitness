// src/repositories/historyRepository.js
// Repository untuk data riwayat gabungan (Workouts, Nutrition, Weight, Streak, Goals)
// HANYA query SQL di sini, tanpa aturan bisnis (AGENTS.md & TUGAS_API_RIWAYAT.md)

const db = require('../db/connection');

class HistoryRepository {
  findWorkouts(userId, fromDate, toDate, type = 'all') {
    let sql = `
      SELECT w.id, w.logged_date, w.activity_type, w.duration_minutes, w.distance_km, w.notes
      FROM workouts w
      WHERE w.user_id = ? AND w.logged_date BETWEEN ? AND ?
    `;
    const params = [userId, fromDate, toDate];

    if (type && type !== 'all') {
      sql += ' AND LOWER(w.activity_type) = LOWER(?)';
      params.push(type.replace('_', ' '));
    }

    sql += ' ORDER BY w.logged_date DESC, w.id DESC';
    return db.prepare(sql).all(...params);
  }

  findNutritionLogs(userId, fromDate, toDate) {
    const sql = `
      SELECT logged_date, calories, protein_grams, carb_grams, fat_grams
      FROM nutrition_logs
      WHERE user_id = ? AND logged_date BETWEEN ? AND ?
      ORDER BY logged_date DESC
    `;
    return db.prepare(sql).all(userId, fromDate, toDate);
  }

  findWeightLogs(userId, fromDate, toDate) {
    const sql = `
      SELECT logged_date, weight_kg
      FROM weight_logs
      WHERE user_id = ? AND logged_date BETWEEN ? AND ?
      ORDER BY logged_date ASC
    `;
    return db.prepare(sql).all(userId, fromDate, toDate);
  }

  findStreak(userId) {
    const sql = 'SELECT current_streak, best_streak FROM streaks WHERE user_id = ?';
    return db.prepare(sql).get(userId) || { current_streak: 0, best_streak: 0 };
  }

  findActiveGoal(userId) {
    const sql = 'SELECT workout_days_per_week, goal_type FROM goals WHERE user_id = ? AND is_active = 1 LIMIT 1';
    return db.prepare(sql).get(userId) || { workout_days_per_week: 4, goal_type: 'bulking' };
  }
}

module.exports = new HistoryRepository();
