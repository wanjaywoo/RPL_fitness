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

    // Pisahkan kekuatan dan kardio
    const strengthExercises = exercises.filter(e => !e.is_cardio);
    const cardioExercises = exercises.filter(e => e.is_cardio);

    const cardsHtml = strengthExercises.map(ex => {
      const primaryList = ex.primary_muscles ? ex.primary_muscles.split(', ') : [];
      const secondaryList = ex.secondary_muscles ? ex.secondary_muscles.split(', ') : [];

      const thumbSvg = SvgMuscleRenderer.renderThumbnail({
        primaryMuscles: primaryList,
        secondaryMuscles: secondaryList
      });

      const primaryBadges = primaryList.map(m => `<span class="badge badge-primary">${m}</span>`).join(' ');
      const secondaryBadges = secondaryList.map(m => `<span class="badge badge-secondary">${m}</span>`).join(' ');

      return `
        <div class="exercise-card">
          <div class="exercise-thumb">${thumbSvg}</div>
          <div class="exercise-details">
            <h4 class="exercise-title">
              <a href="#/exercises/${ex.id}" style="color: var(--text-main); text-decoration: none;">${ex.name}</a>
            </h4>
            <div class="exercise-badges">${primaryBadges} ${secondaryBadges}</div>
            <div class="exercise-meta">${ex.equipment}, ${ex.default_sets} set x ${ex.default_reps}</div>
            <a href="#/exercises/${ex.id}" class="exercise-action">Tambah ke rutinitas</a>
          </div>
        </div>
      `;
    }).join('');

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
          Lari, bersepeda, renang, jalan cepat, HIIT, dan lompat tali dicatat sebagai durasi (dan jarak jika ada).
        </p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${cardioExercises.map(c => `
            <span style="background: #f1f5f9; padding: 7px 16px; border-radius: 9999px; font-size: 0.88rem; font-weight: 500; color: var(--text-main);">
              ${c.name}
            </span>
          `).join('')}
        </div>
      </div>
    `;

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
