// src/services/reminderService.js
// Logika evaluasi pengingat harian (BR-07, TC-21..TC-22)
// Aturan: sekali per hari, jam lokal pengguna, hanya jika belum check-in dan bukan hari istirahat.
// Menerapkan Dependency Injection untuk notifier agar mudah diuji.

class ReminderService {
  /**
   * Menentukan apakah pengingat harus dikirim ke pengguna (BR-07)
   * @param {Object} params
   * @param {boolean} params.isScheduledDay - Apakah hari ini adalah hari latihan terjadwal
   * @param {boolean} params.hasCheckedIn - Apakah pengguna sudah check-in hari ini
   * @returns {boolean}
   */
  shouldSendReminder({ isScheduledDay, hasCheckedIn }) {
    // Pengingat HANYA dikirim jika hari ini hari latihan dan belum check-in
    if (!isScheduledDay) {
      return false; // Hari istirahat netral, jangan kirim pengingat
    }

    if (hasCheckedIn) {
      return false; // Sudah check-in, tidak perlu pengingat
    }

    return true;
  }

  /**
   * Mengevaluasi daftar pengguna dan mengirim notifikasi melalui notifier (DI)
   * @param {Object} params
   * @param {Array<Object>} params.users - Daftar pengguna
   * @param {Object} params.checkinRepository - Repository checkin
   * @param {Object} params.goalRepository - Repository goal
   * @param {Object} params.notifier - Pengirim notifikasi (misal web-push atau mock)
   * @param {string} params.localDate - Tanggal lokal evaluasi ('YYYY-MM-DD')
   * @param {number} params.dayOfWeek - Indeks hari (1 = Sen ... 7 = Min)
   * @param {number} params.currentHour - Jam lokal saat ini (0 - 23)
   * @returns {Promise<{ evaluated: number, sent: number, skipped: number }>}
   */
  async processDailyReminders({
    users = [],
    checkinRepository,
    goalRepository,
    notifier,
    localDate,
    dayOfWeek,
    currentHour = 19
  }) {
    let sentCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const goal = goalRepository ? goalRepository.findActiveByUserId(user.id) : null;
      const scheduledDays = goal && goal.workout_days_per_week === 5 
        ? [1, 2, 3, 4, 5] 
        : [1, 2, 4, 5]; // Default 4 hari: Sen, Sel, Kam, Jum

      const isScheduled = scheduledDays.includes(dayOfWeek);
      const hasCheckedIn = checkinRepository 
        ? checkinRepository.hasCheckinOnDate(user.id, localDate) 
        : false;

      // Jam pengingat preferensi pengguna (default pukul 19.00 sesuai tampilan mockup 2)
      const userReminderHour = user.reminder_hour !== undefined ? user.reminder_hour : 19;

      if (currentHour === userReminderHour && this.shouldSendReminder({ isScheduledDay: isScheduled, hasCheckedIn })) {
        if (notifier && typeof notifier.sendNotification === 'function') {
          await notifier.sendNotification(user, {
            title: '🔥 FitStreak - Waktunya Latihan!',
            body: 'Jaga streak olahragamu hari ini, jangan lupa check-in!'
          });
        }
        sentCount++;
      } else {
        skippedCount++;
      }
    }

    return {
      evaluated: users.length,
      sent: sentCount,
      skipped: skippedCount
    };
  }
}

module.exports = new ReminderService();
module.exports.ReminderService = ReminderService;
