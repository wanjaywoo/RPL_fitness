# AGENTS.md - Aturan untuk AI Agent di proyek FitStreak

Berkas ini wajib dibaca di awal setiap sesi. Jika ada konflik antara permintaan sesaat dan berkas ini, tanyakan dulu kepada pemilik proyek, jangan menebak.

## 1. Tentang proyek

- **FitStreak**: Progressive Web App (PWA) untuk menghitung kebutuhan kalori dengan rumus Mifflin-St Jeor dan melacak streak olahraga pada kegiatan kebugaran mandiri.
- Proyek individual mata kuliah Konstruksi dan Rekayasa Perangkat Lunak. UTS = makalah rancangan (sudah selesai). UAS = implementasi (tahap sekarang).
- Pemilik proyek: mahasiswa **pemula**, memakai **Windows**, VS Code, dan CMD.
- Rancangan acuan: makalah UTS (SRS: FR-01..22, NFR-01..10, BR-01..16, 21 use case, ERD 15 tabel, 31 kelas, 26 test case TC-01..26). Kode harus mengikuti rancangan itu.

## 2. Teknologi (tidak boleh diganti tanpa persetujuan)

- Server: **Node.js (LTS) + Express**, JavaScript (CommonJS), tanpa TypeScript.
- Basis data: **SQLite** lewat `better-sqlite3` (cadangan: `node:sqlite`). Semua query memakai parameter.
- Antarmuka: **HTML, CSS, JavaScript biasa** di folder `public/`. Tanpa React, Vue, Tailwind, atau bundler.
- PWA: `manifest.json` + service worker `sw.js`.
- Pengingat: `node-cron` + `web-push`.
- Kata sandi: hash dengan `bcryptjs` (implementasi bcrypt tanpa kompilasi native, aman di Windows).
- Pengujian: **Jest**. CI: **GitHub Actions**.
- Dilarang menambah pustaka baru tanpa menjelaskan alasannya dan menunggu persetujuan. Utamakan pustaka kecil, populer, dan gratis.

## 3. Arsitektur dan struktur folder

Alur berlapis: **Route -> Service -> Repository -> SQLite**.

```
fitstreak/
  AGENTS.md
  ROADMAP.md
  package.json
  src/
    server.js            # menyalakan server
    app.js               # menyusun Express (middleware + route)
    config.js            # pengaturan (port, kunci VAPID, dll dari .env)
    db/                  # connection.js, schema.sql, migrate.js, seed.js
    repositories/        # satu berkas per tabel; HANYA di sini ada SQL
    services/            # logika bisnis murni (calorie, macro, safety, streak, adaptive, recommendation, reminder)
    strategies/          # BulkingStrategy, CuttingStrategy
    routes/              # auth, profile, goals, checkins, nutrition, weight, dashboard, exercises, routines, admin
    middleware/          # auth, role, validate, errorHandler
    jobs/                # reminderJob.js (node-cron)
    utils/               # time.js (zona waktu), validators
  public/                # index.html, halaman, css/, js/, icons/, manifest.json, sw.js
  tests/                 # *.test.js, tiap berkas menguji satu service
  .github/workflows/ci.yml
```

Aturan lapisan:
1. **Service** tidak boleh mengimpor Express dan tidak boleh menulis SQL. Service menerima data dan dependensi lewat parameter (Dependency Injection), misalnya jam (`now`) dan pengirim notifikasi (`notifier`).
2. **Repository** tidak berisi aturan bisnis.
3. **Route** hanya memvalidasi input, memanggil service, dan membentuk respons.
4. Pola desain yang dipakai: **Strategy** (bulking/cutting), **Repository**, **Dependency Injection**. Jangan menambah pola lain tanpa alasan.

## 4. Aturan bisnis yang tidak boleh diubah diam-diam

Sumber kebenaran adalah makalah (BR-01..BR-16). Ringkasan nilai penting:

- BMR Mifflin-St Jeor: laki-laki = 10W + 6,25H - 5A + 5; perempuan = ... - 161. TDEE = BMR x (1,2 / 1,375 / 1,55 / 1,725 / 1,9).
- Bulking = TDEE + 300; cutting = TDEE - 500 (bawaan).
- Batas keamanan (divalidasi **di server**): usia minimal 18; target tidak di bawah BMR dan minimum absolut (1500 laki-laki, 1200 perempuan); defisit maks 25% TDEE dan 750; surplus maks 20% TDEE dan 500.
- Kalori latihan **tidak** ditambahkan ke target (hindari hitung ganda).
- Makro: protein 1,8 g/kg (bulking) atau 2,0 g/kg (cutting); lemak 25% kalori (min 0,6 g/kg); karbohidrat = sisa. Bila karbohidrat < 100 g, protein turun ke 1,6 g/kg.
- Check-in = minimal satu log latihan (10-300 menit) pada satu tanggal lokal; beberapa log sehari dihitung satu.
- Hari istirahat netral. Satu hari terlewat per minggu ditoleransi; hari terlewat kedua pada minggu yang sama memutus streak. Minggu mulai Senin.
- Skor konsistensi = hari latihan terjadwal yang ada check-in / hari terjadwal yang sudah berakhir x 100% (0% bila belum ada).
- Semua waktu disimpan **UTC**; tanggal lokal dihitung dari zona waktu pengguna (bawaan Asia/Jakarta).
- Target adaptif: jendela 14 hari, regresi linear tren berat, 7700 kkal per kg, perubahan maks 150 kkal, minimal 4 WeightLog dan 10 hari NutritionLog; tetap dalam batas keamanan.
- Pengingat: sekali per hari, jam lokal pilihan pengguna, hanya jika belum check-in dan bukan hari istirahat.
- Administrator **tidak boleh** membaca data kesehatan pengguna (balas 403); aksi admin dicatat di AuditLog.
- Rekomendasi: 1-3 hari = Full Body; 4 = Upper/Lower; 5+ = Push/Pull/Legs. Otot tertinggal = tak ada gerakan otot utama dalam 7 hari; maksimal 3 gerakan per otot.

Jika sebuah aturan tampak salah atau tidak jelas: **berhenti, jelaskan masalahnya, dan tanya pemilik proyek.** Jangan mengubah angka sendiri.

## 5. Keamanan dan keselamatan

- Jangan pernah menaruh kunci rahasia, kata sandi, atau kunci VAPID di kode atau Git. Simpan di `.env` (sudah di `.gitignore`) dan sediakan `.env.example`.
- Selalu pakai query berparameter. Validasi semua input di server.
- Setiap pengguna hanya boleh mengakses datanya sendiri (cek `user_id` dari sesi, bukan dari body permintaan).
- Tampilkan disclaimer kesehatan; rekomendasi hanya saran umum.
- Jangan menyalin gambar, logo, atau data gerakan dari aplikasi lain. Ilustrasi otot adalah SVG buatan sendiri.

## 6. Cara bekerja (wajib)

1. **Satu langkah kecil per sesi.** Kerjakan satu item dari `ROADMAP.md`, lalu berhenti dan laporkan.
2. **Baca sebelum menulis.** Periksa berkas yang sudah ada; jangan membuat ulang atau menimpa tanpa alasan.
3. **Tes dulu atau bersamaan.** Tiap logika bisnis baru punya tes Jest yang merujuk nomor TC dan BR. Jalankan `npm test` dan pastikan hijau sebelum menyatakan selesai.
4. **Jangan mengubah tes agar lolos.** Jika tes gagal, perbaiki kode. Ubah tes hanya jika tes itu memang salah, dan jelaskan alasannya.
5. **Perubahan minimal.** Jangan merapikan atau merombak berkas yang tidak terkait tugas.
6. **Jujur soal hasil.** Katakan dengan jelas apa yang sudah dijalankan dan lulus, dan apa yang belum dicoba. Jangan mengaku sukses tanpa menjalankannya.
7. **Jelaskan untuk pemula.** Setiap sesi akhiri dengan: apa yang dibuat, berkas mana yang berubah, dan cara menjalankannya di Windows (perintah CMD, bukan Bash).
8. **Tanya sebelum bertindak** pada hal yang sulit dibatalkan: menghapus berkas atau data, menambah pustaka, mengubah skema basis data, atau mengubah aturan bisnis.
9. Komentar kode dalam bahasa Indonesia; nama fungsi, variabel, dan tabel dalam bahasa Inggris sesuai ERD.

## 7. Di luar cakupan (jangan dikerjakan)

Database makanan, input kalori otomatis dari foto, fitur sosial atau papan peringkat, integrasi jam pintar, pembayaran, login media sosial, dan notifikasi push iOS tanpa instal ke layar utama. Fitur seperti ini hanya boleh disebut sebagai pengembangan lanjutan.

## 8. Definisi "selesai" untuk setiap tugas

- [ ] Sesuai berkas rancangan (FR/BR/TC yang disebut di tugas).
- [ ] `npm test` hijau, tidak ada tes yang dilewati atau dihapus.
- [ ] Tidak ada rahasia di kode; tidak ada pustaka baru tanpa persetujuan.
- [ ] Ada petunjuk menjalankan dan memeriksa hasilnya di Windows.
- [ ] Ringkasan perubahan ditulis singkat dan jujur.
