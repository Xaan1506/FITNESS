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

module.exports = router;
