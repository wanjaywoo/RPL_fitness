// tests/recommendation.test.js
// Pengujian unit rekomendasi program split dan deteksi otot tertinggal (TC-25..TC-26, BR-14, BR-15)

const recommendationService = require('../src/services/recommendationService');

describe('RecommendationService & Rekomendasi Latihan', () => {
  // TC-25: Rekomendasi pola split program (BR-14)
  test('TC-25: Merekomendasikan pola split sesuai hari per minggu (Full Body / Upper-Lower / PPL)', () => {
    // 3 hari -> Full Body
    const threeDays = recommendationService.recommendProgramSplit(3, 'bulking');
    expect(threeDays.splitName).toBe('Full Body');

    // 4 hari -> Upper/Lower (sesuai contoh tampilan kedua & tampilan keenam)
    const fourDays = recommendationService.recommendProgramSplit(4, 'bulking');
    expect(fourDays.splitName).toBe('Upper/Lower');
    expect(fourDays.schedule.length).toBe(4);
    expect(fourDays.schedule[0].name).toBe('Upper A');

    // 5 hari -> Push/Pull/Legs
    const fiveDays = recommendationService.recommendProgramSplit(5, 'cutting');
    expect(fiveDays.splitName).toBe('Push/Pull/Legs');
  });

  // TC-26: Deteksi otot tertinggal dalam 7 hari & batasan maks 3 gerakan (BR-15)
  test('TC-26: Mendeteksi otot yang belum dilatih 7 hari dan merekomendasikan maks 3 gerakan', () => {
    // Otot yang sudah dilatih: Dada, Punggung, Bahu, Lengan, Paha depan, Perut
    // Otot tertinggal: Paha belakang, Betis (persis seperti di tampilan kedua.png dan tampilan ke enam.png!)
    const trained = ['Dada', 'Punggung', 'Bahu', 'Lengan', 'Paha depan', 'Perut'];
    const lagging = recommendationService.detectLaggingMuscles(trained);

    expect(lagging).toContain('Paha belakang');
    expect(lagging).toContain('Betis');
    expect(lagging).not.toContain('Dada');

    // Uji rekomendasi katalog gerakan
    const catalog = [
      { id: 1, name: 'Romanian Deadlift', primaryMuscle: 'Paha belakang' },
      { id: 2, name: 'Lying Leg Curl', primaryMuscle: 'Paha belakang' },
      { id: 3, name: 'Glute Ham Raise', primaryMuscle: 'Paha belakang' },
      { id: 4, name: 'Good Morning', primaryMuscle: 'Paha belakang' }, // Gerakan ke-4 tidak boleh dimasukkan
      { id: 5, name: 'Standing Calf Raise', primaryMuscle: 'Betis' }
    ];

    const recommendations = recommendationService.recommendExercisesForLaggingMuscles(lagging, catalog);
    const hamstrings = recommendations.find(r => r.muscle === 'Paha belakang');

    expect(hamstrings).toBeDefined();
    // Maksimal 3 gerakan per otot (BR-15)
    expect(hamstrings.exercises.length).toBe(3);
    expect(hamstrings.exercises.map(e => e.name)).toEqual([
      'Romanian Deadlift',
      'Lying Leg Curl',
      'Glute Ham Raise'
    ]);
  });
});
