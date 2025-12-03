const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

// GET /api/foods?query=apple&category=fruit&page=1&pageSize=50
router.get('/', authMiddleware, (req, res) => {
  try {
    const q = (req.query.query || '').trim();
    const category = req.query.category;
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const pageSize = Math.min(200, Math.max(10, parseInt(req.query.pageSize || '50')));
    const offset = (page - 1) * pageSize;

    let params = [];
    let where = '';

    // Search by name
    if (q) {
      where += ' WHERE name LIKE ?';
      params.push('%' + q + '%');
    }

    // Filter by category
    if (category) {
      where += q ? ' AND category = ?' : ' WHERE category = ?';
      params.push(category);
    }

    // COUNT total items
    const countSql = `SELECT COUNT(*) AS cnt FROM food_items ${where}`;
    const countRow = db.prepare(countSql).get(params);
    const total = countRow ? countRow.cnt : 0;

    // Fetch paginated food list
    const listSql = `
      SELECT id, name, calories, protein, carbs, fats, fiber, category
      FROM food_items
      ${where}
      ORDER BY name
      LIMIT ? OFFSET ?
    `;

    const rows = db.prepare(listSql).all(...params, pageSize, offset);

    res.json({
      total,
      page,
      pageSize,
      items: rows
    });

  } catch (err) {
    console.error("foods error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
