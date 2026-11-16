// src/strategies/BulkingStrategy.js
// Strategi untuk tujuan Bulking (surplus kalori terkontrol)

const GoalStrategy = require('./GoalStrategy');

class BulkingStrategy extends GoalStrategy {
  constructor(surplusCalories = 300) {
    super();
    this.surplusCalories = surplusCalories;
  }

  calculateTarget(tdee) {
    return Math.round(tdee + this.surplusCalories);
  }

  getProteinRatio() {
    return 1.8; // BR-10: 1.8 g/kg untuk bulking
  }

  getName() {
    return 'bulking';
  }
}

module.exports = BulkingStrategy;
