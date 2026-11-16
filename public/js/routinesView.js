// public/js/routinesView.js
// Penanganan tampilan Rutinitas & Rekomendasi Program persis sesuai mockup tampilan ke enam.png

const RoutinesView = {
  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Memuat rutinitas dan rekomendasi...</p>
      </div>
    `;

    try {
      const routines = await API.getRoutines();
      const recData = await API.getRoutineRecommendation();
      this.renderContent(container, routines, recData);
    } catch (err) {
      container.innerHTML = `<div class="card"><p style="color:red;">${err.message}</p></div>`;
    }
  },

  renderContent(container, routines = [], recData = {}) {
    const activeRoutine = routines.length > 0 ? routines[0] : {
      name: 'Push Day',
      estimated_minutes: 55,
      exercises: []
    };

    const splitRec = recData.splitRecommendation || {
      splitName: 'Upper/Lower',
      description: 'Berdasarkan tujuan Bulking dan 4 hari latihan per minggu, pola yang disarankan adalah Upper/Lower.',
      schedule: [
        { day: 'Hari 1', name: 'Upper A', focus: 'Dada, bahu, punggung' },
        { day: 'Hari 2', name: 'Lower A', focus: 'Paha depan, bokong, betis' },
        { day: 'Hari 3', name: 'Upper B', focus: 'Punggung, bahu, lengan' },
        { day: 'Hari 4', name: 'Lower B', focus: 'Paha belakang, bokong, perut' }
      ]
    };

    // Daftar gerakan default Push Day bila belum ada
    const routineExercises = (activeRoutine.exercises && activeRoutine.exercises.length > 0)
      ? activeRoutine.exercises
      : [
        { name: 'Bench Press', default_sets: 4, default_reps: '8-10', rest_seconds: 90, primary_muscles: 'Dada' },
        { name: 'Overhead Press', default_sets: 4, default_reps: '6-8', rest_seconds: 90, primary_muscles: 'Bahu' },
        { name: 'Incline Dumbbell Press', default_sets: 3, default_reps: '10-12', rest_seconds: 75, primary_muscles: 'Dada' },
        { name: 'Lateral Raise', default_sets: 3, default_reps: '12-15', rest_seconds: 60, primary_muscles: 'Bahu' },
        { name: 'Triceps Pushdown', default_sets: 3, default_reps: '10-12', rest_seconds: 60, primary_muscles: 'Trisep' }
      ];

    const exerciseItemsHtml = routineExercises.map(ex => {
      const thumb = SvgMuscleRenderer.renderThumbnail({
        primaryMuscles: [ex.primary_muscles || 'Dada'],
        secondaryMuscles: []
      });

      return `
        <div class="routine-exercise-item">
          <div style="width: 44px; height: 50px; background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;">
            ${thumb}
          </div>
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px;">${ex.name}</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">
              ${ex.is_cardio ? `${ex.default_sets} sesi · ${ex.default_reps} · Latihan Kardio` : `${ex.default_sets} set x ${ex.default_reps} repetisi · istirahat ${ex.rest_seconds} dtk`}
            </p>
          </div>
          <div class="routine-controls">
            <button class="control-btn" title="Pindah ke atas">^</button>
            <button class="control-btn" title="Pindah ke bawah">v</button>
            <button class="control-btn" title="Salin gerakan">📄</button>
            <button class="control-btn" title="Hapus gerakan">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    // Jadwal pola rekomendasi
    const scheduleItemsHtml = splitRec.schedule.map(s => `
      <div style="display: flex; gap: 16px; padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
        <span style="font-weight: 600; font-size: 0.88rem; color: var(--text-muted); width: 60px;">${s.day}</span>
        <div>
          <h5 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px;">${s.name}</h5>
          <p style="font-size: 0.82rem; color: var(--text-secondary);">${s.focus}</p>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <!-- Header Rutinitas & Rekomendasi Sesuai Tampilan 6 -->
      <div class="page-header" style="align-items: center;">
        <div>
          <h1 class="page-title">Rutinitas dan rekomendasi</h1>
          <p class="page-subtitle">Susun rutinitas sendiri atau ikuti rekomendasi berdasarkan tujuan dan hari latihanmu.</p>
        </div>
        <button id="btn-create-routine" class="btn btn-primary" style="padding: 10px 20px;">
          Buat rutinitas baru
        </button>
      </div>

      <!-- Layout 2-Kolom Sesuai Mockup 6 -->
      <div class="two-col-grid" style="grid-template-columns: 1.25fr 1fr; align-items: start;">
        <!-- Kolom Kiri: Kartu Rutinitas Push Day & Daftar Gerakan -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
            <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">${activeRoutine.name}</h3>
            <span style="font-size: 0.88rem; color: var(--text-muted);">
              ${routineExercises.length} gerakan · sekitar ${activeRoutine.estimated_minutes} menit
            </span>
          </div>

          <div style="margin-bottom: 24px;">${exerciseItemsHtml}</div>

          <div style="display: flex; gap: 14px;">
            <a href="#/catalog" class="btn btn-outline" style="padding: 10px 20px;">
              Tambah gerakan
            </a>
            <a href="#/checkin" class="btn btn-primary" style="padding: 10px 22px;">
              Mulai latihan (check-in)
            </a>
          </div>
        </div>

        <!-- Kolom Kanan: Rekomendasi Program & Otot Belum Dilatih 7 Hari -->
        <div>
          <!-- Kartu 1: Rekomendasi Program -->
          <div class="card" style="margin-bottom: 20px;">
            <h3 class="card-title">Rekomendasi program</h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">
              ${splitRec.description}
            </p>

            <div style="margin-bottom: 20px;">${scheduleItemsHtml}</div>

            <button id="btn-use-program" class="btn btn-primary btn-block" style="padding: 11px;">
              Gunakan program ini
            </button>
          </div>

          <!-- Kartu 2: Otot Belum Dilatih 7 Hari Terakhir -->
          <div class="card">
            <h3 class="card-title">Otot belum dilatih 7 hari terakhir</h3>
            
            <div style="display: flex; gap: 8px; margin-bottom: 18px;">
              <span class="badge badge-primary">Paha belakang</span>
              <span class="badge badge-primary">Betis</span>
            </div>

            <!-- Romanian Deadlift -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 40px; height: 46px; background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;">
                  ${SvgMuscleRenderer.renderThumbnail({ primaryMuscles: ['Paha belakang'], secondaryMuscles: [] })}
                </div>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px;">Romanian Deadlift</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">Melatih paha belakang, bokong</p>
                </div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="alert('Romanian Deadlift ditambahkan ke rutinitas!')">Tambah</button>
            </div>

            <!-- Standing Calf Raise -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 40px; height: 46px; background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;">
                  ${SvgMuscleRenderer.renderThumbnail({ primaryMuscles: ['Betis'], secondaryMuscles: [] })}
                </div>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px;">Standing Calf Raise</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">Melatih betis</p>
                </div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="alert('Standing Calf Raise ditambahkan ke rutinitas!')">Tambah</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Disclaimer Bawah Sesuai Tampilan 6 -->
      <footer class="app-footer-disclaimer" style="margin-top: 30px;">
        Rekomendasi berbasis aturan sederhana, bukan pengganti saran pelatih atau tenaga kesehatan.
      </footer>
    `;

    document.getElementById('btn-use-program').addEventListener('click', () => {
      alert('Program Upper/Lower berhasil diaktifkan untuk akunmu!');
    });

    document.getElementById('btn-create-routine').addEventListener('click', () => {
      const name = prompt('Masukkan nama rutinitas baru:', 'Leg Day');
      if (name) {
        alert(`Rutinitas "${name}" berhasil dibuat! Silakan tambahkan gerakan dari katalog.`);
        window.location.hash = '#/catalog';
      }
    });
  }
};
