// public/js/api.js
// Pembungkus fetch API untuk mempermudah komunikasi client ke server Express

const API = {
  getBaseUrl() {
    // Jika aplikasi dibuka lewat file:/// atau Live Server (port selain 3000), arahkan ke server backend port 3000
    if (typeof window !== 'undefined') {
      if (window.location.protocol === 'file:' || window.location.port !== '3000') {
        const host = window.location.hostname || 'localhost';
        return `http://${host}:3000`;
      }
    }
    return '';
  },

  getToken() {
    return localStorage.getItem('fitstreak_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('fitstreak_token', token);
    } else {
      localStorage.removeItem('fitstreak_token');
    }
  },

  getUser() {
    const u = localStorage.getItem('fitstreak_user');
    return u ? JSON.parse(u) : null;
  },

  setUser(user) {
    if (user) {
      localStorage.setItem('fitstreak_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fitstreak_user');
    }
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const baseUrl = this.getBaseUrl();
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    let res;
    try {
      res = await fetch(fullUrl, {
        ...options,
        headers
      });
    } catch (networkErr) {
      throw new Error(
        `Gagal terhubung ke server (${networkErr.message}). Pastikan server backend sudah dinyalakan dengan perintah 'npm start' di CMD pada port 3000.`
      );
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `Permintaan gagal (status ${res.status})`);
    }

    return data;
  },

  // Autentikasi
  async login(email, password) {
    const res = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(res.token);
    this.setUser(res.user);
    return res;
  },

  async register(userData) {
    const res = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    this.setToken(res.token);
    this.setUser(res.user);
    return res;
  },

  async getMe() {
    return this.request('/api/auth/me');
  },

  // Profil & Pengaturan Akun
  async getProfile() {
    return this.request('/api/profile');
  },

  async updateProfile(profileData) {
    return this.request('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async logWeight(weightKg, date) {
    return this.request('/api/profile/weight', {
      method: 'POST',
      body: JSON.stringify({ weightKg, date })
    });
  },

  logout() {
    this.setToken(null);
    this.setUser(null);
  },

  // Dashboard
  async getDashboard() {
    return this.request('/api/dashboard');
  },

  // Check-in
  async saveCheckin(checkinData) {
    return this.request('/api/checkins', {
      method: 'POST',
      body: JSON.stringify(checkinData)
    });
  },

  async getCheckinTodayStatus() {
    return this.request('/api/checkins/status-today');
  },

  // Riwayat Lengkap (TUGAS_API_RIWAYAT.md: GET /api/history)
  async getHistory(params = {}) {
    const period = params.period || 30;
    const type = (params.type || 'all').toLowerCase();
    const page = params.page || 1;
    const pageSize = params.pageSize || 8;
    return this.request(`/api/history?period=${period}&type=${type}&page=${page}&pageSize=${pageSize}`);
  },

  // Pengingat Harian (BR-07)
  async getReminderStatus() {
    return this.request('/api/profile/reminder');
  },

  async testReminderNotification() {
    return this.request('/api/profile/reminder/test', {
      method: 'POST'
    });
  },

  // Katalog Gerakan
  async getExercises(category = '', search = '') {
    let url = '/api/exercises';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    return this.request(url);
  },

  async getExerciseById(id) {
    return this.request(`/api/exercises/${id}`);
  },

  // Rutinitas & Rekomendasi
  async getRoutines() {
    return this.request('/api/routines');
  },

  async getRoutineRecommendation() {
    return this.request('/api/routines/recommendation');
  },

  async addExerciseToRoutine(routineId, exerciseId) {
    return this.request(`/api/routines/${routineId}/exercises`, {
      method: 'POST',
      body: JSON.stringify({ exerciseId })
    });
  },

  async deleteRoutine(id) {
    return this.request(`/api/routines/${id}`, {
      method: 'DELETE'
    });
  },

  // Target & Kebugaran
  async getActiveGoal() {
    return this.request('/api/goals/active');
  },

  async updateGoal(goalData) {
    return this.request('/api/goals', {
      method: 'POST',
      body: JSON.stringify(goalData)
    });
  },

  // Target Adaptif
  async acceptAdaptiveGoal(newTargetCalories) {
    return this.request('/api/goals/accept-adaptive', {
      method: 'POST',
      body: JSON.stringify({ newTargetCalories })
    });
  }
};
