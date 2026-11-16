// src/server.js
// Entry point utama untuk menyalakan server FitStreak

const path = require('path');
const fs = require('fs');

// Muat variabel lingkungan dari .env jika ada
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  });
}

const app = require('./app');

// Pastikan migrasi & seed database sudah berjalan saat start
try {
  const migrate = require('./db/migrate');
  const seed = require('./db/seed');
  migrate();
  seed();
} catch (err) {
  console.log('Catatan database:', err.message);
}

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🔥 FitStreak PWA Server berjalan di Port ${PORT}`);
  console.log(`🌐 Akses antarmuka di: http://localhost:${PORT}`);
  console.log(`===============================================`);
});

module.exports = server;
