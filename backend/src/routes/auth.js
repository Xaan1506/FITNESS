const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// =====================
//     SIGNUP
// =====================
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'email and password required' });

    const trimmedEmail = String(email).trim().toLowerCase();

    // Check if user exists
    const existing = db
      .prepare('SELECT id FROM users WHERE email = ?')
      .get(trimmedEmail);

    if (existing)
      return res
        .status(409)
        .json({ error: 'An account with that email already exists. Try logging in.' });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert user
    const result = db
      .prepare('INSERT INTO users (name, email, password_hash) VALUES (?,?,?)')
      .run(name || null, trimmedEmail, hash);

    const user = { id: result.lastInsertRowid, email: trimmedEmail, name };
    const token = signToken(user);

    res.json({ user, token });

  } catch (e) {
    console.error('signup error:', e);
    res.status(500).json({ error: 'unexpected error' });
  }
});

// =====================
//       LOGIN
// =====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'email and password required' });

    const normalizedEmail = String(email).trim().toLowerCase();

    // Fetch user
    const row = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(normalizedEmail);

    if (!row)
      return res.status(401).json({ error: 'invalid credentials' });

    // Check password
    const ok = await bcrypt.compare(password, row.password_hash);

    if (!ok)
      return res.status(401).json({ error: 'invalid credentials' });

    const user = {
      id: row.id,
      email: row.email,
      name: row.name,
      profile: row.profile ? JSON.parse(row.profile) : null
    };

    const token = signToken(user);

    res.json({ user, token });

  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'unexpected error' });
  }
});

module.exports = router;
