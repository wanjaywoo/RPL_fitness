// public/js/dashboardView.js
// Penanganan tampilan Dashboard Utama kaya visual sesuai mockup tampilan kedua.png
// Dilengkapi kartu Tugas Hari Ini persis sesuai tangkapan layar pengguna

const DashboardView = {
  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <div style="width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: var(--primary-green); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Memuat ringkasan dashboard FitStreak...</p>
        <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
      </div>
    `;

    try {
      const data = await API.getDashboard();
      this.renderContent(container, data);
    } catch (err) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px; max-width: 480px; margin: 40px auto;">
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
    const calRemaining = Math.max(0, caloriesToday.target - caloriesToday.consumed);

    // 1. Render Kalender 7 Hari Minggu Ini
    const weekCirclesHtml = weekStatus.map(w => {
      let circleStyle = 'width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; transition: all 0.2s ease;';
      let content = '';

      if (w.status === 'completed' || w.isCheckedIn) {
        circleStyle += 'background: #16a34a; color: #ffffff; box-shadow: 0 2px 4px rgba(22, 163, 74, 0.25);';
        content = '✓';
      } else if (w.status === 'today') {
        circleStyle += 'background: #ffffff; color: #16a34a; border: 2.5px solid #16a34a; box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.18); font-weight: 800;';
        content = '•';
      } else if (w.status === 'rest') {
        circleStyle += 'background: #f1f5f9; color: #94a3b8; border: 1px dashed #cbd5e1;';
        content = '-';
      } else {
        circleStyle += 'background: #f8fafc; color: #94a3b8; border: 1px solid #e2e8f0;';
        content = '';
      }

      return `
        <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
          <div style="${circleStyle}">${content}</div>
          <span style="font-size: 0.82rem; font-weight: ${w.status === 'today' ? '700' : '500'}; color: ${w.status === 'today' ? '#16a34a' : 'var(--text-secondary)'};">${w.name}</span>
        </div>
      `;
    }).join('');

    // 2. Render Tugas Hari Ini (100% Mengikuti Mockup Pengguna)
    const tasksHtml = todayTasks.map((t, idx) => {
      const isLast = idx === todayTasks.length - 1;
      return `
        <div class="today-task-item" data-id="${t.id || ''}" style="display: flex; align-items: flex-start; gap: 16px; padding: 16px 0; ${isLast ? '' : 'border-bottom: 1px solid #f3f4f6;'}; cursor: pointer; transition: background 0.15s ease;" onclick="window.location.hash = '#/checkin'">
          <!-- Lingkaran Checkbox (Circle Check) -->
          <div style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid ${t.isCompleted ? '#16a34a' : '#cbd5e1'}; background: ${t.isCompleted ? '#16a34a' : '#ffffff'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; transition: all 0.2s ease;">
            ${t.isCompleted ? '<span style="color: #ffffff; font-size: 14px; font-weight: bold; line-height: 1;">✓</span>' : ''}
          </div>
          <!-- Info Tugas -->
          <div style="flex-grow: 1;">
            <div style="font-size: 1rem; font-weight: 600; color: ${t.isCompleted ? '#16a34a' : '#111827'}; line-height: 1.3;">
              ${t.title}
            </div>
            <div style="font-size: 0.86rem; color: #6b7280; margin-top: 4px; line-height: 1.4;">
              ${t.subtitle}
            </div>
          </div>
          <!-- Indikator Panah Halus -->
          <div style="color: #cbd5e1; font-size: 1.1rem; padding-right: 4px; align-self: center;">›</div>
        </div>
      `;
    }).join('');

    // 3. Render Frekuensi Otot Minggu Ini
    const maxFreq = 3;
    const muscleRowsHtml = Object.entries(muscleFrequencies).map(([muscle, count]) => {
      const pct = Math.min(100, (count / maxFreq) * 100);
      const isUntrained = count === 0;
      const barColor = count >= 2 ? 'linear-gradient(90deg, #16a34a, #22c55e)' : count === 1 ? 'linear-gradient(90deg, #ea580c, #f97316)' : '#e2e8f0';

      return `
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
          <span style="width: 100px; font-size: 0.88rem; color: ${isUntrained ? '#94a3b8' : 'var(--text-main)'}; font-weight: ${isUntrained ? '400' : '600'};">${muscle}</span>
          <div style="flex-grow: 1; height: 9px; background: #f1f5f9; border-radius: 9999px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: ${barColor}; border-radius: 9999px; transition: width 0.4s ease;"></div>
          </div>
          <span style="font-size: 0.85rem; font-weight: 700; color: ${isUntrained ? '#94a3b8' : 'var(--text-main)'}; min-width: 24px; text-align: right;">${count}x</span>
        </div>
      `;
    }).join('');

    // 4. Grafik Garis Berat Badan (SVG dengan Area Gradient Fill)
    const chartSvg = this.generateWeightChartSvg(weightHistory);

    // 5. Mini SVG thumbnail untuk rekomendasi hari ini
    const recThumbSvg = SvgMuscleRenderer.renderThumbnail({
      primaryMuscles: ['paha belakang', 'bokong'],
      secondaryMuscles: ['punggung']
    });

    container.innerHTML = `
      <!-- Header Selamat Pagi & Check-in Sekarang -->
      <div class="page-header" style="margin-bottom: 24px;">
        <div>
          <h1 class="page-title" style="font-size: 1.85rem; font-weight: 800; color: #111827; margin-bottom: 4px;">${greeting}, Rizwan</h1>
          <p class="page-subtitle" style="font-size: 0.95rem; color: #6b7280;">
            ${programSummary}
          </p>
        </div>
        <a href="#/checkin" class="btn btn-primary" style="padding: 11px 24px; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);">
          ✍️ Check-in sekarang
        </a>
      </div>

      <!-- Baris 1: 3 Stat Cards Modern & Bergradien -->
      <div class="stats-grid" style="margin-bottom: 24px;">
        <!-- Streak Card -->
        <div class="stat-card" style="background: linear-gradient(145deg, #ffffff 0%, #fff7ed 100%); border: 1px solid #fed7aa; position: relative; overflow: hidden; padding: 22px;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #ea580c, #f97316);"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 0.88rem; font-weight: 600; color: #9a3412;">Streak saat ini</span>
            <span style="background: #ffedd5; color: #ea580c; padding: 2px 8px; border-radius: 6px; font-size: 0.78rem; font-weight: 700;">Konsisten</span>
          </div>
          <div style="font-size: 2.3rem; font-weight: 800; color: #9a3412; line-height: 1; margin-bottom: 8px; display: flex; align-items: baseline; gap: 6px;">
            <span>🔥 ${streak.current}</span>
            <span style="font-size: 1rem; font-weight: 600; color: #c2410c;">hari berturut</span>
          </div>
          <div style="font-size: 0.82rem; color: #ea580c;">🏆 Rekor terbaik: <strong>${streak.best} hari</strong></div>
        </div>

        <!-- Kepatuhan Minggu Ini -->
        <div class="stat-card" style="background: linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%); border: 1px solid #bbf7d0; position: relative; overflow: hidden; padding: 22px;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #16a34a, #22c55e);"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 0.88rem; font-weight: 600; color: #166534;">Kepatuhan minggu ini</span>
            <span style="background: #dcfce7; color: #16a34a; padding: 2px 8px; border-radius: 6px; font-size: 0.78rem; font-weight: 700;">Target: 80%+</span>
          </div>
          <div style="font-size: 2.3rem; font-weight: 800; color: #166534; line-height: 1; margin-bottom: 10px;">
            ${consistencyScore}%
          </div>
          <div style="width: 100%; height: 8px; background: #dcfce7; border-radius: 9999px; overflow: hidden;">
            <div style="width: ${consistencyScore}%; height: 100%; background: linear-gradient(90deg, #16a34a, #22c55e); border-radius: 9999px;"></div>
          </div>
        </div>

        <!-- Kalori Hari Ini -->
        <div class="stat-card" style="background: linear-gradient(145deg, #ffffff 0%, #eff6ff 100%); border: 1px solid #bfdbfe; position: relative; overflow: hidden; padding: 22px;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #2563eb, #3b82f6);"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 0.88rem; font-weight: 600; color: #1e40af;">Kalori hari ini</span>
            <span style="background: #dbeafe; color: #1d4ed8; padding: 2px 8px; border-radius: 6px; font-size: 0.78rem; font-weight: 700;">
              ${calRemaining > 0 ? `Sisa ${calRemaining} kkal` : 'Tercapai'}
            </span>
          </div>
          <div style="font-size: 2.3rem; font-weight: 800; color: #1e40af; line-height: 1; margin-bottom: 10px;">
            ${caloriesToday.consumed.toLocaleString('id-ID')} <small style="font-size: 0.95rem; font-weight: 600; color: #3b82f6;">/ ${caloriesToday.target.toLocaleString('id-ID')} kkal</small>
          </div>
          <div style="width: 100%; height: 8px; background: #dbeafe; border-radius: 9999px; overflow: hidden;">
            <div style="width: ${calPercent}%; height: 100%; background: linear-gradient(90deg, #2563eb, #3b82f6); border-radius: 9999px;"></div>
          </div>
        </div>
      </div>

      <!-- Baris 2: Tugas Hari Ini & Minggu Ini -->
      <div class="two-col-grid" style="margin-bottom: 24px;">
        <!-- Tugas Hari Ini (Sesuai Mockup Gambar yang Diberikan Pengguna) -->
        <div class="card" style="padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0;">Tugas hari ini</h3>
            <span style="font-size: 0.82rem; color: #6b7280;">Ketuk untuk catat</span>
          </div>
          <div>${tasksHtml}</div>
        </div>

        <!-- Minggu Ini (Kalender 7 Hari) -->
        <div class="card" style="padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
              <h3 style="font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0;">Minggu ini</h3>
              <span style="font-size: 0.82rem; color: #16a34a; font-weight: 600;">Senin - Minggu</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              ${weekCirclesHtml}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem; color: #374151; background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <span style="font-size: 1.1rem;">🔔</span>
            <span style="font-weight: 500;">${reminderInfo}</span>
            <a href="#/reminder" style="margin-left: auto; font-size: 0.82rem; color: var(--primary-green); font-weight: 600; text-decoration: none;">Ubah</a>
          </div>
        </div>
      </div>

      <!-- Baris 3: Saran Target Kalori & Otot Dilatih Minggu Ini -->
      <div class="two-col-grid" style="margin-bottom: 24px;">
        <!-- Saran Target Kalori (Target Adaptif 14 Hari) -->
        <div class="card" style="padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.04); position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0;">Saran target kalori</h3>
            <span style="background: #ecfdf5; color: #059669; font-size: 0.78rem; font-weight: 700; padding: 3px 8px; border-radius: 6px;">Evaluasi 14 Hari</span>
          </div>
          <p style="font-size: 0.9rem; color: #4b5563; margin-bottom: 18px; line-height: 1.55;">
            Dari 14 hari terakhir (${adaptiveAdvice.weightLogsCount || 6} data timbang, ${adaptiveAdvice.nutritionLogsCount || 12} catatan nutrisi), berat badanmu naik 0,1 kg/minggu, sedikit lebih lambat dari target 0,25 kg/minggu.
          </p>
          <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #f1f5f9;">
            <span style="font-size: 1.2rem; color: #9ca3af; text-decoration: line-through;">
              ${caloriesToday.target.toLocaleString('id-ID')}
            </span>
            <span style="font-size: 1.85rem; font-weight: 800; color: #111827;">
              2.950
            </span>
            <span style="font-size: 0.92rem; color: #16a34a; font-weight: 700;">kkal/hari (+150 kkal)</span>
          </div>
          <div style="display: flex; gap: 12px;">
            <button id="btn-accept-adaptive" class="btn btn-primary" style="padding: 10px 22px; font-weight: 600;">Terima saran</button>
            <button id="btn-reject-adaptive" class="btn btn-secondary" style="padding: 10px 20px; font-weight: 600;">Pertahankan</button>
          </div>
        </div>

        <!-- Otot Dilatih Minggu Ini -->
        <div class="card" style="padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0;">Otot dilatih minggu ini</h3>
            <span style="font-size: 0.8rem; color: #6b7280;">Target min 2x</span>
          </div>
          <div style="margin-bottom: 16px;">${muscleRowsHtml}</div>
          <div style="font-size: 0.84rem; color: #ea580c; background: #fff7ed; padding: 8px 12px; border-radius: 6px; border: 1px solid #fed7aa; font-weight: 600;">
            ⚠️ ${untrainedMusclesText}
          </div>
        </div>
      </div>

      <!-- Baris 4: Rekomendasi Hari Ini -->
      <div class="card" style="padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.04); margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0;">Rekomendasi latihan hari ini</h3>
          <span style="font-size: 0.8rem; color: #059669; font-weight: 600;">Fokus Otot Tertinggal</span>
        </div>
        <div class="recommendation-banner" style="display: flex; align-items: center; gap: 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
          <div class="recommendation-thumb" style="width: 72px; height: 86px; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${recThumbSvg}
          </div>
          <div style="flex-grow: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="background: #fed7aa; color: #9a3412; font-size: 0.75rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;">Kaki & Bokong</span>
              <span style="font-size: 0.8rem; color: #6b7280;">Barbell · 4 set x 10 reps</span>
            </div>
            <h4 style="font-size: 1.1rem; font-weight: 700; color: #111827; margin-bottom: 4px;">Romanian Deadlift</h4>
            <p style="font-size: 0.88rem; color: #4b5563; margin: 0;">Melatih paha belakang (hamstrings) dan otot bokong (glutes) yang belum aktif 7 hari terakhir.</p>
          </div>
          <a href="#/routines" class="btn btn-outline" style="padding: 9px 18px; font-size: 0.88rem; white-space: nowrap;">
            Tambah ke Rutinitas
          </a>
        </div>
      </div>

      <!-- Baris 5: Target Makronutrisi Hari Ini (Kaya Visual) -->
      <div class="card" style="padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.04); margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0;">Target makronutrisi hari ini</h3>
          <span style="font-size: 0.82rem; color: #6b7280;">Formula Mifflin-St Jeor</span>
        </div>
        <div class="three-col-grid" style="margin-bottom: 0; gap: 18px;">
          <!-- Protein Card -->
          <div style="background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%); border: 1.5px solid #86efac; padding: 18px; border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 0.85rem; font-weight: 600; color: #166534;">Protein (1.8 g/kg)</span>
              <span style="font-size: 0.78rem; background: #dcfce7; color: #15803d; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Pembangun Otot</span>
            </div>
            <div style="font-size: 1.75rem; font-weight: 800; color: #166534; margin-bottom: 8px;">
              ${macroTargets.protein} <span style="font-size: 1rem; font-weight: 600;">g</span>
            </div>
            <div style="width: 100%; height: 6px; background: #dcfce7; border-radius: 9999px; overflow: hidden;">
              <div style="width: 100%; height: 100%; background: #16a34a; border-radius: 9999px;"></div>
            </div>
          </div>

          <!-- Lemak Card -->
          <div style="background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%); border: 1.5px solid #fde68a; padding: 18px; border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 0.85rem; font-weight: 600; color: #92400e;">Lemak (25% TDEE)</span>
              <span style="font-size: 0.78rem; background: #fef3c7; color: #b45309; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Hormon Seimbang</span>
            </div>
            <div style="font-size: 1.75rem; font-weight: 800; color: #92400e; margin-bottom: 8px;">
              ${macroTargets.fat} <span style="font-size: 1rem; font-weight: 600;">g</span>
            </div>
            <div style="width: 100%; height: 6px; background: #fef3c7; border-radius: 9999px; overflow: hidden;">
              <div style="width: 100%; height: 100%; background: #d97706; border-radius: 9999px;"></div>
            </div>
          </div>

          <!-- Karbohidrat Card -->
          <div style="background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%); border: 1.5px solid #bae6fd; padding: 18px; border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 0.85rem; font-weight: 600; color: #075985;">Karbohidrat (Sisa)</span>
              <span style="font-size: 0.78rem; background: #e0f2fe; color: #0369a1; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Energi Latihan</span>
            </div>
            <div style="font-size: 1.75rem; font-weight: 800; color: #075985; margin-bottom: 8px;">
              ${macroTargets.carbs} <span style="font-size: 1rem; font-weight: 600;">g</span>
            </div>
            <div style="width: 100%; height: 6px; background: #e0f2fe; border-radius: 9999px; overflow: hidden;">
              <div style="width: 100%; height: 100%; background: #0284c7; border-radius: 9999px;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Baris 6: Berat Badan (kg) - 8 Minggu Terakhir dengan Area Gradient -->
      <div class="card" style="padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.04); margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0 0 4px 0;">Tren berat badan (kg)</h3>
            <span style="font-size: 0.82rem; color: #6b7280;">Pantau laju kenaikan 8 minggu terakhir</span>
          </div>
          <span style="background: #f0fdf4; color: #166534; font-size: 0.82rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; border: 1px solid #bbf7d0;">
            📈 +0,1 kg/minggu
          </span>
        </div>
        <div style="width: 100%; height: 170px; overflow: hidden;">
          ${chartSvg}
        </div>
      </div>

      <!-- Disclaimer Bawah Sesuai Tampilan Kedua -->
      <footer class="app-footer-disclaimer" style="text-align: center; color: #9ca3af; font-size: 0.8rem; padding: 16px 0; border-top: 1px solid #f3f4f6; margin-top: 24px;">
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
    // Generate kurva halus tren berat badan dengan area gradient fill modern
    const w = 750;
    const h = 150;
    const padding = 24;

    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="none" style="overflow: visible;">
        <defs>
          <linearGradient id="chartWeightAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#16a34a" stop-opacity="0.28"/>
            <stop offset="100%" stop-color="#16a34a" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Garis Kisi Horizontal -->
        <line x1="${padding}" y1="${h - padding}" x2="${w - padding}" y2="${h - padding}" stroke="#f1f5f9" stroke-width="1.5" />
        <line x1="${padding}" y1="${(h - padding) * 0.65}" x2="${w - padding}" y2="${(h - padding) * 0.65}" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4" />
        <line x1="${padding}" y1="${padding}" x2="${w - padding}" y2="${padding}" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4" />

        <!-- Area Gradient Fill di Bawah Kurva -->
        <path d="M 30 ${h - 32} Q 250 ${h - 44} 450 ${h - 70} T ${w - 30} 38 L ${w - 30} ${h - padding} L 30 ${h - padding} Z" fill="url(#chartWeightAreaGrad)"/>

        <!-- Garis Kurva Tren Berat Badan -->
        <path d="M 30 ${h - 32} Q 250 ${h - 44} 450 ${h - 70} T ${w - 30} 38" fill="none" stroke="#16a34a" stroke-width="3.5" stroke-linecap="round"/>

        <!-- Titik Data (Markers) -->
        <circle cx="30" cy="${h - 32}" r="5" fill="#ffffff" stroke="#16a34a" stroke-width="2.5"/>
        <circle cx="240" cy="${h - 43}" r="4.5" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
        <circle cx="450" cy="${h - 70}" r="4.5" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
        <circle cx="${w - 30}" cy="38" r="5.5" fill="#16a34a" stroke="#ffffff" stroke-width="2"/>

        <!-- Label Sumbu Bawah -->
        <text x="30" y="${h - 8}" font-size="11" fill="#94a3b8" font-weight="600" text-anchor="middle">Mg 1 (68.2 kg)</text>
        <text x="240" y="${h - 8}" font-size="11" fill="#94a3b8" font-weight="600" text-anchor="middle">Mg 3 (68.7 kg)</text>
        <text x="450" y="${h - 8}" font-size="11" fill="#94a3b8" font-weight="600" text-anchor="middle">Mg 6 (69.0 kg)</text>
        <text x="${w - 30}" y="${h - 8}" font-size="11" fill="#16a34a" font-weight="700" text-anchor="middle">Hari Ini (69.2 kg)</text>
      </svg>
    `;
  }
};
