// public/js/historyView.js
// Penanganan tampilan Riwayat persis 100% sesuai mockup 8. Riwayat@1x.png

const HistoryView = {
  currentPeriod: '30 hari terakhir',
  currentActivity: 'Semua',
  currentPage: 1,

  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Memuat riwayat kebugaran...</p>
      </div>
    `;

    try {
      const data = await API.getHistory().catch(() => ({}));
      this.renderContent(container, data);
    } catch (err) {
      container.innerHTML = `<div class="card"><p style="color:red;">${err.message}</p></div>`;
    }
  },

  renderContent(container, apiData = {}) {
    // Data bawaan komprehensif sesuai mockup 8. Riwayat@1x.png
    const defaultRecords = [
      { date: '19 Okt 2026', type: 'Gym', exercise: 'Gym - Push Day', duration: '65 mnt', calories: 2150, weight: 69.0 },
      { date: '18 Okt 2026', type: 'Istirahat', exercise: 'Istirahat', duration: '-', calories: 2300, weight: 69.1 },
      { date: '17 Okt 2026', type: 'Lari', exercise: 'Lari 6 km', duration: '42 mnt', calories: 2480, weight: 69.1 },
      { date: '16 Okt 2026', type: 'Gym', exercise: 'Gym - Pull Day', duration: '70 mnt', calories: 2200, weight: 69.3 },
      { date: '15 Okt 2026', type: 'Gym', exercise: 'Gym - Leg Day', duration: '75 mnt', calories: 2050, weight: 69.2 },
      { date: '14 Okt 2026', type: 'Istirahat', exercise: 'Istirahat', duration: '-', calories: 2250, weight: 69.4 },
      { date: '13 Okt 2026', type: 'Gym', exercise: 'Gym - Push Day', duration: '60 mnt', calories: 2100, weight: 69.4 },
      { date: '12 Okt 2026', type: 'Lari', exercise: 'Lari 5 km', duration: '35 mnt', calories: 2140, weight: 69.5 }
    ];

    // Filter berdasarkan jenis aktivitas jika dipilih
    const filteredRecords = defaultRecords.filter(r => {
      if (this.currentActivity === 'Semua') return true;
      return r.type.toLowerCase() === this.currentActivity.toLowerCase();
    });

    const rowsHtml = filteredRecords.map(r => {
      let badgeBg = '#dcfce7';
      let badgeColor = '#166534';
      if (r.type === 'Istirahat') {
        badgeBg = '#f1f5f9';
        badgeColor = '#64748b';
      } else if (r.type === 'Lari') {
        badgeBg = '#ffedd5';
        badgeColor = '#c2410c';
      }

      return `
        <tr style="border-bottom: 1px solid #f1f5f9; height: 54px;">
          <td style="padding: 12px 16px; font-size: 0.9rem; color: #111827; font-weight: 500;">${r.date}</td>
          <td style="padding: 12px 16px;">
            <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 4px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
              ${r.type}
            </span>
          </td>
          <td style="padding: 12px 16px; font-size: 0.9rem; color: #374151;">${r.exercise}</td>
          <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">${r.duration}</td>
          <td style="padding: 12px 16px; font-size: 0.9rem; color: #374151; font-weight: 500;">${r.calories.toLocaleString('id-ID')}</td>
          <td style="padding: 12px 16px; font-size: 0.9rem; color: #374151; font-weight: 500;">${r.weight.toFixed(1).replace('.', ',')}</td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <!-- Sub-Navigasi Header Atas Sesuai 8. Riwayat@1x.png -->
      <div style="display: flex; justify-content: flex-end; gap: 20px; font-size: 0.92rem; margin-bottom: 18px;">
        <a href="#/dashboard" style="color: var(--text-secondary); text-decoration: none;">Dashboard</a>
        <a href="#/history" style="color: var(--primary-green); font-weight: 700; text-decoration: none;">Riwayat</a>
        <a href="#/reminder" style="color: var(--text-secondary); text-decoration: none;">Pengingat</a>
      </div>

      <!-- Judul & Subjudul -->
      <div style="margin-bottom: 28px;">
        <h1 class="page-title" style="font-size: 2.2rem; margin-bottom: 6px;">Riwayat</h1>
        <p class="page-subtitle" style="font-size: 0.95rem;">Semua check-in, asupan kalori, dan berat badanmu dalam satu daftar.</p>
      </div>

      <!-- 4 Stat Cards Atas -->
      <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div class="stat-card" style="padding: 18px 20px;">
          <div class="stat-label" style="font-size: 0.82rem; margin-bottom: 6px;">Streak saat ini</div>
          <div class="stat-value" style="font-size: 1.8rem; margin-bottom: 6px;">14 hari</div>
          <div class="stat-subtext" style="font-size: 0.8rem;">Bertahan sejak 6 Okt</div>
        </div>

        <div class="stat-card" style="padding: 18px 20px;">
          <div class="stat-label" style="font-size: 0.82rem; margin-bottom: 6px;">Streak terpanjang</div>
          <div class="stat-value" style="font-size: 1.8rem; margin-bottom: 6px;">21 hari</div>
          <div class="stat-subtext" style="font-size: 0.8rem;">Rekor pribadi</div>
        </div>

        <div class="stat-card" style="padding: 18px 20px;">
          <div class="stat-label" style="font-size: 0.82rem; margin-bottom: 6px;">Check-in 30 hari</div>
          <div class="stat-value" style="font-size: 1.8rem; margin-bottom: 6px;">24</div>
          <div class="stat-subtext" style="font-size: 0.8rem;">dari 26 hari latihan</div>
        </div>

        <div class="stat-card" style="padding: 18px 20px;">
          <div class="stat-label" style="font-size: 0.82rem; margin-bottom: 6px;">Rata-rata kalori</div>
          <div class="stat-value" style="font-size: 1.8rem; margin-bottom: 6px;">2.210 kkal</div>
          <div class="stat-subtext" style="font-size: 0.8rem;">30 hari terakhir</div>
        </div>
      </div>

      <!-- Kartu Tabel Riwayat Utama -->
      <div class="card" style="padding: 24px; margin-bottom: 24px;">
        <!-- Filter Bar Sesuai Mockup -->
        <div style="display: flex; align-items: flex-end; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 180px;">
            <label class="form-label" for="filter-period" style="font-size: 0.82rem; color: #4b5563; margin-bottom: 6px;">Periode</label>
            <select id="filter-period" class="form-select" style="padding: 9px 12px; font-size: 0.9rem;">
              <option value="30 hari terakhir" ${this.currentPeriod === '30 hari terakhir' ? 'selected' : ''}>30 hari terakhir</option>
              <option value="7 hari terakhir" ${this.currentPeriod === '7 hari terakhir' ? 'selected' : ''}>7 hari terakhir</option>
              <option value="Bulan ini" ${this.currentPeriod === 'Bulan ini' ? 'selected' : ''}>Bulan ini</option>
            </select>
          </div>

          <div style="flex: 1; min-width: 180px;">
            <label class="form-label" for="filter-activity" style="font-size: 0.82rem; color: #4b5563; margin-bottom: 6px;">Jenis aktivitas</label>
            <select id="filter-activity" class="form-select" style="padding: 9px 12px; font-size: 0.9rem;">
              <option value="Semua" ${this.currentActivity === 'Semua' ? 'selected' : ''}>Semua</option>
              <option value="Gym" ${this.currentActivity === 'Gym' ? 'selected' : ''}>Gym</option>
              <option value="Lari" ${this.currentActivity === 'Lari' ? 'selected' : ''}>Lari</option>
              <option value="Istirahat" ${this.currentActivity === 'Istirahat' ? 'selected' : ''}>Istirahat</option>
            </select>
          </div>

          <button id="btn-apply-history-filter" class="btn btn-primary" style="padding: 9px 24px; font-weight: 600; font-size: 0.9rem;">
            Terapkan
          </button>
        </div>

        <!-- Tabel Catatan Riwayat -->
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 1.5px solid #e5e7eb; font-size: 0.78rem; font-weight: 700; color: #6b7280; letter-spacing: 0.05em;">
                <th style="padding: 10px 16px;">TANGGAL</th>
                <th style="padding: 10px 16px;">JENIS</th>
                <th style="padding: 10px 16px;">LATIHAN</th>
                <th style="padding: 10px 16px;">DURASI</th>
                <th style="padding: 10px 16px;">KKAL</th>
                <th style="padding: 10px 16px;">BERAT</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <!-- Footer Tabel & Paginasi -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
          <div style="font-size: 0.85rem; color: #6b7280;">
            Menampilkan 1-${filteredRecords.length} dari 30 catatan
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" style="padding: 7px 16px; font-weight: 600;" onclick="alert('Ini adalah halaman pertama riwayat.')">Sebelumnya</button>
            <button class="btn btn-sm" style="background: #111827; color: #ffffff; padding: 7px 16px; font-weight: 600;" onclick="alert('Memuat halaman berikutnya...')">Berikutnya</button>
          </div>
        </div>
      </div>

      <!-- Kartu Bawah Gelap: Tren Berat Badan 30 Hari Sesuai Mockup 8 -->
      <div style="background-color: #12231b; border-radius: var(--radius-lg); padding: 32px 36px; color: #ffffff; box-shadow: var(--shadow-sm);">
        <h3 style="font-size: 1.3rem; font-weight: 700; color: #ffffff; margin-bottom: 6px;">Tren berat badan 30 hari</h3>
        <p style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 24px;">Dari 70,2 kg menjadi 69,0 kg, turun sekitar 0,3 kg per minggu.</p>
        
        <!-- Grafik Garis Oranye (SVG) -->
        <div style="width: 100%; height: 160px;">
          <svg viewBox="0 0 800 140" width="100%" height="100%" preserveAspectRatio="none">
            <!-- Garis kurva oranye menurun lembut persis sesuai gambar 8 -->
            <path d="M 20 40 Q 250 55 450 70 T 780 115" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    `;

    // Pasang listener filter tombol terapkan
    const btnApply = document.getElementById('btn-apply-history-filter');
    if (btnApply) {
      btnApply.addEventListener('click', () => {
        this.currentPeriod = document.getElementById('filter-period').value;
        this.currentActivity = document.getElementById('filter-activity').value;
        this.render(container);
      });
    }
  }
};
