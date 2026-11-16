// public/js/app.js
// Router SPA sederhana berbasis URL hash dan pengontrol shell aplikasi FitStreak

const App = {
  init() {
    // Daftarkan Service Worker PWA (NFR-07)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('[FitStreak PWA] Service Worker terdaftar:', reg.scope))
          .catch(err => console.log('[FitStreak PWA] Gagal mendaftarkan Service Worker:', err));
      });
    }

    // Dengarkan perubahan rute URL hash
    window.addEventListener('hashchange', () => this.handleRoute());

    // Tangani aksi logout
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'btn-logout') {
        e.preventDefault();
        API.logout();
        window.location.hash = '#/login';
      }
    });

    // Jalankan rute awal
    this.handleRoute();
  },

  handleRoute() {
    const hash = window.location.hash || '#/dashboard';
    const mainContainer = document.getElementById('main-view');
    const sidebar = document.getElementById('app-sidebar');
    const mobileNav = document.getElementById('mobile-nav');

    // Cek apakah pengguna sudah login
    const token = API.getToken();
    const isAuthRoute = hash === '#/register' || hash === '#/login';

    if (!token && !isAuthRoute) {
      window.location.hash = '#/register';
      return;
    }

    // Sembunyikan sidebar dan mobile nav pada layar register/login
    if (isAuthRoute) {
      if (sidebar) sidebar.style.display = 'none';
      if (mobileNav) mobileNav.style.display = 'none';
      document.body.classList.add('auth-mode');
    } else {
      if (sidebar) sidebar.style.display = window.innerWidth > 900 ? 'flex' : 'none';
      if (mobileNav) mobileNav.style.display = window.innerWidth <= 900 ? 'flex' : 'none';
      document.body.classList.remove('auth-mode');
    }

    // Perbarui status menu aktif di sidebar
    this.updateActiveMenu(hash);

    // Parsing parameter rute dinamis (contoh: #/exercises/1)
    if (hash.startsWith('#/exercises/')) {
      const exerciseId = hash.replace('#/exercises/', '');
      DetailView.render(mainContainer, exerciseId);
      return;
    }

    switch (hash) {
      case '#/register':
        AuthView.renderRegister(mainContainer);
        break;
      case '#/login':
        AuthView.renderLogin(mainContainer);
        break;
      case '#/dashboard':
        DashboardView.render(mainContainer);
        break;
      case '#/checkin':
        CheckinView.render(mainContainer);
        break;
      case '#/catalog':
        CatalogView.render(mainContainer);
        break;
      case '#/routines':
        RoutinesView.render(mainContainer);
        break;
      case '#/history':
        HistoryView.render(mainContainer);
        break;
      case '#/reminder':
        ReminderView.render(mainContainer);
        break;
      default:
        DashboardView.render(mainContainer);
        break;
    }
  },

  updateActiveMenu(hash) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('active');
    });

    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.classList.remove('active');
    });

    let currentSection = 'dashboard';
    if (hash.includes('checkin')) currentSection = 'checkin';
    else if (hash.includes('catalog') || hash.includes('exercises')) currentSection = 'exercises';
    else if (hash.includes('routines')) currentSection = 'routines';
    else if (hash.includes('history')) currentSection = 'history';
    else if (hash.includes('reminder')) currentSection = 'reminder';

    const activeSidebar = document.querySelector(`.sidebar-item[data-page="${currentSection}"]`);
    if (activeSidebar) activeSidebar.classList.add('active');

    const activeMobile = document.querySelector(`.mobile-nav-item[data-page="${currentSection}"]`);
    if (activeMobile) activeMobile.classList.add('active');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
