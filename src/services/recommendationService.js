// src/services/recommendationService.js
// Layanan rekomendasi pola split latihan dan deteksi otot tertinggal
// Sesuai dengan BR-14, BR-15, dan TC-25..TC-26

const ALL_PRIMARY_MUSCLES = [
  'Dada',
  'Punggung',
  'Bahu',
  'Lengan',
  'Paha depan',
  'Paha belakang',
  'Betis',
  'Perut'
];

class RecommendationService {
  /**
   * Merekomendasikan pola split program latihan berdasarkan frekuensi hari per minggu (BR-14)
   * 1-3 hari = Full Body
   * 4 hari = Upper/Lower
   * 5+ hari = Push/Pull/Legs (PPL)
   * @param {number} daysPerWeek - Jumlah hari latihan per minggu
   * @param {string} goalType - 'bulking' atau 'cutting'
   * @returns {Object} Rekomendasi program
   */
  recommendProgramSplit(daysPerWeek = 4, goalType = 'bulking') {
    const formattedGoal = goalType.toLowerCase() === 'bulking' ? 'Bulking' : 'Cutting';

    if (daysPerWeek <= 3) {
      return {
        splitName: 'Full Body',
        daysPerWeek,
        goalType: formattedGoal,
        description: `Berdasarkan tujuan ${formattedGoal} dan ${daysPerWeek} hari latihan per minggu, pola yang disarankan adalah Full Body.`,
        schedule: [
          { day: 'Hari 1', name: 'Full Body A', focus: 'Dada, Paha depan, Punggung' },
          { day: 'Hari 2', name: 'Full Body B', focus: 'Bahu, Paha belakang, Lengan' },
          ...(daysPerWeek >= 3 ? [{ day: 'Hari 3', name: 'Full Body C', focus: 'Seluruh tubuh & Inti' }] : [])
        ]
      };
    } else if (daysPerWeek === 4) {
      return {
        splitName: 'Upper/Lower',
        daysPerWeek: 4,
        goalType: formattedGoal,
        description: `Berdasarkan tujuan ${formattedGoal} dan 4 hari latihan per minggu, pola yang disarankan adalah Upper/Lower.`,
        schedule: [
          { day: 'Hari 1', name: 'Upper A', focus: 'Dada, bahu, punggung' },
          { day: 'Hari 2', name: 'Lower A', focus: 'Paha depan, bokong, betis' },
          { day: 'Hari 3', name: 'Upper B', focus: 'Punggung, bahu, lengan' },
          { day: 'Hari 4', name: 'Lower B', focus: 'Paha belakang, bokong, perut' }
        ]
      };
    } else {
      return {
        splitName: 'Push/Pull/Legs',
        daysPerWeek,
        goalType: formattedGoal,
        description: `Berdasarkan tujuan ${formattedGoal} dan ${daysPerWeek} hari latihan per minggu, pola yang disarankan adalah Push/Pull/Legs.`,
        schedule: [
          { day: 'Hari 1', name: 'Push', focus: 'Dada, bahu depan/samping, trisep' },
          { day: 'Hari 2', name: 'Pull', focus: 'Punggung, bahu belakang, bisep' },
          { day: 'Hari 3', name: 'Legs', focus: 'Paha depan, paha belakang, betis' },
          { day: 'Hari 4', name: 'Upper / Push', focus: 'Dada, bahu, punggung' },
          { day: 'Hari 5', name: 'Lower / Legs', focus: 'Kaki & perut' }
        ]
      };
    }
  }

  /**
   * Mendeteksi otot yang belum dilatih dalam 7 hari terakhir (BR-15)
   * @param {Array<string>} trainedMusclesLast7Days - Daftar otot utama yang sudah dilatih 7 hari terakhir
   * @returns {Array<string>} Daftar otot yang tertinggal
   */
  detectLaggingMuscles(trainedMusclesLast7Days = []) {
    const trainedSet = new Set(
      trainedMusclesLast7Days.map(m => m.trim().toLowerCase())
    );

    return ALL_PRIMARY_MUSCLES.filter(
      muscle => !trainedSet.has(muscle.toLowerCase())
    );
  }

  /**
   * Menyarankan gerakan untuk otot tertinggal (maksimal 3 gerakan per otot - BR-15)
   * @param {Array<string>} laggingMuscles
   * @param {Array<{ id: number, name: string, primaryMuscle: string }>} exerciseCatalog
   * @returns {Array<{ muscle: string, exercises: Array<Object> }>}
   */
  recommendExercisesForLaggingMuscles(laggingMuscles = [], exerciseCatalog = []) {
    return laggingMuscles.map(muscle => {
      const matchingExercises = exerciseCatalog
        .filter(ex => ex.primaryMuscle && ex.primaryMuscle.toLowerCase().includes(muscle.toLowerCase()))
        .slice(0, 3); // Maksimal 3 gerakan per otot (BR-15)

      return {
        muscle,
        exercises: matchingExercises
      };
    });
  }
}

module.exports = new RecommendationService();
module.exports.RecommendationService = RecommendationService;
module.exports.ALL_PRIMARY_MUSCLES = ALL_PRIMARY_MUSCLES;
