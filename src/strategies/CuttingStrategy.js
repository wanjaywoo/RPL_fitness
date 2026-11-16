// src/strategies/CuttingStrategy.js
// Strategi untuk tujuan Cutting (defisit kalori terkontrol)

const GoalStrategy = require('./GoalStrategy');

class CuttingStrategy extends GoalStrategy {
  constructor(deficitCalories = 500) {
    super();
    this.deficitCalories = deficitCalories;
  }

  calculateTarget(tdee) {
    return Math.round(tdee - this.deficitCalories);
  }

  getProteinRatio() {
    return 2.0; // BR-10: 2.0 g/kg untuk cutting
  }

  getName() {
    return 'cutting';
  }
}

module.exports = CuttingStrategy;
