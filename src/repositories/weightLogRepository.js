// src/repositories/weightLogRepository.js
// Penanganan data log berat badan ke SQLite. HANYA SQL di sini.

const db = require('../db/connection');

class WeightLogRepository {
  addLog({ userId, weightKg, loggedDate }) {
    const stmt = db.prepare(`
      INSERT INTO weight_logs (user_id, weight_kg, logged_date)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(userId, weightKg, loggedDate);
    return { id: result.lastInsertRowid, userId, weightKg, loggedDate };
  }

  getLatestByUserId(userId) {
    const stmt = db.prepare(`
      SELECT * FROM weight_logs 
      WHERE user_id = ? 
      ORDER BY logged_date DESC, id DESC LIMIT 1
    `);
    return stmt.get(userId);
  }

  getLogsInDateRange(userId, startDate, endDate) {
    const stmt = db.prepare(`
      SELECT weight_kg as weight, logged_date as date
      FROM weight_logs
      WHERE user_id = ? AND logged_date >= ? AND logged_date <= ?
      ORDER BY logged_date ASC, id ASC
    `);
    return stmt.all(userId, startDate, endDate);
  }

  getAllByUserId(userId, limit = 56) {
    // 8 minggu terakhir (56 hari) untuk grafik
    const stmt = db.prepare(`
      SELECT id, weight_kg as weight, logged_date as date
      FROM weight_logs
      WHERE user_id = ?
      ORDER BY logged_date ASC
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }
}

module.exports = new WeightLogRepository();
