// tests/reminder.test.js
// Pengujian unit pengingat harian (TC-21..TC-22, BR-07)
// Aturan: sekali per hari, jam lokal pengguna, hanya jika belum check-in dan bukan hari istirahat.
// Notifier diganti (mock) saat tes menggunakan Dependency Injection.

const reminderService = require('../src/services/reminderService');
const { runReminderOnce } = require('../src/jobs/reminderJob');

describe('ReminderService & Job Pengingat Harian (BR-07)', () => {
  // TC-21: Pengingat dikirim pada hari latihan jika belum check-in
  test('TC-21: Mengirim pengingat jika hari ini hari latihan terjadwal dan belum check-in', async () => {
    // Skenario: Hari Senin (1), terjadwal, belum check-in
    expect(reminderService.shouldSendReminder({
      isScheduledDay: true,
      hasCheckedIn: false
    })).toBe(true);

    // Uji alur lengkap dengan mock notifier (Dependency Injection)
    const mockNotifier = {
      sendNotification: jest.fn().mockResolvedValue(true)
    };

    const mockUsers = [
      { id: 1, name: 'Rizwan', reminder_hour: 19 }
    ];

    const mockCheckinRepo = {
      hasCheckinOnDate: jest.fn().mockReturnValue(false) // Belum check-in
    };

    const mockGoalRepo = {
      findActiveByUserId: jest.fn().mockReturnValue({ workout_days_per_week: 4 }) // Jadwal: Sen, Sel, Kam, Jum (1, 2, 4, 5)
    };

    const result = await reminderService.processDailyReminders({
      users: mockUsers,
      checkinRepository: mockCheckinRepo,
      goalRepository: mockGoalRepo,
      notifier: mockNotifier,
      localDate: '2026-10-19', // Hari Senin
      dayOfWeek: 1,            // Senin (terjadwal)
      currentHour: 19          // Jam 19:00 sesuai preferensi
    });

    expect(result.sent).toBe(1);
    expect(mockNotifier.sendNotification).toHaveBeenCalledTimes(1);
    expect(mockNotifier.sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }),
      expect.objectContaining({ title: expect.stringContaining('Waktunya Latihan') })
    );
  });

  // TC-22: Pengingat TIDAK dikirim jika hari istirahat atau sudah check-in
  test('TC-22: Menolak pengiriman pengingat pada hari istirahat atau jika sudah check-in', async () => {
    // 1. Hari istirahat (tidak terjadwal): TIDAK dikirim
    expect(reminderService.shouldSendReminder({
      isScheduledDay: false,
      hasCheckedIn: false
    })).toBe(false);

    // 2. Hari latihan, tapi SUDAH check-in: TIDAK dikirim
    expect(reminderService.shouldSendReminder({
      isScheduledDay: true,
      hasCheckedIn: true
    })).toBe(false);

    // 3. Hari istirahat dan sudah check-in: TIDAK dikirim
    expect(reminderService.shouldSendReminder({
      isScheduledDay: false,
      hasCheckedIn: true
    })).toBe(false);

    // Uji alur lengkap proses: Pengguna sudah check-in
    const mockNotifier = {
      sendNotification: jest.fn()
    };

    const mockUsers = [
      { id: 1, name: 'Rizwan', reminder_hour: 19 }
    ];

    const mockCheckinRepo = {
      hasCheckinOnDate: jest.fn().mockReturnValue(true) // Sudah check-in!
    };

    const mockGoalRepo = {
      findActiveByUserId: jest.fn().mockReturnValue({ workout_days_per_week: 4 })
    };

    const result = await reminderService.processDailyReminders({
      users: mockUsers,
      checkinRepository: mockCheckinRepo,
      goalRepository: mockGoalRepo,
      notifier: mockNotifier,
      localDate: '2026-10-19',
      dayOfWeek: 1,
      currentHour: 19
    });

    expect(result.sent).toBe(0);
    expect(result.skipped).toBe(1);
    expect(mockNotifier.sendNotification).not.toHaveBeenCalled();
  });
});
