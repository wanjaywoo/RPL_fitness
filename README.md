# FitStreak 🏋️‍♂️🔥

> **Progressive Web App (PWA)** untuk menghitung kebutuhan kalori harian dengan rumus **Mifflin-St Jeor**, memantau target makronutrisi, serta melacak **streak** olahraga dan konsistensi kebugaran mandiri secara adaptif.

Proyek ini dikembangkan sebagai implementasi Ujian Akhir Semester (UAS) mata kuliah **Konstruksi dan Rekayasa Perangkat Lunak (RPL)** berdasarkan spesifikasi rancangan UTS (SRS: FR-01..22, NFR-01..10, BR-01..16, 21 use case, ERD 15 tabel, 26 test case TC-01..26).

---

## 📸 Antarmuka PWA Sesuai Rancangan Mockup

Antarmuka aplikasi dibangun murni menggunakan **HTML5, CSS3, dan JavaScript Vanilla (CommonJS/ES Modules tanpa framework/bundler eksternal)** di folder `public/`, disesuaikan secara presisi dengan 6 gambar referensi resmi:

1. **Buat Akun & Registrasi** (`tampilan buat akun.png`): Formulir 9 data fisik profil, penegakan batas usia minimal 18 tahun, serta kotak persetujuan disclaimer medis.
2. **Dashboard Utama** (`tampilan kedua.png`): Sidebar hijau gelap (`#12231b`), 3 stat cards (Streak, Kepatuhan 86%, Kalori hari ini), checklist tugas hari ini, kalender 7 hari minggu ini, saran target kalori adaptif (+150 kkal) dengan tombol terima/tolak, frekuensi otot dilatih minggu ini, rekomendasi hari ini, target makro, dan grafik garis tren berat badan 8 minggu.
3. **Check-in Harian** (`tampilan ketiga.png`): Formulir 2 kolom (log latihan berdurasi 10-300 menit, checklist gerakan rutinitas Push Day, log nutrisi kalori/makro & berat badan) serta kartu gelap pratinjau pertambahan streak ("🔥 Streak jadi 15 hari").
4. **Katalog Gerakan** (`tampilan ke empat.png`): Pencarian instan, filter pills kategori (Dada, Punggung, Bahu, Lengan, Kaki, Perut, Kardio), 24 kartu gerakan dengan badge otot utama (oranye) dan pendukung (abu-abu), serta seksi kardio bawah.
5. **Detail Gerakan & Anatomi Vektor Tubuh Orisinal SVG** (`tampilan ke lima.png`): Ilustrasi anatomi vektor tubuh tampak DEPAN dan BELAKANG buatan sendiri dengan highlight oranye untuk otot utama dan peach untuk pendukung, petunjuk langkah demi langkah, dan parameter default set/reps/istirahat.
6. **Rutinitas & Rekomendasi Program** (`tampilan ke enam.png`): Pengelolaan urutan gerakan rutinitas aktif (Push Day), kartu rekomendasi program split (Upper/Lower untuk 4 hari), dan deteksi otot belum dilatih 7 hari terakhir (Paha belakang, Betis) dengan tombol cepat tambah gerakan.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

Sesuai aturan ketat pada `AGENTS.md`:
- **Server**: Node.js (LTS) + Express (CommonJS, JavaScript murni, tanpa TypeScript).
- **Basis Data**: SQLite murni via `node:sqlite` (cadangan resmi `better-sqlite3` yang aman dan kompatibel di seluruh versi Windows). Semua query berparameter.
- **Antarmuka**: HTML5, Vanilla CSS, Vanilla JavaScript di folder `public/` (Tanpa React, Vue, Tailwind, atau bundler).
- **PWA**: `manifest.json` (warna tema `#165b39`, mode *standalone*) + Service Worker `sw.js` (*cache-first* untuk akses offline NFR-07).
- **Pengingat**: `node-cron` + `web-push` (BR-07, Dependency Injection untuk kemudahan pengujian).
- **Keamanan**: Hash kata sandi dengan `bcryptjs` (murni JavaScript, bebas kompilasi C++ di Windows).
- **Pengujian**: **Jest** (Unit testing untuk seluruh service dan endpoint).
- **CI / Otomasi**: GitHub Actions (`.github/workflows/ci.yml`).

---

## 📁 Struktur Direktori & Arsitektur Lapisan

Arsitektur aplikasi menerapkan pemisahan tanggung jawab yang ketat:
**Route $\rightarrow$ Service $\rightarrow$ Repository $\rightarrow$ SQLite**.

```text
RPL_fitness/
├── AGENTS.md                  # Aturan dan pedoman AI agent
├── ROADMAP.md                 # Tahapan pengerjaan bertahap (Tahap 0 s/d Tahap 6)
├── README.md                  # Dokumentasi resmi proyek
├── package.json               # Konfigurasi dependensi dan skrip npm
├── .env.example               # Contoh variabel lingkungan
├── .gitignore                 # Berkas pengabaian Git
├── .github/workflows/ci.yml   # Pipeline otomatisasi pengujian CI
├── src/
│   ├── server.js              # Entry point Express server
│   ├── app.js                 # Konfigurasi Express, middleware, & routes
│   ├── db/
│   │   ├── connection.js      # Koneksi SQLite (node:sqlite)
│   │   ├── schema.sql         # Skema DDL 15 tabel relasional
│   │   ├── migrate.js         # Eksekutor migrasi tabel
│   │   └── seed.js            # Seeding master 24 gerakan & otot (BR-16)
│   ├── repositories/          # Khusus SQL berparameter (1 berkas per tabel)
│   ├── services/              # Logika bisnis murni (Dependency Injection, tanpa Express/SQL)
│   │   ├── calorieService.js       # Mifflin-St Jeor & batas keselamatan (BR-01..03, BR-09)
│   │   ├── macroService.js         # Distribusi Protein, Lemak, Karbohidrat (BR-10, BR-11)
│   │   ├── streakService.js        # Streak, toleransi hari libur, skor konsistensi (BR-04..08)
│   │   ├── trendService.js         # Regresi linier tren berat badan
│   │   ├── adaptiveService.js      # Target kalori adaptif 14 hari (BR-12)
│   │   ├── recommendationService.js# Rekomendasi program & otot tertinggal (BR-14, BR-15)
│   │   └── reminderService.js      # Evaluasi notifikasi harian (BR-07)
│   ├── strategies/            # Pola desain Strategy (BulkingStrategy, CuttingStrategy)
│   ├── routes/                # Endpoint REST API (auth, profile, goals, checkin, dashboard, dll)
│   ├── middleware/            # authMiddleware, roleMiddleware (BR-13), errorHandler
│   ├── jobs/                  # reminderJob.js (node-cron)
│   └── utils/                 # time.js (penanganan UTC vs WIB & awal minggu Senin)
├── public/                    # Frontend PWA statis
│   ├── index.html             # Shell aplikasi PWA
│   ├── manifest.json          # PWA Web App Manifest
│   ├── sw.js                  # PWA Service Worker offline caching
│   ├── icons/icon.svg         # Ikon vektor api FitStreak
│   ├── css/ (base, layout, components)
│   └── js/ (app, api, views, svgMuscle)
└── tests/                     # 10 Test Suites Jest (TC-01 s/d TC-26)
```

---

## 🚀 Petunjuk Menjalankan di Windows (Command Prompt / CMD)

### 1. Prasyarat
Pastikan komputer telah terpasang **Node.js LTS** (v20+ / v22+ / v24+) dan **Git**:
```cmd
node -v
npm -v
git --version
```

### 2. Pemasangan Dependensi
Buka CMD di folder proyek, lalu jalankan:
```cmd
cd C:\Users\user\Project-Rizwan\RPL_fitness
npm install
```

### 3. Migrasi & Seeding Basis Data
Jalankan migrasi 15 tabel dan seeding 24 gerakan latihan:
```cmd
npm run migrate
npm run seed
```

### 4. Menjalankan Server Aplikasi
Nyalakan server Express:
```cmd
npm start
```
Buka browser (Google Chrome atau Microsoft Edge) dan akses:
👉 **`http://localhost:3000`**

Untuk menguji fitur PWA, klik ikon **Install FitStreak** pada bilah alamat browser untuk memasang aplikasi ke desktop/layar utama Windows.

---

## 🧪 Pengujian & Jaminan Mutu (Testing & Quality Assurance)

Seluruh logika bisnis diuji secara komprehensif menggunakan Jest dengan cakupan skenario pengujian **TC-01 s/d TC-26**:

Jalankan seluruh pengujian unit:
```cmd
npm test
```

Periksa persentase cakupan kode (Code Coverage):
```cmd
npm run test:coverage
```

### Hasil Nyata Pengujian (100% Lulus / Hijau):
- **Test Suites**: 10 passed, 10 total
- **Tests**: 39 passed, 39 total
- **Lines Coverage**: **74.34%** (Melampaui target syarat $\ge 65\%$)

| Berkas Pengujian | Skenario Uji | Status |
|---|---|---|
| `tests/calorie.test.js` | TC-01..TC-05: BMR Mifflin-St Jeor, TDEE, Bulking/Cutting, Batas Keamanan Server | ✅ LULUS |
| `tests/macro.test.js` | TC-06..TC-09: Rasio Protein, Lemak $\ge 0.6\text{ g/kg}$, Penyesuaian Karbo $< 100\text{ g}$ | ✅ LULUS |
| `tests/trend.test.js` | TC-10..TC-11: Slope Regresi Linier Tren Berat Badan Mingguan & $R^2$ | ✅ LULUS |
| `tests/adaptive.test.js` | TC-12..TC-13: Syarat 14 Hari (4 Berat, 10 Nutrisi), Pembatasan Koreksi $\pm 150\text{ kkal}$ | ✅ LULUS |
| `tests/streak.test.js` | TC-14..TC-18: Validasi Durasi 10-300 Menit, Hari Istirahat Netral, Toleransi Bolos, Skor | ✅ LULUS |
| `tests/time.test.js` | TC-19..TC-20: Waktu UTC ke Lokal Asia/Jakarta & Awal Minggu Senin | ✅ LULUS |
| `tests/reminder.test.js` | TC-21..TC-22: Evaluasi Pengingat Harian (Jam Pengguna, Hari Terjadwal, Belum Checkin) | ✅ LULUS |
| `tests/recommendation.test.js` | TC-25..TC-26: Rekomendasi Split (Full Body/Upper-Lower/PPL) & Deteksi Otot Tertinggal | ✅ LULUS |
| `tests/api.test.js` | FR-01..03, Dashboard Agregasi, & Penolakan Akses Medis Admin HTTP 403 (BR-13) | ✅ LULUS |
| `tests/pwa.test.js` | NFR-07: Validitas Manifest PWA, Service Worker Cache, & Generator SVG Otot Orisinal | ✅ LULUS |

---

## ⚖️ Penegakan Aturan Bisnis (Business Rules BR-01..BR-16)

- **BR-01**: BMR dihitung dengan formula Mifflin-St Jeor ($10W + 6.25H - 5A + 5$ pria; $-161$ wanita).
- **BR-02**: Target Bulking bawaan $\text{TDEE} + 300\text{ kkal}$; Cutting bawaan $\text{TDEE} - 500\text{ kkal}$.
- **BR-03 & BR-09**: Batas keselamatan server-side: usia $\ge 18$ tahun; kalori tidak boleh di bawah BMR dan batas minimum absolut ($1.500$ pria, $1.200$ wanita); defisit maksimal $\min(25\% \text{TDEE}, 750\text{ kkal})$; surplus maksimal $\min(20\% \text{TDEE}, 500\text{ kkal})$. Kalori latihan tidak ditambahkan ke target harian.
- **BR-04**: Check-in sah membutuhkan minimal 1 sesi latihan berdurasi 10–300 menit. Beberapa log pada tanggal lokal yang sama dihitung sebagai 1 check-in.
- **BR-05 & BR-08**: Hari istirahat netral. Toleransi 1 hari bolos per minggu kalender (Senin–Minggu); bolos kedua memutus streak.
- **BR-06**: Skor konsistensi dihitung dari rasio hari check-in terhadap total hari latihan terjadwal yang telah berakhir.
- **BR-07**: Notifikasi pengingat dikirim 1x sehari pada jam lokal preferensi pengguna, hanya jika belum check-in dan bukan hari libur.
- **BR-10 & BR-11**: Protein $1.8\text{ g/kg}$ (Bulking) atau $2.0\text{ g/kg}$ (Cutting); lemak $25\%$ (min $0.6\text{ g/kg}$); karbohidrat sisa alokasi. Jika karbohidrat $< 100\text{ g}$, protein diturunkan ke $1.6\text{ g/kg}$.
- **BR-12**: Target kalori adaptif mengevaluasi jendela 14 hari (min 4 timbangan & 10 log makan) dengan nilai $7.700\text{ kkal/kg}$, koreksi maksimal $\pm 150\text{ kkal/hari}$.
- **BR-13**: Administrator dilarang membaca data kesehatan pengguna (HTTP 403 Forbidden). Seluruh aksi admin dicatat di `audit_logs`.
- **BR-14 & BR-15**: Rekomendasi pola program: 1-3 hari Full Body, 4 hari Upper/Lower, 5+ hari PPL. Otot yang tidak dilatih selama 7 hari dideteksi sebagai otot tertinggal (rekomendasi maks 3 gerakan per otot).
- **BR-16**: Seed 24 gerakan latihan terbagi atas kategori kekuatan dan kardio.

---

## 👨‍💻 Pengembang & Lisensi

- **Nama**: Rizwan Defriansyah (`@wanjaywoo`)
- **Mata Kuliah**: Konstruksi dan Rekayasa Perangkat Lunak (UAS)
- **Lisensi**: ISC
