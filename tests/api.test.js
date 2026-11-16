// tests/api.test.js
// Pengujian endpoint API REST FitStreak (Auth, Goals, Check-in, Exercises, Dashboard, Admin BR-13)

const http = require('http');
const app = require('../src/app');
const db = require('../src/db/connection');

let server;
let baseUrl;

beforeAll((done) => {
  // Jalankan migrasi dan seed untuk pengujian
  const migrate = require('../src/db/migrate');
  const seed = require('../src/db/seed');
  migrate();
  seed();

  // Bersihkan tabel users untuk pengujian bersih
  db.prepare('DELETE FROM users WHERE email LIKE ?').run('%test%@%');

  server = http.createServer(app);
  server.listen(0, () => {
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe('API FitStreak (Auth, Check-in, Dashboard, Admin)', () => {
  let authToken = '';
  let userId = null;

  // 1. Registrasi pengguna baru
  test('POST /api/auth/register - Menolak pendaftaran jika usia < 18 tahun (BR-09)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Remaja',
        email: 'test_minor@email.com',
        password: 'password123',
        gender: 'male',
        birthDate: '2015-01-01', // usia ~11 tahun
        heightCm: 160,
        weightKg: 50
      })
    });

    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain('18 tahun');
  });

  test('POST /api/auth/register - Berhasil mendaftarkan pengguna dewasa (FR-01)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rizwan Defriansyah',
        email: 'test_rizwan@email.com',
        password: 'password123',
        gender: 'male',
        birthDate: '2000-05-14',
        heightCm: 170,
        weightKg: 69,
        activityLevel: 'light',
        goalType: 'bulking'
      })
    });

    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe('test_rizwan@email.com');
    authToken = data.token;
    userId = data.user.id;
  });

  // 2. Login pengguna (FR-02)
  test('POST /api/auth/login - Berhasil login dengan kredensial yang valid', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_rizwan@email.com',
        password: 'password123'
      })
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.token).toBeDefined();
  });

  // 3. Katalog Gerakan (Mockup Layar 4)
  test('GET /api/exercises - Mengembalikan 24 gerakan latihan dan filter kategori', async () => {
    const res = await fetch(`${baseUrl}/api/exercises`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.length).toBeGreaterThanOrEqual(24);

    // Filter kategori Dada
    const resDada = await fetch(`${baseUrl}/api/exercises?category=Dada`);
    const dataDada = await resDada.json();
    expect(dataDada.every(e => e.category === 'Dada')).toBe(true);
  });

  // 4. Check-in Harian (FR-03, BR-04)
  test('POST /api/checkins - Menyimpan check-in dengan validasi durasi (10-300 menit)', async () => {
    // Uji durasi terlalu pendek (< 10 menit)
    const resInvalid = await fetch(`${baseUrl}/api/checkins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        date: '2026-10-19',
        activityType: 'Gym',
        durationMinutes: 5
      })
    });
    expect(resInvalid.status).toBe(400);

    // Uji check-in valid (65 menit sesuai mockup 3)
    const resValid = await fetch(`${baseUrl}/api/checkins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        date: '2026-10-19',
        activityType: 'Gym',
        durationMinutes: 65,
        calories: 2150,
        protein: 140,
        carbs: 260,
        fat: 60,
        weight: 69,
        notes: 'PR bench press'
      })
    });

    const dataValid = await resValid.json();
    expect(resValid.status).toBe(201);
    expect(dataValid.currentStreak).toBeGreaterThanOrEqual(1);
  });

  // 5. Dashboard Data Agregasi (Mockup Layar 2)
  test('GET /api/dashboard - Mengembalikan seluruh data ringkasan dashboard', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.streak).toBeDefined();
    expect(data.caloriesToday).toBeDefined();
    expect(data.adaptiveAdvice).toBeDefined();
    expect(data.muscleFrequencies).toBeDefined();
    expect(data.macroTargets).toBeDefined();
  });

  // 6. Profil dan Target Kebugaran (TC-23 & TC-24, BR-01..BR-03, BR-09)
  test('GET /api/goals/active - TC-23: Mengembalikan target aktif, BMR, TDEE, dan alokasi makronutrisi', async () => {
    const res = await fetch(`${baseUrl}/api/goals/active`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.goal).toBeDefined();
    expect(data.macros).toBeDefined();
    expect(data.metrics).toBeDefined();
    expect(data.metrics.bmr).toBeGreaterThan(1000);
    expect(data.metrics.tdee).toBeGreaterThan(data.metrics.bmr);
    expect(data.macros.protein_grams).toBeGreaterThanOrEqual(100);
  });

  test('POST /api/goals - TC-24: Memperbarui sasaran program dan menegakkan batas keselamatan server (BR-09)', async () => {
    const res = await fetch(`${baseUrl}/api/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        goalType: 'cutting',
        activityLevel: 'moderate',
        workoutDaysPerWeek: 5
      })
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.goal.goal_type).toBe('cutting');
    expect(data.goal.workout_days_per_week).toBe(5);
    // Target kalori cutting tidak boleh di bawah BMR atau batas absolut 1500 kkal
    expect(data.goal.target_calories).toBeGreaterThanOrEqual(1500);
    expect(data.macros.protein).toBeGreaterThan(0);
    expect(data.macros.fat).toBeGreaterThan(0);
    expect(data.macros.carbs).toBeGreaterThan(0);
  });

  // 7. Aturan Admin (BR-13: Menolak data kesehatan 403 Forbidden)
  test('GET /api/admin/users/:id/health-data - Menolak akses data kesehatan untuk admin (403 Forbidden)', async () => {
    // Buat akun admin sementara
    const adminUser = db.prepare(`
      INSERT INTO users (name, email, password_hash, gender, birth_date, height_cm, role)
      VALUES ('Admin Test', 'admin_test@fitstreak.local', 'hash', 'male', '1990-01-01', 175, 'admin')
    `).run();

    const { generateToken } = require('../src/middleware/authMiddleware');
    const adminToken = generateToken(adminUser.lastInsertRowid);

    const res = await fetch(`${baseUrl}/api/admin/users/${userId}/health-data`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain('BR-13');
  });
});
