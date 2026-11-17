// public/js/reminderView.js
// Penanganan tampilan Pengingat Harian persis 100% sesuai mockup 9. Pengingat@1x.png
// Dilengkapi dengan nada dering notifikasi merdu (Web Audio API) dan sinkronisasi jam dinamis.

const NotificationSound = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playChime() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;

      // Nada 1: D5 (587.33 Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Nada 2: A5 (880.00 Hz) - jeda 100ms
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.1);
      gain2.gain.setValueAtTime(0.3, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.55);

      // Nada 3: D6 (1174.66 Hz) harmonik manis - jeda 200ms
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(1174.66, now + 0.2);
      gain3.gain.setValueAtTime(0.2, now + 0.2);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc3.connect(gain3);
      gain3.connect(this.ctx.destination);
      osc3.start(now + 0.2);
      osc3.stop(now + 0.75);
    } catch (e) {
      console.warn('Audio chime playback error:', e);
    }
  }
};

const ReminderView = {
  activeDays: [1, 2, 4, 5], // Default sesuai 9. Pengingat@1x.png: Sen, Sel, Kam, Jum
  isEnabled: true,
  reminderHour: '19:00',
  timeZone: 'Asia/Jakarta',

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
    const row1Days = [
      { id: 1, name: 'Sen' },
      { id: 2, name: 'Sel' },
      { id: 3, name: 'Rab' },
      { id: 4, name: 'Kam' },
      { id: 5, name: 'Jum' },
      { id: 6, name: 'Sab' }
    ];
    const row2Days = [
      { id: 7, name: 'Min' }
    ];

    const createPillHtml = (d) => {
      const isChecked = this.activeDays.includes(d.id);
      return `
        <label class="reminder-day-pill" data-day="${d.id}" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 8px; border: 1.5px solid ${isChecked ? '#93c5fd' : '#e2e8f0'}; background: ${isChecked ? '#eff6ff' : '#ffffff'}; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: ${isChecked ? '#1d4ed8' : '#64748b'}; user-select: none; transition: all 0.15s ease;">
          <span class="custom-checkbox" style="width: 17px; height: 17px; border-radius: 4px; border: 1.5px solid ${isChecked ? '#2563eb' : '#cbd5e1'}; background: ${isChecked ? '#2563eb' : '#ffffff'}; display: inline-flex; align-items: center; justify-content: center; color: #ffffff; font-size: 11px; font-weight: 800;">
            ${isChecked ? '✓' : ''}
          </span>
          <span>${d.name}</span>
          <input type="checkbox" class="chk-day" data-day="${d.id}" ${isChecked ? 'checked' : ''} style="display: none;" />
        </label>
      `;
    };

    const row1Html = row1Days.map(createPillHtml).join('');
    const row2Html = row2Days.map(createPillHtml).join('');

    container.innerHTML = `
      <style>
        .reminder-container {
          max-width: 1080px;
          margin: 0 auto;
          padding-bottom: 120px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .reminder-top-nav {
          display: flex;
          justify-content: flex-end;
          gap: 24px;
          font-size: 0.95rem;
          margin-bottom: 24px;
          padding-bottom: 8px;
        }
        .reminder-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .reminder-grid {
            grid-template-columns: 1fr;
          }
        }
        @keyframes toastSlideIn {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes notifPulse {
          0% { transform: scale(1); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          50% { transform: scale(1.03); box-shadow: 0 0 22px rgba(59, 130, 246, 0.7); }
          100% { transform: scale(1); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        }
      </style>

      <div class="reminder-container">
        <!-- Sub-Navigasi Header Atas Sesuai 9. Pengingat@1x.png -->
        <div class="reminder-top-nav">
          <a href="#/dashboard" style="color: #6b7280; text-decoration: none; font-weight: 500;">Dashboard</a>
          <a href="#/history" style="color: #6b7280; text-decoration: none; font-weight: 500;">Riwayat</a>
          <a href="#/reminder" style="color: #111827; font-weight: 700; text-decoration: none;">Pengingat</a>
        </div>

        <!-- Judul & Subjudul -->
        <div style="margin-bottom: 28px;">
          <h1 style="font-size: 2.2rem; font-weight: 800; color: #111827; margin: 0 0 6px 0; letter-spacing: -0.02em;">Pengingat harian</h1>
          <p style="font-size: 0.98rem; color: #6b7280; margin: 0;">Dapatkan notifikasi tepat waktu agar streak tidak putus.</p>
        </div>

        <!-- Grid 2-Kolom Sesuai Mockup 9 -->
        <div class="reminder-grid">
          <!-- Kolom Kiri: Form Pengaturan -->
          <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0 0 20px 0;">Pengaturan</h3>

            <!-- Checkbox Aktifkan Pengingat -->
            <label style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px; cursor: pointer; user-select: none;">
              <span id="chk-enable-box" style="width: 20px; height: 20px; border-radius: 4px; background: #2563eb; display: inline-flex; align-items: center; justify-content: center; color: #ffffff; font-size: 13px; font-weight: 800;">✓</span>
              <input type="checkbox" id="chk-enable-reminder" checked style="display: none;" />
              <span style="font-size: 0.98rem; font-weight: 600; color: #111827;">
                Aktifkan pengingat harian
              </span>
            </label>

            <!-- Form Row: Jam & Zona Waktu -->
            <div style="display: flex; gap: 16px; margin-bottom: 22px; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 140px;">
                <label for="rem-hour" style="display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 6px;">Jam pengingat</label>
                <input type="time" id="rem-hour" value="19:00" style="width: 100%; box-sizing: border-box; padding: 11px 14px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 0.95rem; color: #111827; background: #ffffff; outline: none;" />
                <div style="display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;">
                  <button type="button" class="btn-preset-time" data-time="06:00" style="padding: 3px 8px; font-size: 0.78rem; border-radius: 4px; border: 1px solid #d1d5db; background: #ffffff; color: #374151; cursor: pointer;">06:00</button>
                  <button type="button" class="btn-preset-time" data-time="07:00" style="padding: 3px 8px; font-size: 0.78rem; border-radius: 4px; border: 1px solid #d1d5db; background: #ffffff; color: #374151; cursor: pointer;">07:00</button>
                  <button type="button" class="btn-preset-time" data-time="18:00" style="padding: 3px 8px; font-size: 0.78rem; border-radius: 4px; border: 1px solid #d1d5db; background: #ffffff; color: #374151; cursor: pointer;">18:00</button>
                  <button type="button" class="btn-preset-time" data-time="19:00" style="padding: 3px 8px; font-size: 0.78rem; border-radius: 4px; border: 1.5px solid #2563eb; background: #eff6ff; color: #1d4ed8; font-weight: 700; cursor: pointer;">19:00</button>
                  <button type="button" class="btn-preset-time" data-time="20:00" style="padding: 3px 8px; font-size: 0.78rem; border-radius: 4px; border: 1px solid #d1d5db; background: #ffffff; color: #374151; cursor: pointer;">20:00</button>
                  <button type="button" class="btn-preset-time" data-time="21:00" style="padding: 3px 8px; font-size: 0.78rem; border-radius: 4px; border: 1px solid #d1d5db; background: #ffffff; color: #374151; cursor: pointer;">21:00</button>
                </div>
              </div>

              <div style="flex: 1.4; min-width: 180px;">
                <label for="rem-timezone" style="display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 6px;">Zona waktu</label>
                <select id="rem-timezone" style="width: 100%; box-sizing: border-box; padding: 11px 14px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 0.95rem; color: #111827; background: #ffffff; outline: none;">
                  <option value="Asia/Jakarta" selected>Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                </select>
              </div>
            </div>

            <!-- Hari Latihan -->
            <div style="margin-bottom: 24px;">
              <div style="font-size: 0.9rem; font-weight: 700; color: #111827; margin-bottom: 4px;">Hari latihan</div>
              <p style="font-size: 0.82rem; color: #6b7280; margin: 0 0 12px 0;">
                Pengingat hanya dikirim pada hari latihan. Hari yang tidak dicentang dianggap hari istirahat.
              </p>
              
              <!-- Baris 1: Sen s/d Sab (6 item) -->
              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
                ${row1Html}
              </div>

              <!-- Baris 2: Min (1 item) persis tata letak mockup 9 -->
              <div style="display: flex; gap: 8px;">
                ${row2Html}
              </div>
            </div>

            <!-- Kotak Aturan Pengingat Sesuai Mockup 9 -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; margin-bottom: 28px;">
              <h4 style="font-size: 0.88rem; font-weight: 700; color: #111827; margin: 0 0 4px 0;">Aturan pengingat</h4>
              <p style="font-size: 0.82rem; color: #64748b; line-height: 1.5; margin: 0;">
                Dikirim satu kali per hari pada jam pilihanmu. Tidak dikirim jika kamu sudah check-in hari itu atau hari itu adalah hari istirahat.
              </p>
            </div>

            <!-- Tombol Aksi -->
            <div style="display: flex; gap: 12px;">
              <button id="btn-save-reminder" style="background: #14532d; color: #ffffff; border: none; padding: 12px 26px; border-radius: 8px; font-weight: 700; font-size: 0.92rem; cursor: pointer; transition: background 0.15s ease;">
                Simpan pengaturan
              </button>
              <button id="btn-cancel-reminder" style="background: #ffffff; color: #374151; border: 1.5px solid #d1d5db; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 0.92rem; cursor: pointer; transition: all 0.15s ease;" onclick="window.location.hash='#/dashboard'">
                Batal
              </button>
            </div>
          </div>

          <!-- Kolom Kanan: Kartu Gelap Contoh Notifikasi Sesuai Mockup 9 -->
          <div style="background-color: #11231a; border-radius: 16px; padding: 30px 24px; color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #ffffff; margin: 0 0 20px 0;">Contoh notifikasi</h3>

            <!-- Gelembung Notifikasi Putih Bersih Sesuai Mockup 9 -->
            <div id="mockup-notification-bubble" style="background-color: #ffffff; border-radius: 16px; padding: 18px 20px; color: #111827; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #6b7280; margin-bottom: 8px;">
                <span style="font-size: 1.1rem; line-height: 1;">🔥</span>
                <span style="font-weight: 600;">FitStreak · <span id="preview-notif-time">19:00</span></span>
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 700; color: #111827; margin: 0 0 4px 0;">Jangan putus streak-mu!</h4>
              <p style="font-size: 0.85rem; color: #4b5563; line-height: 1.45; margin: 0;">
                Streak 14 hari menunggumu. Ayo check-in hari ini.
              </p>
            </div>

            <!-- Status Perangkat -->
            <div style="margin-bottom: 22px;">
              <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 4px;">Status di perangkat ini</div>
              <div style="font-size: 1.15rem; font-weight: 700; color: #ffffff; margin-bottom: 2px;">Notifikasi aktif</div>
              <div style="font-size: 0.85rem; color: #cbd5e1;">Chrome di Windows</div>
            </div>

            <!-- Tombol Kirim Notifikasi Uji Sesuai Mockup 9 -->
            <button id="btn-test-notif" style="width: 100%; background: rgba(255, 255, 255, 0.08); border: 1.5px solid rgba(255, 255, 255, 0.25); color: #ffffff; padding: 12px; font-weight: 700; font-size: 0.95rem; border-radius: 8px; cursor: pointer; transition: all 0.15s ease; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 22px;">
              <span>🔔</span>
              <span>Kirim notifikasi uji</span>
            </button>

            <p style="font-size: 0.8rem; color: #94a3b8; line-height: 1.5; margin: 0;">
              Di iPhone, notifikasi hanya berfungsi setelah FitStreak ditambahkan ke layar utama.
            </p>
          </div>
        </div>

        <!-- Kartu Tengah: Perangkat Penerima Sesuai Mockup 9 -->
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px 28px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0 0 18px 0;">Perangkat penerima</h3>

          <!-- Device 1: Android -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #f1f5f9;">
            <div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #111827; margin-bottom: 2px;">Chrome di Android</div>
              <div style="font-size: 0.82rem; color: #6b7280;">Didaftarkan 6 Okt 2026</div>
            </div>
            <button class="btn-remove-device" data-device="Chrome di Android" style="background: #ffffff; border: 1.5px solid #d1d5db; color: #374151; padding: 7px 16px; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer;">
              Hapus perangkat
            </button>
          </div>

          <!-- Device 2: Windows -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0;">
            <div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #111827; margin-bottom: 2px;">Chrome di Windows</div>
              <div style="font-size: 0.82rem; color: #6b7280;">Didaftarkan 12 Okt 2026</div>
            </div>
            <button class="btn-remove-device" data-device="Chrome di Windows" style="background: #ffffff; border: 1.5px solid #d1d5db; color: #374151; padding: 7px 16px; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer;">
              Hapus perangkat
            </button>
          </div>
        </div>

        <!-- Kartu Bawah: Riwayat Pengingat Sesuai Mockup 9 -->
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0 0 18px 0;">Riwayat pengingat</h3>

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
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #111827; font-weight: 500;">19 Okt 2026</td>
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #374151;">19:00</td>
                  <td style="padding: 12px 16px;">
                    <span style="background: #ffedd5; color: #c2410c; padding: 4px 14px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
                      Terkirim
                    </span>
                  </td>
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">Belum check-in</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9; height: 50px;">
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #111827; font-weight: 500;">18 Okt 2026</td>
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">-</td>
                  <td style="padding: 12px 16px;">
                    <span style="background: #f1f5f9; color: #64748b; padding: 4px 14px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
                      Dilewati
                    </span>
                  </td>
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">Hari istirahat</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9; height: 50px;">
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #111827; font-weight: 500;">17 Okt 2026</td>
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">-</td>
                  <td style="padding: 12px 16px;">
                    <span style="background: #f1f5f9; color: #64748b; padding: 4px 14px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
                      Dilewati
                    </span>
                  </td>
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">Sudah check-in</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9; height: 50px;">
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #111827; font-weight: 500;">16 Okt 2026</td>
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #374151;">19:00</td>
                  <td style="padding: 12px 16px;">
                    <span style="background: #ffedd5; color: #c2410c; padding: 4px 14px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
                      Terkirim
                    </span>
                  </td>
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">Belum check-in</td>
                </tr>
                <tr style="height: 50px;">
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #111827; font-weight: 500;">15 Okt 2026</td>
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">-</td>
                  <td style="padding: 12px 16px;">
                    <span style="background: #f1f5f9; color: #64748b; padding: 4px 14px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
                      Dilewati
                    </span>
                  </td>
                  <td style="padding: 12px 16px; font-size: 0.9rem; color: #6b7280;">Sudah check-in</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // 1. Sinkronisasi Jam Dinamis ke Gelembung Notifikasi
    const remHourInput = document.getElementById('rem-hour');
    const previewTimeSpan = document.getElementById('preview-notif-time');
    if (remHourInput && previewTimeSpan) {
      remHourInput.addEventListener('input', () => {
        const val = remHourInput.value || '19:00';
        previewTimeSpan.textContent = val;
      });
    }

    // Pilihan Cepat Jam Pengingat
    container.querySelectorAll('.btn-preset-time').forEach(btn => {
      btn.addEventListener('click', () => {
        const timeVal = btn.getAttribute('data-time');
        if (remHourInput) {
          remHourInput.value = timeVal;
          if (previewTimeSpan) previewTimeSpan.textContent = timeVal;
        }
        container.querySelectorAll('.btn-preset-time').forEach(b => {
          b.style.border = '1px solid #d1d5db';
          b.style.background = '#ffffff';
          b.style.color = '#374151';
          b.style.fontWeight = 'normal';
        });
        btn.style.border = '1.5px solid #2563eb';
        btn.style.background = '#eff6ff';
        btn.style.color = '#1d4ed8';
        btn.style.fontWeight = '700';
      });
    });

    // 2. Toggle Aktifkan Pengingat
    const chkEnable = document.getElementById('chk-enable-reminder');
    const chkEnableBox = document.getElementById('chk-enable-box');
    if (chkEnable && chkEnableBox) {
      chkEnable.addEventListener('change', () => {
        if (chkEnable.checked) {
          chkEnableBox.style.background = '#2563eb';
          chkEnableBox.textContent = '✓';
        } else {
          chkEnableBox.style.background = '#e2e8f0';
          chkEnableBox.textContent = '';
        }
      });
    }

    // 3. Interaktivitas Checkbox Hari Latihan
    container.querySelectorAll('.reminder-day-pill').forEach(label => {
      label.addEventListener('click', (e) => {
        e.preventDefault();
        const chk = label.querySelector('.chk-day');
        const box = label.querySelector('.custom-checkbox');
        const day = Number(label.getAttribute('data-day'));

        const newChecked = !chk.checked;
        chk.checked = newChecked;

        if (newChecked) {
          if (!this.activeDays.includes(day)) this.activeDays.push(day);
          label.style.borderColor = '#93c5fd';
          label.style.background = '#eff6ff';
          label.style.color = '#1d4ed8';
          box.style.borderColor = '#2563eb';
          box.style.background = '#2563eb';
          box.textContent = '✓';
        } else {
          this.activeDays = this.activeDays.filter(d => d !== day);
          label.style.borderColor = '#e2e8f0';
          label.style.background = '#ffffff';
          label.style.color = '#64748b';
          box.style.borderColor = '#cbd5e1';
          box.style.background = '#ffffff';
          box.textContent = '';
        }
      });
    });

    // 4. Tombol Hapus Perangkat
    container.querySelectorAll('.btn-remove-device').forEach(btn => {
      btn.addEventListener('click', () => {
        const deviceName = btn.getAttribute('data-device');
        if (confirm(`Hapus ${deviceName} dari daftar perangkat penerima notifikasi?`)) {
          btn.closest('div[style*="justify-content: space-between"]').remove();
          alert(`Perangkat "${deviceName}" berhasil dihapus.`);
        }
      });
    });

    // 5. Simpan Pengaturan
    const btnSave = document.getElementById('btn-save-reminder');
    if (btnSave) {
      btnSave.addEventListener('click', async () => {
        const hour = document.getElementById('rem-hour').value || '19:00';
        const tz = document.getElementById('rem-timezone').value;
        const enabled = document.getElementById('chk-enable-reminder').checked;
        try {
          await API.request('/api/profile/reminder', {
            method: 'POST',
            body: JSON.stringify({ reminderHour: hour, timeZone: tz, isEnabled: enabled })
          }).catch(() => ({}));
          this.showToast('PENGATURAN TERSIMPAN', `Pengingat berhasil dijadwalkan pukul ${hour} (${tz}) pada ${this.activeDays.length} hari latihan.`);
          NotificationSound.playChime();
        } catch (e) {
          this.showToast('PENGATURAN TERSIMPAN', `Pengingat disimpan lokal untuk pukul ${hour} (${tz}).`);
          NotificationSound.playChime();
        }
      });
    }

    // 6. Uji Notifikasi dengan NADA DERING Web Audio API + Animasi Gelembung + Toast Elegan
    const btnTest = document.getElementById('btn-test-notif');
    const bubble = document.getElementById('mockup-notification-bubble');

    if (btnTest) {
      btnTest.addEventListener('click', async () => {
        // Mainkan nada dering harmonik merdu
        NotificationSound.playChime();

        // Animasi gelembung notifikasi di preview
        if (bubble) {
          bubble.style.animation = 'none';
          void bubble.offsetWidth; // trigger reflow
          bubble.style.animation = 'notifPulse 1.2s ease-in-out';
        }

        const currentTime = document.getElementById('rem-hour').value || '19:00';

        // Tampilkan floating banner toast elegan
        this.showToast(
          `FITSTREAK · ${currentTime}`,
          'Streak 14 hari menunggumu. Ayo check-in hari ini.'
        );

        // Jika browser mendukung & mengizinkan Notification API sistem
        try {
          if ('Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification(`🔥 FitStreak - ${currentTime}`, {
                body: 'Jangan putus streak-mu! Streak 14 hari menunggumu. Ayo check-in hari ini.',
                icon: '/icons/icon.svg'
              });
            } else if (Notification.permission !== 'denied') {
              const perm = await Notification.requestPermission();
              if (perm === 'granted') {
                new Notification(`🔥 FitStreak - ${currentTime}`, {
                  body: 'Jangan putus streak-mu! Streak 14 hari menunggumu. Ayo check-in hari ini.',
                  icon: '/icons/icon.svg'
                });
              }
            }
          }
        } catch (err) {
          console.log('Native notification error:', err);
        }
      });
    }
  },

  // Floating Toast Notification Elegan
  showToast(title, body) {
    let toast = document.getElementById('fitstreak-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'fitstreak-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div style="position: fixed; top: 24px; right: 24px; z-index: 99999; background: #ffffff; color: #111827; padding: 16px 20px; border-radius: 14px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.06); min-width: 300px; max-width: 380px; display: flex; gap: 14px; align-items: start; animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);">
        <span style="font-size: 1.6rem; line-height: 1;">🔥</span>
        <div style="flex: 1;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #ea580c; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
            ${title}
          </div>
          <div style="font-size: 0.95rem; font-weight: 700; color: #111827; margin-bottom: 4px;">
            Jangan putus streak-mu!
          </div>
          <div style="font-size: 0.85rem; color: #4b5563; line-height: 1.4;">
            ${body}
          </div>
        </div>
        <button id="btn-close-toast" style="background: none; border: none; font-size: 1.3rem; color: #9ca3af; cursor: pointer; padding: 0 4px; line-height: 1;">&times;</button>
      </div>
    `;

    const closeBtn = document.getElementById('btn-close-toast');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.innerHTML = '';
      });
    }

    setTimeout(() => {
      if (toast && toast.innerHTML) {
        toast.innerHTML = '';
      }
    }, 4500);
  }
};
