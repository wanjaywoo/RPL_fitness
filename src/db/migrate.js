// src/db/migrate.js
// Skrip untuk mengeksekusi skema basis data SQLite (15 tabel)

const fs = require('fs');
const path = require('path');
const db = require('./connection');

function migrate() {
  console.log('Menjalankan migrasi basis data SQLite FitStreak (15 tabel)...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  db.exec(schemaSql);
  console.log('Migrasi berhasil! Seluruh 15 tabel telah terbentuk dengan benar.');
}

if (require.main === module) {
  try {
    migrate();
    process.exit(0);
  } catch (error) {
    console.error('Gagal menjalankan migrasi:', error);
    process.exit(1);
  }
}

module.exports = migrate;
