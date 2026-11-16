// src/db/seed.js
// Seeding 24 gerakan latihan, grup otot, dan rutinitas bawaan (BR-16)
// Sesuai dengan mockup tampilan ke empat, ke lima, dan ke enam

const db = require('./connection');

const MUSCLES_DATA = [
  { name: 'Dada', region: 'upper', is_primary: 1 },
  { name: 'Punggung', region: 'upper', is_primary: 1 },
  { name: 'Bahu', region: 'upper', is_primary: 1 },
  { name: 'Lengan', region: 'upper', is_primary: 1 },
  { name: 'Bisep', region: 'upper', is_primary: 0 },
  { name: 'Trisep', region: 'upper', is_primary: 0 },
  { name: 'Trapezius', region: 'upper', is_primary: 0 },
  { name: 'Paha depan', region: 'lower', is_primary: 1 },
  { name: 'Paha belakang', region: 'lower', is_primary: 1 },
  { name: 'Bokong', region: 'lower', is_primary: 0 },
  { name: 'Betis', region: 'lower', is_primary: 1 },
  { name: 'Perut', region: 'core', is_primary: 1 }
];

const EXERCISES_DATA = [
  // 1-12 Latihan Beban Utama (Mockup Layar 4 & 5)
  {
    name: 'Bench Press',
    category: 'Dada',
    equipment: 'Barbel',
    difficulty: 'menengah',
    default_sets: 4,
    default_reps: '8-10',
    rest_seconds: 90,
    instructions: '1. Berbaring di bangku, kaki menapak lantai, bahu dirapatkan ke bangku.\n2. Pegang barbel selebar sedikit di atas bahu, turunkan perlahan ke tengah dada.\n3. Dorong ke atas sampai siku hampir lurus tanpa mengunci.',
    is_cardio: 0,
    muscles: [
      { name: 'Dada', is_primary: 1 },
      { name: 'Bahu', is_primary: 0 },
      { name: 'Trisep', is_primary: 0 }
    ]
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'Dada',
    equipment: 'Dumbel',
    difficulty: 'menengah',
    default_sets: 3,
    default_reps: '10-12',
    rest_seconds: 75,
    instructions: '1. Atur bangku inklinasi 30-45 derajat.\n2. Angkat dumbel ke atas dada bagian atas.\n3. Turunkan terkontrol hingga siku 90 derajat lalu dorong kembali ke atas.',
    is_cardio: 0,
    muscles: [
      { name: 'Dada', is_primary: 1 },
      { name: 'Bahu', is_primary: 0 },
      { name: 'Trisep', is_primary: 0 }
    ]
  },
  {
    name: 'Overhead Press',
    category: 'Bahu',
    equipment: 'Barbel',
    difficulty: 'menengah',
    default_sets: 4,
    default_reps: '6-8',
    rest_seconds: 90,
    instructions: '1. Berdiri tegak, pegang barbel di depan bahu atas.\n2. Kencangkan otot inti dan bokong.\n3. Dorong barbel lurus ke atas kepala sampai lengan lurus.',
    is_cardio: 0,
    muscles: [
      { name: 'Bahu', is_primary: 1 },
      { name: 'Trisep', is_primary: 0 },
      { name: 'Trapezius', is_primary: 0 }
    ]
  },
  {
    name: 'Lateral Raise',
    category: 'Bahu',
    equipment: 'Dumbel',
    difficulty: 'pemula',
    default_sets: 3,
    default_reps: '12-15',
    rest_seconds: 60,
    instructions: '1. Berdiri dengan dumbel di samping paha.\n2. Angkat kedua tangan ke samping hingga sejajar bahu dengan siku sedikit ditekuk.\n3. Turunkan perlahan ke posisi awal.',
    is_cardio: 0,
    muscles: [
      { name: 'Bahu', is_primary: 1 }
    ]
  },
  {
    name: 'Pull-up',
    category: 'Punggung',
    equipment: 'Palang',
    difficulty: 'mahir',
    default_sets: 4,
    default_reps: '6-10',
    rest_seconds: 90,
    instructions: '1. Gantung di palang dengan pegangan selebar bahu menghadap luar.\n2. Tarik tubuh ke atas hingga dagu melampaui palang.\n3. Turunkan tubuh terkontrol sampai lengan lurus penuh.',
    is_cardio: 0,
    muscles: [
      { name: 'Punggung', is_primary: 1 },
      { name: 'Bisep', is_primary: 0 },
      { name: 'Trapezius', is_primary: 0 }
    ]
  },
  {
    name: 'Barbell Row',
    category: 'Punggung',
    equipment: 'Barbel',
    difficulty: 'menengah',
    default_sets: 4,
    default_reps: '8-10',
    rest_seconds: 90,
    instructions: '1. Bungkukkan badan 45 derajat dengan punggung lurus.\n2. Tarik barbel ke arah perut bagian bawah.\n3. Rasakan kontraksi otot punggung lalu turunkan perlahan.',
    is_cardio: 0,
    muscles: [
      { name: 'Punggung', is_primary: 1 },
      { name: 'Trapezius', is_primary: 1 },
      { name: 'Bisep', is_primary: 0 }
    ]
  },
  {
    name: 'Biceps Curl',
    category: 'Lengan',
    equipment: 'Dumbel',
    difficulty: 'pemula',
    default_sets: 3,
    default_reps: '10-12',
    rest_seconds: 60,
    instructions: '1. Berdiri tegak memegang dumbel dengan telapak tangan menghadap depan.\n2. Tekuk siku mengangkat dumbel mendekati bahu tanpa mengayun tubuh.\n3. Turunkan beban secara terkontrol.',
    is_cardio: 0,
    muscles: [
      { name: 'Lengan', is_primary: 1 },
      { name: 'Bisep', is_primary: 1 }
    ]
  },
  {
    name: 'Triceps Pushdown',
    category: 'Lengan',
    equipment: 'Kabel',
    difficulty: 'pemula',
    default_sets: 3,
    default_reps: '10-12',
    rest_seconds: 60,
    instructions: '1. Berdiri di depan mesin kabel katrol atas.\n2. Tahan siku tetap di samping badan.\n3. Dorong palang/tali ke bawah hingga siku lurus mengunci.',
    is_cardio: 0,
    muscles: [
      { name: 'Lengan', is_primary: 1 },
      { name: 'Trisep', is_primary: 1 }
    ]
  },
  {
    name: 'Back Squat',
    category: 'Kaki',
    equipment: 'Barbel',
    difficulty: 'menengah',
    default_sets: 4,
    default_reps: '6-8',
    rest_seconds: 120,
    instructions: '1. Letakkan barbel di punggung atas (trapezius).\n2. Turunkan pinggul ke belakang dan bawah hingga paha sejajar lantai.\n3. Dorong tumit untuk berdiri kembali ke posisi awal.',
    is_cardio: 0,
    muscles: [
      { name: 'Paha depan', is_primary: 1 },
      { name: 'Bokong', is_primary: 1 },
      { name: 'Paha belakang', is_primary: 0 },
      { name: 'Perut', is_primary: 0 }
    ]
  },
  {
    name: 'Romanian Deadlift',
    category: 'Kaki',
    equipment: 'Barbel',
    difficulty: 'menengah',
    default_sets: 3,
    default_reps: '8-10',
    rest_seconds: 90,
    instructions: '1. Berdiri memegang barbel di depan paha.\n2. Dorong pinggul ke belakang dengan lutut sedikit ditekuk hingga meregang paha belakang.\n3. Kembalikan pinggul ke depan sambil mengencangkan bokong.',
    is_cardio: 0,
    muscles: [
      { name: 'Paha belakang', is_primary: 1 },
      { name: 'Bokong', is_primary: 1 },
      { name: 'Punggung', is_primary: 0 }
    ]
  },
  {
    name: 'Standing Calf Raise',
    category: 'Kaki',
    equipment: 'Mesin',
    difficulty: 'pemula',
    default_sets: 4,
    default_reps: '12-15',
    rest_seconds: 60,
    instructions: '1. Berdiri di bantalan mesin dengan bola kaki.\n2. Turunkan tumit untuk meregangkan betis.\n3. Dorong setinggi mungkin ke atas menggunakan ujung kaki.',
    is_cardio: 0,
    muscles: [
      { name: 'Betis', is_primary: 1 }
    ]
  },
  {
    name: 'Plank',
    category: 'Perut',
    equipment: 'Tanpa alat',
    difficulty: 'pemula',
    default_sets: 3,
    default_reps: '45 dtk',
    rest_seconds: 60,
    instructions: '1. Tumpu tubuh pada lengan bawah dan jari kaki.\n2. Pertahankan tubuh dalam satu garis lurus kaku dari kepala hingga tumit.\n3. Tahan posisi tanpa membiarkan pinggul turun.',
    is_cardio: 0,
    muscles: [
      { name: 'Perut', is_primary: 1 },
      { name: 'Bahu', is_primary: 0 }
    ]
  },

  // 13-18 Latihan Kekuatan Tambahan
  {
    name: 'Leg Press',
    category: 'Kaki',
    equipment: 'Mesin',
    difficulty: 'pemula',
    default_sets: 3,
    default_reps: '10-12',
    rest_seconds: 90,
    instructions: 'Duduk di mesin leg press, dorong platform dengan kaki tanpa mengunci lutut.',
    is_cardio: 0,
    muscles: [
      { name: 'Paha depan', is_primary: 1 },
      { name: 'Bokong', is_primary: 0 }
    ]
  },
  {
    name: 'Lying Leg Curl',
    category: 'Kaki',
    equipment: 'Mesin',
    difficulty: 'pemula',
    default_sets: 3,
    default_reps: '10-12',
    rest_seconds: 60,
    instructions: 'Tengkurap di mesin, tekuk lutut menarik beban ke arah bokong.',
    is_cardio: 0,
    muscles: [
      { name: 'Paha belakang', is_primary: 1 }
    ]
  },
  {
    name: 'Lat Pulldown',
    category: 'Punggung',
    equipment: 'Kabel',
    difficulty: 'pemula',
    default_sets: 3,
    default_reps: '10-12',
    rest_seconds: 75,
    instructions: 'Duduk di mesin katrol, tarik palang ke dada atas dengan mengunci bahu ke bawah.',
    is_cardio: 0,
    muscles: [
      { name: 'Punggung', is_primary: 1 },
      { name: 'Bisep', is_primary: 0 }
    ]
  },
  {
    name: 'Cable Fly',
    category: 'Dada',
    equipment: 'Kabel',
    difficulty: 'menengah',
    default_sets: 3,
    default_reps: '12-15',
    rest_seconds: 60,
    instructions: 'Tarik kabel dari samping ke tengah dada membentuk gerakan memeluk.',
    is_cardio: 0,
    muscles: [
      { name: 'Dada', is_primary: 1 }
    ]
  },
  {
    name: 'Dips',
    category: 'Dada',
    equipment: 'Palang',
    difficulty: 'menengah',
    default_sets: 3,
    default_reps: '8-12',
    rest_seconds: 90,
    instructions: 'Gantung tubuh di palang sejajar, turunkan badan dengan menekuk siku 90 derajat lalu dorong ke atas.',
    is_cardio: 0,
    muscles: [
      { name: 'Dada', is_primary: 1 },
      { name: 'Trisep', is_primary: 1 }
    ]
  },
  {
    name: 'Crunches',
    category: 'Perut',
    equipment: 'Tanpa alat',
    difficulty: 'pemula',
    default_sets: 3,
    default_reps: '15-20',
    rest_seconds: 45,
    instructions: 'Berbaring telentang, tekuk lutut, angkat bahu dari lantai menggunakan kontraksi otot perut.',
    is_cardio: 0,
    muscles: [
      { name: 'Perut', is_primary: 1 }
    ]
  },

  // 19-24 Gerakan Kardio (Mockup Layar 4 Bawah)
  {
    name: 'Lari',
    category: 'Kardio',
    equipment: 'Tanpa alat',
    difficulty: 'pemula',
    default_sets: 1,
    default_reps: '30 menit',
    rest_seconds: 0,
    instructions: 'Lari dengan kecepatan konstan atau interval untuk melatih daya tahan kardiovaskular.',
    is_cardio: 1,
    muscles: [
      { name: 'Kaki', is_primary: 1 },
      { name: 'Betis', is_primary: 0 }
    ]
  },
  {
    name: 'Bersepeda',
    category: 'Kardio',
    equipment: 'Sepeda',
    difficulty: 'pemula',
    default_sets: 1,
    default_reps: '45 menit',
    rest_seconds: 0,
    instructions: 'Gowes dengan kayuhan teratur melatih jantung dan otot kaki bagian bawah.',
    is_cardio: 1,
    muscles: [
      { name: 'Paha depan', is_primary: 1 },
      { name: 'Betis', is_primary: 0 }
    ]
  },
  {
    name: 'Renang',
    category: 'Kardio',
    equipment: 'Kolam',
    difficulty: 'menengah',
    default_sets: 1,
    default_reps: '45 menit',
    rest_seconds: 0,
    instructions: 'Berenang gaya dada atau bebas untuk melatih seluruh tubuh tanpa beban sendi.',
    is_cardio: 1,
    muscles: [
      { name: 'Punggung', is_primary: 1 },
      { name: 'Bahu', is_primary: 0 }
    ]
  },
  {
    name: 'Jalan cepat',
    category: 'Kardio',
    equipment: 'Tanpa alat',
    difficulty: 'pemula',
    default_sets: 1,
    default_reps: '30 menit',
    rest_seconds: 0,
    instructions: 'Jalan kaki dengan tempo cepat (5-6 km/jam) untuk membakar kalori secara aktif.',
    is_cardio: 1,
    muscles: [
      { name: 'Kaki', is_primary: 1 }
    ]
  },
  {
    name: 'HIIT',
    category: 'Kardio',
    equipment: 'Tanpa alat',
    difficulty: 'mahir',
    default_sets: 4,
    default_reps: '20 menit',
    rest_seconds: 30,
    instructions: 'Latihan interval intensitas tinggi: 30 detik sprint/burpee, 30 detik istirahat aktif.',
    is_cardio: 1,
    muscles: [
      { name: 'Perut', is_primary: 1 },
      { name: 'Kaki', is_primary: 1 }
    ]
  },
  {
    name: 'Lompat tali',
    category: 'Kardio',
    equipment: 'Tali skipping',
    difficulty: 'menengah',
    default_sets: 3,
    default_reps: '15 menit',
    rest_seconds: 60,
    instructions: 'Melompat berirama dengan tumpuan bola kaki meningkatkan koordinasi dan kelincahan.',
    is_cardio: 1,
    muscles: [
      { name: 'Betis', is_primary: 1 },
      { name: 'Bahu', is_primary: 0 }
    ]
  }
];

function seed() {
  console.log('Menjalankan seeding 24 gerakan, otot, dan rutinitas...');

  // 1. Seed Otot
  const insertMuscle = db.prepare(`
    INSERT OR IGNORE INTO muscles (name, region, is_primary)
    VALUES (?, ?, ?)
  `);
  for (const m of MUSCLES_DATA) {
    insertMuscle.run(m.name, m.region, m.is_primary);
  }

  // 2. Seed 24 Gerakan
  const insertExercise = db.prepare(`
    INSERT OR IGNORE INTO exercises (
      name, category, equipment, difficulty, default_sets, default_reps, rest_seconds, instructions, is_cardio
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertExerciseMuscle = db.prepare(`
    INSERT OR IGNORE INTO exercise_muscles (exercise_id, muscle_name, is_primary)
    VALUES (?, ?, ?)
  `);

  const selectExId = db.prepare('SELECT id FROM exercises WHERE name = ?');

  for (const ex of EXERCISES_DATA) {
    insertExercise.run(
      ex.name,
      ex.category,
      ex.equipment,
      ex.difficulty,
      ex.default_sets,
      ex.default_reps,
      ex.rest_seconds,
      ex.instructions,
      ex.is_cardio
    );

    const row = selectExId.get(ex.name);
    if (row && ex.muscles) {
      for (const m of ex.muscles) {
        insertExerciseMuscle.run(row.id, m.name, m.is_primary);
      }
    }
  }

  console.log('Seeding berhasil! 24 gerakan latihan dan grup otot telah tersimpan.');
}

if (require.main === module) {
  try {
    seed();
    process.exit(0);
  } catch (error) {
    console.error('Gagal menjalankan seeding:', error);
    process.exit(1);
  }
}

module.exports = seed;
