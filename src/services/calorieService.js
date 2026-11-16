// src/services/calorieService.js
// Layanan perhitungan kalori (BMR Mifflin-St Jeor, TDEE, dan batas keamanan)
// Sesuai dengan BR-01, BR-02, BR-03, dan BR-09

const BulkingStrategy = require('../strategies/BulkingStrategy');
const CuttingStrategy = require('../strategies/CuttingStrategy');

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,       // Jarang / tidak pernah berolahraga
  light: 1.375,         // Ringan (1-3 hari/minggu)
  moderate: 1.55,       // Sedang (3-5 hari/minggu)
  very_active: 1.725,   // Sangat aktif (6-7 hari/minggu)
  extra_active: 1.9     // Ekstra aktif (pekerja fisik / atlet latihan 2x/hari)
};

const ABSOLUTE_MIN_CALORIES = {
  male: 1500,
  female: 1200
};

class CalorieService {
  /**
   * Menghitung BMR (Basal Metabolic Rate) dengan rumus Mifflin-St Jeor
   * Laki-laki: 10 * berat(kg) + 6.25 * tinggi(cm) - 5 * usia(tahun) + 5
   * Perempuan: 10 * berat(kg) + 6.25 * tinggi(cm) - 5 * usia(tahun) - 161
   */
  calculateBmr({ weight, height, age, gender }) {
    if (!weight || !height || !age || !gender) {
      throw new Error('Parameter weight, height, age, dan gender wajib diisi');
    }

    if (age < 18) {
      throw new Error('Pengguna harus berusia minimal 18 tahun (BR-09)');
    }

    const normalizedGender = gender.toLowerCase();
    const base = 10 * weight + 6.25 * height - 5 * age;

    if (normalizedGender === 'male' || normalizedGender === 'laki-laki' || normalizedGender === 'pria') {
      return base + 5;
    } else if (normalizedGender === 'female' || normalizedGender === 'perempuan' || normalizedGender === 'wanita') {
      return base - 161;
    } else {
      throw new Error('Gender tidak valid (gunakan male/female atau laki-laki/perempuan)');
    }
  }

  /**
   * Menghitung TDEE (Total Daily Energy Expenditure)
   */
  calculateTdee({ bmr, activityLevel }) {
    if (!bmr || bmr <= 0) {
      throw new Error('Nilai BMR tidak valid');
    }

    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || (typeof activityLevel === 'number' ? activityLevel : 1.2);
    return Math.round(bmr * multiplier);
  }

  /**
   * Menghitung target kalori harian berdasarkan strategi tujuan
   * @param {Object} params
   * @param {number} params.tdee
   * @param {number} params.bmr
   * @param {string} params.gender
   * @param {GoalStrategy|string} params.strategy
   */
  calculateTargetCalories({ tdee, bmr, gender, strategy }) {
    let activeStrategy = strategy;
    if (typeof strategy === 'string') {
      const type = strategy.toLowerCase();
      if (type === 'bulking') {
        activeStrategy = new BulkingStrategy();
      } else if (type === 'cutting') {
        activeStrategy = new CuttingStrategy();
      } else {
        throw new Error('Strategi harus bulking atau cutting');
      }
    }

    const rawTarget = activeStrategy.calculateTarget(tdee);
    return this.applySafetyLimits({
      targetCalories: rawTarget,
      bmr,
      tdee,
      gender,
      goalType: activeStrategy.getName()
    });
  }

  /**
   * Menerapkan batas keamanan mutlak di server (BR-03 & BR-09)
   */
  applySafetyLimits({ targetCalories, bmr, tdee, gender, goalType }) {
    const normalizedGender = (gender || 'male').toLowerCase();
    const isMale = normalizedGender === 'male' || normalizedGender === 'laki-laki' || normalizedGender === 'pria';
    const absoluteMin = isMale ? ABSOLUTE_MIN_CALORIES.male : ABSOLUTE_MIN_CALORIES.female;

    let adjustedTarget = targetCalories;

    if (goalType === 'cutting') {
      // Defisit maks: 25% dari TDEE dan maksimal 750 kkal
      const maxDeficit = Math.min(tdee * 0.25, 750);
      const minAllowed = tdee - maxDeficit;

      if (adjustedTarget < minAllowed) {
        adjustedTarget = minAllowed;
      }

      // Target tidak boleh di bawah BMR
      if (adjustedTarget < bmr) {
        adjustedTarget = bmr;
      }

      // Target tidak boleh di bawah batas absolut (1500 kkal pria, 1200 kkal wanita)
      if (adjustedTarget < absoluteMin) {
        adjustedTarget = absoluteMin;
      }
    } else if (goalType === 'bulking') {
      // Surplus maks: 20% dari TDEE dan maksimal 500 kkal
      const maxSurplus = Math.min(tdee * 0.20, 500);
      const maxAllowed = tdee + maxSurplus;

      if (adjustedTarget > maxAllowed) {
        adjustedTarget = maxAllowed;
      }
    }

    return Math.round(adjustedTarget);
  }

  /**
   * Validasi target kalori apakah melanggar batas keamanan
   */
  validateTargetCalories({ targetCalories, bmr, tdee, gender, goalType }) {
    const normalizedGender = (gender || 'male').toLowerCase();
    const isMale = normalizedGender === 'male' || normalizedGender === 'laki-laki' || normalizedGender === 'pria';
    const absoluteMin = isMale ? ABSOLUTE_MIN_CALORIES.male : ABSOLUTE_MIN_CALORIES.female;

    const errors = [];

    if (targetCalories < absoluteMin) {
      errors.push(`Target kalori (${targetCalories} kkal) tidak boleh di bawah batas absolut ${absoluteMin} kkal`);
    }

    if (targetCalories < bmr) {
      errors.push(`Target kalori (${targetCalories} kkal) tidak boleh di bawah BMR (${bmr} kkal)`);
    }

    if (goalType === 'cutting') {
      const deficit = tdee - targetCalories;
      const maxDeficit = Math.min(tdee * 0.25, 750);
      if (deficit > maxDeficit) {
        errors.push(`Defisit kalori (${deficit} kkal) melebihi batas maksimal ${maxDeficit} kkal`);
      }
    }

    if (goalType === 'bulking') {
      const surplus = targetCalories - tdee;
      const maxSurplus = Math.min(tdee * 0.20, 500);
      if (surplus > maxSurplus) {
        errors.push(`Surplus kalori (${surplus} kkal) melebihi batas maksimal ${maxSurplus} kkal`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new CalorieService();
module.exports.CalorieService = CalorieService;
module.exports.ACTIVITY_MULTIPLIERS = ACTIVITY_MULTIPLIERS;
