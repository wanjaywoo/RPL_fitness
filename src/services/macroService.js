// src/services/macroService.js
// Layanan perhitungan distribusi makronutrisi (Protein, Lemak, Karbohidrat)
// Sesuai dengan BR-10 dan BR-11

const BulkingStrategy = require('../strategies/BulkingStrategy');
const CuttingStrategy = require('../strategies/CuttingStrategy');

class MacroService {
  /**
   * Menghitung pembagian makronutrisi dari target kalori dan berat badan
   * @param {Object} params
   * @param {number} params.targetCalories - Target kalori harian
   * @param {number} params.weight - Berat badan pengguna (kg)
   * @param {GoalStrategy|string} params.strategy - Strategi 'bulking' atau 'cutting'
   * @returns {Object} { protein, fat, carbs, calories, isAdjusted }
   */
  calculateMacros({ targetCalories, weight, strategy }) {
    if (!targetCalories || !weight) {
      throw new Error('targetCalories dan weight wajib diisi');
    }

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

    let proteinRatio = activeStrategy ? activeStrategy.getProteinRatio() : 1.8;
    let proteinGrams = proteinRatio * weight;

    // Lemak: 25% total kalori, minimum absolut 0.6 g/kg berat badan (BR-10)
    let fatFromCalories = (0.25 * targetCalories) / 9;
    const minFatGrams = 0.6 * weight;
    let fatGrams = Math.max(fatFromCalories, minFatGrams);

    // Karbohidrat: Sisa alokasi kalori
    let caloriesForCarbs = targetCalories - (proteinGrams * 4 + fatGrams * 9);
    let carbGrams = caloriesForCarbs / 4;

    let isAdjusted = false;

    // BR-11: Bila karbohidrat < 100 g, turunkan rasio protein ke 1.6 g/kg
    if (carbGrams < 100) {
      proteinRatio = 1.6;
      proteinGrams = proteinRatio * weight;
      caloriesForCarbs = targetCalories - (proteinGrams * 4 + fatGrams * 9);
      carbGrams = caloriesForCarbs / 4;
      isAdjusted = true;
    }

    return {
      calories: Math.round(targetCalories),
      protein: Math.round(proteinGrams),
      fat: Math.round(fatGrams),
      carbs: Math.round(carbGrams),
      proteinRatio,
      isAdjusted
    };
  }
}

module.exports = new MacroService();
module.exports.MacroService = MacroService;
