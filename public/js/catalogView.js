// public/js/catalogView.js
// Penanganan tampilan Katalog Gerakan persis sesuai mockup tampilan ke empat.png

const CatalogView = {
  currentCategory: 'Semua',
  searchQuery: '',

  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Memuat katalog gerakan...</p>
      </div>
    `;

    try {
      const exercises = await API.getExercises();
      this.renderContent(container, exercises);
    } catch (err) {
      container.innerHTML = `<div class="card"><p style="color:red;">${err.message}</p></div>`;
    }
  },

  renderContent(container, exercises = []) {
    const categories = ['Semua', 'Dada', 'Punggung', 'Bahu', 'Lengan', 'Kaki', 'Perut', 'Kardio'];

    const pillsHtml = categories.map(cat => `
      <button class="pill-btn ${cat === this.currentCategory ? 'active' : ''}" data-cat="${cat}">
        ${cat}
      </button>
    `).join('');

    // Simpan cache kardio saat ada data
    if (exercises.some(e => e.is_cardio)) {
      this.cardioCache = exercises.filter(e => e.is_cardio);
    }

    // Jika filter Kardio dipilih, tampilkan kartu kardio di dalam grid!
    // Jika Semua dipilih, tampilkan latihan beban di grid dan kardio di bagian bawah (sesuai mockup).
    let gridExercises = [];
    if (this.currentCategory === 'Kardio') {
      gridExercises = exercises;
    } else if (this.currentCategory === 'Semua') {
      gridExercises = exercises.filter(e => !e.is_cardio);
    } else {
      gridExercises = exercises;
    }

    const cardsHtml = gridExercises.map(ex => {
      const primaryList = ex.primary_muscles ? ex.primary_muscles.split(', ') : [];
      const secondaryList = ex.secondary_muscles ? ex.secondary_muscles.split(', ') : [];

      const thumbSvg = SvgMuscleRenderer.renderThumbnail({
        primaryMuscles: primaryList,
        secondaryMuscles: secondaryList
      });

      const primaryBadges = primaryList.map(m => `<span class="badge badge-primary">${m}</span>`).join(' ');
      const secondaryBadges = secondaryList.map(m => `<span class="badge badge-secondary">${m}</span>`).join(' ');

      return `
        <div class="exercise-card" data-id="${ex.id}">
          <div class="exercise-thumb">${thumbSvg}</div>
          <div class="exercise-details">
            <h4 class="exercise-title">
              <a href="#/exercises/${ex.id}" style="color: var(--text-main); text-decoration: none;">${ex.name}</a>
            </h4>
            <div class="exercise-badges">${primaryBadges} ${secondaryBadges}</div>
            <div class="exercise-meta">${ex.equipment}, ${ex.default_sets} set x ${ex.default_reps}</div>
            <button type="button" class="btn-quick-add-routine" data-id="${ex.id}" data-name="${ex.name}" style="background: none; border: none; padding: 4px 0; font-size: 0.88rem; font-weight: 600; color: var(--primary-green); cursor: pointer; text-align: left; display: block; margin-top: 6px;">
              + Tambah ke rutinitas
            </button>
          </div>
        </div>
      `;
    }).join('');

    const cardioList = this.cardioCache || [
      { id: 19, name: 'Lari' },
      { id: 20, name: 'Bersepeda' },
      { id: 21, name: 'Renang' },
      { id: 22, name: 'Jalan cepat' },
      { id: 23, name: 'HIIT' },
      { id: 24, name: 'Lompat tali' }
    ];

    container.innerHTML = `
      <!-- Header Pilih Gerakan Sesuai Tampilan 4 -->
      <div class="page-header" style="align-items: center;">
        <div>
          <h1 class="page-title">Pilih gerakan</h1>
          <p class="page-subtitle">Katalog gerakan beserta otot yang dilatih. Tandai otot utama (oranye) dan pendukung (abu-abu).</p>
        </div>
        <a href="#/routines" class="btn btn-primary" style="padding: 10px 20px;">
          Lihat rutinitas saya
        </a>
      </div>

      <!-- Kolom Pencarian -->
      <div class="card" style="padding: 18px 20px; margin-bottom: 20px;">
        <label class="form-label" for="search-input" style="font-size: 0.88rem; margin-bottom: 8px;">Cari gerakan</label>
        <input type="text" id="search-input" class="form-input" placeholder="Contoh: squat" value="${this.searchQuery}" />
      </div>

      <!-- Filter Kategori Pills -->
      <div class="filter-pills">${pillsHtml}</div>

      <!-- Grid 3-Kolom Kartu Gerakan -->
      <div class="catalog-grid" id="catalog-grid-container">${cardsHtml}</div>

      <!-- Seksi Bawah: Gerakan Kardio Sesuai Mockup 4 -->
      <div class="card" style="margin-top: 10px;">
        <h3 class="card-title">Gerakan kardio</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px;">
          Lari, bersepeda, renang, jalan cepat, HIIT, dan lompat tali dicatat sebagai durasi (dan jarak jika ada). Klik untuk melihat detail cara melakukannya.
        </p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          ${cardioList.map(c => `
            <button type="button" class="cardio-pill-btn" data-id="${c.id}" style="background: #ffffff; border: 1.5px solid var(--border-color); padding: 9px 20px; border-radius: 9999px; font-size: 0.92rem; font-weight: 600; color: var(--text-main); cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm); transition: all 0.15s ease;">
              <span>🏃</span>
              <span>${c.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Pasang listener klik pada kartu gerakan untuk langsung membuka Tampilan Kelima
    container.querySelectorAll('.exercise-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-quick-add-routine') || e.target.closest('a')) return;
        const id = card.getAttribute('data-id');
        if (id) {
          window.location.hash = `#/exercises/${id}`;
        }
      });
    });

    // Pasang listener tombol cepat tambah ke rutinitas
    container.querySelectorAll('.btn-quick-add-routine').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        btn.textContent = 'Menambahkan...';
        try {
          let routines = await API.getRoutines();
          let targetId;
          if (routines.length > 1) {
            const routineNames = routines.map((r, i) => `${i + 1}. ${r.name}`).join('\n');
            const chosen = prompt(`Pilih rutinitas untuk "${name}":\n${routineNames}\n(Ketik nomor rutinitas 1-${routines.length})`, '1');
            const idx = (parseInt(chosen, 10) || 1) - 1;
            targetId = (routines[idx] || routines[0]).id;
          } else if (routines.length === 1) {
            targetId = routines[0].id;
          } else {
            const newRoutine = await API.request('/api/routines', {
              method: 'POST',
              body: JSON.stringify({ name: 'Push Day', estimatedMinutes: 55 })
            });
            targetId = newRoutine.id;
          }
          await API.addExerciseToRoutine(targetId, Number(id));
          alert(`✓ "${name}" berhasil ditambahkan ke rutinitas!`);
          window.location.hash = '#/routines';
        } catch (err) {
          alert(`Gagal: ${err.message}`);
          btn.textContent = '+ Tambah ke rutinitas';
        }
      });
    });

    // Pasang listener klik pada tombol pil kardio di bawah
    container.querySelectorAll('.cardio-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        if (id) {
          window.location.hash = `#/exercises/${id}`;
        }
      });
      btn.addEventListener('mouseenter', () => {
        btn.style.borderColor = 'var(--primary-green)';
        btn.style.color = 'var(--primary-green)';
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = 'var(--shadow-md)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.borderColor = 'var(--border-color)';
        btn.style.color = 'var(--text-main)';
        btn.style.transform = 'none';
        btn.style.boxShadow = 'var(--shadow-sm)';
      });
    });

    // Pasang listener filter pills
    container.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        this.currentCategory = e.currentTarget.getAttribute('data-cat');
        const filterVal = this.currentCategory === 'Semua' ? '' : this.currentCategory;
        const res = await API.getExercises(filterVal, this.searchQuery);
        this.renderContent(container, res);
      });
    });

    // Pasang listener pencarian input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', async (e) => {
        this.searchQuery = e.target.value.trim();
        const filterVal = this.currentCategory === 'Semua' ? '' : this.currentCategory;
        const res = await API.getExercises(filterVal, this.searchQuery);
        this.renderContent(container, res);
      });
    }
  }
};
