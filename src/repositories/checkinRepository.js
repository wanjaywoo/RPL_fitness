// src/repositories/checkinRepository.js
// Penanganan data check-in harian ke SQLite. HANYA SQL di sini.

const db = require('../db/connection');

class CheckinRepository {
  createCheckin({ userId, checkinDate, workoutId, isValid = 1 }) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO checkins (user_id, checkin_date, workout_id, is_valid)
      VALUES (?, ?, ?, ?)
    `);
    const res = stmt.run(userId, checkinDate, workoutId, isValid);
    return res.lastInsertRowid;
  }

  getCheckinDatesByUserId(userId) {
    const stmt = db.prepare(`
      SELECT checkin_date 
      FROM checkins 
      WHERE user_id = ? AND is_valid = 1 
      ORDER BY checkin_date ASC
    `);
    const rows = stmt.all(userId);
    return rows.map(r => r.checkin_date);
  }

  hasCheckinOnDate(userId, dateStr) {
    const stmt = db.prepare(`
      SELECT id FROM checkins
      WHERE user_id = ? AND checkin_date = ? AND is_valid = 1
    `);
    return Boolean(stmt.get(userId, dateStr));
  }
}

module.exports = new CheckinRepository();
