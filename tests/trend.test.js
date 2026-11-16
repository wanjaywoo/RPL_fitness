// tests/trend.test.js
// Pengujian unit regresi linier tren berat badan (TC-10..TC-11)

const trendService = require('../src/services/trendService');

describe('TrendService & Regresi Linier Tren Berat Badan', () => {
  // TC-10: Menghitung slope regresi dan laju perubahan mingguan dengan data bertambah
  test('TC-10: Menghitung laju kenaikan berat badan per minggu dengan tepat', () => {
    // 7 hari data: naik 0.1 kg per hari = 0.7 kg per minggu
    const logs = [
      { date: '2026-10-01', weight: 70.0 },
      { date: '2026-10-02', weight: 70.1 },
      { date: '2026-10-03', weight: 70.2 },
      { date: '2026-10-04', weight: 70.3 },
      { date: '2026-10-05', weight: 70.4 },
      { date: '2026-10-06', weight: 70.5 },
      { date: '2026-10-07', weight: 70.6 }
    ];

    const trend = trendService.calculateWeightTrend(logs);
    expect(trend.slope).toBeCloseTo(0.1, 2);
    expect(trend.weeklyChangeKg).toBeCloseTo(0.7, 2);
    expect(trend.rSquared).toBeCloseTo(1.0, 2);
    expect(trend.count).toBe(7);
  });

  // TC-11: Menangani data berat badan konstan atau fluktuatif
  test('TC-11: Menghitung slope 0 ketika berat badan konstan', () => {
    const logs = [
      { date: '2026-10-01', weight: 65.0 },
      { date: '2026-10-05', weight: 65.0 },
      { date: '2026-10-10', weight: 65.0 }
    ];

    const trend = trendService.calculateWeightTrend(logs);
    expect(trend.slope).toBe(0);
    expect(trend.weeklyChangeKg).toBe(0);
  });
});
