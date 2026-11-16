// src/services/streakService.js
// Layanan pelacakan streak, toleransi hari libur, dan skor konsistensi
// Sesuai dengan BR-04, BR-05, BR-06, BR-08, dan TC-14..TC-18

const {
  getDayOfWeek,
  getStartOfWeekMonday,
  addDays,
  diffInDays
} = require('../utils/time');

class StreakService {
  /**
   * Memvalidasi log latihan untuk check-in yang sah (BR-04)
   * Syarat: minimal 1 sesi latihan dengan durasi 10 - 300 menit
   * @param {Array<{ durationMinutes: number }>} workoutLogs
   * @returns {{ isValid: boolean, reason?: string }}
   */
  validateWorkoutLogs(workoutLogs) {
    if (!Array.isArray(workoutLogs) || workoutLogs.length === 0) {
      return {
        isValid: false,
        reason: 'Minimal harus ada 1 catatan latihan untuk check-in'
      };
    }

    const hasValidSession = workoutLogs.some(
      log => typeof log.durationMinutes === 'number' &&
             log.durationMinutes >= 10 &&
             log.durationMinutes <= 300
    );

    if (!hasValidSession) {
      return {
        isValid: false,
        reason: 'Durasi latihan harus antara 10 hingga 300 menit per sesi (BR-04)'
      };
    }

    return { isValid: true };
  }

  /**
   * Menghitung streak aktif dan rekor streak terbaik
   * Aturan:
   * - Hari istirahat bersifat netral (tidak menambah & tidak memutus)
   * - 1 hari terlewat per minggu (Senin-Minggu) ditoleransi
   * - Hari terlewat kedua dalam minggu yang sama memutus streak (reset ke 0)
   * @param {Object} params
   * @param {Array<string>} params.checkinDates - Daftar tanggal check-in sah ('YYYY-MM-DD')
   * @param {Array<number>} params.scheduledDays - Indeks hari latihan terjadwal (1 = Sen ... 7 = Min)
   * @param {string} params.startDate - Tanggal awal pelacakan ('YYYY-MM-DD')
   * @param {string} params.currentDate - Tanggal evaluasi/hari ini ('YYYY-MM-DD')
   * @returns {{ currentStreak: number, bestStreak: number, missedThisWeek: number }}
   */
  calculateStreak({ checkinDates = [], scheduledDays = [1, 2, 4, 5], startDate, currentDate }) {
    if (!startDate || !currentDate) {
      return { currentStreak: 0, bestStreak: 0, missedThisWeek: 0 };
    }

    const checkinSet = new Set(checkinDates);
    const scheduledSet = new Set(scheduledDays);

    let currentStreak = 0;
    let bestStreak = 0;
    let missedCountThisWeek = 0;
    let currentWeekStart = null;

    let totalDays = diffInDays(startDate, currentDate);
    if (totalDays < 0) return { currentStreak: 0, bestStreak: 0, missedThisWeek: 0 };

    for (let i = 0; i <= totalDays; i++) {
      const thisDate = addDays(startDate, i);
      const weekMonday = getStartOfWeekMonday(thisDate);

      // Jika berpindah minggu kalender, reset toleransi hari terlewat
      if (weekMonday !== currentWeekStart) {
        currentWeekStart = weekMonday;
        missedCountThisWeek = 0;
      }

      const dayOfWeek = getDayOfWeek(thisDate);
      const isScheduled = scheduledSet.has(dayOfWeek);
      const hasCheckedIn = checkinSet.has(thisDate);

      if (hasCheckedIn) {
        // Check-in sah menambah streak
        currentStreak++;
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }
      } else if (isScheduled) {
        // Hari terjadwal tapi tidak check-in
        // Jangan anggap bolos jika hari tersebut adalah 'currentDate' dan pengguna masih punya waktu
        const isToday = thisDate === currentDate;
        if (!isToday) {
          missedCountThisWeek++;
          if (missedCountThisWeek > 1) {
            // Bolos kedua dalam minggu yang sama memutus streak (BR-05)
            currentStreak = 0;
          }
          // Jika missedCountThisWeek === 1, ditoleransi dan streak tidak putus
        }
      } else {
        // Hari istirahat (tidak terjadwal): bersifat netral (BR-05)
      }
    }

    return {
      currentStreak,
      bestStreak,
      missedThisWeek: missedCountThisWeek
    };
  }

  /**
   * Menghitung skor konsistensi (BR-06)
   * Skor = (hari latihan terjadwal yang ada check-in / hari terjadwal yang sudah berakhir) * 100%
   * @param {Object} params
   * @param {Array<string>} params.checkinDates
   * @param {Array<number>} params.scheduledDays
   * @param {string} params.startDate
   * @param {string} params.endDate
   * @returns {number} Persentase konsistensi (0 - 100)
   */
  calculateConsistencyScore({ checkinDates = [], scheduledDays = [1, 2, 4, 5], startDate, endDate }) {
    if (!startDate || !endDate) return 0;

    const checkinSet = new Set(checkinDates);
    const scheduledSet = new Set(scheduledDays);

    let totalScheduledPast = 0;
    let completedScheduled = 0;

    const totalDays = diffInDays(startDate, endDate);
    if (totalDays < 0) return 0;

    for (let i = 0; i <= totalDays; i++) {
      const thisDate = addDays(startDate, i);
      const dayOfWeek = getDayOfWeek(thisDate);

      if (scheduledSet.has(dayOfWeek)) {
        totalScheduledPast++;
        if (checkinSet.has(thisDate)) {
          completedScheduled++;
        }
      }
    }

    if (totalScheduledPast === 0) return 0;
    return Math.round((completedScheduled / totalScheduledPast) * 100);
  }
}

module.exports = new StreakService();
module.exports.StreakService = StreakService;
