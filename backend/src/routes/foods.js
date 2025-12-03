const express = require('express');
const router = express.Router();
const db = require('../db');
const {authMiddleware} = require('../middleware/auth');

// GET /api/foods?query=apple&category=fruit&page=1&pageSize=50
router.get('/', authMiddleware, (req, res) => {
  const q = (req.query.query || '').trim();
  const category = req.query.category;
  const page = Math.max(1, parseInt(req.query.page || '1'));
  const pageSize = Math.min(200, Math.max(10, parseInt(req.query.pageSize || '50')));
  const offset = (page - 1) * pageSize;

  let params = [];
  let where = '';
  if (q) { where += ' WHERE name LIKE ?'; params.push('%' + q + '%'); }
  if (category) {
    where += q ? ' AND category = ?' : ' WHERE category = ?';
    params.push(category);
  }

  const countSql = `SELECT COUNT(*) as cnt FROM food_items ${where}`;
  db.get(countSql, params, (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    const total = row ? row.cnt : 0;
    const sql = `SELECT id,name,calories,protein,carbs,fats,fiber,category FROM food_items ${where} ORDER BY name LIMIT ? OFFSET ?`;
    db.all(sql, params.concat([pageSize, offset]), (err2, rows) => {
      if (err2) return res.status(500).json({error: err2.message});
      res.json({total, page, pageSize, items: rows});
    });
  });
});

module.exports = router;
