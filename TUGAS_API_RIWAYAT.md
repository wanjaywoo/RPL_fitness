# Tugas untuk AI Agent: API Riwayat (layar "8. Riwayat")

Baca dulu `AGENTS.md`. Tugas ini hanya untuk **fitur Riwayat**. Jangan menyentuh fitur lain.
Acuan tampilan: layar "8. Riwayat" pada mockup FitStreak. Acuan rancangan: makalah (FR-12, BR-04, BR-05, BR-06, BR-08, BR-13, NFR-02, NFR-03).

## 1. Tujuan

Pengguna yang sudah login dapat melihat riwayat check-in, asupan kalori, dan berat badannya dalam satu daftar, dengan filter periode dan jenis aktivitas, ringkasan di atas, dan data tren berat badan.

## 2. Langkah kerja (urut, berhenti di setiap tanda STOP)

1. **Periksa dulu** `src/db/schema.sql` dan repository yang sudah ada. Tulis ringkasan singkat: tabel dan kolom apa yang akan dipakai, dan apa yang belum ada. **STOP** dan tunggu persetujuan saya jika ada kolom atau tabel yang harus ditambah.
2. Buat `src/repositories/historyRepository.js` (hanya SQL).
3. Buat `src/services/historyService.js` (logika murni, tanpa Express dan tanpa SQL).
4. Buat `src/routes/history.js` lalu daftarkan di `src/app.js`.
5. Tulis tes Jest (bagian 6). Jalankan `npm test`. **STOP** dan laporkan hasilnya.
6. Hubungkan halaman `public/history.html` ke API ini (bagian 7). Hanya setelah langkah 5 hijau.

## 3. Endpoint

`GET /api/history`

Wajib login. `user_id` diambil dari sesi, **bukan** dari parameter permintaan.

Query string:

| Parameter | Nilai | Bawaan |
|---|---|---|
| `period` | `7`, `30`, atau `90` (hari terakhir) | `30` |
| `type` | `all`, `gym`, `lari`, `bersepeda`, `renang`, `jalan_cepat`, `hiit` | `all` |
| `page` | bilangan bulat >= 1 | `1` |
| `pageSize` | 1 sampai 50 | `8` |

Nilai di luar daftar ditolak dengan status **400** dan pesan kesalahan yang jelas. Administrator mendapat **403** (BR-13). Tanpa login: **401**.

Contoh respons **200**:

```json
{
  "period": 30,
  "type": "all",
  "summary": {
    "currentStreak": 14,
    "longestStreak": 21,
    "checkinDays": 24,
    "scheduledDays": 26,
    "avgCalories": 2210
  },
  "weightTrend": [
    { "date": "2026-09-20", "weightKg": 70.2 },
    { "date": "2026-10-19", "weightKg": 69.0 }
  ],
  "items": [
    {
      "date": "2026-10-19",
      "workouts": [{ "type": "gym", "durationMin": 65, "distanceKm": null, "routineName": "Push Day", "notes": null }],
      "calories": 2150,
      "weightKg": 69.0
    }
  ],
  "page": 1,
  "pageSize": 8,
  "total": 30
}
```

Aturan isi respons:
- `items` = **satu entri per tanggal lokal** yang punya minimal satu catatan (latihan, nutrisi, atau berat). Beberapa latihan di hari yang sama masuk ke larik `workouts` pada tanggal itu (BR-04). Urutan: tanggal terbaru dulu.
- Filter `type` hanya menyaring tanggal yang punya latihan berjenis itu. `type=all` menampilkan semua tanggal.
- `calories` atau `weightKg` bernilai `null` jika hari itu tidak ada catatannya.
- `summary.currentStreak` dan `longestStreak` dibaca dari tabel Streak. `checkinDays` = jumlah tanggal yang punya minimal satu WorkoutLog dalam periode. `scheduledDays` = jumlah hari latihan terjadwal dalam periode (dari jadwal pengguna). `avgCalories` = rata-rata `calories` pada hari yang punya NutritionLog, dibulatkan; `null` jika tidak ada.
- `weightTrend` = semua WeightLog dalam periode, urut tanggal naik.
- `total` = jumlah tanggal pada `items` sebelum dipaginasi.

## 4. Aturan yang wajib dipatuhi

- **Tanggal lokal (BR-08):** `log_date` sudah tanggal lokal pengguna. Batas periode dihitung dari tanggal lokal hari ini menurut zona waktu pengguna, bukan UTC server. Pakai `utils/time.js`; jangan memakai `new Date()` langsung di service, terima `today` lewat parameter agar bisa dites.
- **Keamanan (NFR-03):** semua query berparameter; setiap query memuat `WHERE user_id = ?`; tidak ada data pengguna lain yang pernah bisa bocor.
- **Administrator (BR-13):** middleware peran harus menolak admin dengan 403 dan mencatat tidak ada data kesehatan yang dikirim.
- **Kinerja (NFR-02):** maksimal beberapa query ringan per permintaan, tidak ada query di dalam perulangan (hindari N+1). Gunakan indeks `(user_id, log_date)` yang sudah ada.
- **Hari istirahat:** mockup menampilkan baris "Istirahat", tetapi `WorkoutLog.type` pada ERD **tidak** punya nilai istirahat. Jangan menambah nilai itu ke tabel. Hari istirahat harus diturunkan dari jadwal latihan pengguna. Jika jadwalnya belum ada di skema, **STOP dan tanyakan saya** (jangan menebak).
- Jangan mengubah tabel yang sudah ada tanpa persetujuan.

## 5. Struktur kode

- `historyRepository.js`: fungsi seperti `findDailyEntries(userId, fromDate, toDate, type)`, `findWeightLogs(userId, fromDate, toDate)`, `findStreak(userId)`. Tidak ada aturan bisnis di sini.
- `historyService.js`: `getHistory({ userId, period, type, page, pageSize, today }, repo)` menerima `repo` sebagai parameter (Dependency Injection) sehingga bisa dites dengan repo palsu.
- `routes/history.js`: validasi query, panggil service, bentuk respons.

## 6. Tes Jest (minimal)

Gunakan repo palsu (tanpa database) untuk tes service, dan beri nama tes dengan awalan `RIW-`:

1. `RIW-01` periode 7 hari hanya memuat tanggal dalam 7 hari terakhir (tepi: hari ke-7 masuk, hari ke-8 tidak).
2. `RIW-02` dua latihan di tanggal yang sama menjadi satu entri dengan dua isi `workouts`.
3. `RIW-03` filter `type=lari` hanya menampilkan tanggal yang punya latihan lari.
4. `RIW-04` `avgCalories` hanya dari hari yang punya catatan nutrisi; `null` bila tidak ada.
5. `RIW-05` paginasi: `pageSize=8`, 30 entri, halaman 4 berisi 6 entri; `total` = 30.
6. `RIW-06` parameter tidak valid (`period=15`, `type=abc`, `pageSize=100`) ditolak 400.
7. `RIW-07` admin mendapat 403; tanpa login 401.
8. `RIW-08` data pengguna lain tidak pernah muncul (repo dipanggil dengan `userId` dari sesi).

## 7. Menghubungkan halaman `public/history.html`

- Salin tata letak dari mockup layar 8 (HTML dan CSS biasa, tanpa kerangka kerja).
- Saat halaman dibuka dan saat tombol "Terapkan" ditekan, panggil `fetch('/api/history?period=...&type=...&page=...')`.
- Isi kartu ringkasan, tabel, teks "Menampilkan x-y dari z catatan", dan grafik garis berat dari `weightTrend` (SVG sederhana).
- Tampilkan keadaan **memuat**, **kosong** ("Belum ada catatan pada periode ini"), dan **galat** (pesan ramah, bukan teks mentah).
- Tombol Sebelumnya/Berikutnya dinonaktifkan di halaman pertama/terakhir.
- Semua teks yang berasal dari data dipasang dengan `textContent`, bukan `innerHTML`.
- Layar harus terbaca di lebar 360 px (tabel boleh digulir horizontal).

## 8. Definisi selesai

- [ ] `npm test` hijau, termasuk RIW-01 sampai RIW-08; tidak ada tes lama yang diubah.
- [ ] Endpoint dicoba dan hasil nyatanya ditunjukkan (contoh respons dari data uji).
- [ ] Tidak ada pustaka baru, tidak ada rahasia di kode.
- [ ] Ringkasan: berkas yang dibuat atau diubah, dan cara mencobanya di Windows (CMD).
- [ ] Hal yang belum diuji atau diasumsikan ditulis jujur.
