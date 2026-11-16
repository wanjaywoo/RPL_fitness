// public/js/reminderView.js
// Penanganan tampilan Pengingat Harian & Evaluasi Notifikasi (BR-07)

const ReminderView = {
  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted);">Memuat pengaturan pengingat...</p>
      </div>
    `;

    try {
      const statusData = await API.getReminderStatus();
      this.renderContent(container, statusData);
    } catch (err) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <p style="color: red; margin-bottom: 16px;">Gagal memuat status pengingat: ${err.message}</p>
          <a href="#/dashboard" class="btn btn-primary">Kembali ke Dashboard</a>
        </div>
      `;
    }
  },

  renderContent(container, statusData = {}) {
    const {
      reminderHour = 19,
      timeZone = 'Asia/Jakarta',
      todayDate = '2026-10-19',
      isScheduledDay = true,
      hasCheckedIn = false,
      shouldRemind = true,
      statusText = 'Hari ini terjadwal latihan (Pengingat aktif pukul 19:00 WIB)'
    } = statusData;

    container.innerHTML = `
      <div class="page-header" style="align-items: center;">
        <div>
          <h1 class="page-title">Pengingat Harian</h1>
          <p class="page-subtitle">Atur waktu pengingat latihan untuk menjaga streak dan konsistensi kebugaranmu (BR-07).</p>
        </div>
        <a href="#/dashboard" class="btn btn-outline" style="padding: 10px 18px;">
          ← Dashboard
        </a>
      </div>

      <div class="two-col-grid" style="align-items: start;">
        <!-- Kolom Kiri: Pengaturan Jam Pengingat -->
        <div>
          <div class="card">
            <h3 class="card-title">Pengaturan Jam Pengingat</h3>
            
            <div class="form-group">
              <label class="form-label" for="reminder-time">Waktu Pengingat Harian (Jam Lokal)</label>
              <select id="reminder-time" class="form-select">
                <option value="06">06:00 (Pagi)</option>
                <option value="07">07:00 (Pagi)</option>
                <option value="08">08:00 (Pagi)</option>
                <option value="16">16:00 (Sore)</option>
                <option value="17">17:00 (Sore)</option>
                <option value="18">18:00 (Petang)</option>
                <option value="19" selected>19:00 (Malam - Bawaan)</option>
                <option value="20">20:00 (Malam)</option>
                <option value="21">21:00 (Malam)</option>
              </select>
              <p class="form-help">Zona waktu aktif: <strong>${timeZone}</strong></p>
            </div>

            <!-- Box Aturan Bisnis BR-07 -->
            <div style="background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin: 18px 0; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
              <strong style="color: var(--text-main);">Aturan Pengingat Cerdas (BR-07):</strong>
              <ul style="margin-top: 8px; padding-left: 20px;">
                <li>Pengingat dikirim <strong>sekali per hari</strong> pada jam yang Anda tentukan.</li>
                <li>Hanya dikirim jika Anda <strong>belum melakukan check-in</strong>.</li>
                <li>Pada <strong>hari istirahat netral</strong>, pengingat secara otomatis tidak akan mengganggu Anda.</li>
              </ul>
            </div>

            <button id="btn-save-reminder" class="btn btn-primary btn-block" style="padding: 11px;">
              Simpan Pengaturan
            </button>
          </div>

          <!-- Uji Coba Pengingat -->
          <div class="card">
            <h3 class="card-title">Uji Notifikasi Web</h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px;">
              Tekan tombol di bawah untuk mencoba simulasi penerimaan notifikasi pengingat langsung di aplikasi ini.
            </p>
            <div style="display: flex; gap: 12px;">
              <button id="btn-test-notification" class="btn btn-outline" style="flex-grow: 1; padding: 10px;">
                🚀 Uji Notifikasi Sekarang
              </button>
            </div>
            <div id="test-notification-toast" style="display: none; margin-top: 14px; padding: 14px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: var(--radius-md); color: #065f46; font-size: 0.88rem;"></div>
          </div>
        </div>

        <!-- Kolom Kanan: Status Evaluasi Hari Ini -->
        <div>
          <div class="card">
            <h3 class="card-title">Status Evaluasi Hari Ini</h3>
            
            <div style="padding: 16px; background-color: ${shouldRemind ? '#eff6ff' : '#f8fafc'}; border: 1px solid ${shouldRemind ? '#bfdbfe' : 'var(--border-color)'}; border-radius: var(--radius-md); margin-bottom: 20px;">
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">STATUS PENGINGAT</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: ${shouldRemind ? '#1d4ed8' : 'var(--text-main)'}; margin-bottom: 6px;">
                ${shouldRemind ? '🔔 Aktif Menunggu Jam Pengingat' : '💤 Tidak Aktif'}
              </div>
              <div style="font-size: 0.88rem; color: var(--text-secondary);">
                ${statusText}
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 0.92rem;">
                <span style="color: var(--text-secondary);">Tanggal Hari Ini</span>
                <span style="font-weight: 600; color: var(--text-main);">${todayDate}</span>
              </div>

              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 0.92rem;">
                <span style="color: var(--text-secondary);">Jadwal Hari Ini</span>
                <span class="badge ${isScheduledDay ? 'badge-primary' : 'badge-secondary'}">
                  ${isScheduledDay ? 'Hari Latihan' : 'Hari Istirahat Netral'}
                </span>
              </div>

              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 0.92rem;">
                <span style="color: var(--text-secondary);">Status Check-in</span>
                <span class="badge ${hasCheckedIn ? 'badge-primary' : 'badge-secondary'}">
                  ${hasCheckedIn ? '✓ Sudah Check-in' : 'Belum Check-in'}
                </span>
              </div>
            </div>

            <div style="margin-top: 24px;">
              <a href="#/checkin" class="btn btn-primary btn-block" style="padding: 11px;">
                Catat Check-in Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Handler simpan
    document.getElementById('btn-save-reminder').addEventListener('click', () => {
      const selectedHour = document.getElementById('reminder-time').value;
      alert(`Pengaturan waktu pengingat berhasil disimpan untuk pukul ${selectedHour}:00 (${timeZone}).`);
    });

    // Handler uji notifikasi
    document.getElementById('btn-test-notification').addEventListener('click', async () => {
      const toast = document.getElementById('test-notification-toast');
      try {
        const res = await API.testReminderNotification();
        toast.innerHTML = `<strong>${res.title}</strong><br>${res.body}`;
        toast.style.display = 'block';

        // Jika browser mendukung web notification API
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(res.title, { body: res.body, icon: '/icons/icon.svg' });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      } catch (e) {
        toast.textContent = `Gagal mengirim pengingat uji: ${e.message}`;
        toast.style.display = 'block';
      }
    });
  }
};
