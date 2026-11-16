// src/repositories/nutritionLogRepository.js
// Penanganan data log nutrisi ke SQLite. HANYA SQL di sini.

const db = require('../db/connection');

class NutritionLogRepository {
  addOrUpdateLog({ userId, loggedDate, calories, proteinGrams = 0, carbGrams = 0, fatGrams = 0, notes = '' }) {
    const existing = this.getByDate(userId, loggedDate);
    if (existing) {
      const stmt = db.prepare(`
        UPDATE nutrition_logs 
        SET calories = ?, protein_grams = ?, carb_grams = ?, fat_grams = ?, notes = ?
        WHERE id = ?
      `);
      stmt.run(calories, proteinGrams, carbGrams, fatGrams, notes, existing.id);
      return this.getByDate(userId, loggedDate);
    } else {
      const stmt = db.prepare(`
        INSERT INTO nutrition_logs (user_id, logged_date, calories, protein_grams, carb_grams, fat_grams, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const res = stmt.run(userId, loggedDate, calories, proteinGrams, carbGrams, fatGrams, notes);
      return { id: res.lastInsertRowid, userId, loggedDate, calories, proteinGrams, carbGrams, fatGrams, notes };
    }
  }

  getByDate(userId, loggedDate) {
    const stmt = db.prepare(`
      SELECT * FROM nutrition_logs 
      WHERE user_id = ? AND logged_date = ? 
      ORDER BY id DESC LIMIT 1
    `);
    return stmt.get(userId, loggedDate);
  }

  getLogsInDateRange(userId, startDate, endDate) {
    const stmt = db.prepare(`
      SELECT calories, protein_grams as protein, carb_grams as carbs, fat_grams as fat, logged_date as date
      FROM nutrition_logs
      WHERE user_id = ? AND logged_date >= ? AND logged_date <= ?
      ORDER BY logged_date ASC
    `);
    return stmt.all(userId, startDate, endDate);
  }
}

module.exports = new NutritionLogRepository();
