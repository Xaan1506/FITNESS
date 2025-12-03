const express = require('express');
const router = express.Router();
const db = require('../db');
const {authMiddleware} = require('../middleware/auth');

const METS = {
  'running': 9.8,
  'cycling': 7.5,
  'yoga': 3,
  'strength': 6,
  'hiit': 10,
  'walking': 3.5
};

router.post('/add', authMiddleware, (req, res) => {
  const uid = req.user.id;
  const {name, duration_min, intensity, exercises, weight_kg} = req.body;
  const met = METS[intensity] || 5;
  const calories = (met * (weight_kg || 70) * (duration_min/60));
  db.run('INSERT INTO workouts (user_id,name,calories_burned,duration_min,intensity,exercises) VALUES (?,?,?,?,?,?)',
    [uid,name,calories,duration_min,intensity,JSON.stringify(exercises||[])], function(err){
      if (err) return res.status(500).json({error: err.message});
      res.json({id: this.lastID, calories});
    }
  );
});

module.exports = router;
