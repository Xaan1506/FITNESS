const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const METS = {
  running: 9.8,
  cycling: 7.5,
  yoga: 3,
  strength: 6,
  hiit: 10,
  walking: 3.5
};

router.post('/add', authMiddleware, (req, res) => {
  try {
    const uid = req.user.id;
    const { name, duration_min, intensity, exercises, weight_kg } = req.body;

    if (!name || !duration_min || !intensity) {
      return res.status(400).json({ error: "name, duration_min, and intensity are required" });
    }

    const met = METS[intensity] || 5;
    const calories = met * (weight_kg || 70) * (duration_min / 60);

    const sql = `
      INSERT INTO workouts (user_id, name, calories_burned, duration_min, intensity, exercises)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = db.prepare(sql).run(
      uid,
      name,
      calories,
      duration_min,
      intensity,
      JSON.stringify(exercises || [])
    );

    res.json({
      id: result.lastInsertRowid,
      calories
    });

  } catch (err) {
    console.error("workout/add error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
