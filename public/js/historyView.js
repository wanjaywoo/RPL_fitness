// public/js/historyView.js
// Penanganan tampilan Riwayat Aktivitas & Progres (Latihan, Nutrisi, Berat Badan)

const HistoryView = {
  activeTab: 'workouts',

  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Memuat riwayat aktivitas...</p>
      </div>
    `;

    try {
      const data = await API.getHistory();
      this.renderContent(container, data);
    } catch (err) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <p style="color: red; margin-bottom: 16px;">Gagal memuat riwayat: ${err.message}</p>
          <a href="#/dashboard" class="btn btn-primary">Kembali ke Dashboard</a>
        </div>
      `;
    }
  },

  renderContent(container, data = {}) {
    const workouts = data.workouts || [];
    const nutrition = data.nutrition || [];
    const weights = data.weights || [];

    // Tabel Riwayat Latihan & Check-in
    const workoutsRows = workouts.length > 0 ? workouts.map(w => `
      <tr style="border-bottom: 1px solid var(--border-color);">
        <td style="padding: 14px 16px; font-weight: 600; color: var(--text-main);">${w.logged_date}</td>
        <td style="padding: 14px 16px;">
          <span class="badge badge-secondary" style="font-size: 0.85rem;">${w.activity_type}</span>
        </td>
        <td style="padding: 14px 16px; font-weight: 500;">${w.duration_minutes} menit</td>
        <td style="padding: 14px 16px; font-size: 0.88rem; color: var(--text-secondary); max-width: 320px;">
          ${w.exercises_summary || (w.notes || 'Sesi latihan rutin')}
        </td>
        <td style="padding: 14px 16px;">
          <span class="badge badge-primary">Sah (Streak +1)</span>
        </td>
      </tr>
    `).join('') : `
      <tr>
        <td colspan="5" style="padding: 30px; text-align: center; color: var(--text-muted);">
          Belum ada catatan latihan. Mulai dengan melakukan <a href="#/checkin">Check-in harian</a>!
        </td>
      </tr>
    `;

    // Tabel Riwayat Nutrisi
    const nutritionRows = nutrition.length > 0 ? nutrition.map(n => `
      <tr style="border-bottom: 1px solid var(--border-color);">
        <td style="padding: 14px 16px; font-weight: 600; color: var(--text-main);">${n.logged_date}</td>
        <td style="padding: 14px 16px; font-weight: 700; color: var(--accent-orange);">${n.calories.toLocaleString('id-ID')} kkal</td>
        <td style="padding: 14px 16px;">${n.protein_grams || 0} g</td>
        <td style="padding: 14px 16px;">${n.carb_grams || 0} g</td>
        <td style="padding: 14px 16px;">${n.fat_grams || 0} g</td>
        <td style="padding: 14px 16px; font-size: 0.85rem; color: var(--text-muted);">${n.notes || '-'}</td>
      </tr>
    `).join('') : `
      <tr>
        <td colspan="6" style="padding: 30px; text-align: center; color: var(--text-muted);">
          Belum ada catatan asupan nutrisi harian.
        </td>
      </tr>
    `;

    // Tabel Riwayat Berat Badan
    const weightRows = weights.length > 0 ? weights.map(w => `
      <tr style="border-bottom: 1px solid var(--border-color);">
        <td style="padding: 14px 16px; font-weight: 600; color: var(--text-main);">${w.logged_date}</td>
        <td style="padding: 14px 16px; font-size: 1.1rem; font-weight: 700; color: var(--primary-green);">${w.weight_kg} kg</td>
        <td style="padding: 14px 16px; font-size: 0.85rem; color: var(--text-muted);">${w.created_at || '-'}</td>
      </tr>
    `).join('') : `
      <tr>
        <td colspan="3" style="padding: 30px; text-align: center; color: var(--text-muted);">
          Belum ada catatan berat badan.
        </td>
      </tr>
    `;

    container.innerHTML = `
      <div class="page-header" style="align-items: center;">
        <div>
          <h1 class="page-title">Riwayat Aktivitas</h1>
          <p class="page-subtitle">Pantau riwayat check-in latihan, asupan nutrisi harian, dan tren berat badanmu.</p>
        </div>
        <a href="#/dashboard" class="btn btn-outline" style="padding: 10px 18px;">
          ← Dashboard
        </a>
      </div>

      <!-- Tab Navigasi Riwayat -->
      <div class="filter-pills" style="margin-bottom: 20px;">
        <button class="pill-btn ${this.activeTab === 'workouts' ? 'active' : ''}" data-tab="workouts">
          🏋️‍♂️ Sesi Latihan & Check-in (${workouts.length})
        </button>
        <button class="pill-btn ${this.activeTab === 'nutrition' ? 'active' : ''}" data-tab="nutrition">
          🥗 Catatan Nutrisi (${nutrition.length})
        </button>
        <button class="pill-btn ${this.activeTab === 'weights' ? 'active' : ''}" data-tab="weights">
          ⚖️ Timbangan Berat Badan (${weights.length})
        </button>
      </div>

      <!-- Tab Konten: Latihan -->
      <div id="tab-workouts" class="card" style="padding: 0; overflow-x: auto; display: ${this.activeTab === 'workouts' ? 'block' : 'none'};">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.92rem;">
          <thead style="background-color: #f8fafc; border-bottom: 1px solid var(--border-color);">
            <tr>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">TANGGAL</th>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">AKTIVITAS</th>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">DURASI</th>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">RINCIAN GERAKAN / CATATAN</th>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${workoutsRows}
          </tbody>
        </table>
      </div>

      <!-- Tab Konten: Nutrisi -->
      <div id="tab-nutrition" class="card" style="padding: 0; overflow-x: auto; display: ${this.activeTab === 'nutrition' ? 'block' : 'none'};">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.92rem;">
          <thead style="background-color: #f8fafc; border-bottom: 1px solid var(--border-color);">
            <tr>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">TANGGAL</th>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">TOTAL KALORI</th>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">PROTEIN</th>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">KARBOHIDRAT</th>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">LEMAK</th>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">CATATAN</th>
            </tr>
          </thead>
          <tbody>
            ${nutritionRows}
          </tbody>
        </table>
      </div>

      <!-- Tab Konten: Berat Badan -->
      <div id="tab-weights" class="card" style="padding: 0; overflow-x: auto; display: ${this.activeTab === 'weights' ? 'block' : 'none'};">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.92rem;">
          <thead style="background-color: #f8fafc; border-bottom: 1px solid var(--border-color);">
            <tr>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">TANGGAL</th>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">BERAT BADAN</th>
              <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem;">WAKTU DICATAT</th>
            </tr>
          </thead>
          <tbody>
            ${weightRows}
          </tbody>
        </table>
      </div>
    `;

    // Event listener switch tab
    container.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.getAttribute('data-tab');
        this.renderContent(container, data);
      });
    });
  }
};
