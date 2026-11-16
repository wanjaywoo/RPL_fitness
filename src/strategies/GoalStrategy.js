// src/strategies/GoalStrategy.js
// Antarmuka dasar untuk strategi tujuan (Bulking / Cutting)

class GoalStrategy {
  /**
   * Menghitung target kalori harian dari TDEE
   * @param {number} tdee - Total Daily Energy Expenditure
   * @returns {number}
   */
  calculateTarget(tdee) {
    throw new Error('Metode calculateTarget() harus diimplementasikan');
  }

  /**
   * Mendapatkan rasio protein (gram per kg berat badan)
   * @returns {number}
   */
  getProteinRatio() {
    throw new Error('Metode getProteinRatio() harus diimplementasikan');
  }

  /**
   * Mendapatkan nama strategi
   * @returns {string}
   */
  getName() {
    throw new Error('Metode getName() harus diimplementasikan');
  }
}

module.exports = GoalStrategy;
