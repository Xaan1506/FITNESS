const express = require('express');
const router = express.Router();
const db = require('../db');
const {authMiddleware} = require('../middleware/auth');

router.post('/add', authMiddleware, (req, res) => {
  const uid = req.user.id;
  const {name, calories, protein, carbs, fats, fiber, vitamins, portion} = req.body;
  db.run(
    'INSERT INTO food_logs (user_id,name,calories,protein,carbs,fats,fiber,vitamins,portion) VALUES (?,?,?,?,?,?,?,?,?)',
    [uid,name,calories||0,protein||0,carbs||0,fats||0,fiber||0,JSON.stringify(vitamins||{}),portion||null],
    function(err){
      if (err) return res.status(500).json({error: err.message});
      res.json({id: this.lastID});
    }
  );
});

router.get('/today', authMiddleware, (req, res) => {
  const uid = req.user.id;
  const sql = `
    SELECT id,name,calories,protein,carbs,fats,fiber,vitamins,portion,created_at
    FROM food_logs
    WHERE user_id = ?
      AND DATE(created_at, 'localtime') = DATE('now','localtime')
    ORDER BY created_at DESC
  `;
  db.all(sql, [uid], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    const items = (rows || []).map(row => ({
      id: row.id,
      name: row.name,
      calories: row.calories,
      protein: row.protein,
      carbs: row.carbs,
      fats: row.fats,
      fiber: row.fiber,
      portion: row.portion,
      loggedAt: row.created_at,
      meta: row.vitamins ? JSON.parse(row.vitamins) : {}
    }));
    res.json({items});
  });
});

module.exports = router;
