const express = require('express');
const router = express.Router();
const db = require('../db');
const {authMiddleware} = require('../middleware/auth');

function calculateBMR({weight_kg, height_cm, age, gender}){
  if (!weight_kg || !height_cm || !age || !gender) return null;
  if (gender === 'male') return 10*weight_kg + 6.25*height_cm - 5*age + 5;
  return 10*weight_kg + 6.25*height_cm - 5*age - 161;
}

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  intense: 1.725
};

router.post('/personalize', authMiddleware, (req, res) => {
  const uid = req.user.id;
  const profile = req.body;
  // store profile
  db.run('UPDATE users SET profile = ? WHERE id = ?', [JSON.stringify(profile), uid], function(err){
    if (err) console.error(err);
  });

  // calculate BMR and targets
  const weight = profile.currentWeight || profile.weight_kg || profile.weight;
  const height = profile.height;
  const age = profile.age;
  const gender = profile.gender || 'female';
  const activity = profile.activityLevel || 'light';
  const goal = profile.goal || 'stay_fit';

  const bmr = calculateBMR({weight_kg: weight, height_cm: height, age, gender});
  const maintenance = bmr * (activityMultipliers[activity] || 1.375);
  let calorieTarget = Math.round(maintenance);
  if (goal === 'fat_loss') calorieTarget = Math.max(1200, Math.round(maintenance - 500));
  if (goal === 'muscle_gain') calorieTarget = Math.round(maintenance + 300);

  // simple meal suggestions
  const meals = {
    breakfast: {name: 'Oats with banana & milk', calories: Math.round(calorieTarget * 0.2), protein: 12},
    lunch: {name: 'Grilled chicken salad', calories: Math.round(calorieTarget * 0.35), protein: 35},
    dinner: {name: 'Salmon with veggies', calories: Math.round(calorieTarget * 0.3), protein: 30},
    snacks: {name: 'Greek yogurt / nuts', calories: Math.round(calorieTarget * 0.15), protein: 10}
  };

  // simple workout suggestion
  const workout = {
    name: goal === 'muscle_gain' ? 'Full body strength' : 'Cardio + Core',
    duration_min: goal === 'muscle_gain' ? 50 : 35,
    exercises: [
      {name: 'Squat', sets: 3, reps: 8, rest_sec: 90},
      {name: 'Push-up', sets: 3, reps: 12, rest_sec: 60},
      {name: 'Plank', sets: 3, reps: 1, rest_sec: 45, duration_sec: 60}
    ]
  };

  const plan = {
    calorieTarget,
    bmr: Math.round(bmr),
    meals,
    workout,
    runningGoal: {distance_km: 5, pace_kmh: 10},
    water_liters: 2.5,
    message: 'Welcome! This is your personalized plan. Stay consistent and adjust as needed.'
  };

  res.json({profile, plan});
});

router.get('/plan', authMiddleware, (req, res) => {
  const uid = req.user.id;
  db.get('SELECT profile FROM users WHERE id = ?', [uid], (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    if (!row || !row.profile) return res.status(404).json({error: 'no profile'});
    const profile = JSON.parse(row.profile);
    // reuse logic from personalize
    const weight = profile.currentWeight || profile.weight_kg || profile.weight;
    const height = profile.height;
    const age = profile.age;
    const gender = profile.gender || 'female';
    const activity = profile.activityLevel || 'light';
    const goal = profile.goal || 'stay_fit';
    const bmr = calculateBMR({weight_kg: weight, height_cm: height, age, gender});
    const maintenance = bmr * (activityMultipliers[activity] || 1.375);
    let calorieTarget = Math.round(maintenance);
    if (goal === 'fat_loss') calorieTarget = Math.max(1200, Math.round(maintenance - 500));
    if (goal === 'muscle_gain') calorieTarget = Math.round(maintenance + 300);
    res.json({calorieTarget});
  });
});

module.exports = router;
