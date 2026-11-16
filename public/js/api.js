// public/js/api.js
// Pembungkus fetch API untuk mempermudah komunikasi client ke server Express

const API = {
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

    const res = await fetch(endpoint, {
      ...options,
      headers
    });

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

  // Target Adaptif
  async acceptAdaptiveGoal(newTargetCalories) {
    return this.request('/api/goals/accept-adaptive', {
      method: 'POST',
      body: JSON.stringify({ newTargetCalories })
    });
  }
};
