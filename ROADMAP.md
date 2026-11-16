# ROADMAP FitStreak (UAS) - langkah demi langkah

Kerjakan **berurutan**. Selesaikan satu langkah sampai `npm test` hijau, simpan ke Git (`git add .` lalu `git commit -m "pesan"`), baru lanjut.

Cara memberi tugas ke AI Agent: tempel baris "Perintah" di bawah. Agent harus sudah membaca `AGENTS.md`.

## Tahap 0 - Persiapan (sekali saja)
- Pasang Node.js LTS, VS Code, Git. Cek: `node -v`, `npm -v`, `git --version`.
- Buat folder proyek, `git init`, taruh `AGENTS.md` dan `ROADMAP.md` di akar.
- Perintah: "Baca AGENTS.md dan ROADMAP.md. Buat package.json, .gitignore, .env.example. Jangan menulis kode lain."

## Tahap 1 - Logika kalori (SELESAI)
- calorie.js, macro.js + tes TC-01..TC-09. Pastikan `npm test` hijau.

## Tahap 2 - Logika murni lainnya (tanpa database)
| Langkah | Perintah ke agent | Tes |
|---|---|---|
| 2.1 Tren dan target adaptif | "Buat services/trend.js dan adaptive.js sesuai BR-12 dan subbab 2.1.13." | TC-10..13 |
| 2.2 Streak | "Buat services/streak.js sesuai BR-04, BR-05, BR-08." | TC-14..18 |
| 2.3 Zona waktu | "Buat utils/time.js: tanggal lokal dari UTC dan zona waktu, awal minggu Senin." | TC-19..20 |
| 2.4 Rekomendasi | "Buat services/recommendation.js sesuai BR-14 dan BR-15." | TC-25..26 |

## Tahap 3 - Database dan API
| Langkah | Perintah | Hasil yang diperiksa |
|---|---|---|
| 3.1 Skema | "Buat db/schema.sql dan migrate.js dari ERD (15 tabel) pada makalah. Tunjukkan skemanya dulu, tunggu persetujuan saya." | tabel terbentuk |
| 3.2 Repository | "Buat repositories untuk User, Goal, WeightLog. Hanya SQL di sini." | tes repository |
| 3.3 Auth | "Buat registrasi dan login (FR-01, FR-02), bcryptjs, sesi, tolak usia < 18." | daftar, login, logout |
| 3.4 Profil dan target | "Buat route profil dan target yang memakai CalorieService dan batas BR-09 di server." | TC-23..24 |
| 3.5 Check-in | "Buat route check-in yang memperbarui streak dan skor." | check-in berjalan |
| 3.6 Nutrisi dan berat | "Buat log nutrisi dan berat badan, dan evaluasi target adaptif." | saran muncul |
| 3.7 Katalog dan rutinitas | "Buat tabel dan seed 24 gerakan, otot, rutinitas (BR-16)." | daftar gerakan |
| 3.8 Admin | "Buat route admin: kelola akun dan statistik agregat, tolak data kesehatan dengan 403 (BR-13)." | TC admin |

## Tahap 4 - Antarmuka PWA
| Langkah | Perintah |
|---|---|
| 4.1 Kerangka | "Buat public/index.html, css dasar, manifest.json, ikon, dan sw.js yang menyimpan berkas UI (NFR-07)." |
| 4.2 Login dan registrasi | "Buat halaman login dan registrasi, lebar 360 px sampai 1280 px." |
| 4.3 Dashboard | "Buat dashboard: streak, skor konsistensi, kalori, makro, saran target." |
| 4.4 Check-in | "Buat halaman check-in maksimal 3 langkah (NFR-01)." |
| 4.5 Katalog dan rutinitas | "Buat katalog, detail gerakan dengan SVG otot, dan halaman rutinitas." |

## Tahap 5 - Pengingat
- "Buat jobs/reminderJob.js dengan node-cron dan web-push (BR-07), notifier bisa diganti saat tes." Tes: TC-21..22.

## Tahap 6 - Mutu dan penutup
- "Tambahkan .github/workflows/ci.yml yang menjalankan npm test." Cek cakupan >= 65% (`npm run test:coverage`).
- Lengkapi README (cara pasang dan jalan), isi bagian pengujian laporan UAS dengan hasil nyata.
