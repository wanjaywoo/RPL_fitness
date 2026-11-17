// public/js/profileView.js
// Penanganan tampilan Profil & Pengaturan Akun Pengguna FitStreak

const ProfileView = {
  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Memuat profil pengguna...</p>
      </div>
    `;

    try {
      const profile = await API.getProfile();
      this.renderContent(container, profile);
    } catch (err) {
      container.innerHTML = `<div class="card"><p style="color:red;">${err.message}</p></div>`;
    }
  },

  renderContent(container, profile) {
    // Hitung usia dari tanggal lahir
    let age = 26;
    if (profile.birthDate) {
      const birthYear = new Date(profile.birthDate).getFullYear();
      age = new Date().getFullYear() - birthYear;
    }

    const genderLabel = profile.gender === 'female' ? 'Perempuan' : 'Laki-laki';
    const weightDisplay = profile.currentWeightKg ? `${profile.currentWeightKg} kg` : 'Belum ada';

    container.innerHTML = `
      <div class="page-header" style="align-items: center;">
        <div>
          <h1 class="page-title">Profil & Pengaturan</h1>
          <p class="page-subtitle">Kelola data fisik, timbangan berat badan, dan pengaturan akun FitStreak-mu.</p>
        </div>
        <a href="#/dashboard" class="btn btn-outline" style="padding: 10px 20px; font-weight: 600; text-decoration: none;">
          Kembali ke dashboard
        </a>
      </div>

      <!-- 3 Kartu Ringkasan Atas -->
      <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px;">
        <div class="stat-card" style="padding: 20px 24px;">
          <div class="stat-label">Pengguna Terdaftar</div>
          <div class="stat-value" style="font-size: 1.5rem; color: var(--text-main); margin-bottom: 4px;">
            ${profile.name}
          </div>
          <div class="stat-subtext">${profile.email}</div>
        </div>

        <div class="stat-card" style="padding: 20px 24px;">
          <div class="stat-label">Data Fisik</div>
          <div class="stat-value" style="font-size: 1.5rem; color: var(--text-main); margin-bottom: 4px;">
            ${profile.heightCm} cm · ${weightDisplay}
          </div>
          <div class="stat-subtext">${genderLabel} · ${age} tahun</div>
        </div>

        <div class="stat-card" style="padding: 20px 24px;">
          <div class="stat-label">Zona Waktu Lokal</div>
          <div class="stat-value" style="font-size: 1.5rem; color: var(--text-main); margin-bottom: 4px;">
            ${profile.timeZone === 'Asia/Jakarta' ? 'WIB' : (profile.timeZone === 'Asia/Makassar' ? 'WITA' : 'WIT')}
          </div>
          <div class="stat-subtext">${profile.timeZone || 'Asia/Jakarta'}</div>
        </div>
      </div>

      <!-- Grid 2-Kolom: Edit Profil Fisik & Catat Timbangan Berat Badan -->
      <div class="two-col-grid" style="grid-template-columns: 1.25fr 1fr; align-items: start; gap: 24px;">
        <!-- Kolom Kiri: Form Perbarui Data Fisik -->
        <div class="card" style="padding: 28px;">
          <h3 class="card-title" style="margin-bottom: 20px;">Perbarui Data Fisik & Profil</h3>

          <form id="form-update-profile">
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="prof-name">Nama Lengkap</label>
              <input type="text" id="prof-name" class="form-input" value="${profile.name || ''}" required />
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="prof-email">Email Akun (Hanya Baca)</label>
              <input type="email" id="prof-email" class="form-input" value="${profile.email || ''}" disabled style="background: #f1f5f9; color: #64748b;" />
            </div>

            <div class="form-row" style="margin-bottom: 16px;">
              <div class="form-group" style="flex: 1;">
                <label class="form-label" for="prof-height">Tinggi Badan (cm)</label>
                <input type="number" id="prof-height" class="form-input" value="${profile.heightCm || 170}" required min="100" max="250" />
              </div>

              <div class="form-group" style="flex: 1.2;">
                <label class="form-label" for="prof-timezone">Zona Waktu</label>
                <select id="prof-timezone" class="form-select">
                  <option value="Asia/Jakarta" ${profile.timeZone === 'Asia/Jakarta' ? 'selected' : ''}>Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar" ${profile.timeZone === 'Asia/Makassar' ? 'selected' : ''}>Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura" ${profile.timeZone === 'Asia/Jayapura' ? 'selected' : ''}>Asia/Jayapura (WIT)</option>
                </select>
              </div>
            </div>

            <div id="prof-feedback" style="display: none; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 0.88rem;"></div>

            <button type="submit" id="btn-save-profile" class="btn btn-primary" style="padding: 11px 24px; font-weight: 700;">
              Simpan Perubahan
            </button>
          </form>
        </div>

        <!-- Kolom Kanan: Catat Timbangan Berat Badan Cepat -->
        <div>
          <div class="card" style="padding: 28px; margin-bottom: 20px;">
            <h3 class="card-title" style="margin-bottom: 12px;">Catat Timbangan Berat Badan</h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">
              Timbangan terbaru akan langsung memperbarui grafik tren 8 minggu dan evaluasi target kalori adaptif (BR-12).
            </p>

            <form id="form-log-weight">
              <div class="form-group" style="margin-bottom: 16px;">
                <label class="form-label" for="log-weight-input">Berat Badan Baru (kg)</label>
                <input type="number" step="0.1" id="log-weight-input" class="form-input" placeholder="Contoh: 69.5" required min="30" max="300" />
              </div>

              <div id="weight-feedback" style="display: none; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 0.88rem;"></div>

              <button type="submit" id="btn-save-weight" class="btn btn-primary btn-block" style="padding: 11px; font-weight: 700;">
                Catat Timbangan Baru
              </button>
            </form>
          </div>

          <!-- Kartu Info Keamanan -->
          <div class="card" style="padding: 20px 24px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: #111827; margin: 0 0 6px 0;">Privasi Data Kesehatan</h4>
            <p style="font-size: 0.82rem; color: #64748b; line-height: 1.5; margin: 0 0 14px 0;">
              Sesuai aturan keamanan BR-13, data kesehatan pribadi (berat badan, asupan nutrisi, dan latihan) hanya dapat diakses oleh akun Anda sendiri. Administrator tidak memiliki izin membaca data kesehatan pengguna.
            </p>
            <button id="btn-profile-logout" class="btn btn-outline btn-block" style="color: #dc2626; border-color: #fecaca; font-weight: 600;">
              Keluar dari Akun (Logout)
            </button>
          </div>
        </div>
      </div>

      <footer class="app-footer-disclaimer" style="margin-top: 30px;">
        FitStreak memberi estimasi umum, bukan saran medis. Konsultasikan dengan tenaga kesehatan untuk kebutuhan khusus.
      </footer>
    `;

    // Handler Form Update Profil
    const formProfile = document.getElementById('form-update-profile');
    if (formProfile) {
      formProfile.addEventListener('submit', async (e) => {
        e.preventDefault();
        const feedback = document.getElementById('prof-feedback');
        const btn = document.getElementById('btn-save-profile');
        feedback.style.display = 'none';
        btn.disabled = true;
        btn.textContent = 'Menyimpan...';

        try {
          const payload = {
            name: document.getElementById('prof-name').value.trim(),
            heightCm: Number(document.getElementById('prof-height').value),
            timeZone: document.getElementById('prof-timezone').value
          };
          const res = await API.updateProfile(payload);
          feedback.style.display = 'block';
          feedback.style.background = '#dcfce7';
          feedback.style.color = '#166534';
          feedback.textContent = `✓ ${res.message || 'Profil berhasil diperbarui!'}`;
          setTimeout(() => this.render(container), 800);
        } catch (err) {
          feedback.style.display = 'block';
          feedback.style.background = '#fee2e2';
          feedback.style.color = '#991b1b';
          feedback.textContent = `✕ Gagal: ${err.message}`;
          btn.disabled = false;
          btn.textContent = 'Simpan Perubahan';
        }
      });
    }

    // Handler Form Catat Berat Badan
    const formWeight = document.getElementById('form-log-weight');
    if (formWeight) {
      formWeight.addEventListener('submit', async (e) => {
        e.preventDefault();
        const feedback = document.getElementById('weight-feedback');
        const btn = document.getElementById('btn-save-weight');
        const weightVal = Number(document.getElementById('log-weight-input').value);
        feedback.style.display = 'none';
        btn.disabled = true;
        btn.textContent = 'Menyimpan...';

        try {
          await API.logWeight(weightVal);
          feedback.style.display = 'block';
          feedback.style.background = '#dcfce7';
          feedback.style.color = '#166534';
          feedback.textContent = `✓ Timbangan ${weightVal} kg berhasil dicatat!`;
          setTimeout(() => this.render(container), 800);
        } catch (err) {
          feedback.style.display = 'block';
          feedback.style.background = '#fee2e2';
          feedback.style.color = '#991b1b';
          feedback.textContent = `✕ Gagal: ${err.message}`;
          btn.disabled = false;
          btn.textContent = 'Catat Timbangan Baru';
        }
      });
    }

    // Handler Logout
    const btnLogout = document.getElementById('btn-profile-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
          API.logout();
          window.location.hash = '#/login';
        }
      });
    }
  }
};
