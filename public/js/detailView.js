// public/js/detailView.js
// Penanganan tampilan Detail Gerakan persis sesuai mockup tampilan ke lima.png

const DetailView = {
  async render(container, exerciseId) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Memuat rincian gerakan...</p>
      </div>
    `;

    try {
      const exercise = await API.getExerciseById(exerciseId);
      this.renderContent(container, exercise);
    } catch (err) {
      container.innerHTML = `<div class="card"><p style="color:red;">${err.message}</p></div>`;
    }
  },

  renderContent(container, exercise) {
    const primaryMuscles = (exercise.muscles || [])
      .filter(m => m.is_primary === 1)
      .map(m => m.muscle_name);

    const secondaryMuscles = (exercise.muscles || [])
      .filter(m => m.is_primary === 0)
      .map(m => m.muscle_name);

    // Render diagram anatomi tubuh depan dan belakang
    const anatomySvg = SvgMuscleRenderer.renderBodyDiagram({
      primaryMuscles,
      secondaryMuscles,
      width: 280,
      height: 290,
      showBoth: true
    });

    // Format instruksi langkah per langkah
    const instructions = exercise.instructions ? exercise.instructions.split('\n') : [];
    const instructionsHtml = instructions.map(step => `
      <li style="margin-bottom: 12px; color: var(--text-secondary); line-height: 1.55;">
        ${step}
      </li>
    `).join('');

    container.innerHTML = `
      <!-- Link Kembali ke Daftar Gerakan Sesuai Tampilan 5 -->
      <div style="margin-bottom: 16px;">
        <a href="#/catalog" style="color: var(--primary-green); font-size: 0.92rem; font-weight: 600;">
          ← Kembali ke daftar gerakan
        </a>
      </div>

      <!-- Judul & Subtitle Gerakan -->
      <div style="margin-bottom: 24px;">
        <h1 class="page-title" style="font-size: 2.2rem; margin-bottom: 4px;">${exercise.name}</h1>
        <p class="page-subtitle" style="font-size: 1rem;">
          Gerakan dasar untuk ${exercise.category.toLowerCase()} · ${exercise.equipment} · Tingkat: ${exercise.difficulty}
        </p>
      </div>

      <!-- Layout 2-Kolom Sesuai Mockup 5 -->
      <div class="two-col-grid" style="grid-template-columns: 1.1fr 1fr; align-items: start;">
        <!-- Kolom Kiri: Ilustrasi Anatomi Otot Vektor (DEPAN dan BELAKANG) -->
        <div class="card">
          <h3 class="card-title">Otot yang dilatih</h3>
          
          <div style="background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; text-align: center; margin-bottom: 18px;">
            ${anatomySvg}
          </div>

          <!-- Legend Warna Sesuai Tampilan 5 -->
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); padding: 0 4px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 12px; height: 12px; background-color: #ea580c; border-radius: 2px;"></span>
              <span>Otot utama</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 12px; height: 12px; background-color: #fed7aa; border-radius: 2px;"></span>
              <span>Otot pendukung</span>
            </div>
            <div style="color: var(--text-muted); font-size: 0.8rem;">
              Tampak depan dan belakang
            </div>
          </div>

          <!-- Gambaran Manfaat untuk Tubuh -->
          <div style="margin-top: 20px; padding: 16px; background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); border-left: 4px solid var(--primary-green);">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
              <span>✨</span>
              <span>Gambaran Manfaat untuk Tubuh</span>
            </h4>
            <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
              ${exercise.is_cardio ? `
                <div style="margin-bottom: 8px;">❤️ <strong>Kesehatan Jantung & Pembuluh Darah:</strong> Memperkuat kontraksi otot jantung, meningkatkan sirkulasi darah, dan menurunkan denyut istirahat.</div>
                <div style="margin-bottom: 8px;">🔥 <strong>Pembakaran Lemak & Efisiensi Energi:</strong> Meningkatkan pengeluaran kalori harian untuk mendukung target Cutting dan menjaga komposisi tubuh.</div>
                <div style="margin-bottom: 8px;">🫁 <strong>Stamina & Kapasitas Paru (VO2 Max):</strong> Meningkatkan efisiensi penyerapan oksigen agar tidak mudah letih beraktivitas.</div>
                <div>🦵 <strong>Ketahanan Kaki & Mobilitas:</strong> Melatih daya tahan otot betis, paha, dan tumpuan persendian secara fungsional.</div>
              ` : `
                <div style="margin-bottom: 8px;">💪 <strong>Pertumbuhan Massa Otot:</strong> Menstimulasi serat otot utama untuk memicu adaptasi hipertrofi dan kekuatan.</div>
                <div style="margin-bottom: 8px;">⚡ <strong>Kekuatan & Stabilitas Fisik:</strong> Melatih koordinasi saraf-otot dan memperkuat tumpuan postur tubuh.</div>
                <div style="margin-bottom: 8px;">🦴 <strong>Kepadatan Tulang & Sendi:</strong> Beban progresif memperkuat ligamen dan merangsang kepadatan mineral tulang.</div>
                <div>🔥 <strong>Peningkatan Metabolisme (BMR):</strong> Massa otot yang terjaga membakar lebih banyak kalori alami saat beristirahat.</div>
              `}
            </div>
          </div>
        </div>

        <!-- Kolom Kanan: Rincian Otot, Cara Melakukan, & Pengaturan Awal -->
        <div>
          <!-- Kartu 1: Otot -->
          <div class="card" style="margin-bottom: 16px;">
            <h3 class="card-title" style="margin-bottom: 12px;">Otot</h3>
            
            <div style="margin-bottom: 12px;">
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">Utama</div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${primaryMuscles.map(m => `<span class="badge badge-primary">${m}</span>`).join('')}
              </div>
            </div>

            ${secondaryMuscles.length > 0 ? `
              <div>
                <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">Pendukung</div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  ${secondaryMuscles.map(m => `<span class="badge badge-secondary">${m}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Kartu 2: Cara Melakukan -->
          <div class="card" style="margin-bottom: 16px;">
            <h3 class="card-title" style="margin-bottom: 14px;">Cara melakukan</h3>
            <ol style="padding-left: 20px;">
              ${instructionsHtml}
            </ol>
          </div>

          <!-- Kartu 3: Pengaturan Awal -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom: 14px;">Pengaturan awal</h3>
            
            <div class="three-col-grid" style="margin-bottom: 18px;">
              <div style="background: #f8fafc; padding: 12px 14px; border-radius: var(--radius-md);">
                <div style="font-size: 0.8rem; color: var(--text-muted);">Set</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: var(--text-main);">${exercise.default_sets}</div>
              </div>
              <div style="background: #f8fafc; padding: 12px 14px; border-radius: var(--radius-md);">
                <div style="font-size: 0.8rem; color: var(--text-muted);">${exercise.is_cardio ? 'Durasi' : 'Repetisi'}</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: var(--text-main);">${exercise.default_reps}</div>
              </div>
              <div style="background: #f8fafc; padding: 12px 14px; border-radius: var(--radius-md);">
                <div style="font-size: 0.8rem; color: var(--text-muted);">Istirahat</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: var(--text-main);">${exercise.rest_seconds || 0} dtk</div>
              </div>
            </div>

            <button id="btn-add-to-routine" class="btn btn-primary btn-block" style="padding: 12px;">
              Tambah ke rutinitas
            </button>
          </div>
        </div>
      </div>

      <!-- Catatan Vektor Orisinal Bawah Sesuai Mockup 5 -->
      <footer class="app-footer-disclaimer" style="margin-top: 30px;">
        Ilustrasi dibuat sebagai gambar vektor orisinal untuk aplikasi ini. Konsultasikan teknik gerakan dengan pelatih bila ragu.
      </footer>
    `;

    document.getElementById('btn-add-to-routine').addEventListener('click', async () => {
      const btn = document.getElementById('btn-add-to-routine');
      btn.disabled = true;
      btn.textContent = 'Menambahkan...';
      try {
        let routines = await API.getRoutines();
        let targetRoutineId;
        if (routines.length > 1) {
          const routineNames = routines.map((r, i) => `${i + 1}. ${r.name}`).join('\n');
          const chosen = prompt(`Pilih rutinitas untuk "${exercise.name}":\n${routineNames}\n(Ketik nomor rutinitas 1-${routines.length})`, '1');
          const idx = (parseInt(chosen, 10) || 1) - 1;
          targetRoutineId = (routines[idx] || routines[0]).id;
        } else if (routines.length === 1) {
          targetRoutineId = routines[0].id;
        } else {
          const newRoutine = await API.request('/api/routines', {
            method: 'POST',
            body: JSON.stringify({ name: 'Push Day', estimatedMinutes: 55 })
          });
          targetRoutineId = newRoutine.id;
        }
        await API.addExerciseToRoutine(targetRoutineId, exercise.id);
        alert(`✓ Gerakan "${exercise.name}" berhasil ditambahkan ke rutinitas!`);
        window.location.hash = '#/routines';
      } catch (err) {
        alert(`Gagal: ${err.message}`);
        btn.disabled = false;
        btn.textContent = 'Tambah ke rutinitas';
      }
    });
  }
};
