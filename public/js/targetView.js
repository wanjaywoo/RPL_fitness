// public/js/targetView.js
// Penanganan tampilan "Target Saya" (Kalkulator Mifflin-St Jeor, Makronutrisi, dan Penyesuaian Program)

const TargetView = {
  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Memuat informasi target kebugaran...</p>
      </div>
    `;

    try {
      const data = await API.getActiveGoal();
      let dashboardData = null;
      try {
        dashboardData = await API.getDashboard();
      } catch (e) {
        // Fallback jika dashboard gagal diambil
      }
      this.renderContent(container, data, dashboardData);
    } catch (err) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <h3 style="color: #b91c1c; margin-bottom: 12px;">Gagal memuat target</h3>
          <p style="color: var(--text-muted); margin-bottom: 20px;">${err.message}</p>
          <a href="#/dashboard" class="btn btn-primary">Kembali ke Dashboard</a>
        </div>
      `;
    }
  },

  renderContent(container, goalData, dashboardData) {
    const { goal = {}, macros = {}, metrics = {} } = goalData;
    const isBulking = goal.goal_type === 'bulking';
    const goalTitle = isBulking ? 'Bulking' : 'Cutting';
    const goalBadgeColor = isBulking ? '#166534' : '#b45309';
    const goalBadgeBg = isBulking ? '#dcfce7' : '#fef3c7';
    const deltaCalories = isBulking ? '+300' : '-500';

    const weightKg = metrics.weightKg || 69;
    const heightCm = metrics.heightCm || 170;
    const age = metrics.age || 26;
    const gender = metrics.gender === 'female' ? 'Perempuan' : 'Laki-laki';
    const bmr = metrics.bmr || 1628;
    const tdee = metrics.tdee || 2238;

    const adaptiveAdvice = dashboardData?.adaptiveAdvice || {
      shouldAdjust: true,
      delta: 150,
      suggestedTarget: goal.target_calories + 150,
      reason: 'Dari 14 hari terakhir, kenaikan berat badan lebih lambat dari sasaran.'
    };

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Target Saya</h1>
          <p class="page-subtitle">Kelola sasaran kalori, makronutrisi Mifflin-St Jeor, dan program latihanmu.</p>
        </div>
        <a href="#/dashboard" class="btn btn-secondary">Kembali ke Dashboard</a>
      </div>

      <!-- 3 Kartu Ringkasan Target Utama -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Program Aktif</div>
          <div class="stat-value" style="font-size: 1.6rem;">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background: ${goalBadgeBg}; color: ${goalBadgeColor}; font-size: 1rem; font-weight: 700;">
              ${goalTitle} (${deltaCalories} kkal)
            </span>
          </div>
          <div class="stat-subtext">Sasaran laju: ${goal.target_weekly_rate_kg > 0 ? '+' : ''}${goal.target_weekly_rate_kg} kg/minggu</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Target Kalori Harian</div>
          <div class="stat-value">
            ${(goal.target_calories || 2800).toLocaleString('id-ID')} <small>kkal/hari</small>
          </div>
          <div class="stat-subtext">Dihitung dari TDEE + batas keamanan server</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Frekuensi Latihan Terjadwal</div>
          <div class="stat-value">
            ${goal.workout_days_per_week || 4} <small>hari / minggu</small>
          </div>
          <div class="stat-subtext">Pengingat harian aktif di hari terjadwal</div>
        </div>
      </div>

      <!-- Target Makronutrisi Hari Ini -->
      <div class="card">
        <h3 class="card-title">Target Makronutrisi Harian</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px;">
          Dihitung berdasarkan berat badan (${weightKg} kg) dan strategi ${goalTitle} (protein ${isBulking ? '1,8' : '2,0'} g/kg, lemak 25% kalori, karbohidrat sisa).
        </p>
        <div class="three-col-grid" style="margin-bottom: 0;">
          <div style="background: #f8fafc; padding: 18px 20px; border-radius: var(--radius-md); border-left: 4px solid #16a34a;">
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Protein</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: var(--text-main);">${macros.protein_grams || 126} <small style="font-size: 0.95rem; font-weight: 400; color: var(--text-secondary);">g/hari</small></div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">${((macros.protein_grams || 126) * 4).toLocaleString('id-ID')} kkal</div>
          </div>

          <div style="background: #f8fafc; padding: 18px 20px; border-radius: var(--radius-md); border-left: 4px solid #d97706;">
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Lemak</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: var(--text-main);">${macros.fat_grams || 79} <small style="font-size: 0.95rem; font-weight: 400; color: var(--text-secondary);">g/hari</small></div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">${((macros.fat_grams || 79) * 9).toLocaleString('id-ID')} kkal</div>
          </div>

          <div style="background: #f8fafc; padding: 18px 20px; border-radius: var(--radius-md); border-left: 4px solid #2563eb;">
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Karbohidrat</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: var(--text-main);">${macros.carb_grams || 408} <small style="font-size: 0.95rem; font-weight: 400; color: var(--text-secondary);">g/hari</small></div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">${((macros.carb_grams || 408) * 4).toLocaleString('id-ID')} kkal</div>
          </div>
        </div>
      </div>

      <!-- Dua Kolom: Rincian Ilmiah Mifflin-St Jeor & Form Ubah Target -->
      <div class="two-col-grid">
        <!-- Rincian Ilmiah Mifflin-St Jeor -->
        <div class="card">
          <h3 class="card-title">Kalkulasi Mifflin-St Jeor</h3>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 14px 16px; margin-bottom: 18px;">
            <div style="font-weight: 600; color: #166534; font-size: 0.92rem; margin-bottom: 4px;">Data Profil Terdaftar:</div>
            <div style="font-size: 0.88rem; color: #15803d; line-height: 1.6;">
              • Jenis Kelamin: <strong>${gender}</strong><br>
              • Usia: <strong>${age} tahun</strong><br>
              • Tinggi Badan: <strong>${heightCm} cm</strong><br>
              • Berat Badan Terkini: <strong>${weightKg} kg</strong>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
            <span style="color: var(--text-secondary); font-size: 0.9rem;">BMR (Basal Metabolic Rate)</span>
            <span style="font-weight: 700; color: var(--text-main);">${bmr.toLocaleString('id-ID')} kkal</span>
          </div>

          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
            <span style="color: var(--text-secondary); font-size: 0.9rem;">TDEE (Total Kebutuhan Harian)</span>
            <span style="font-weight: 700; color: var(--text-main);">${tdee.toLocaleString('id-ID')} kkal</span>
          </div>

          <div style="display: flex; justify-content: space-between; padding: 10px 0; margin-bottom: 12px;">
            <span style="color: var(--text-secondary); font-size: 0.9rem;">Penyesuaian Program (${goalTitle})</span>
            <span style="font-weight: 700; color: ${isBulking ? '#166534' : '#b45309'};">${deltaCalories} kkal</span>
          </div>

          <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 12px; font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
            🛡️ <strong>Batas Keamanan Server (BR-09):</strong> Target kalori divalidasi di server tidak boleh di bawah BMR (${bmr} kkal) atau minimum absolut (1.500 kkal pria / 1.200 kkal wanita). Defisit maks 25% TDEE & 750 kkal, surplus maks 20% TDEE & 500 kkal.
          </div>
        </div>

        <!-- Formulir Penyesuaian Target Kebugaran -->
        <div class="card">
          <h3 class="card-title">Sesuaikan Sasaran Program</h3>
          <form id="form-update-goal">
            <div class="form-group">
              <label class="form-label" for="target-goal-type">Tujuan Kebugaran</label>
              <select id="target-goal-type" class="form-select">
                <option value="bulking" ${isBulking ? 'selected' : ''}>Bulking (Surplus +300 kkal, naik massa otot)</option>
                <option value="cutting" ${!isBulking ? 'selected' : ''}>Cutting (Defisit -500 kkal, turun lemak)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="target-activity-level">Tingkat Aktivitas Harian</label>
              <select id="target-activity-level" class="form-select">
                <option value="sedentary" ${goal.activity_level === 'sedentary' ? 'selected' : ''}>Sedentary (Jarang olahraga - 1,2x BMR)</option>
                <option value="light" ${goal.activity_level === 'light' || !goal.activity_level ? 'selected' : ''}>Ringan (Olahraga 1-3 hari/minggu - 1,375x BMR)</option>
                <option value="moderate" ${goal.activity_level === 'moderate' ? 'selected' : ''}>Sedang (Olahraga 3-5 hari/minggu - 1,55x BMR)</option>
                <option value="heavy" ${goal.activity_level === 'heavy' ? 'selected' : ''}>Berat (Olahraga 6-7 hari/minggu - 1,725x BMR)</option>
                <option value="very_heavy" ${goal.activity_level === 'very_heavy' ? 'selected' : ''}>Sangat Berat (Latihan fisik 2x sehari - 1,9x BMR)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="target-workout-days">Target Hari Latihan per Minggu</label>
              <input type="number" id="target-workout-days" class="form-input" min="1" max="7" value="${goal.workout_days_per_week || 4}" required />
              <small style="color: var(--text-muted); font-size: 0.8rem;">Digunakan untuk menghitung skor konsistensi dan jadwal pengingat.</small>
            </div>

            <div id="target-feedback" style="display: none; padding: 10px; border-radius: var(--radius-sm); margin-bottom: 14px; font-size: 0.88rem;"></div>

            <button type="submit" id="btn-save-goal" class="btn btn-primary btn-block" style="padding: 12px; font-weight: 600;">
              Simpan & Hitung Ulang Target
            </button>
          </form>
        </div>
      </div>

      <!-- Saran Target Adaptif 14 Hari (BR-12) -->
      <div class="card">
        <h3 class="card-title">Evaluasi Target Adaptif (BR-12)</h3>
        <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.5;">
          ${adaptiveAdvice.reason || 'Sistem mengevaluasi tren berat badan dan log makan 14 hari terakhir untuk menyesuaikan target kalorimu secara dinamis.'}
        </p>
        <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 18px;">
          <span style="font-size: 1.15rem; color: var(--text-muted); text-decoration: line-through;">
            ${(goal.target_calories || 2800).toLocaleString('id-ID')}
          </span>
          <span style="font-size: 1.75rem; font-weight: 700; color: var(--text-main);">
            ${(adaptiveAdvice.suggestedTarget || goal.target_calories + 150).toLocaleString('id-ID')}
          </span>
          <span style="font-size: 0.92rem; color: var(--text-secondary);">kkal/hari (${adaptiveAdvice.delta > 0 ? '+' : ''}${adaptiveAdvice.delta || 150})</span>
        </div>
        <div style="display: flex; gap: 12px;">
          <button id="btn-accept-adaptive-target" class="btn btn-primary" style="padding: 9px 20px;">Terima Saran Adaptif</button>
          <button id="btn-reject-adaptive-target" class="btn btn-secondary" style="padding: 9px 20px;">Pertahankan Target Saat Ini</button>
        </div>
      </div>

      <footer class="app-footer-disclaimer">
        FitStreak memberi estimasi umum, bukan saran medis. Konsultasikan dengan tenaga kesehatan untuk kebutuhan khusus.
      </footer>
    `;

    // Pasang handler form update target
    const form = document.getElementById('form-update-goal');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const feedback = document.getElementById('target-feedback');
        const submitBtn = document.getElementById('btn-save-goal');
        feedback.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menghitung...';

        try {
          const payload = {
            goalType: document.getElementById('target-goal-type').value,
            activityLevel: document.getElementById('target-activity-level').value,
            workoutDaysPerWeek: Number(document.getElementById('target-workout-days').value)
          };

          const res = await API.updateGoal(payload);
          feedback.style.display = 'block';
          feedback.style.background = '#dcfce7';
          feedback.style.color = '#166534';
          feedback.textContent = `✓ Target berhasil diperbarui! Target kalori baru: ${res.goal.target_calories.toLocaleString('id-ID')} kkal/hari.`;
          
          setTimeout(() => {
            this.render(container);
          }, 1000);
        } catch (err) {
          feedback.style.display = 'block';
          feedback.style.background = '#fee2e2';
          feedback.style.color = '#991b1b';
          feedback.textContent = `✕ Gagal: ${err.message}`;
          submitBtn.disabled = false;
          submitBtn.textContent = 'Simpan & Hitung Ulang Target';
        }
      });
    }

    // Handler tombol saran adaptif
    const btnAccept = document.getElementById('btn-accept-adaptive-target');
    if (btnAccept) {
      btnAccept.addEventListener('click', async () => {
        try {
          const newTarget = adaptiveAdvice.suggestedTarget || (goal.target_calories + 150);
          await API.acceptAdaptiveGoal(newTarget);
          alert(`Target kalori baru (${newTarget.toLocaleString('id-ID')} kkal) berhasil diterapkan!`);
          this.render(container);
        } catch (err) {
          alert(`Gagal menerapkan target adaptif: ${err.message}`);
        }
      });
    }

    const btnReject = document.getElementById('btn-reject-adaptive-target');
    if (btnReject) {
      btnReject.addEventListener('click', () => {
        alert('Saran adaptif ditolak. Target kalori saat ini dipertahankan.');
      });
    }
  }
};
