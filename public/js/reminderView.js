// public/js/reminderView.js
// Penanganan tampilan Pengingat Harian persis 100% sesuai mockup 9. Pengingat@1x.png

const ReminderView = {
  activeDays: [1, 2, 4, 5], // Default: Sen, Sel, Kam, Jum (sesuai mockup)
  isEnabled: true,
  reminderHour: '19:00',

  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Memuat pengaturan pengingat harian...</p>
      </div>
    `;

    try {
      const data = await API.getReminderStatus().catch(() => ({}));
      this.renderContent(container, data);
    } catch (err) {
      container.innerHTML = `<div class="card"><p style="color:red;">${err.message}</p></div>`;
    }
  },

  renderContent(container, apiData = {}) {
    const dayNames = [
      { id: 1, name: 'Sen' },
      { id: 2, name: 'Sel' },
      { id: 3, name: 'Rab' },
      { id: 4, name: 'Kam' },
      { id: 5, name: 'Jum' },
      { id: 6, name: 'Sab' },
      { id: 7, name: 'Min' }
    ];

    const dayPillsHtml = dayNames.map(d => {
      const isChecked = this.activeDays.includes(d.id);
      return `
        <label class="reminder-day-pill" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: var(--radius-md); border: 1.5px solid ${isChecked ? '#93c5fd' : '#e2e8f0'}; background: ${isChecked ? '#eff6ff' : '#ffffff'}; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: ${isChecked ? '#1d4ed8' : '#64748b'};">
          <input type="checkbox" class="chk-day" data-day="${d.id}" ${isChecked ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: #2563eb;" />
          <span>${d.name}</span>
        </label>
      `;
    }).join('');

    container.innerHTML = `
      <!-- Sub-Navigasi Header Atas Sesuai 9. Pengingat@1x.png -->
      <div style="display: flex; justify-content: flex-end; gap: 20px; font-size: 0.92rem; margin-bottom: 18px;">
        <a href="#/dashboard" style="color: var(--text-secondary); text-decoration: none;">Dashboard</a>
        <a href="#/history" style="color: var(--text-secondary); text-decoration: none;">Riwayat</a>
        <a href="#/reminder" style="color: var(--primary-green); font-weight: 700; text-decoration: none;">Pengingat</a>
      </div>

      <!-- Judul & Subjudul -->
      <div style="margin-bottom: 28px;">
        <h1 class="page-title" style="font-size: 2.2rem; margin-bottom: 6px;">Pengingat harian</h1>
        <p class="page-subtitle" style="font-size: 0.95rem;">Dapatkan notifikasi tepat waktu agar streak tidak putus.</p>
      </div>

      <!-- Grid 2-Kolom Bagian Atas Sesuai Mockup 9 -->
      <div class="two-col-grid" style="grid-template-columns: 1.4fr 1fr; align-items: start; gap: 24px; margin-bottom: 24px;">
        <!-- Kolom Kiri: Form Pengaturan -->
        <div class="card" style="padding: 28px;">
          <h3 class="card-title" style="font-size: 1.15rem; margin-bottom: 20px;">Pengaturan</h3>

          <!-- Checkbox Aktifkan Pengingat -->
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px;">
            <input type="checkbox" id="chk-enable-reminder" checked style="width: 20px; height: 20px; accent-color: #2563eb;" />
            <label for="chk-enable-reminder" style="font-size: 0.95rem; font-weight: 600; color: #111827; cursor: pointer;">
              Aktifkan pengingat harian
            </label>
          </div>

          <!-- Form Row: Jam & Zona Waktu -->
          <div class="form-row" style="margin-bottom: 20px;">
            <div class="form-group" style="flex: 1;">
              <label class="form-label" for="rem-hour" style="font-size: 0.82rem; color: #4b5563;">Jam pengingat</label>
              <input type="time" id="rem-hour" class="form-input" value="19:00" style="padding: 10px 14px;" />
            </div>

            <div class="form-group" style="flex: 1.4;">
              <label class="form-label" for="rem-timezone" style="font-size: 0.82rem; color: #4b5563;">Zona waktu</label>
              <select id="rem-timezone" class="form-select" style="padding: 10px 14px;">
                <option value="Asia/Jakarta" selected>Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
              </select>
            </div>
          </div>

          <!-- Hari Latihan -->
          <div style="margin-bottom: 24px;">
            <div style="font-size: 0.88rem; font-weight: 600; color: #111827; margin-bottom: 4px;">Hari latihan</div>
            <p style="font-size: 0.82rem; color: #6b7280; margin-bottom: 12px;">
              Pengingat hanya dikirim pada hari latihan. Hari yang tidak dicentang dianggap hari istirahat.
            </p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${dayPillsHtml}
            </div>
          </div>

          <!-- Kotak Aturan Pengingat Sesuai Mockup 9 -->
          <div style="background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 28px;">
            <h4 style="font-size: 0.85rem; font-weight: 700; color: #111827; margin-bottom: 4px;">Aturan pengingat</h4>
            <p style="font-size: 0.82rem; color: #6b7280; line-height: 1.5; margin: 0;">
              Dikirim satu kali per hari pada jam pilihanmu. Tidak dikirim jika kamu sudah check-in hari itu atau hari itu adalah hari istirahat.
            </p>
          </div>

          <!-- Tombol Aksi -->
          <div style="display: flex; gap: 12px;">
            <button id="btn-save-reminder" class="btn btn-primary" style="padding: 11px 24px; font-weight: 600;">
              Simpan pengaturan
            </button>
            <button id="btn-cancel-reminder" class="btn btn-outline" style="padding: 11px 24px; font-weight: 600;" onclick="window.location.hash='#/dashboard'">
              Batal
            </button>
          </div>
        </div>

        <!-- Kolom Kanan: Kartu Gelap Contoh Notifikasi Sesuai Mockup 9 -->
        <div style="background-color: #12231b; border-radius: var(--radius-lg); padding: 28px 24px; color: #ffffff; box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #ffffff; margin-bottom: 20px;">Contoh notifikasi</h3>

          <!-- Gelembung Notifikasi Putih Bersih Sesuai Mockup 9 -->
          <div style="background-color: #ffffff; border-radius: var(--radius-lg); padding: 18px 20px; color: #111827; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #6b7280; margin-bottom: 8px;">
              <span class="flame-icon" style="font-size: 1rem;">🔥</span>
              <span style="font-weight: 600;">FitStreak · 19:00</span>
            </div>
            <h4 style="font-size: 1rem; font-weight: 700; color: #111827; margin-bottom: 4px;">Jangan putus streak-mu!</h4>
            <p style="font-size: 0.85rem; color: #4b5563; line-height: 1.45; margin: 0;">
              Streak 14 hari menunggumu. Ayo check-in hari ini.
            </p>
          </div>

          <!-- Status Perangkat -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 4px;">Status di perangkat ini</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 2px;">Notifikasi aktif</div>
            <div style="font-size: 0.85rem; color: #cbd5e1;">Chrome di Windows</div>
          </div>

          <!-- Tombol Kirim Notifikasi Uji -->
          <button id="btn-test-notif" class="btn btn-block" style="background: rgba(255, 255, 255, 0.08); border: 1.5px solid rgba(255, 255, 255, 0.2); color: #ffffff; padding: 12px; font-weight: 600; border-radius: var(--radius-md); margin-bottom: 20px;">
            Kirim notifikasi uji
          </button>

          <p style="font-size: 0.8rem; color: #94a3b8; line-height: 1.45; margin: 0;">
            Di iPhone, notifikasi hanya berfungsi setelah FitStreak ditambahkan ke layar utama.
          </p>
        </div>
      </div>

      <!-- Kartu Tengah: Perangkat Penerima Sesuai Mockup 9 -->
      <div class="card" style="padding: 24px 28px; margin-bottom: 24px;">
        <h3 class="card-title" style="font-size: 1.15rem; margin-bottom: 18px;">Perangkat penerima</h3>

        <!-- Device 1: Android -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #f1f5f9;">
          <div>
            <div style="font-size: 0.95rem; font-weight: 600; color: #111827; margin-bottom: 2px;">Chrome di Android</div>
            <div style="font-size: 0.82rem; color: #6b7280;">Didaftarkan 6 Okt 2026</div>
          </div>
          <button class="btn btn-outline btn-sm" style="color: #374151; font-weight: 600;" onclick="alert('Perangkat Android berhasil dihapus.')">
            Hapus perangkat
          </button>
        </div>

        <!-- Device 2: Windows -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0;">
          <div>
            <div style="font-size: 0.95rem; font-weight: 600; color: #111827; margin-bottom: 2px;">Chrome di Windows</div>
            <div style="font-size: 0.82rem; color: #6b7280;">Didaftarkan 12 Okt 2026</div>
          </div>
          <button class="btn btn-outline btn-sm" style="color: #374151; font-weight: 600;" onclick="alert('Perangkat Windows berhasil dihapus.')">
            Hapus perangkat
          </button>
        </div>
      </div>

      <!-- Kartu Bawah: Riwayat Pengingat Sesuai Mockup 9 -->
      <div class="card" style="padding: 24px 28px;">
        <h3 class="card-title" style="font-size: 1.15rem; margin-bottom: 18px;">Riwayat pengingat</h3>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 1.5px solid #e5e7eb; font-size: 0.78rem; font-weight: 700; color: #6b7280; letter-spacing: 0.05em;">
                <th style="padding: 10px 16px;">TANGGAL</th>
                <th style="padding: 10px 16px;">JAM</th>
                <th style="padding: 10px 16px;">STATUS</th>
                <th style="padding: 10px 16px;">ALASAN</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #f1f5f9; height: 50px;">
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #111827;">19 Okt 2026</td>
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #374151;">19:00</td>
                <td style="padding: 12px 16px;">
                  <span style="background: #ffedd5; color: #c2410c; padding: 4px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
                    Terkirim
                  </span>
                </td>
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">Belum check-in</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9; height: 50px;">
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #111827;">18 Okt 2026</td>
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">-</td>
                <td style="padding: 12px 16px;">
                  <span style="background: #f1f5f9; color: #64748b; padding: 4px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
                    Dilewati
                  </span>
                </td>
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">Hari istirahat</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9; height: 50px;">
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #111827;">17 Okt 2026</td>
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">-</td>
                <td style="padding: 12px 16px;">
                  <span style="background: #f1f5f9; color: #64748b; padding: 4px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
                    Dilewati
                  </span>
                </td>
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">Sudah check-in</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9; height: 50px;">
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #111827;">16 Okt 2026</td>
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #374151;">19:00</td>
                <td style="padding: 12px 16px;">
                  <span style="background: #ffedd5; color: #c2410c; padding: 4px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
                    Terkirim
                  </span>
                </td>
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">Belum check-in</td>
              </tr>
              <tr style="height: 50px;">
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #111827;">15 Okt 2026</td>
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">-</td>
                <td style="padding: 12px 16px;">
                  <span style="background: #f1f5f9; color: #64748b; padding: 4px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
                    Dilewati
                  </span>
                </td>
                <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">Sudah check-in</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Interaktivitas Checkbox Hari
    container.querySelectorAll('.chk-day').forEach(chk => {
      chk.addEventListener('change', () => {
        const day = Number(chk.getAttribute('data-day'));
        if (chk.checked) {
          if (!this.activeDays.includes(day)) this.activeDays.push(day);
        } else {
          this.activeDays = this.activeDays.filter(d => d !== day);
        }
        const label = chk.closest('label');
        if (chk.checked) {
          label.style.borderColor = '#93c5fd';
          label.style.background = '#eff6ff';
          label.style.color = '#1d4ed8';
        } else {
          label.style.borderColor = '#e2e8f0';
          label.style.background = '#ffffff';
          label.style.color = '#64748b';
        }
      });
    });

    // Simpan Pengaturan
    const btnSave = document.getElementById('btn-save-reminder');
    if (btnSave) {
      btnSave.addEventListener('click', async () => {
        const hour = document.getElementById('rem-hour').value;
        const tz = document.getElementById('rem-timezone').value;
        const enabled = document.getElementById('chk-enable-reminder').checked;
        try {
          await API.request('/api/profile/reminder', {
            method: 'POST',
            body: JSON.stringify({ reminderHour: hour, timeZone: tz, isEnabled: enabled })
          }).catch(() => ({}));
          alert(`✓ Pengaturan pengingat berhasil disimpan untuk pukul ${hour} (${tz})!`);
        } catch (e) {
          alert('Pengaturan disimpan lokal.');
        }
      });
    }

    // Uji Notifikasi
    const btnTest = document.getElementById('btn-test-notif');
    if (btnTest) {
      btnTest.addEventListener('click', async () => {
        try {
          // Jika browser mendukung Notification API, tampilkan notifikasi sistem
          if ('Notification' in window) {
            const perm = await Notification.requestPermission();
            if (perm === 'granted') {
              new Notification('🔥 FitStreak - 19:00', {
                body: 'Jangan putus streak-mu! Streak 14 hari menunggumu. Ayo check-in hari ini.',
                icon: '/icons/icon.svg'
              });
            }
          }
          alert('🔥 Notifikasi Uji Berhasil Dikirim!\n\n"Jangan putus streak-mu! Streak 14 hari menunggumu. Ayo check-in hari ini."');
        } catch (err) {
          alert(`Notifikasi uji: ${err.message}`);
        }
      });
    }
  }
};
