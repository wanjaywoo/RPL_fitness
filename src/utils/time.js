// src/utils/time.js
// Penanganan waktu UTC, konversi ke tanggal lokal, dan penentuan awal minggu (Senin)
// Sesuai dengan BR-05, BR-08, dan TC-19..TC-20

const DEFAULT_TIMEZONE = 'Asia/Jakarta';

/**
 * Mendapatkan tanggal lokal dalam format 'YYYY-MM-DD' dari UTC Date atau ISO string
 * @param {Date|string|number} utcDate
 * @param {string} timeZone
 * @returns {string} 'YYYY-MM-DD'
 */
function getLocalDateString(utcDate = new Date(), timeZone = DEFAULT_TIMEZONE) {
  const date = typeof utcDate === 'string' || typeof utcDate === 'number' ? new Date(utcDate) : utcDate;
  
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  return formatter.format(date); // format 'en-CA' menghasilkan 'YYYY-MM-DD'
}

/**
 * Mendapatkan indeks hari dalam minggu lokal (1 = Senin, 2 = Selasa, ..., 7 = Minggu)
 * @param {string|Date} localDateStr - format 'YYYY-MM-DD' atau Date
 * @param {string} timeZone
 * @returns {number} 1..7 (1 = Senin, 7 = Minggu)
 */
function getDayOfWeek(localDateStr, timeZone = DEFAULT_TIMEZONE) {
  let date;
  if (typeof localDateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(localDateStr)) {
    // Parse sebagai tanggal lokal jam 12:00 siang agar aman dari offset zona
    const [year, month, day] = localDateStr.split('-').map(Number);
    date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  } else {
    date = new Date(localDateStr);
  }

  // Ambil nama hari singkat dalam zona waktu
  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short'
  });
  const dayName = dayFormatter.format(date);

  const dayMap = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7
  };

  return dayMap[dayName] || 1;
}

/**
 * Mendapatkan tanggal awal minggu (Senin) dari suatu tanggal lokal
 * @param {string} localDateStr - format 'YYYY-MM-DD'
 * @returns {string} format 'YYYY-MM-DD' hari Senin
 */
function getStartOfWeekMonday(localDateStr) {
  const dayOfWeek = getDayOfWeek(localDateStr);
  const diffDays = dayOfWeek - 1; // 1 (Senin) -> 0, 2 (Selasa) -> 1, dst.
  return addDays(localDateStr, -diffDays);
}

/**
 * Menambahkan sejumlah hari ke tanggal lokal ('YYYY-MM-DD')
 * @param {string} localDateStr 
 * @param {number} days 
 * @returns {string} 'YYYY-MM-DD'
 */
function addDays(localDateStr, days) {
  const [year, month, day] = localDateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0));
  return date.toISOString().split('T')[0];
}

/**
 * Memeriksa apakah dua tanggal lokal berada pada minggu kalender yang sama (Senin - Minggu)
 * @param {string} date1Str 
 * @param {string} date2Str 
 * @returns {boolean}
 */
function isSameWeekMonday(date1Str, date2Str) {
  return getStartOfWeekMonday(date1Str) === getStartOfWeekMonday(date2Str);
}

/**
 * Menghitung selisih hari antara dua tanggal 'YYYY-MM-DD'
 * @param {string} dateStart 
 * @param {string} dateEnd 
 * @returns {number}
 */
function diffInDays(dateStart, dateEnd) {
  const d1 = new Date(dateStart + 'T00:00:00Z');
  const d2 = new Date(dateEnd + 'T00:00:00Z');
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

module.exports = {
  DEFAULT_TIMEZONE,
  getLocalDateString,
  getDayOfWeek,
  getStartOfWeekMonday,
  addDays,
  isSameWeekMonday,
  diffInDays
};
