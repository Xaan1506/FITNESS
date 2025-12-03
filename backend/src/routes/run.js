const express = require('express');
const router = express.Router();
const db = require('../db');
const {authMiddleware} = require('../middleware/auth');

router.post('/add', authMiddleware, (req, res) => {
  const uid = req.user.id;
  const {distance_km, duration_min, weight_kg} = req.body;
  const hours = duration_min/60;
  const pace_kmh = distance_km / hours || 0;
  // rough calories: 1 kcal/kg/km * weight * distance
  const calories = (weight_kg || 70) * distance_km * 1;
  db.run('INSERT INTO runs (user_id,distance_km,duration_min,pace_kmh,calories) VALUES (?,?,?,?,?)',
    [uid,distance_km,duration_min,pace_kmh,calories], function(err){
      if (err) return res.status(500).json({error: err.message});
      res.json({id: this.lastID, pace_kmh, calories});
    }
  );
});

module.exports = router;
