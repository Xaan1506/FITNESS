const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// --- CORS ---
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// --- BODY PARSERS ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- PORT ---
const PORT = process.env.PORT || 4000;

// --- ROUTES ---
const db = require('./src/db');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const foodRoutes = require('./src/routes/food');
const workoutRoutes = require('./src/routes/workout');
const runRoutes = require('./src/routes/run');
const foodsRoutes = require('./src/routes/foods');

// API routes must come FIRST
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/run', runRoutes);
app.use('/api/foods', foodsRoutes);

// Simple API check
app.get('/api', (req, res) => {
  res.json({ status: 'FitTrack API OK', time: Date.now() });
});

// --- SERVE FRONTEND (must be LAST) ---
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
