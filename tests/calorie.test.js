// tests/calorie.test.js
// Pengujian unit logika kalori sesuai TC-01..TC-05 dan batas keamanan BR-01..BR-03, BR-09

const calorieService = require('../src/services/calorieService');
const BulkingStrategy = require('../src/strategies/BulkingStrategy');
const CuttingStrategy = require('../src/strategies/CuttingStrategy');

describe('CalorieService & Formula Mifflin-St Jeor', () => {
  // TC-01: Perhitungan BMR Laki-laki (BR-01)
  test('TC-01: Menghitung BMR laki-laki dengan benar (10W + 6.25H - 5A + 5)', () => {
    // Berat: 70kg, Tinggi: 175cm, Usia: 25 tahun, Laki-laki
    // BMR = 10*70 + 6.25*175 - 5*25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75
    const bmr = calorieService.calculateBmr({
      weight: 70,
      height: 175,
      age: 25,
      gender: 'male'
    });
    expect(bmr).toBeCloseTo(1673.75, 2);
  });

  // TC-02: Perhitungan BMR Perempuan (BR-01)
  test('TC-02: Menghitung BMR perempuan dengan benar (10W + 6.25H - 5A - 161)', () => {
    // Berat: 55kg, Tinggi: 160cm, Usia: 25 tahun, Perempuan
    // BMR = 10*55 + 6.25*160 - 5*25 - 161 = 550 + 1000 - 125 - 161 = 1264
    const bmr = calorieService.calculateBmr({
      weight: 55,
      height: 160,
      age: 25,
      gender: 'female'
    });
    expect(bmr).toBeCloseTo(1264, 2);
  });

  // TC-03: Menolak usia < 18 tahun (BR-09)
  test('TC-03: Menolak pengguna dengan usia di bawah 18 tahun', () => {
    expect(() => {
      calorieService.calculateBmr({
        weight: 60,
        height: 165,
        age: 17,
        gender: 'male'
      });
    }).toThrow('Pengguna harus berusia minimal 18 tahun');
  });

  // TC-04: Perhitungan TDEE dengan berbagai tingkat aktivitas (BR-01)
  test('TC-04: Menghitung TDEE dengan pengali aktivitas yang benar', () => {
    const bmr = 1500;
    expect(calorieService.calculateTdee({ bmr, activityLevel: 'sedentary' })).toBe(1800);     // 1500 * 1.2
    expect(calorieService.calculateTdee({ bmr, activityLevel: 'light' })).toBe(2063);         // 1500 * 1.375 = 2062.5 -> 2063
    expect(calorieService.calculateTdee({ bmr, activityLevel: 'moderate' })).toBe(2325);      // 1500 * 1.55
    expect(calorieService.calculateTdee({ bmr, activityLevel: 'very_active' })).toBe(2588);   // 1500 * 1.725 = 2587.5 -> 2588
    expect(calorieService.calculateTdee({ bmr, activityLevel: 'extra_active' })).toBe(2850);  // 1500 * 1.9
  });

  // TC-05: Target Bulking (+300 kkal bawaan BR-02)
  test('TC-05: Menghitung target kalori Bulking (TDEE + 300)', () => {
    const tdee = 2500;
    const bmr = 1700;
    const target = calorieService.calculateTargetCalories({
      tdee,
      bmr,
      gender: 'male',
      strategy: 'bulking'
    });
    expect(target).toBe(2800); // 2500 + 300
  });

  // Target Cutting (-500 kkal bawaan BR-02)
  test('Menghitung target kalori Cutting (TDEE - 500)', () => {
    const tdee = 2500;
    const bmr = 1700;
    const target = calorieService.calculateTargetCalories({
      tdee,
      bmr,
      gender: 'male',
      strategy: 'cutting'
    });
    expect(target).toBe(2000); // 2500 - 500
  });

  // Batas keamanan defisit tidak boleh di bawah BMR & batas absolut (BR-03, BR-09)
  test('Target kalori cutting tidak boleh di bawah BMR', () => {
    const tdee = 1800;
    const bmr = 1600; // Cutting -500 akan menjadi 1300, tetapi BMR 1600
    const target = calorieService.calculateTargetCalories({
      tdee,
      bmr,
      gender: 'male',
      strategy: 'cutting'
    });
    expect(target).toBe(1600); // Tertahan di BMR
  });

  test('Target kalori cutting tidak boleh di bawah batas absolut 1500 (pria) atau 1200 (wanita)', () => {
    const targetMale = calorieService.calculateTargetCalories({
      tdee: 1600,
      bmr: 1300,
      gender: 'male',
      strategy: new CuttingStrategy(400) // 1600 - 400 = 1200, pria min 1500
    });
    expect(targetMale).toBe(1500);

    const targetFemale = calorieService.calculateTargetCalories({
      tdee: 1300,
      bmr: 1100,
      gender: 'female',
      strategy: new CuttingStrategy(300) // 1300 - 300 = 1000, wanita min 1200
    });
    expect(targetFemale).toBe(1200);
  });

  test('Surplus bulking dibatasi maksimal 20% TDEE dan 500 kkal (BR-03)', () => {
    // TDEE 2000, 20% = 400 kkal. Jika surplus diminta 600 kkal, dibatasi ke 400 kkal
    const target = calorieService.calculateTargetCalories({
      tdee: 2000,
      bmr: 1500,
      gender: 'male',
      strategy: new BulkingStrategy(600)
    });
    expect(target).toBe(2400); // 2000 + 400
  });
});
