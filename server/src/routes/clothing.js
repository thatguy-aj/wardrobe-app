// UC-05 Upload Clothing, UC-06 Search and Filter Clothing
const express = require('express');
const db = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();
router.use(requireAuth);

// POST /api/clothing
router.post('/', async (req, res, next) => {
  try {
    const { name, category, color, size, brand, image_url } = req.body || {};
    if (!name || !category) return res.status(400).json({ error: 'Name and category are required.' });
    const [r] = await db.query(
      'INSERT INTO Clothing (user_id, name, category, color, size, brand, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.user_id, name, category, color || null, size || null, brand || null, image_url || null]
    );
    res.status(201).json({ clothing_id: r.insertId, message: 'Clothing item saved.' });
  } catch (e) { next(e); }
});

// GET /api/clothing?q=shirt&category=Tops&color=blue   (only the logged-in user's items)
router.get('/', async (req, res, next) => {
  try {
    const { q, category, color } = req.query;
    let sql = 'SELECT * FROM Clothing WHERE user_id = ?';
    const params = [req.user.user_id];
    if (q) { sql += ' AND (name LIKE ? OR brand LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
    if (category) { sql += ' AND category = ?'; params.push(category); }
    if (color) { sql += ' AND color = ?'; params.push(color); }
    sql += ' ORDER BY created_at DESC';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (e) { next(e); }
});

// DELETE /api/clothing/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const [r] = await db.query('DELETE FROM Clothing WHERE clothing_id = ? AND user_id = ?', [req.params.id, req.user.user_id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Item not found.' });
    res.json({ message: 'Clothing item removed.' });
  } catch (e) { next(e); }
});

module.exports = router;
