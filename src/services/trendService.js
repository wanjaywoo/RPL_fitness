// src/services/trendService.js
// Layanan perhitungan tren berat badan menggunakan regresi linier sederhana
// Sesuai dengan BR-12 dan subbab 2.1.13

class TrendService {
  /**
   * Menghitung regresi linier dari data berat badan
   * @param {Array<{ date: string, weight: number }>} weightLogs - Daftar catatan berat badan terurut tanggal
   * @returns {Object} { slope, weeklyChangeKg, intercept, rSquared, count }
   */
  calculateWeightTrend(weightLogs) {
    if (!Array.isArray(weightLogs) || weightLogs.length < 2) {
      return {
        slope: 0,
        weeklyChangeKg: 0,
        intercept: weightLogs && weightLogs.length === 1 ? weightLogs[0].weight : 0,
        rSquared: 0,
        count: weightLogs ? weightLogs.length : 0
      };
    }

    // Urutkan berdasarkan tanggal kronologis
    const sortedLogs = [...weightLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstDate = new Date(sortedLogs[0].date).getTime();

    // x = hari sejak catatan pertama (dalam satuan hari)
    // y = berat badan (kg)
    const points = sortedLogs.map(log => ({
      x: (new Date(log.date).getTime() - firstDate) / (1000 * 60 * 60 * 24),
      y: log.weight
    }));

    const n = points.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (const p of points) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
    }

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) {
      return {
        slope: 0,
        weeklyChangeKg: 0,
        intercept: sumY / n,
        rSquared: 0,
        count: n
      };
    }

    const slope = (n * sumXY - sumX * sumY) / denominator; // perubahan kg per hari
    const intercept = (sumY - slope * sumX) / n;
    const weeklyChangeKg = slope * 7; // perubahan kg per minggu

    // Hitung R-squared
    const meanY = sumY / n;
    let ssTot = 0;
    let ssRes = 0;

    for (const p of points) {
      const yPred = slope * p.x + intercept;
      ssTot += Math.pow(p.y - meanY, 2);
      ssRes += Math.pow(p.y - yPred, 2);
    }

    const rSquared = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);

    return {
      slope: Number(slope.toFixed(4)),
      weeklyChangeKg: Number(weeklyChangeKg.toFixed(3)),
      intercept: Number(intercept.toFixed(2)),
      rSquared: Number(rSquared.toFixed(3)),
      count: n
    };
  }
}

module.exports = new TrendService();
module.exports.TrendService = TrendService;
