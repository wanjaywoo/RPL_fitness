// tests/streak.test.js
// Pengujian unit streak, toleransi hari istirahat, dan skor konsistensi (TC-14..TC-18, BR-04..BR-08)

const streakService = require('../src/services/streakService');

describe('StreakService & Aturan Streak & Konsistensi', () => {
  // TC-14: Validasi durasi check-in (10 - 300 menit) (BR-04)
  test('TC-14: Memvalidasi durasi latihan check-in (10 s/d 300 menit)', () => {
    // Kurang dari 10 menit -> tidak sah
    expect(streakService.validateWorkoutLogs([{ durationMinutes: 5 }]).isValid).toBe(false);

    // Lebih dari 300 menit -> tidak sah
    expect(streakService.validateWorkoutLogs([{ durationMinutes: 360 }]).isValid).toBe(false);

    // Antara 10 dan 300 menit -> sah
    expect(streakService.validateWorkoutLogs([{ durationMinutes: 45 }]).isValid).toBe(true);
  });

  // TC-15: Hari istirahat bersifat netral (tidak memutus streak) (BR-05)
  test('TC-15: Hari istirahat tidak memutus streak', () => {
    // Jadwal: Senin(1), Selasa(2), Kamis(4), Jumat(5)
    // Rabu(3) adalah hari istirahat
    // Tanggal: 2026-10-19 (Senin), 2026-10-20 (Selasa), 2026-10-21 (Rabu - rest), 2026-10-22 (Kamis)
    const checkinDates = ['2026-10-19', '2026-10-20', '2026-10-22'];
    const result = streakService.calculateStreak({
      checkinDates,
      scheduledDays: [1, 2, 4, 5],
      startDate: '2026-10-19',
      currentDate: '2026-10-22'
    });

    // Streak harus berlanjut menjadi 3 (hari Rabu tidak memutus streak)
    expect(result.currentStreak).toBe(3);
  });

  // TC-16: 1 hari bolos per minggu ditoleransi (streak tidak putus) (BR-05)
  test('TC-16: 1 hari latihan terlewat dalam 1 minggu ditoleransi', () => {
    // Jadwal: Senin(1), Selasa(2), Kamis(4), Jumat(5)
    // User check-in Senin, bolos Selasa (1x bolos), check-in Kamis
    const checkinDates = ['2026-10-19', '2026-10-22'];
    const result = streakService.calculateStreak({
      checkinDates,
      scheduledDays: [1, 2, 4, 5],
      startDate: '2026-10-19',
      currentDate: '2026-10-22'
    });

    // 1 bolos ditoleransi -> streak tetap lanjut bernilai 2
    expect(result.currentStreak).toBe(2);
    expect(result.missedThisWeek).toBe(1);
  });

  // TC-17: Hari bolos kedua dalam minggu yang sama memutus streak (BR-05)
  test('TC-17: Hari terlewat kedua dalam minggu yang sama mereset streak', () => {
    // Jadwal: Senin(1), Selasa(2), Kamis(4), Jumat(5)
    // User check-in Senin, bolos Selasa (1x), bolos Kamis (2x) -> streak putus
    const checkinDates = ['2026-10-19'];
    const result = streakService.calculateStreak({
      checkinDates,
      scheduledDays: [1, 2, 4, 5],
      startDate: '2026-10-19',
      currentDate: '2026-10-23' // Evaluasi hari Jumat
    });

    // Streak harus putus (0) karena sudah 2 hari terlewat di minggu yang sama
    expect(result.currentStreak).toBe(0);
    expect(result.bestStreak).toBe(1);
  });

  // TC-18: Perhitungan Skor Konsistensi (BR-06)
  test('TC-18: Menghitung skor konsistensi persentase dengan benar', () => {
    // Periode 1 minggu (Senin-Minggu, 4 hari terjadwal: Sen, Sel, Kam, Jum)
    // User check-in di 3 hari dari 4 hari
    const checkinDates = ['2026-10-19', '2026-10-20', '2026-10-22'];
    const score = streakService.calculateConsistencyScore({
      checkinDates,
      scheduledDays: [1, 2, 4, 5],
      startDate: '2026-10-19',
      endDate: '2026-10-25'
    });

    // 3 / 4 * 100% = 75%
    expect(score).toBe(75);
  });
});
