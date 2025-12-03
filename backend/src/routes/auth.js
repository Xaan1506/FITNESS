const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function signToken(user) {
  return jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {expiresIn: '30d'});
}

router.post('/signup', async (req, res) => {
  const {email, password, name} = req.body;
  if (!email || !password) return res.status(400).json({error: 'email and password required'});
  const hash = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)', [name||null,email,hash], function(err) {
    if (err) return res.status(400).json({error: err.message});
    const user = {id: this.lastID, email, name};
    const token = signToken(user);
    res.json({user, token});
  });
});

router.post('/login', (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) return res.status(400).json({error: 'email and password required'});
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    if (!row) return res.status(401).json({error: 'invalid credentials'});
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({error: 'invalid credentials'});
    const user = {id: row.id, email: row.email, name: row.name, profile: row.profile ? JSON.parse(row.profile) : null};
    const token = signToken(user);
    res.json({user, token});
  });
});

module.exports = router;
