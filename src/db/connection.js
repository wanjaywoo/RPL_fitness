// src/db/connection.js
// Pengelola koneksi basis data SQLite
// Memakai DatabaseSync bawaan Node.js (node:sqlite) dengan cadangan better-sqlite3

const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'fitstreak.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;
try {
  const { DatabaseSync } = require('node:sqlite');
  db = new DatabaseSync(dbPath);
} catch (err) {
  const Database = require('better-sqlite3');
  db = new Database(dbPath);
}

// Aktifkan dukungan foreign key di SQLite
db.exec('PRAGMA foreign_keys = ON;');

module.exports = db;
