const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

const db = require('./src/db');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const foodRoutes = require('./src/routes/food');
const workoutRoutes = require('./src/routes/workout');
const runRoutes = require('./src/routes/run');
const foodsRoutes = require('./src/routes/foods');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/run', runRoutes);
app.use('/api/foods', foodsRoutes);

app.get('/', (req, res) => {
  res.json({status: 'FitTrack API', time: Date.now()});
});

// Serve the built frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
