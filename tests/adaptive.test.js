// tests/adaptive.test.js
// Pengujian unit evaluasi target adaptif jendela 14 hari (TC-12..TC-13, BR-12)

const adaptiveService = require('../src/services/adaptiveService');

describe('AdaptiveService & Target Kalori Adaptif', () => {
  // TC-12: Menolak evaluasi jika data belum cukup (min 4 weight logs & 10 nutrition logs)
  test('TC-12: Menolak penyesuaian jika data kurang dari 4 timbangan atau kurang dari 10 log makan', () => {
    const weightLogs = [
      { date: '2026-10-01', weight: 70.0 },
      { date: '2026-10-05', weight: 70.2 },
      { date: '2026-10-10', weight: 70.3 }
      // Hanya 3 data berat badan (< 4)
    ];

    const nutritionLogs = Array.from({ length: 12 }, (_, i) => ({
      date: `2026-10-${String(i + 1).padStart(2, '0')}`,
      calories: 2500
    }));

    const result = adaptiveService.evaluateAdaptiveTarget({
      currentTarget: 2800,
      currentWeight: 70.3,
      goalType: 'bulking',
      weightLogs,
      nutritionLogs,
      bmr: 1600,
      tdee: 2500
    });

    expect(result.shouldAdjust).toBe(false);
    expect(result.delta).toBe(0);
    expect(result.reason).toContain('Data belum cukup');
  });

  // TC-13: Menyarankan penyesuaian dengan pembatasan maksimal ±150 kkal (BR-12)
  test('TC-13: Membatasi saran penyesuaian kalori maksimal 150 kkal (sesuai contoh tampilan kedua)', () => {
    // Skenario sesuai tampilan kedua.png:
    // Bulking, target 2800 kkal, BB naik 0.1 kg/minggu (lebih lambat dari tujuan 0.25 kg/minggu).
    // Gap: 0.25 - 0.1 = 0.15 kg/minggu.
    // Kalori harian: 0.15 * 1100 = 165 kkal.
    // Dibatasi maksimal +150 kkal -> saran menjadi 2950 kkal (+150).
    const weightLogs = [
      { date: '2026-10-01', weight: 69.0 },
      { date: '2026-10-03', weight: 69.02 },
      { date: '2026-10-06', weight: 69.05 },
      { date: '2026-10-09', weight: 69.1 },
      { date: '2026-10-12', weight: 69.15 },
      { date: '2026-10-14', weight: 69.2 }
    ];

    const nutritionLogs = Array.from({ length: 12 }, (_, i) => ({
      date: `2026-10-${String(i + 1).padStart(2, '0')}`,
      calories: 2800
    }));

    const result = adaptiveService.evaluateAdaptiveTarget({
      currentTarget: 2800,
      currentWeight: 69.2,
      goalType: 'bulking',
      weightLogs,
      nutritionLogs,
      bmr: 1600,
      tdee: 2500,
      targetWeeklyRateKg: 0.25
    });

    expect(result.shouldAdjust).toBe(true);
    expect(result.delta).toBe(150);
    expect(result.suggestedTarget).toBe(2950);
    expect(result.currentTarget).toBe(2800);
  });
});
