// src/services/historyService.js
// Logika murni layanan riwayat gabungan (TUGAS_API_RIWAYAT.md, FR-12, BR-04, BR-05, BR-06, BR-08, BR-13)
// Tanpa Express dan tanpa SQL (Dependency Injection)

const { addDays } = require('../utils/time');
const defaultHistoryRepo = require('../repositories/historyRepository');

class HistoryService {
  async getHistory({ userId, period = 30, type = 'all', page = 1, pageSize = 8, today }, repo = defaultHistoryRepo) {
    // 1. Validasi parameter query (TUGAS_API_RIWAYAT.md Bagian 3)
    const numPeriod = Number(period);
    const validPeriods = [7, 30, 90];
    if (!validPeriods.includes(numPeriod)) {
      const err = new Error(`Periode tidak valid: '${period}'. Pilihan yang diizinkan: 7, 30, atau 90.`);
      err.status = 400;
      throw err;
    }

    const normalizedType = String(type).toLowerCase();
    const validTypes = ['all', 'gym', 'lari', 'bersepeda', 'renang', 'jalan_cepat', 'hiit'];
    if (!validTypes.includes(normalizedType)) {
      const err = new Error(`Jenis aktivitas tidak valid: '${type}'. Pilihan: ${validTypes.join(', ')}.`);
      err.status = 400;
      throw err;
    }

    const numPage = Number(page);
    if (!Number.isInteger(numPage) || numPage < 1) {
      const err = new Error(`Halaman (page) harus berupa bilangan bulat >= 1, diterima: '${page}'.`);
      err.status = 400;
      throw err;
    }

    const numPageSize = Number(pageSize);
    if (!Number.isInteger(numPageSize) || numPageSize < 1 || numPageSize > 50) {
      const err = new Error(`Ukuran halaman (pageSize) harus antara 1 sampai 50, diterima: '${pageSize}'.`);
      err.status = 400;
      throw err;
    }

    // Gunakan tanggal hari ini dari parameter (BR-08)
    const todayDate = today || new Date().toISOString().slice(0, 10);
    const fromDate = addDays(todayDate, -(numPeriod - 1));
    const toDate = todayDate;

    // 2. Ambil data mentah dari repository via Dependency Injection
    const workouts = await repo.findWorkouts(userId, fromDate, toDate, normalizedType);
    const nutritionLogs = await repo.findNutritionLogs(userId, fromDate, toDate);
    const weightLogs = await repo.findWeightLogs(userId, fromDate, toDate);
    const streak = await repo.findStreak(userId);
    const goal = await repo.findActiveGoal(userId);

    // 3. Gabungkan catatan per tanggal lokal (BR-04: multi workout di satu hari)
    const dateMap = new Map();

    // Petakan latihan
    for (const w of workouts) {
      const d = w.logged_date;
      if (!dateMap.has(d)) {
        dateMap.set(d, {
          date: d,
          workouts: [],
          calories: null,
          weightKg: null
        });
      }
      dateMap.get(d).workouts.push({
        type: (w.activity_type || '').toLowerCase(),
        durationMin: w.duration_minutes,
        distanceKm: w.distance_km || null,
        routineName: w.routine_name || (w.activity_type ? `${w.activity_type} Session` : 'Latihan Mandiri'),
        notes: w.notes || null
      });
    }

    // Petakan nutrisi
    for (const n of nutritionLogs) {
      const d = n.logged_date;
      // Jika type filter aktif dan bukan 'all', hanya sertakan jika hari itu memiliki latihan yang sesuai
      if (normalizedType !== 'all' && !dateMap.has(d)) {
        continue;
      }
      if (!dateMap.has(d)) {
        dateMap.set(d, {
          date: d,
          workouts: [],
          calories: null,
          weightKg: null
        });
      }
      dateMap.get(d).calories = n.calories;
    }

    // Petakan berat badan
    for (const w of weightLogs) {
      const d = w.logged_date;
      if (normalizedType !== 'all' && !dateMap.has(d)) {
        continue;
      }
      if (!dateMap.has(d)) {
        dateMap.set(d, {
          date: d,
          workouts: [],
          calories: null,
          weightKg: null
        });
      }
      dateMap.get(d).weightKg = Number(w.weight_kg);
    }

    // Urutkan entri tanggal terbaru dulu (descending)
    const allItems = Array.from(dateMap.values()).sort((a, b) => b.date.localeCompare(a.date));

    // 4. Hitung ringkasan (Summary)
    const checkinDaysSet = new Set(workouts.map(w => w.logged_date));
    const checkinDays = checkinDaysSet.size;

    const daysPerWeek = goal?.workout_days_per_week || 4;
    const scheduledDays = Math.round((numPeriod / 7) * daysPerWeek);

    // Rata-rata kalori hanya dari hari yang ada NutritionLog
    const calList = nutritionLogs.map(n => n.calories).filter(c => typeof c === 'number' && c > 0);
    const avgCalories = calList.length > 0
      ? Math.round(calList.reduce((sum, c) => sum + c, 0) / calList.length)
      : null;

    // 5. Tren berat badan (WeightTrend)
    const weightTrend = weightLogs.map(w => ({
      date: w.logged_date,
      weightKg: Number(w.weight_kg)
    }));

    // 6. Paginasi
    const total = allItems.length;
    const startIndex = (numPage - 1) * numPageSize;
    const paginatedItems = allItems.slice(startIndex, startIndex + numPageSize);

    return {
      period: numPeriod,
      type: normalizedType,
      summary: {
        currentStreak: streak?.current_streak || 0,
        longestStreak: streak?.best_streak || 0,
        checkinDays,
        scheduledDays,
        avgCalories
      },
      weightTrend,
      items: paginatedItems,
      page: numPage,
      pageSize: numPageSize,
      total
    };
  }
}

module.exports = new HistoryService();
