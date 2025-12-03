const express = require('express');
const router = express.Router();
const db = require('../db');
const {authMiddleware} = require('../middleware/auth');
const {promisify} = require('util');

const dbGet = promisify(db.get.bind(db));

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

function dietExclusions(diet){
  if (diet === 'veg') return " AND category NOT IN ('non-veg')";
  if (diet === 'vegan') return " AND category NOT IN ('non-veg','dairy')";
  return '';
}

async function pickFoodFromCategories(categories, diet){
  if (!categories || !categories.length) return null;
  const placeholders = categories.map(()=>'?').join(',');
  const params = categories.slice();
  let sql = `SELECT id,name,calories,protein,carbs,fats,fiber,category FROM food_items WHERE category IN (${placeholders})${dietExclusions(diet)} ORDER BY RANDOM() LIMIT 1`;
  let row = await dbGet(sql, params);
  if (!row){
    row = await dbGet(`SELECT id,name,calories,protein,carbs,fats,fiber,category FROM food_items WHERE 1=1 ${dietExclusions(diet)} ORDER BY RANDOM() LIMIT 1`, []);
  }
  return row;
}

function proteinCategories(diet){
  if (diet === 'vegan') return ['pulse','indian','grain'];
  if (diet === 'veg') return ['pulse','dairy','indian'];
  return ['non-veg','pulse','indian'];
}

async function buildDietPlan(profile, calorieTarget){
  const diet = profile.diet || 'non-veg';
  const blueprints = [
    {slot:'breakfast', label:'Breakfast', share:0.27, groups:[['grain','bread'], ['fruit'], ['dairy','beverage']]},
    {slot:'lunch', label:'Lunch', share:0.3, groups:[['rice','grain','indian'], proteinCategories(diet), ['vegetable']]},
    {slot:'snack', label:'Snack', share:0.13, groups:[['fruit','snack'], ['beverage','dairy']]},
    {slot:'dinner', label:'Dinner', share:0.3, groups:[['grain','bread','rice'], proteinCategories(diet), ['vegetable']]}
  ];

  const macroSplit = {protein:0.3, carbs:0.45, fats:0.25};
  const macros = {
    calories: Math.round(calorieTarget),
    protein_g: Math.round((calorieTarget * macroSplit.protein)/4),
    carbs_g: Math.round((calorieTarget * macroSplit.carbs)/4),
    fats_g: Math.round((calorieTarget * macroSplit.fats)/9)
  };

  const meals = [];
  for (const block of blueprints){
    const picks = [];
    for (const group of block.groups){
      const food = await pickFoodFromCategories(group, diet);
      if (food) picks.push(food);
    }
    if (!picks.length) continue;
    const perItemCalories = (calorieTarget * block.share) / picks.length;
    const items = picks.map(food => {
      const calPer100 = food.calories || 0;
      const grams = calPer100 > 0 ? Math.min(400, Math.max(40, Math.round((perItemCalories / calPer100) * 100))) : 100;
      const scale = grams / 100;
      return {
        name: food.name,
        category: food.category,
        portion_g: grams,
        calories: Math.round((food.calories || 0) * scale),
        protein: Number(((food.protein || 0) * scale).toFixed(1)),
        carbs: Number(((food.carbs || 0) * scale).toFixed(1)),
        fats: Number(((food.fats || 0) * scale).toFixed(1)),
        fiber: Number(((food.fiber || 0) * scale).toFixed(1))
      };
    });
    const totalCalories = items.reduce((sum,item)=>sum + item.calories,0);
    meals.push({slot:block.slot, label:block.label, totalCalories, items});
  }

  return {macros, meals};
}

async function generatePlan(profile={}){
  const weight = Number(profile.currentWeight || profile.weight_kg || profile.weight) || 70;
  const height = Number(profile.height) || 170;
  const age = Number(profile.age) || 28;
  const gender = profile.gender || 'female';
  const activity = profile.activityLevel || 'light';
  const goal = profile.goal || 'stay_fit';
  const dietPlanProfile = {...profile, diet: profile.diet || 'non-veg'};

  const baseBmr = calculateBMR({weight_kg: weight, height_cm: height, age, gender}) || 1500;
  const maintenance = baseBmr * (activityMultipliers[activity] || 1.375);
  let calorieTarget = Math.round(maintenance);
  if (goal === 'fat_loss') calorieTarget = Math.max(1200, Math.round(maintenance - 400));
  if (goal === 'muscle_gain') calorieTarget = Math.round(maintenance + 300);

  const nutrition = await buildDietPlan(dietPlanProfile, calorieTarget);
  const mealsSummary = {};
  nutrition.meals.forEach(meal => {
    mealsSummary[meal.slot] = {
      name: meal.items.map(i=>i.name).join(' + '),
      calories: meal.totalCalories
    };
  });

  const workout = {
    name: goal === 'muscle_gain' ? 'Progressive strength split' : 'Cardio & core mix',
    duration_min: goal === 'muscle_gain' ? 55 : 35,
    focus: goal,
    notes: goal === 'fat_loss' ? 'Intervals + sculpt' : 'Alternate push/pull days'
  };

  return {
    calorieTarget,
    bmr: Math.round(baseBmr),
    macros: nutrition.macros,
    nutrition,
    meals: mealsSummary,
    workout,
    runningGoal: {distance_km: goal === 'stamina' ? 8 : 5, pace_kmh: goal === 'stamina' ? 11 : 9},
    water_liters: goal === 'muscle_gain' ? 3.5 : 2.8,
    message: 'Plan auto-built from your profile and live foods database.'
  };
}

router.post('/personalize', authMiddleware, (req, res) => {
  const uid = req.user.id;
  const profile = req.body || {};
  db.run('UPDATE users SET profile = ? WHERE id = ?', [JSON.stringify(profile), uid], async function(err){
    if (err) return res.status(500).json({error: err.message});
    try{
      const plan = await generatePlan(profile);
      res.json({profile, plan});
    }catch(e){
      console.error(e);
      res.status(500).json({error: 'failed to generate plan'});
    }
  });
});

router.get('/plan', authMiddleware, async (req, res) => {
  try{
    const uid = req.user.id;
    const row = await dbGet('SELECT profile FROM users WHERE id = ?', [uid]);
    if (!row || !row.profile) return res.status(404).json({error: 'no profile'});
    const profile = JSON.parse(row.profile);
    const plan = await generatePlan(profile);
    res.json(plan);
  }catch(err){
    console.error(err);
    res.status(500).json({error: 'could not load plan'});
  }
});

module.exports = router;
