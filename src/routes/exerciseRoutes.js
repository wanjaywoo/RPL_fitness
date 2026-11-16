// src/routes/exerciseRoutes.js
// Endpoint Katalog Gerakan & Detail Gerakan (Mockup Layar 4 & 5)

const express = require('express');
const router = express.Router();
const exerciseRepository = require('../repositories/exerciseRepository');

// GET /api/exercises: Mendapatkan daftar gerakan dengan opsi filter & pencarian
router.get('/', (req, res) => {
  const { category, search } = req.query;

  if (search) {
    const results = exerciseRepository.search(search);
    return res.json(results);
  }

  if (category) {
    const results = exerciseRepository.getByCategory(category);
    return res.json(results);
  }

  const all = exerciseRepository.getAll();
  res.json(all);
});

// GET /api/exercises/:id: Mendapatkan detail satu gerakan beserta instruksi & otot
router.get('/:id', (req, res) => {
  const exercise = exerciseRepository.getById(Number(req.params.id));
  if (!exercise) {
    return res.status(404).json({ error: 'Gerakan tidak ditemukan' });
  }
  res.json(exercise);
});

module.exports = router;
