// tests/time.test.js
// Pengujian penanganan waktu UTC vs zona waktu lokal dan awal minggu hari Senin (TC-19..TC-20)

const {
  getLocalDateString,
  getDayOfWeek,
  getStartOfWeekMonday,
  addDays,
  isSameWeekMonday
} = require('../src/utils/time');

describe('Time Utils (Zona Waktu & Kalender)', () => {
  // TC-19: Konversi UTC ke tanggal lokal dengan zona waktu Asia/Jakarta (WIB = UTC+7)
  test('TC-19: Mengonversi UTC ke tanggal lokal Asia/Jakarta dengan tepat', () => {
    // 2026-10-18T18:30:00Z di UTC adalah pukul 01:30 pada 2026-10-19 di WIB (UTC+7)
    const utcIso = '2026-10-18T18:30:00.000Z';
    const localDate = getLocalDateString(utcIso, 'Asia/Jakarta');
    expect(localDate).toBe('2026-10-19');

    // 2026-10-18T16:00:00Z di UTC adalah pukul 23:00 pada 2026-10-18 di WIB (UTC+7)
    const utcIso2 = '2026-10-18T16:00:00.000Z';
    const localDate2 = getLocalDateString(utcIso2, 'Asia/Jakarta');
    expect(localDate2).toBe('2026-10-18');
  });

  // TC-20: Penentuan awal minggu hari Senin
  test('TC-20: Mengidentifikasi awal minggu adalah hari Senin', () => {
    // 2026-10-19 adalah hari Senin (index 1)
    expect(getDayOfWeek('2026-10-19')).toBe(1);
    expect(getStartOfWeekMonday('2026-10-19')).toBe('2026-10-19');

    // 2026-10-21 adalah hari Rabu (index 3)
    expect(getDayOfWeek('2026-10-21')).toBe(3);
    // Awal minggu harus tetap Senin (2026-10-19)
    expect(getStartOfWeekMonday('2026-10-21')).toBe('2026-10-19');

    // 2026-10-25 adalah hari Minggu (index 7)
    expect(getDayOfWeek('2026-10-25')).toBe(7);
    expect(getStartOfWeekMonday('2026-10-25')).toBe('2026-10-19');

    // 2026-10-26 adalah Senin minggu berikutnya
    expect(getDayOfWeek('2026-10-26')).toBe(1);
    expect(getStartOfWeekMonday('2026-10-26')).toBe('2026-10-26');

    // Memeriksa kesamaan minggu
    expect(isSameWeekMonday('2026-10-19', '2026-10-25')).toBe(true);
    expect(isSameWeekMonday('2026-10-25', '2026-10-26')).toBe(false);
  });
});
