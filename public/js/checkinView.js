// public/js/checkinView.js
// Penanganan tampilan Check-in Harian persis sesuai mockup tampilan ketiga.png

const CheckinView = {
  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Menyiapkan formulir check-in...</p>
      </div>
    `;

    try {
      const todayStatus = await API.getCheckinTodayStatus().catch(() => ({}));
      const routines = await API.getRoutines().catch(() => []);
      this.renderContent(container, todayStatus, routines);
    } catch (err) {
      container.innerHTML = `<div class="card"><p style="color:red;">${err.message}</p></div>`;
    }
  },

  renderContent(container, todayStatus = {}, routines = []) {
    const currentStreak = todayStatus.currentStreak !== undefined ? todayStatus.currentStreak : 14;
    const nextStreak = currentStreak + 1;

    // Rutinitas Push Day bawaan
    const defaultPushExercises = [
      { name: 'Bench Press', setsReps: '4 x 8-10', muscle: 'Dada' },
      { name: 'Overhead Press', setsReps: '4 x 6-8', muscle: 'Bahu' },
      { name: 'Incline Dumbbell Press', setsReps: '3 x 10-12', muscle: 'Dada' },
      { name: 'Lateral Raise', setsReps: '3 x 12-15', muscle: 'Bahu' },
      { name: 'Triceps Pushdown', setsReps: '3 x 10-12', muscle: 'Trisep' }
    ];

    const exercisesHtml = defaultPushExercises.map((ex, idx) => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
        <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; flex-grow: 1;">
          <input type="checkbox" name="checkin-exercise" value="${ex.name}" checked style="width: 18px; height: 18px; accent-color: var(--primary-green);" />
          <span style="font-weight: 600; font-size: 0.95rem; color: var(--text-main);">${ex.name}</span>
        </label>
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">${ex.setsReps}</span>
          <span class="badge badge-primary">${ex.muscle}</span>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <!-- Header Kembali ke Dashboard Sesuai Tampilan Ketiga -->
      <div class="page-header" style="align-items: center;">
        <div>
          <h1 class="page-title">Check-in harian</h1>
          <p class="page-subtitle">Catat latihan dan asupan hari ini untuk menjaga streak.</p>
        </div>
        <a href="#/dashboard" style="color: var(--text-secondary); font-size: 0.92rem; font-weight: 500;">
          Kembali ke dashboard
        </a>
      </div>

      <!-- Layout 2-Kolom Sesuai Mockup 3 -->
      <div class="two-col-grid" style="grid-template-columns: 1.4fr 0.9fr; align-items: start;">
        <!-- Kolom Kiri: Formulir Latihan, Rutinitas, dan Nutrisi -->
        <div class="card">
          <form id="checkin-form">
            <!-- Seksi Latihan -->
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 16px;">Latihan</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="ci-date">Tanggal</label>
                <input type="text" id="ci-date" class="form-input" value="19 Oktober 2026" />
              </div>
              <div class="form-group">
                <label class="form-label" for="ci-activity">Jenis aktivitas</label>
                <select id="ci-activity" class="form-select">
                  <option value="Gym" selected>Gym</option>
                  <option value="Lari">Lari</option>
                  <option value="Bersepeda">Bersepeda</option>
                  <option value="Renang">Renang</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="ci-duration">Durasi (menit)</label>
                <input type="number" id="ci-duration" class="form-input" value="65" required min="10" max="300" />
              </div>
              <div class="form-group">
                <label class="form-label" for="ci-distance">Jarak lari (km, opsional)</label>
                <input type="number" step="0.1" id="ci-distance" class="form-input" value="0" />
              </div>
            </div>

            <!-- Seksi Gerakan yang Dilakukan -->
            <div style="margin: 24px 0 20px 0;">
              <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">Gerakan yang dilakukan</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">Dari rutinitas Push Day. Centang yang selesai.</p>
              
              <div id="checkin-exercise-list">${exercisesHtml}</div>

              <div style="margin-top: 14px;">
                <a href="#/catalog" style="color: var(--primary-green); font-size: 0.88rem; font-weight: 600;">+ Tambah gerakan lain</a>
              </div>
            </div>

            <!-- Seksi Nutrisi -->
            <div style="margin-top: 28px;">
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 16px;">Nutrisi</h3>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="ci-calories">Kalori (kkal)</label>
                  <input type="number" id="ci-calories" class="form-input" value="2150" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="ci-protein">Protein (g)</label>
                  <input type="number" id="ci-protein" class="form-input" value="140" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="ci-carbs">Karbohidrat (g)</label>
                  <input type="number" id="ci-carbs" class="form-input" value="260" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="ci-fat">Lemak (g)</label>
                  <input type="number" id="ci-fat" class="form-input" value="60" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="ci-weight">Berat badan (kg)</label>
                  <input type="number" step="0.1" id="ci-weight" class="form-input" value="69" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="ci-notes">Catatan</label>
                  <input type="text" id="ci-notes" class="form-input" placeholder="Contoh: PR bench press" value="PR bench press" />
                </div>
              </div>
            </div>

            <div id="checkin-error" style="color: #b91c1c; font-size: 0.88rem; margin: 12px 0; display: none;"></div>

            <!-- Tombol Aksi Bawah Sesuai Tampilan Ketiga -->
            <div style="display: flex; gap: 14px; margin-top: 24px;">
              <button type="submit" class="btn btn-primary" style="padding: 11px 24px;">
                Simpan check-in
              </button>
              <a href="#/dashboard" class="btn btn-outline" style="padding: 11px 24px;">
                Batal
              </a>
            </div>
          </form>
        </div>

        <!-- Kolom Kanan: Kartu Gelap Ringkasan Hari Ini & Dampak Streak -->
        <div class="dark-summary-card">
          <h3>Ringkasan hari ini</h3>
          
          <div style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 8px;">Kalori vs target</div>
          <div style="font-size: 1.85rem; font-weight: 700; margin-bottom: 12px;">
            2.150 / 2.800 <small style="font-size: 1rem; font-weight: 400; color: #94a3b8;">kkal</small>
          </div>

          <div class="progress-bar-track" style="background: rgba(255, 255, 255, 0.15); height: 8px;">
            <div class="progress-bar-fill orange" style="width: 77%;"></div>
          </div>

          <div class="stat-box">
            <div style="font-size: 1.15rem; font-weight: 700; display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="flame-icon">🔥</span> Streak jadi ${nextStreak} hari
            </div>
            <div style="font-size: 0.82rem; color: #94a3b8;">
              jika check-in disimpan hari ini
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('checkin-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const errBox = document.getElementById('checkin-error');
      errBox.style.display = 'none';

      try {
        const payload = {
          date: new Date().toISOString().split('T')[0],
          activityType: document.getElementById('ci-activity').value,
          durationMinutes: Number(document.getElementById('ci-duration').value),
          distanceKm: Number(document.getElementById('ci-distance').value) || 0,
          calories: Number(document.getElementById('ci-calories').value),
          protein: Number(document.getElementById('ci-protein').value),
          carbs: Number(document.getElementById('ci-carbs').value),
          fat: Number(document.getElementById('ci-fat').value),
          weight: Number(document.getElementById('ci-weight').value),
          notes: document.getElementById('ci-notes').value
        };

        const res = await API.saveCheckin(payload);
        alert(`Check-in berhasil disimpan! Streak aktifmu sekarang: ${res.currentStreak} hari.`);
        window.location.hash = '#/dashboard';
      } catch (err) {
        errBox.textContent = err.message;
        errBox.style.display = 'block';
      }
    });
  }
};
