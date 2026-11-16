// tests/history.test.js
// Pengujian unit layanan dan endpoint API Riwayat (TUGAS_API_RIWAYAT.md, RIW-01 s/d RIW-08)

const historyService = require('../src/services/historyService');
const http = require('http');
const app = require('../src/app');
const db = require('../src/db/connection');
const { generateToken } = require('../src/middleware/authMiddleware');

describe('HistoryService & API Riwayat (TUGAS_API_RIWAYAT.md)', () => {
  const fakeUserId = 101;
  const testToday = '2026-10-19';

  // 1. RIW-01: Periode 7 hari hanya memuat tanggal dalam 7 hari terakhir (hari ke-7 masuk, hari ke-8 tidak)
  test('RIW-01: periode 7 hari hanya memuat tanggal dalam 7 hari terakhir (tepi: hari ke-7 masuk, hari ke-8 tidak)', async () => {
    const fakeRepo = {
      findWorkouts: jest.fn().mockImplementation((userId, from, to) => {
        // from harus 2026-10-13 (7 hari: 13, 14, 15, 16, 17, 18, 19)
        expect(from).toBe('2026-10-13');
        expect(to).toBe('2026-10-19');
        return [
          { logged_date: '2026-10-19', activity_type: 'Gym', duration_minutes: 60 },
          { logged_date: '2026-10-13', activity_type: 'Lari', duration_minutes: 30 }
        ];
      }),
      findNutritionLogs: jest.fn().mockResolvedValue([]),
      findWeightLogs: jest.fn().mockResolvedValue([]),
      findStreak: jest.fn().mockResolvedValue({ current_streak: 7, best_streak: 10 }),
      findActiveGoal: jest.fn().mockResolvedValue({ workout_days_per_week: 4 })
    };

    const res = await historyService.getHistory(
      { userId: fakeUserId, period: 7, type: 'all', page: 1, pageSize: 8, today: testToday },
      fakeRepo
    );

    expect(res.period).toBe(7);
    expect(res.items.length).toBe(2);
    expect(res.items[0].date).toBe('2026-10-19');
    expect(res.items[1].date).toBe('2026-10-13'); // hari ke-7 masuk
  });

  // 2. RIW-02: Dua latihan di tanggal yang sama menjadi satu entri dengan dua isi workouts (BR-04)
  test('RIW-02: dua latihan di tanggal yang sama menjadi satu entri dengan dua isi workouts', async () => {
    const fakeRepo = {
      findWorkouts: jest.fn().mockResolvedValue([
        { logged_date: '2026-10-19', activity_type: 'Gym', duration_minutes: 60, routine_name: 'Push Day' },
        { logged_date: '2026-10-19', activity_type: 'Lari', duration_minutes: 20, routine_name: 'Kardio Sore' }
      ]),
      findNutritionLogs: jest.fn().mockResolvedValue([]),
      findWeightLogs: jest.fn().mockResolvedValue([]),
      findStreak: jest.fn().mockResolvedValue({ current_streak: 5, best_streak: 10 }),
      findActiveGoal: jest.fn().mockResolvedValue({ workout_days_per_week: 4 })
    };

    const res = await historyService.getHistory(
      { userId: fakeUserId, period: 30, type: 'all', page: 1, pageSize: 8, today: testToday },
      fakeRepo
    );

    expect(res.items.length).toBe(1);
    expect(res.items[0].date).toBe('2026-10-19');
    expect(res.items[0].workouts.length).toBe(2);
    expect(res.items[0].workouts[0].type).toBe('gym');
    expect(res.items[0].workouts[1].type).toBe('lari');
  });

  // 3. RIW-03: Filter type=lari hanya menampilkan tanggal yang punya latihan lari
  test('RIW-03: filter type=lari hanya menampilkan tanggal yang punya latihan lari', async () => {
    const fakeRepo = {
      findWorkouts: jest.fn().mockResolvedValue([
        { logged_date: '2026-10-17', activity_type: 'Lari', duration_minutes: 42 }
      ]),
      findNutritionLogs: jest.fn().mockResolvedValue([
        { logged_date: '2026-10-19', calories: 2150 },
        { logged_date: '2026-10-17', calories: 2480 }
      ]),
      findWeightLogs: jest.fn().mockResolvedValue([]),
      findStreak: jest.fn().mockResolvedValue({ current_streak: 1, best_streak: 1 }),
      findActiveGoal: jest.fn().mockResolvedValue({ workout_days_per_week: 4 })
    };

    const res = await historyService.getHistory(
      { userId: fakeUserId, period: 30, type: 'lari', page: 1, pageSize: 8, today: testToday },
      fakeRepo
    );

    // Tanggal 2026-10-19 hanya punya nutrisi tanpa latihan lari, harus disaring keluar
    expect(res.items.length).toBe(1);
    expect(res.items[0].date).toBe('2026-10-17');
    expect(res.items[0].workouts[0].type).toBe('lari');
  });

  // 4. RIW-04: avgCalories hanya dari hari yang punya catatan nutrisi; null bila tidak ada
  test('RIW-04: avgCalories hanya dari hari yang punya catatan nutrisi; null bila tidak ada', async () => {
    const fakeRepoWithNutr = {
      findWorkouts: jest.fn().mockResolvedValue([]),
      findNutritionLogs: jest.fn().mockResolvedValue([
        { logged_date: '2026-10-19', calories: 2100 },
        { logged_date: '2026-10-18', calories: 2300 }
      ]),
      findWeightLogs: jest.fn().mockResolvedValue([]),
      findStreak: jest.fn().mockResolvedValue({ current_streak: 0, best_streak: 0 }),
      findActiveGoal: jest.fn().mockResolvedValue({ workout_days_per_week: 4 })
    };

    const resWithNutr = await historyService.getHistory(
      { userId: fakeUserId, period: 30, type: 'all', page: 1, pageSize: 8, today: testToday },
      fakeRepoWithNutr
    );
    expect(resWithNutr.summary.avgCalories).toBe(2200); // (2100 + 2300) / 2

    const fakeRepoEmptyNutr = {
      findWorkouts: jest.fn().mockResolvedValue([]),
      findNutritionLogs: jest.fn().mockResolvedValue([]),
      findWeightLogs: jest.fn().mockResolvedValue([]),
      findStreak: jest.fn().mockResolvedValue({ current_streak: 0, best_streak: 0 }),
      findActiveGoal: jest.fn().mockResolvedValue({ workout_days_per_week: 4 })
    };

    const resEmpty = await historyService.getHistory(
      { userId: fakeUserId, period: 30, type: 'all', page: 1, pageSize: 8, today: testToday },
      fakeRepoEmptyNutr
    );
    expect(resEmpty.summary.avgCalories).toBeNull();
  });

  // 5. RIW-05: Paginasi: pageSize=8, 30 entri, halaman 4 berisi 6 entri; total = 30
  test('RIW-05: paginasi: pageSize=8, 30 entri, halaman 4 berisi 6 entri; total = 30', async () => {
    // Bangkitkan 30 entri hari berbeda
    const dummyWorkouts = [];
    for (let i = 0; i < 30; i++) {
      dummyWorkouts.push({
        logged_date: `2026-09-${String(i + 1).padStart(2, '0')}`,
        activity_type: 'Gym',
        duration_minutes: 45
      });
    }

    const fakeRepo = {
      findWorkouts: jest.fn().mockResolvedValue(dummyWorkouts),
      findNutritionLogs: jest.fn().mockResolvedValue([]),
      findWeightLogs: jest.fn().mockResolvedValue([]),
      findStreak: jest.fn().mockResolvedValue({ current_streak: 10, best_streak: 20 }),
      findActiveGoal: jest.fn().mockResolvedValue({ workout_days_per_week: 4 })
    };

    // Halaman 4: offset = (4-1)*8 = 24. Sisa entri = 30 - 24 = 6 entri.
    const res = await historyService.getHistory(
      { userId: fakeUserId, period: 30, type: 'all', page: 4, pageSize: 8, today: testToday },
      fakeRepo
    );

    expect(res.total).toBe(30);
    expect(res.page).toBe(4);
    expect(res.pageSize).toBe(8);
    expect(res.items.length).toBe(6);
  });

  // 6. RIW-06: Parameter tidak valid (period=15, type=abc, pageSize=100) ditolak 400
  test('RIW-06: parameter tidak valid (period=15, type=abc, pageSize=100) ditolak 400', async () => {
    const dummyRepo = {
      findWorkouts: jest.fn(),
      findNutritionLogs: jest.fn(),
      findWeightLogs: jest.fn(),
      findStreak: jest.fn(),
      findActiveGoal: jest.fn()
    };

    // Uji periode tidak valid
    await expect(historyService.getHistory({ userId: fakeUserId, period: 15 }, dummyRepo))
      .rejects.toThrow('Periode tidak valid');

    // Uji jenis aktivitas tidak valid
    await expect(historyService.getHistory({ userId: fakeUserId, period: 30, type: 'abc' }, dummyRepo))
      .rejects.toThrow('Jenis aktivitas tidak valid');

    // Uji pageSize tidak valid (> 50)
    await expect(historyService.getHistory({ userId: fakeUserId, period: 30, type: 'all', pageSize: 100 }, dummyRepo))
      .rejects.toThrow('Ukuran halaman');
  });

  // Uji Integrasi Endpoint HTTP (RIW-07 & RIW-08)
  describe('HTTP Endpoint GET /api/history', () => {
    let server;
    let baseUrl;
    let normalUserToken;
    let adminUserToken;
    let normalUserId;

    beforeAll((done) => {
      // Bersihkan data uji lama jika tertinggal
      db.prepare('DELETE FROM users WHERE email LIKE ?').run('%history_%');
      db.prepare('DELETE FROM users WHERE email LIKE ?').run('other_user@test.local');

      // Pastikan ada akun user dan admin
      const user = db.prepare(`
        INSERT INTO users (name, email, password_hash, gender, birth_date, height_cm, role)
        VALUES ('History User', 'history_user@test.local', 'hash', 'male', '1995-01-01', 170, 'user')
      `).run();
      normalUserId = user.lastInsertRowid;
      normalUserToken = generateToken(normalUserId);

      const admin = db.prepare(`
        INSERT INTO users (name, email, password_hash, gender, birth_date, height_cm, role)
        VALUES ('History Admin', 'history_admin@test.local', 'hash', 'male', '1990-01-01', 175, 'admin')
      `).run();
      adminUserToken = generateToken(admin.lastInsertRowid);

      server = http.createServer(app);
      server.listen(0, () => {
        baseUrl = `http://localhost:${server.address().port}`;
        done();
      });
    });

    afterAll((done) => {
      // Bersihkan data uji
      try {
        db.prepare('DELETE FROM users WHERE email LIKE ?').run('%history_%');
        db.prepare('DELETE FROM users WHERE email LIKE ?').run('other_user@test.local');
      } catch (e) {}

      if (server && server.listening) {
        server.close(done);
      } else if (done) {
        done();
      }
    });

    // 7. RIW-07: Admin mendapat 403; tanpa login 401
    test('RIW-07: admin mendapat 403; tanpa login 401', async () => {
      // Tanpa login -> 401
      const resNoAuth = await fetch(`${baseUrl}/api/history`);
      expect(resNoAuth.status).toBe(401);

      // Admin -> 403 (BR-13)
      const resAdmin = await fetch(`${baseUrl}/api/history`, {
        headers: { 'Authorization': `Bearer ${adminUserToken}` }
      });
      expect(resAdmin.status).toBe(403);
      const dataAdmin = await resAdmin.json();
      expect(dataAdmin.error).toContain('BR-13');
    });

    // 8. RIW-08: Data pengguna lain tidak pernah muncul (repo dipanggil dengan userId dari sesi)
    test('RIW-08: data pengguna lain tidak pernah muncul (repo dipanggil dengan userId dari sesi)', async () => {
      // Masukkan data latihan untuk user lain
      db.prepare('DELETE FROM users WHERE email = ?').run('other_user@test.local');
      const otherUser = db.prepare(`
        INSERT INTO users (name, email, password_hash, gender, birth_date, height_cm, role)
        VALUES ('Other User', 'other_user@test.local', 'hash', 'female', '1998-05-05', 165, 'user')
      `).run();
      const otherId = otherUser.lastInsertRowid;

      db.prepare(`
        INSERT INTO workouts (user_id, logged_date, activity_type, duration_minutes, notes)
        VALUES (?, '2026-10-19', 'Lari', 99, 'Latihan Rahasia Pengguna Lain')
      `).run(otherId);

      const res = await fetch(`${baseUrl}/api/history?period=30`, {
        headers: { 'Authorization': `Bearer ${normalUserToken}` }
      });
      const data = await res.json();
      expect(res.status).toBe(200);

      // Pastikan data milik otherUser TIDAK PERNAH muncul di data normalUser
      const hasOtherNotes = data.items.some(item =>
        item.workouts.some(w => w.notes === 'Latihan Rahasia Pengguna Lain')
      );
      expect(hasOtherNotes).toBe(false);
    });
  });
});
