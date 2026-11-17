# ROADMAP FitStreak (UAS) - langkah demi langkah

Kerjakan **berurutan**. Selesaikan satu langkah sampai `npm test` hijau, simpan ke Git (`git add .` lalu `git commit -m "pesan"`), baru lanjut.

Cara memberi tugas ke AI Agent: tempel baris "Perintah" di bawah. Agent harus sudah membaca `AGENTS.md`.

## Tahap 0 - Persiapan (SELESAI)
- [x] Pasang Node.js LTS, VS Code, Git. Cek: `node -v`, `npm -v`, `git --version`.
- [x] Buat folder proyek, `git init`, taruh `AGENTS.md` dan `ROADMAP.md` di akar.
- [x] Buat package.json, .gitignore, .env.example.

## Tahap 1 - Logika kalori (SELESAI)
- [x] calorie.js, macro.js + tes TC-01..TC-09. `npm test` hijau.

## Tahap 2 - Logika murni lainnya (tanpa database) (SELESAI)
| Langkah | Deskripsi | Status | Tes |
|---|---|---|---|
| 2.1 Tren dan target adaptif | `services/trend.js` dan `adaptive.js` sesuai BR-12 dan subbab 2.1.13 | [x] Selesai | TC-10..13 |
| 2.2 Streak | `services/streak.js` sesuai BR-04, BR-05, BR-08 | [x] Selesai | TC-14..18 |
| 2.3 Zona waktu | `utils/time.js`: tanggal lokal dari UTC dan zona waktu, awal minggu Senin | [x] Selesai | TC-19..20 |
| 2.4 Rekomendasi | `services/recommendation.js` sesuai BR-14 dan BR-15 | [x] Selesai | TC-25..26 |

## Tahap 3 - Database dan API (SELESAI)
| Langkah | Deskripsi | Status | Hasil |
|---|---|---|---|
| 3.1 Skema | `db/schema.sql` dan `migrate.js` (15 tabel ERD makalah) | [x] Selesai | 15 tabel terbentuk |
| 3.2 Repository | Repositories User, Goal, WeightLog, Streak, AuditLog, dll. (Khusus SQL) | [x] Selesai | Tes repository lulus |
| 3.3 Auth | Registrasi dan login (FR-01, FR-02), bcryptjs, sesi, tolak usia < 18 | [x] Selesai | Daftar, login, logout |
| 3.4 Profil dan target | Route profil dan target memakai CalorieService dan batas BR-09 di server | [x] Selesai | TC-23..24 |
| 3.5 Check-in | Route check-in yang memperbarui streak dan skor | [x] Selesai | Check-in berjalan |
| 3.6 Nutrisi dan berat | Log nutrisi dan berat badan, evaluasi target adaptif | [x] Selesai | Saran adaptif muncul |
| 3.7 Katalog dan rutinitas | Tabel & seed 24 gerakan, otot, rutinitas (BR-16) | [x] Selesai | 24 gerakan tersimpan |
| 3.8 Admin | Route admin: kelola akun & statistik agregat, tolak data kesehatan 403 (BR-13) | [x] Selesai | TC admin lulus |

## Tahap 4 - Antarmuka PWA (SELESAI)
| Langkah | Deskripsi | Status |
|---|---|---|
| 4.1 Kerangka | `public/index.html`, css dasar, `manifest.json`, ikon, dan `sw.js` (NFR-07) | [x] Selesai |
| 4.2 Login dan registrasi | Halaman login dan registrasi, responsif 360 px sampai 1280 px | [x] Selesai |
| 4.3 Dashboard | Dashboard: streak, skor konsistensi, kalori, makro, saran target adaptif | [x] Selesai |
| 4.4 Check-in | Halaman check-in maksimal 3 langkah (NFR-01) | [x] Selesai |
| 4.5 Katalog dan rutinitas | Katalog 24 gerakan, detail dengan SVG anatomi otot, halaman rutinitas, dan riwayat | [x] Selesai |

## Tahap 5 - Pengingat (SELESAI)
- [x] `jobs/reminderJob.js` dengan node-cron dan web-push (BR-07), Web Audio API chime sound, dan integrasi UI Pengingat. Tes: TC-21..22.

## Tahap 6 - Mutu dan penutup (SELESAI)
- [x] Menambahkan `.github/workflows/ci.yml` yang menjalankan npm test otomatis di GitHub Actions.
- [x] Cakupan kode (code coverage) mencapai **74.04% Lines** (melampaui target >= 65%).
- [x] Lengkapi README.md (cara pasang, cara jalan, link localhost lengkap, hasil nyata pengujian 11 test suites 49 tests).
- [x] Seluruh 49 pengujian Jest 100% HIJAU (PASS).

