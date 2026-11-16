-- src/db/schema.sql
-- Skema Basis Data 15 Tabel FitStreak SQLite sesuai ERD Makalah RPL

PRAGMA foreign_keys = ON;

-- 1. Tabel users: Akun pengguna dan data profil
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  gender TEXT NOT NULL, -- 'male' / 'female' / 'laki-laki' / 'perempuan'
  birth_date TEXT NOT NULL, -- 'YYYY-MM-DD'
  height_cm REAL NOT NULL,
  time_zone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
  role TEXT NOT NULL DEFAULT 'user', -- 'user' / 'admin'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Tabel goals: Target program kebugaran (Bulking / Cutting)
CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL, -- 'bulking' / 'cutting'
  target_calories INTEGER NOT NULL,
  activity_level TEXT NOT NULL DEFAULT 'light',
  workout_days_per_week INTEGER NOT NULL DEFAULT 4,
  target_weekly_rate_kg REAL DEFAULT 0.25,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 3. Tabel macro_targets: Alokasi gram makronutrisi harian
CREATE TABLE IF NOT EXISTS macro_targets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  goal_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  protein_grams INTEGER NOT NULL,
  fat_grams INTEGER NOT NULL,
  carb_grams INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 4. Tabel weight_logs: Riwayat timbangan berat badan harian
CREATE TABLE IF NOT EXISTS weight_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight_kg REAL NOT NULL,
  logged_date TEXT NOT NULL, -- 'YYYY-MM-DD'
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 5. Tabel nutrition_logs: Catatan konsumsi kalori & makro harian
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_date TEXT NOT NULL, -- 'YYYY-MM-DD'
  calories INTEGER NOT NULL,
  protein_grams INTEGER NOT NULL DEFAULT 0,
  carb_grams INTEGER NOT NULL DEFAULT 0,
  fat_grams INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 6. Tabel workouts: Log sesi aktivitas latihan fisik
CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_date TEXT NOT NULL, -- 'YYYY-MM-DD'
  activity_type TEXT NOT NULL, -- 'Gym', 'Lari', 'Bersepeda', dll.
  duration_minutes INTEGER NOT NULL,
  distance_km REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 7. Tabel workout_exercises: Gerakan yang diselesaikan dalam sesi latihan
CREATE TABLE IF NOT EXISTS workout_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id),
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL DEFAULT 3,
  reps TEXT NOT NULL DEFAULT '10',
  weight_kg REAL DEFAULT 0,
  is_completed INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- 8. Tabel checkins: Status validitas check-in harian (1 hari lokal = 1 checkin)
CREATE TABLE IF NOT EXISTS checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checkin_date TEXT NOT NULL, -- 'YYYY-MM-DD'
  workout_id INTEGER REFERENCES workouts(id),
  is_valid INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, checkin_date)
);

-- 9. Tabel streaks: Catatan streak aktif dan rekor streak pengguna
CREATE TABLE IF NOT EXISTS streaks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  last_checkin_date TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 10. Tabel exercises: Katalog master 24 gerakan latihan
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'Dada', 'Punggung', 'Bahu', 'Lengan', 'Kaki', 'Perut', 'Kardio'
  equipment TEXT NOT NULL, -- 'Barbel', 'Dumbel', 'Kabel', 'Mesin', 'Tanpa alat', 'Palang'
  difficulty TEXT NOT NULL DEFAULT 'menengah',
  default_sets INTEGER NOT NULL DEFAULT 3,
  default_reps TEXT NOT NULL DEFAULT '8-10',
  rest_seconds INTEGER NOT NULL DEFAULT 90,
  instructions TEXT NOT NULL,
  is_cardio INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 11. Tabel muscles: Master grup otot tubuh manusia
CREATE TABLE IF NOT EXISTS muscles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  region TEXT NOT NULL, -- 'upper', 'lower', 'core'
  is_primary INTEGER NOT NULL DEFAULT 1
);

-- 12. Tabel exercise_muscles: Pemetaan relasi gerakan dengan otot (utama/pendukung)
CREATE TABLE IF NOT EXISTS exercise_muscles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  muscle_name TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 1, -- 1 = otot utama, 0 = otot pendukung
  UNIQUE(exercise_id, muscle_name)
);

-- 13. Tabel routines: Rutinitas latihan yang disusun pengguna
CREATE TABLE IF NOT EXISTS routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 55,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 14. Tabel routine_exercises: Daftar urutan gerakan dalam satu rutinitas
CREATE TABLE IF NOT EXISTS routine_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  default_sets INTEGER NOT NULL DEFAULT 4,
  default_reps TEXT NOT NULL DEFAULT '8-10',
  rest_seconds INTEGER NOT NULL DEFAULT 90,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- 15. Tabel audit_logs: Pencatatan jejak audit aksi administrator (BR-13)
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  target_user_id INTEGER,
  details TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
