// tests/macro.test.js
// Pengujian unit distribusi makronutrisi sesuai TC-06..TC-09 dan BR-10, BR-11

const macroService = require('../src/services/macroService');

describe('MacroService & Aturan Makronutrisi', () => {
  // TC-06: Distribusi makronutrisi Bulking (BR-10)
  test('TC-06: Menghitung makro bulking dengan protein 1.8 g/kg dan lemak 25%', () => {
    // Berat: 70kg, Target kalori: 2800 kkal
    // Protein: 1.8 * 70 = 126 g (504 kkal)
    // Lemak: 25% * 2800 = 700 kkal / 9 = 77.78 g -> min 0.6*70 = 42 g -> gunakan 77.78 g
    // Sisa kalori untuk karbohidrat: 2800 - 504 - 700 = 1596 kkal / 4 = 399 g
    const result = macroService.calculateMacros({
      targetCalories: 2800,
      weight: 70,
      strategy: 'bulking'
    });

    expect(result.protein).toBe(126);
    expect(result.proteinRatio).toBe(1.8);
    expect(result.fat).toBe(78);
    expect(result.carbs).toBe(399);
    expect(result.isAdjusted).toBe(false);
  });

  // TC-07: Distribusi makronutrisi Cutting (BR-10)
  test('TC-07: Menghitung makro cutting dengan protein 2.0 g/kg dan lemak 25%', () => {
    // Berat: 70kg, Target kalori: 2000 kkal
    // Protein: 2.0 * 70 = 140 g (560 kkal)
    // Lemak: 25% * 2000 = 500 kkal / 9 = 55.56 g -> 56 g (min 0.6*70 = 42 g)
    // Sisa kalori untuk karbohidrat: 2000 - 560 - 500 = 940 kkal / 4 = 235 g
    const result = macroService.calculateMacros({
      targetCalories: 2000,
      weight: 70,
      strategy: 'cutting'
    });

    expect(result.protein).toBe(140);
    expect(result.proteinRatio).toBe(2.0);
    expect(result.fat).toBe(56);
    expect(result.carbs).toBe(235);
    expect(result.isAdjusted).toBe(false);
  });

  // TC-08: Lemak minimal 0.6 g/kg jika 25% kalori terlalu rendah
  test('TC-08: Menegakkan batas minimal lemak 0.6 g/kg berat badan', () => {
    // Kasus ekstrem kalori rendah: Target 1200 kkal, berat 80 kg
    // 25% * 1200 = 300 kkal / 9 = 33.3 g
    // Batas minimal lemak: 0.6 * 80 = 48 g (432 kkal)
    // Karena 33.3 < 48, lemak harus dinaikkan ke 48 g
    const result = macroService.calculateMacros({
      targetCalories: 1200,
      weight: 80,
      strategy: 'cutting'
    });

    expect(result.fat).toBe(48);
  });

  // TC-09: Penyesuaian bila Karbohidrat < 100g (BR-11)
  test('TC-09: Menurunkan rasio protein ke 1.6 g/kg jika karbohidrat < 100g', () => {
    // Berat: 80kg, Target: 1500 kkal, cutting
    // Awal: Protein 2.0 * 80 = 160g (640 kkal)
    // Lemak min: 0.6 * 80 = 48g (432 kkal)
    // Sisa karbo: 1500 - 640 - 432 = 428 kkal / 4 = 107g (masih > 100)
    
    // Mari uji kasus di mana sisa kalori untuk karbo < 400 kkal (< 100g):
    // Target 1400 kkal, berat 85kg:
    // Protein awal (2.0 * 85) = 170g (680 kkal)
    // Lemak min: 0.6 * 85 = 51g (459 kkal)
    // Sisa karbo awal: 1400 - 680 - 459 = 261 kkal / 4 = 65.25g (< 100g!)
    // Maka disesuaikan (BR-11):
    // Protein diturunkan ke 1.6 * 85 = 136g (544 kkal)
    // Sisa karbo baru: 1400 - 544 - 459 = 397 kkal / 4 = 99.25g (~99g)
    const result = macroService.calculateMacros({
      targetCalories: 1400,
      weight: 85,
      strategy: 'cutting'
    });

    expect(result.isAdjusted).toBe(true);
    expect(result.proteinRatio).toBe(1.6);
    expect(result.protein).toBe(136);
    expect(result.fat).toBe(51);
  });
});
