// src/app.js
// Konfigurasi aplikasi Express, middleware, static files, dan routing API

const express = require('express');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const goalRoutes = require('./routes/goalRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const routineRoutes = require('./routes/routineRoutes');
const historyRoutes = require('./routes/historyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware CORS sederhana agar dapat diakses dari browser / Live Server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-user-id');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Melayani berkas statis frontend PWA di folder public/
app.use(express.static(path.join(__dirname, '../public')));

// Mounting API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'FitStreak', version: '1.0.0' });
});

// Middleware penanganan kesalahan
app.use(errorHandler);

module.exports = app;
