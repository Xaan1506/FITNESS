const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({error: 'missing token'});
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({error: 'malformed token'});
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({error: 'invalid token'});
  }
}

module.exports = {authMiddleware};
