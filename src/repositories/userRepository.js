// src/repositories/userRepository.js
// Penanganan data pengguna ke SQLite. HANYA SQL di sini, tanpa aturan bisnis.

const db = require('../db/connection');

class UserRepository {
  findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email.toLowerCase().trim());
  }

  create({ name, email, passwordHash, gender, birthDate, heightCm, timeZone = 'Asia/Jakarta', role = 'user' }) {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, gender, birth_date, height_cm, time_zone, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, email.toLowerCase().trim(), passwordHash, gender, birthDate, heightCm, timeZone, role);
    return this.findById(result.lastInsertRowid);
  }

  updateProfile(id, { name, heightCm, timeZone }) {
    const stmt = db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          height_cm = COALESCE(?, height_cm),
          time_zone = COALESCE(?, time_zone),
          updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(name, heightCm, timeZone, id);
    return this.findById(id);
  }

  listAllNonSensitive() {
    // Administrator hanya boleh melihat daftar akun tanpa data kesehatan (BR-13)
    const stmt = db.prepare(`
      SELECT id, name, email, role, time_zone, created_at
      FROM users
      ORDER BY id ASC
    `);
    return stmt.all();
  }
}

module.exports = new UserRepository();
