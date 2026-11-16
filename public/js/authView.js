// public/js/authView.js
// Penanganan tampilan Buat Akun & Login persis sesuai mockup tampilan buat akun.png

const AuthView = {
  renderRegister(container) {
    container.innerHTML = `
      <div class="auth-page">
        <header class="auth-header">
          <span class="flame-icon">🔥</span>
          <span>FitStreak</span>
        </header>

        <main class="auth-body">
          <div style="text-align: left; width: 100%; max-width: 680px; margin-bottom: 24px;">
            <h1 style="font-size: 2rem; font-weight: 700; color: #111827; margin-bottom: 6px;">Buat akun</h1>
            <p style="color: #4b5563; font-size: 0.95rem;">Data ini dipakai untuk menghitung kebutuhan kalorimu dengan rumus Mifflin-St Jeor.</p>
          </div>

          <div class="auth-card">
            <form id="register-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="reg-name">Nama</label>
                  <input type="text" id="reg-name" class="form-input" placeholder="Rizwan" value="Rizwan" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="reg-email">Email</label>
                  <input type="email" id="reg-email" class="form-input" placeholder="nama@email.com" value="nama@email.com" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="reg-password">Kata sandi</label>
                  <input type="password" id="reg-password" class="form-input" placeholder="Minimal 8 karakter" value="password123" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="reg-gender">Jenis kelamin</label>
                  <select id="reg-gender" class="form-select">
                    <option value="male" selected>Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="reg-birth">Tanggal lahir</label>
                  <input type="date" id="reg-birth" class="form-input" value="2000-05-14" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="reg-timezone">Zona waktu</label>
                  <select id="reg-timezone" class="form-select">
                    <option value="Asia/Jakarta" selected>Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="reg-height">Tinggi badan (cm)</label>
                  <input type="number" id="reg-height" class="form-input" placeholder="170" value="170" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="reg-weight">Berat badan (kg)</label>
                  <input type="number" step="0.1" id="reg-weight" class="form-input" placeholder="69" value="69" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="reg-activity">Tingkat aktivitas</label>
                <select id="reg-activity" class="form-select">
                  <option value="sedentary">Jarang olahraga (Sedentary)</option>
                  <option value="light" selected>Ringan (1-3 hari/minggu)</option>
                  <option value="moderate">Sedang (3-5 hari/minggu)</option>
                  <option value="very_active">Sangat aktif (6-7 hari/minggu)</option>
                  <option value="extra_active">Ekstra aktif (Latihan intensif 2x/hari)</option>
                </select>
                <p class="form-help">Pengguna harus berusia minimal 18 tahun.</p>
              </div>

              <div class="disclaimer-box">
                <input type="checkbox" id="reg-disclaimer" required checked />
                <label class="disclaimer-text" for="reg-disclaimer">
                  Saya memahami bahwa FitStreak memberi estimasi umum, bukan saran medis. Saya akan berkonsultasi dengan tenaga kesehatan sebelum mengubah pola makan atau latihan secara drastis.
                </label>
              </div>

              <div id="register-error" style="color: #b91c1c; font-size: 0.9rem; margin-bottom: 16px; display: none;"></div>

              <button type="submit" class="btn btn-primary btn-block" style="padding: 14px; font-size: 1rem; border-radius: var(--radius-md);">
                Daftar
              </button>
            </form>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="#/login" style="color: var(--primary-green); font-weight: 600; font-size: 0.95rem;">Sudah punya akun? Masuk</a>
          </div>
        </main>
      </div>
    `;

    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const errBox = document.getElementById('register-error');
      errBox.style.display = 'none';

      try {
        const payload = {
          name: document.getElementById('reg-name').value,
          email: document.getElementById('reg-email').value,
          password: document.getElementById('reg-password').value,
          gender: document.getElementById('reg-gender').value,
          birthDate: document.getElementById('reg-birth').value,
          timeZone: document.getElementById('reg-timezone').value,
          heightCm: Number(document.getElementById('reg-height').value),
          weightKg: Number(document.getElementById('reg-weight').value),
          activityLevel: document.getElementById('reg-activity').value,
          goalType: 'bulking'
        };

        await API.register(payload);
        window.location.hash = '#/dashboard';
      } catch (err) {
        errBox.textContent = err.message;
        errBox.style.display = 'block';
      }
    });
  },

  renderLogin(container) {
    container.innerHTML = `
      <div class="auth-page">
        <header class="auth-header">
          <span class="flame-icon">🔥</span>
          <span>FitStreak</span>
        </header>

        <main class="auth-body">
          <div style="text-align: left; width: 100%; max-width: 440px; margin-bottom: 24px;">
            <h1 style="font-size: 2rem; font-weight: 700; color: #111827; margin-bottom: 6px;">Masuk</h1>
            <p style="color: #4b5563; font-size: 0.95rem;">Lanjutkan perjalanan kebugaran dan jaga streak latihanmu.</p>
          </div>

          <div class="auth-card" style="max-width: 440px;">
            <form id="login-form">
              <div class="form-group">
                <label class="form-label" for="login-email">Email</label>
                <input type="email" id="login-email" class="form-input" placeholder="nama@email.com" value="nama@email.com" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="login-password">Kata sandi</label>
                <input type="password" id="login-password" class="form-input" placeholder="Kata sandi" value="password123" required />
              </div>

              <div id="login-error" style="color: #b91c1c; font-size: 0.9rem; margin-bottom: 16px; display: none;"></div>

              <button type="submit" class="btn btn-primary btn-block" style="padding: 12px; font-size: 1rem;">
                Masuk
              </button>
            </form>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="#/register" style="color: var(--primary-green); font-weight: 600; font-size: 0.95rem;">Belum punya akun? Buat akun baru</a>
          </div>
        </main>
      </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const errBox = document.getElementById('login-error');
      errBox.style.display = 'none';

      try {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        await API.login(email, password);
        window.location.hash = '#/dashboard';
      } catch (err) {
        errBox.textContent = err.message;
        errBox.style.display = 'block';
      }
    });
  }
};
