// src/repositories/streakRepository.js
// Penanganan data streak ke SQLite. HANYA SQL di sini.

const db = require('../db/connection');

class StreakRepository {
  getByUserId(userId) {
    const stmt = db.prepare('SELECT * FROM streaks WHERE user_id = ?');
    return stmt.get(userId);
  }

  upsertStreak({ userId, currentStreak, bestStreak, lastCheckinDate }) {
    const stmt = db.prepare(`
      INSERT INTO streaks (user_id, current_streak, best_streak, last_checkin_date, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT(user_id) DO UPDATE SET
        current_streak = excluded.current_streak,
        best_streak = excluded.best_streak,
        last_checkin_date = excluded.last_checkin_date,
        updated_at = datetime('now')
    `);
    stmt.run(userId, currentStreak, bestStreak, lastCheckinDate);
    return this.getByUserId(userId);
  }
}

module.exports = new StreakRepository();
