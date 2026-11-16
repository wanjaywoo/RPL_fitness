// src/services/adaptiveService.js
// Layanan penyesuaian target kalori adaptif berbasis jendela 14 hari
// Sesuai dengan BR-12 dan subbab 2.1.13

const trendService = require('./trendService');
const calorieService = require('./calorieService');

const KCAL_PER_KG = 7700; // Standar energi 1 kg jaringan tubuh (BR-12)
const MAX_DAILY_ADJUSTMENT = 150; // Perubahan maksimal per evaluasi (BR-12)
const MIN_WEIGHT_LOGS = 4; // Minimal 4 data berat badan dalam 14 hari (BR-12)
const MIN_NUTRITION_LOGS = 10; // Minimal 10 hari data nutrisi dalam 14 hari (BR-12)

class AdaptiveService {
  constructor(trend = trendService, calorie = calorieService) {
    this.trendService = trend;
    this.calorieService = calorie;
  }

  /**
   * Mengevaluasi data 14 hari untuk menyarankan perubahan target kalori adaptif
   * @param {Object} params
   * @param {number} params.currentTarget - Target kalori harian saat ini
   * @param {number} params.currentWeight - Berat badan saat ini (kg)
   * @param {string} params.goalType - 'bulking' atau 'cutting'
   * @param {Array<{ date: string, weight: number }>} params.weightLogs - Data timbangan dalam jendela 14 hari
   * @param {Array<{ date: string, calories: number }>} params.nutritionLogs - Data nutrisi dalam jendela 14 hari
   * @param {number} params.bmr - BMR pengguna untuk batas keselamatan
   * @param {number} params.tdee - TDEE pengguna
   * @param {string} params.gender - Gender pengguna
   * @param {number} [params.targetWeeklyRateKg] - Target laju mingguan opsional (kg/minggu)
   * @returns {Object} Hasil evaluasi adaptif
   */
  evaluateAdaptiveTarget({
    currentTarget,
    currentWeight,
    goalType = 'bulking',
    weightLogs = [],
    nutritionLogs = [],
    bmr,
    tdee,
    gender = 'male',
    targetWeeklyRateKg
  }) {
    // Validasi syarat kecukupan data (BR-12)
    if (weightLogs.length < MIN_WEIGHT_LOGS || nutritionLogs.length < MIN_NUTRITION_LOGS) {
      return {
        shouldAdjust: false,
        reason: `Data belum cukup untuk evaluasi adaptif (terkumpul ${weightLogs.length}/${MIN_WEIGHT_LOGS} data berat dan ${nutritionLogs.length}/${MIN_NUTRITION_LOGS} catatan makan)`,
        weightLogsCount: weightLogs.length,
        nutritionLogsCount: nutritionLogs.length,
        currentTarget,
        suggestedTarget: currentTarget,
        delta: 0
      };
    }

    // Hitung tren laju berat badan nyata per minggu via regresi linier
    const trend = this.trendService.calculateWeightTrend(weightLogs);
    const actualWeeklyChangeKg = trend.weeklyChangeKg;

    // Tentukan laju mingguan yang diharapkan
    let expectedWeeklyChangeKg = targetWeeklyRateKg;
    if (expectedWeeklyChangeKg === undefined) {
      if (goalType === 'bulking') {
        // Default bulking: surplus ~300 kkal/hari -> (300 * 7) / 7700 = +0.27 kg/minggu (~0.25% BB)
        expectedWeeklyChangeKg = 0.25;
      } else {
        // Default cutting: defisit ~500 kkal/hari -> (-500 * 7) / 7700 = -0.45 kg/minggu (~0.5% BB)
        expectedWeeklyChangeKg = -0.45;
      }
    }

    // Selisih laju mingguan (kg)
    const gapWeeklyKg = expectedWeeklyChangeKg - actualWeeklyChangeKg;

    // Kalori harian yang perlu ditambah atau dikurangi untuk menutup gap:
    // (gapWeeklyKg * 7700) / 7 = gapWeeklyKg * 1100
    const rawDailyDelta = gapWeeklyKg * (KCAL_PER_KG / 7);

    // Dibatasi maksimal ±150 kkal/hari (BR-12)
    let delta = Math.round(rawDailyDelta);
    if (delta > MAX_DAILY_ADJUSTMENT) {
      delta = MAX_DAILY_ADJUSTMENT;
    } else if (delta < -MAX_DAILY_ADJUSTMENT) {
      delta = -MAX_DAILY_ADJUSTMENT;
    }

    // Jika perubahan sangat kecil (< 30 kkal), pertahankan target saat ini
    if (Math.abs(delta) < 30) {
      return {
        shouldAdjust: false,
        reason: `Laju perubahan berat badan (${actualWeeklyChangeKg} kg/minggu) sudah sesuai dengan target (${expectedWeeklyChangeKg} kg/minggu)`,
        weightLogsCount: weightLogs.length,
        nutritionLogsCount: nutritionLogs.length,
        actualWeeklyChangeKg,
        expectedWeeklyChangeKg,
        currentTarget,
        suggestedTarget: currentTarget,
        delta: 0
      };
    }

    const proposedTarget = currentTarget + delta;

    // Pastikan usulan target kalori tetap mematuhi batas keamanan (BR-03 & BR-09)
    const safeTarget = this.calorieService.applySafetyLimits({
      targetCalories: proposedTarget,
      bmr: bmr || currentTarget * 0.7,
      tdee: tdee || currentTarget,
      gender,
      goalType
    });

    const finalDelta = safeTarget - currentTarget;

    const explanation = goalType === 'bulking'
      ? actualWeeklyChangeKg < expectedWeeklyChangeKg
        ? `Berat badanmu naik ${actualWeeklyChangeKg} kg per minggu, lebih lambat dari tujuan ${expectedWeeklyChangeKg} kg per minggu.`
        : `Berat badanmu naik ${actualWeeklyChangeKg} kg per minggu, lebih cepat dari tujuan ${expectedWeeklyChangeKg} kg per minggu.`
      : actualWeeklyChangeKg > expectedWeeklyChangeKg
        ? `Penurunan berat badan (${actualWeeklyChangeKg} kg/minggu) lebih lambat dari tujuan (${expectedWeeklyChangeKg} kg/minggu).`
        : `Penurunan berat badan (${actualWeeklyChangeKg} kg/minggu) lebih cepat dari tujuan (${expectedWeeklyChangeKg} kg/minggu).`;

    return {
      shouldAdjust: finalDelta !== 0,
      reason: explanation,
      weightLogsCount: weightLogs.length,
      nutritionLogsCount: nutritionLogs.length,
      actualWeeklyChangeKg,
      expectedWeeklyChangeKg,
      currentTarget,
      suggestedTarget: safeTarget,
      delta: finalDelta
    };
  }
}

module.exports = new AdaptiveService();
module.exports.AdaptiveService = AdaptiveService;
