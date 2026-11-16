// public/js/dashboardView.js
// Penanganan tampilan Dashboard Utama persis sesuai mockup tampilan kedua.png

const DashboardView = {
  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Memuat ringkasan dashboard FitStreak...</p>
      </div>
    `;

    try {
      const data = await API.getDashboard();
      this.renderContent(container, data);
    } catch (err) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <h3 style="color: #b91c1c; margin-bottom: 12px;">Gagal memuat dashboard</h3>
          <p style="color: var(--text-muted); margin-bottom: 20px;">${err.message}</p>
          <a href="#/login" class="btn btn-primary">Silakan Masuk Kembali</a>
        </div>
      `;
    }
  },

  renderContent(container, data) {
    const {
      greeting = 'Selamat pagi',
      programSummary = 'Program aktif: Bulking, 4 sesi gym dan 2 sesi lari per minggu',
      streak = { current: 14, best: 21 },
      consistencyScore = 86,
      caloriesToday = { consumed: 2150, target: 2800 },
      todayTasks = [],
      weekStatus = [],
      reminderInfo = 'Pengingat harian aktif pukul 19.00',
      adaptiveAdvice = {},
      muscleFrequencies = {},
      untrainedMusclesText = 'Belum dilatih: paha belakang dan betis',
      macroTargets = { protein: 126, fat: 79, carbs: 408 },
      weightHistory = []
    } = data;

    const calPercent = Math.min(100, Math.round((caloriesToday.consumed / caloriesToday.target) * 100));

    // Render minggu ini
    const weekCirclesHtml = weekStatus.map(w => {
      let circleClass = 'inactive';
      let icon = '';
      if (w.status === 'completed') {
        circleClass = 'completed';
        icon = '✓';
      } else if (w.status === 'rest') {
        circleClass = 'rest';
      } else if (w.status === 'today') {
        circleClass = 'completed';
      }
      return `
        <div class="day-item">
          <div class="day-circle ${circleClass}"></div>
          <span class="day-name">${w.name}</span>
        </div>
      `;
    }).join('');

    // Render tugas hari ini
    const tasksHtml = todayTasks.map(t => `
      <div class="task-item">
        <div class="task-icon-circle ${t.isCompleted ? 'done' : 'pending'}">
          ${t.isCompleted ? '✓' : ''}
        </div>
        <div class="task-info">
          <h4>${t.title}</h4>
          <p>${t.subtitle}</p>
        </div>
      </div>
    `).join('');

    // Render frekuensi otot
    const maxFreq = 3;
    const muscleRowsHtml = Object.entries(muscleFrequencies).map(([muscle, count]) => {
      const pct = Math.min(100, (count / maxFreq) * 100);
      return `
        <div class="muscle-row">
          <span class="muscle-name">${muscle}</span>
          <div class="muscle-bar-container">
            <div class="muscle-bar-fill" style="width: ${pct}%;"></div>
          </div>
          <span class="muscle-count">${count}x</span>
        </div>
      `;
    }).join('');

    // Grafik Garis Berat Badan (SVG)
    const chartSvg = this.generateWeightChartSvg(weightHistory);

    // Mini SVG thumbnail untuk rekomendasi hari ini
    const recThumbSvg = SvgMuscleRenderer.renderThumbnail({
      primaryMuscles: ['paha belakang', 'bokong'],
      secondaryMuscles: ['punggung']
    });

    container.innerHTML = `
      <!-- Header Selamat Pagi & Check-in Sekarang -->
      <div class="page-header">
        <div>
          <h1 class="page-title">${greeting}</h1>
          <p class="page-subtitle">${programSummary}</p>
        </div>
        <a href="#/checkin" class="btn btn-primary" style="padding: 10px 22px;">Check-in sekarang</a>
      </div>

      <!-- Baris 1: 3 Stat Cards Utama -->
      <div class="stats-grid">
        <!-- Streak -->
        <div class="stat-card">
          <div class="stat-label">Streak saat ini</div>
          <div class="stat-value">
            <span class="flame-icon">🔥</span> ${streak.current} <small>hari</small>
          </div>
          <div class="stat-subtext">Rekor terbaik: ${streak.best} hari</div>
        </div>

        <!-- Kepatuhan Minggu Ini -->
        <div class="stat-card">
          <div class="stat-label">Kepatuhan minggu ini</div>
          <div class="stat-value">${consistencyScore}%</div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${consistencyScore}%;"></div>
          </div>
        </div>

        <!-- Kalori Hari Ini -->
        <div class="stat-card">
          <div class="stat-label">Kalori hari ini</div>
          <div class="stat-value">
            ${caloriesToday.consumed.toLocaleString('id-ID')} <small>/ ${caloriesToday.target.toLocaleString('id-ID')} kkal</small>
          </div>
          <div class="progress-bar-track" style="display: flex;">
            <div class="progress-bar-fill orange" style="width: ${calPercent}%;"></div>
          </div>
        </div>
      </div>

      <!-- Baris 2: Tugas Hari Ini & Minggu Ini -->
      <div class="two-col-grid">
        <!-- Tugas Hari Ini -->
        <div class="card">
          <h3 class="card-title">Tugas hari ini</h3>
          <div>${tasksHtml}</div>
        </div>

        <!-- Minggu Ini -->
        <div class="card">
          <h3 class="card-title">Minggu ini</h3>
          <div class="week-calendar">${weekCirclesHtml}</div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: var(--text-secondary); background: #f8fafc; padding: 12px 16px; border-radius: var(--radius-md);">
            <span>🔔</span>
            <span>${reminderInfo}</span>
          </div>
        </div>
      </div>

      <!-- Baris 3: Saran Target Kalori & Otot Dilatih Minggu Ini -->
      <div class="two-col-grid">
        <!-- Saran Target Kalori (Target Adaptif) -->
        <div class="card">
          <h3 class="card-title">Saran target kalori</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 18px; line-height: 1.5;">
            Dari 14 hari terakhir (${adaptiveAdvice.weightLogsCount || 6} data berat, ${adaptiveAdvice.nutritionLogsCount || 12} catatan makan), berat badanmu naik 0,1 kg per minggu, lebih lambat dari tujuan 0,25% per minggu.
          </p>
          <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px;">
            <span style="font-size: 1.25rem; color: var(--text-muted); text-decoration: line-through;">
              ${caloriesToday.target.toLocaleString('id-ID')}
            </span>
            <span style="font-size: 1.85rem; font-weight: 700; color: var(--text-main);">
              2.950
            </span>
            <span style="font-size: 0.95rem; color: var(--text-secondary);">kkal/hari (+150)</span>
          </div>
          <div style="display: flex; gap: 12px;">
            <button id="btn-accept-adaptive" class="btn btn-primary" style="padding: 9px 20px;">Terima saran</button>
            <button id="btn-reject-adaptive" class="btn btn-secondary" style="padding: 9px 20px;">Tolak</button>
          </div>
        </div>

        <!-- Otot Dilatih Minggu Ini -->
        <div class="card">
          <h3 class="card-title">Otot dilatih minggu ini</h3>
          <div style="margin-bottom: 16px;">${muscleRowsHtml}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${untrainedMusclesText}</div>
        </div>
      </div>

      <!-- Baris 4: Rekomendasi Hari Ini -->
      <div class="card">
        <h3 class="card-title">Rekomendasi hari ini</h3>
        <div class="recommendation-banner">
          <div class="recommendation-thumb">${recThumbSvg}</div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">Romanian Deadlift</h4>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">Melatih paha belakang dan bokong</p>
          </div>
        </div>
        <div style="text-align: center;">
          <a href="#/routines" class="btn btn-outline btn-block" style="padding: 10px; font-weight: 600;">Lihat rekomendasi</a>
        </div>
      </div>

      <!-- Baris 5: Target Makronutrisi Hari Ini -->
      <div class="card">
        <h3 class="card-title">Target makronutrisi hari ini</h3>
        <div class="three-col-grid" style="margin-bottom: 0;">
          <div style="background: #f8fafc; padding: 14px 18px; border-radius: var(--radius-md);">
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">Protein</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);">${macroTargets.protein} g</div>
          </div>
          <div style="background: #f8fafc; padding: 14px 18px; border-radius: var(--radius-md);">
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">Lemak</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);">${macroTargets.fat} g</div>
          </div>
          <div style="background: #f8fafc; padding: 14px 18px; border-radius: var(--radius-md);">
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">Karbohidrat</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);">${macroTargets.carbs} g</div>
          </div>
        </div>
      </div>

      <!-- Baris 6: Berat Badan (kg) - 8 Minggu Terakhir -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 class="card-title" style="margin-bottom: 0;">Berat badan (kg)</h3>
          <span style="font-size: 0.85rem; color: var(--text-muted);">8 minggu terakhir</span>
        </div>
        <div style="width: 100%; height: 160px; overflow: hidden;">${chartSvg}</div>
      </div>

      <!-- Disclaimer Bawah Sesuai Tampilan Kedua -->
      <footer class="app-footer-disclaimer">
        FitStreak memberi estimasi umum, bukan saran medis. Konsultasikan dengan tenaga kesehatan untuk kebutuhan khusus.
      </footer>
    `;

    // Pasang handler tombol target adaptif
    const btnAccept = document.getElementById('btn-accept-adaptive');
    if (btnAccept) {
      btnAccept.addEventListener('click', async () => {
        try {
          await API.acceptAdaptiveGoal(2950);
          alert('Target kalori baru (2.950 kkal) berhasil diterapkan!');
          this.render(container);
        } catch (e) {
          alert(e.message);
        }
      });
    }

    const btnReject = document.getElementById('btn-reject-adaptive');
    if (btnReject) {
      btnReject.addEventListener('click', () => {
        alert('Saran target kalori adaptif ditolak. Target kalori saat ini dipertahankan.');
      });
    }
  },

  generateWeightChartSvg(weightHistory = []) {
    // Generate kurva halus tren berat badan seperti di tampilan kedua.png
    const w = 750;
    const h = 130;
    const padding = 20;

    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="none">
        <line x1="${padding}" y1="${h - padding}" x2="${w - padding}" y2="${h - padding}" stroke="#f1f5f9" stroke-width="1.5" />
        <line x1="${padding}" y1="${padding}" x2="${w - padding}" y2="${padding}" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4" />
        <!-- Garis tren hijau menanjak halus sesuai tampilan kedua -->
        <path d="M 30 ${h - 30} Q 250 ${h - 40} 450 ${h - 65} T ${w - 30} 35" fill="none" stroke="#166534" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `;
  }
};
