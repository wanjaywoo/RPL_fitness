// src/jobs/reminderJob.js
// Penjadwal notifikasi pengingat harian menggunakan node-cron dan web-push (BR-07)

const cron = require('node-cron');
const webpush = require('web-push');
const reminderService = require('../services/reminderService');
const userRepository = require('../repositories/userRepository');
const checkinRepository = require('../repositories/checkinRepository');
const goalRepository = require('../repositories/goalRepository');
const { getLocalDateString, getDayOfWeek } = require('../utils/time');

// Konfigurasi Web Push jika kunci VAPID tersedia
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@fitstreak.local',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Notifier bawaan menggunakan web-push
const defaultWebPushNotifier = {
  async sendNotification(user, payload) {
    if (user.push_subscription) {
      try {
        const sub = JSON.parse(user.push_subscription);
        await webpush.sendNotification(sub, JSON.stringify(payload));
      } catch (err) {
        console.error(`[WebPush] Gagal mengirim ke user ${user.id}:`, err.message);
      }
    } else {
      // Log simulasi jika pengguna belum subscribe push notification browser
      console.log(`[Pengingat Terkirim ke User ${user.id} (${user.name})]: ${payload.title} - ${payload.body}`);
    }
  }
};

let scheduledTask = null;

/**
 * Menjalankan evaluasi pengingat satu kali (dapat dipanggil manual atau saat cron berdetik)
 */
async function runReminderOnce({
  usersRepo = userRepository,
  checkinsRepo = checkinRepository,
  goalsRepo = goalRepository,
  notifier = defaultWebPushNotifier,
  now = new Date()
} = {}) {
  const users = usersRepo.listAllNonSensitive ? usersRepo.listAllNonSensitive() : [];
  const localDate = getLocalDateString(now, 'Asia/Jakarta');
  const dayOfWeek = getDayOfWeek(localDate, 'Asia/Jakarta');
  const currentHour = now.getHours();

  return reminderService.processDailyReminders({
    users,
    checkinRepository: checkinsRepo,
    goalRepository: goalsRepo,
    notifier,
    localDate,
    dayOfWeek,
    currentHour
  });
}

/**
 * Memulai penjadwal cron setiap awal jam (menit ke-0)
 */
function startReminderJob(options = {}) {
  if (scheduledTask) return scheduledTask;

  // Jalankan setiap jam pada menit ke-0: '0 * * * *'
  scheduledTask = cron.schedule('0 * * * *', async () => {
    try {
      console.log('[Cron Job] Menjalankan pengecekan pengingat harian...');
      const result = await runReminderOnce(options);
      console.log(`[Cron Job Selesai] Evaluasi ${result.evaluated} user, terkirim: ${result.sent}, dilewati: ${result.skipped}`);
    } catch (err) {
      console.error('[Cron Job Error]:', err.message);
    }
  });

  console.log('[FitStreak Job] Penjadwal pengingat harian aktif.');
  return scheduledTask;
}

function stopReminderJob() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('[FitStreak Job] Penjadwal pengingat harian dihentikan.');
  }
}

module.exports = {
  startReminderJob,
  stopReminderJob,
  runReminderOnce,
  defaultWebPushNotifier
};
