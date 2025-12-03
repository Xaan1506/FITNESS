const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.post('/add', authMiddleware, (req, res) => {
  try {
    const uid = req.user.id;
    const { distance_km, duration_min, weight_kg } = req.body;

    if (!distance_km || !duration_min) {
      return res.status(400).json({ error: "distance_km and duration_min required" });
    }

    const hours = duration_min / 60;
    const pace_kmh = hours > 0 ? distance_km / hours : 0;

    // Calories burned estimate: 1 kcal/kg/km
    const calories = (weight_kg || 70) * distance_km;

    const sql = `
      INSERT INTO runs (user_id, distance_km, duration_min, pace_kmh, calories)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = db.prepare(sql).run(
      uid,
      distance_km,
      duration_min,
      pace_kmh,
      calories
    );

    res.json({
      id: result.lastInsertRowid,
      pace_kmh,
      calories
    });

  } catch (err) {
    console.error("run/add error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
