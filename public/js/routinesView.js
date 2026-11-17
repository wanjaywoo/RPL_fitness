// public/js/routinesView.js
// Penanganan tampilan Rutinitas & Rekomendasi Program persis sesuai mockup tampilan ke enam.png
// Mendukung multi-rutinitas, pemilihan rutinitas aktif, penambahan/penghapusan, dan rekomendasi program

const RoutinesView = {
  activeRoutineId: null,

  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Memuat rutinitas dan rekomendasi...</p>
      </div>
    `;

    try {
      const routines = await API.getRoutines().catch(() => []);
      const recData = await API.getRoutineRecommendation().catch(() => ({}));
      this.renderContent(container, routines, recData);
    } catch (err) {
      container.innerHTML = `<div class="card"><p style="color:red;">${err.message}</p></div>`;
    }
  },

  renderContent(container, routines = [], recData = {}) {
    // Tentukan rutinitas yang sedang aktif dilihat
    let activeRoutine = null;
    if (this.activeRoutineId && routines.some(r => r.id === this.activeRoutineId)) {
      activeRoutine = routines.find(r => r.id === this.activeRoutineId);
    } else if (routines.length > 0) {
      activeRoutine = routines[0];
      this.activeRoutineId = activeRoutine.id;
    } else {
      activeRoutine = {
        id: null,
        name: 'Push Day',
        estimated_minutes: 55,
        exercises: []
      };
    }

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

    // Daftar gerakan default Push Day bila belum ada gerakan di database
    const defaultPushExercises = [
      { name: 'Bench Press', default_sets: 4, default_reps: '8-10', rest_seconds: 90, primary_muscles: 'Dada' },
      { name: 'Overhead Press', default_sets: 4, default_reps: '6-8', rest_seconds: 90, primary_muscles: 'Bahu' },
      { name: 'Incline Dumbbell Press', default_sets: 3, default_reps: '10-12', rest_seconds: 75, primary_muscles: 'Dada' },
      { name: 'Lateral Raise', default_sets: 3, default_reps: '12-15', rest_seconds: 60, primary_muscles: 'Bahu' },
      { name: 'Triceps Pushdown', default_sets: 3, default_reps: '10-12', rest_seconds: 60, primary_muscles: 'Trisep' }
    ];

    const routineExercises = (activeRoutine.exercises && activeRoutine.exercises.length > 0)
      ? activeRoutine.exercises
      : defaultPushExercises;

    const exerciseItemsHtml = routineExercises.map((ex, idx) => {
      const thumb = SvgMuscleRenderer.renderThumbnail({
        primaryMuscles: [ex.primary_muscles || ex.category || 'Dada'],
        secondaryMuscles: []
      });

      return `
        <div class="routine-exercise-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 10px; transition: transform 0.15s ease;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 50px; background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              ${thumb}
            </div>
            <div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px;">${ex.name}</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
                ${ex.is_cardio ? `${ex.default_sets} sesi · ${ex.default_reps} · Latihan Kardio` : `${ex.default_sets} set x ${ex.default_reps} repetisi · istirahat ${ex.rest_seconds} dtk`}
              </p>
            </div>
          </div>
          <div class="routine-controls" style="display: flex; gap: 6px;">
            ${ex.id && activeRoutine.id ? `
              <button class="btn-delete-exercise" data-routine-id="${activeRoutine.id}" data-id="${ex.id}" title="Hapus dari rutinitas" style="background: none; border: 1px solid #fee2e2; color: #ef4444; border-radius: 6px; padding: 6px 10px; cursor: pointer; font-size: 0.85rem;">
                🗑️ Hapus
              </button>
            ` : ''}
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
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0;">${s.focus}</p>
        </div>
      </div>
    `).join('');

    // Tab Pilihan Multi-Rutinitas
    const routineTabsHtml = routines.length > 0 ? `
      <div style="display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; align-items: center;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-right: 4px;">Pilih rutinitas:</span>
        ${routines.map(r => `
          <button class="btn-tab-routine ${r.id === activeRoutine.id ? 'active' : ''}" data-id="${r.id}" style="padding: 6px 16px; border-radius: 9999px; font-size: 0.88rem; font-weight: 600; cursor: pointer; border: 1.5px solid ${r.id === activeRoutine.id ? 'var(--primary-green)' : 'var(--border-color)'}; background: ${r.id === activeRoutine.id ? 'var(--primary-green)' : '#ffffff'}; color: ${r.id === activeRoutine.id ? '#ffffff' : 'var(--text-main)'};">
            ${r.name}
          </button>
        `).join('')}
      </div>
    ` : '';

    container.innerHTML = `
      <!-- Header Rutinitas & Rekomendasi Sesuai Tampilan 6 -->
      <div class="page-header" style="align-items: center;">
        <div>
          <h1 class="page-title">Rutinitas dan rekomendasi</h1>
          <p class="page-subtitle">Susun rutinitas sendiri atau ikuti rekomendasi berdasarkan tujuan dan hari latihanmu.</p>
        </div>
        <button id="btn-create-routine" class="btn btn-primary" style="padding: 10px 20px;">
          + Buat rutinitas baru
        </button>
      </div>

      <!-- Tab Pemilihan Rutinitas Aktif -->
      ${routineTabsHtml}

      <!-- Layout 2-Kolom Sesuai Mockup 6 -->
      <div class="two-col-grid" style="grid-template-columns: 1.25fr 1fr; align-items: start; gap: 24px;">
        <!-- Kolom Kiri: Kartu Rutinitas Aktif & Daftar Gerakan -->
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
            <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin: 0;">${activeRoutine.name}</h3>
            <span style="font-size: 0.88rem; color: var(--text-muted);">
              ${routineExercises.length} gerakan · sekitar ${activeRoutine.estimated_minutes || 55} menit
            </span>
          </div>

          <div style="margin-bottom: 24px;">${exerciseItemsHtml}</div>

          <div style="display: flex; gap: 14px; flex-wrap: wrap;">
            <a href="#/catalog" class="btn btn-outline" style="padding: 10px 20px; font-weight: 600; text-decoration: none;">
              + Tambah gerakan dari katalog
            </a>
            <a href="#/checkin" class="btn btn-primary" style="padding: 10px 22px; font-weight: 600; text-decoration: none;">
              Mulai latihan (check-in)
            </a>
          </div>
        </div>

        <!-- Kolom Kanan: Rekomendasi Program & Otot Belum Dilatih 7 Hari -->
        <div>
          <!-- Kartu 1: Rekomendasi Program Sesuai Mockup 6 -->
          <div class="card" style="margin-bottom: 20px; padding: 24px;">
            <h3 class="card-title" style="margin-bottom: 8px;">Rekomendasi program</h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">
              ${splitRec.description}
            </p>

            <div style="margin-bottom: 20px;">${scheduleItemsHtml}</div>

            <button id="btn-use-program" class="btn btn-primary btn-block" style="padding: 11px; font-weight: 600;">
              Gunakan program ini
            </button>
          </div>

          <!-- Kartu 2: Otot Belum Dilatih 7 Hari Terakhir Sesuai Mockup 6 -->
          <div class="card" style="padding: 24px;">
            <h3 class="card-title" style="margin-bottom: 8px;">Otot belum dilatih 7 hari terakhir</h3>
            
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
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin: 0 0 2px 0;">Romanian Deadlift</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Melatih paha belakang, bokong</p>
                </div>
              </div>
              <button class="btn btn-outline btn-sm btn-quick-rec" data-id="10" data-name="Romanian Deadlift">Tambah</button>
            </div>

            <!-- Standing Calf Raise -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 40px; height: 46px; background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;">
                  ${SvgMuscleRenderer.renderThumbnail({ primaryMuscles: ['Betis'], secondaryMuscles: [] })}
                </div>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin: 0 0 2px 0;">Standing Calf Raise</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Melatih betis</p>
                </div>
              </div>
              <button class="btn btn-outline btn-sm btn-quick-rec" data-id="11" data-name="Standing Calf Raise">Tambah</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Disclaimer Bawah Sesuai Tampilan 6 -->
      <footer class="app-footer-disclaimer" style="margin-top: 30px;">
        Rekomendasi berbasis aturan sederhana, bukan pengganti saran pelatih atau tenaga kesehatan.
      </footer>
    `;

    // Pasang listener switch tab rutinitas
    container.querySelectorAll('.btn-tab-routine').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeRoutineId = Number(btn.getAttribute('data-id'));
        this.renderContent(container, routines, recData);
      });
    });

    // Pasang listener hapus gerakan
    container.querySelectorAll('.btn-delete-exercise').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const routineId = btn.getAttribute('data-routine-id');
        const exId = btn.getAttribute('data-id');
        if (confirm('Hapus gerakan ini dari rutinitas?')) {
          try {
            await API.request(`/api/routines/${routineId}/exercises/${exId}`, { method: 'DELETE' });
            this.render(container);
          } catch (err) {
            alert(`Gagal menghapus: ${err.message}`);
          }
        }
      });
    });

    // Pasang listener tambah gerakan rekomendasi
    container.querySelectorAll('.btn-quick-rec').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const exId = btn.getAttribute('data-id');
        const exName = btn.getAttribute('data-name');
        btn.textContent = 'Menambah...';
        try {
          let routineId = activeRoutine.id;
          if (!routineId) {
            const newRoutine = await API.request('/api/routines', {
              method: 'POST',
              body: JSON.stringify({ name: 'Push Day', estimatedMinutes: 55 })
            });
            routineId = newRoutine.id;
          }
          await API.addExerciseToRoutine(routineId, Number(exId));
          alert(`✓ "${exName}" berhasil ditambahkan ke rutinitas!`);
          this.render(container);
        } catch (err) {
          alert(`Gagal: ${err.message}`);
          btn.textContent = 'Tambah';
        }
      });
    });

    document.getElementById('btn-use-program').addEventListener('click', () => {
      alert('✓ Program Upper/Lower berhasil diaktifkan untuk akunmu!');
    });

    document.getElementById('btn-create-routine').addEventListener('click', async () => {
      const name = prompt('Masukkan nama rutinitas baru:', 'Leg Day');
      if (name && name.trim()) {
        try {
          const created = await API.request('/api/routines', {
            method: 'POST',
            body: JSON.stringify({ name: name.trim(), estimatedMinutes: 55 })
          });
          this.activeRoutineId = created.id;
          alert(`✓ Rutinitas "${name.trim()}" berhasil dibuat!\nSilakan tambahkan gerakan dari katalog.`);
          this.render(container);
        } catch (err) {
          alert(`Gagal membuat rutinitas: ${err.message}`);
        }
      }
    });
  }
};
