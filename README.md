# FitTrack — Personalized Fitness Tracker

This repository is a complete full-stack scaffold for a personalized fitness-tracking website. It includes a React frontend (Vite) and a Node.js/Express backend with SQLite storage and JWT authentication.

Features implemented in this scaffold:
- User authentication (signup/login) with JWT
- Personalization popup after signup/login (3s delay)
- Mifflin–St Jeor based calorie calculations and activity multipliers
- API endpoints for food, workout, run, weight, and plan generation
- Frontend dashboard with cards, charts, progress ring, and personalization flow
- Dark mode toggle

This is a starter implementation. It includes example logic for the AI trainer (rule-based) and sample UI components. You can extend components, add media assets, and plug in real tracking (GPS) or AI services.

Folders:
- `backend/` — Node/Express server
- `frontend/` — React app bootstrapped with Vite

Getting started (local development):

1. Backend

cd backend
npm install
cp .env.example .env   # edit JWT_SECRET if desired
node server.js

2. Frontend

cd frontend
npm install
npm run dev

Open the frontend URL printed by Vite. The frontend talks to the backend at http://localhost:4000 by default.

Design notes, API design, DB schema, personalization flow, and example outputs are in this README below.

---

## API Endpoints (summary)

- POST /api/auth/signup {email,password,name?} -> {user, token}
- POST /api/auth/login {email,password} -> {user, token}
- POST /api/user/personalize (auth) {profile fields} -> {plan}
- GET /api/plan/generate (auth) -> {dailyPlan}
- POST /api/food/add (auth) {foodEntry} -> {saved}
- POST /api/workout/add (auth) {workoutEntry} -> {saved}
- POST /api/run/add (auth) {runEntry} -> {saved}
- POST /api/weight/update (auth) {weight, date} -> {saved}

See backend source files for full request/response shapes.

## Database schema (SQLite)

Tables (created at first run): users, food_logs, workouts, runs, weights, goals, measurements, badges

Key columns:
- users(id, name, email, password_hash, profile JSON, created_at)
- food_logs(id, user_id, name, calories, protein, carbs, fats, fiber, vitamins JSON, portion, created_at)
- workouts(id, user_id, name, calories_burned, duration_min, intensity, exercises JSON, created_at)
- runs(id, user_id, distance_km, duration_min, pace_kmh, calories, created_at)
- weights(id, user_id, weight_kg, recorded_at)

## Personalization flow

1. After signup/login, frontend waits 3 seconds and opens the `PersonalizeModal` asking for: age, gender, height, weight, target weight, body type, activity level, dietary preference, allergies, fitness goals, target body part.
2. Frontend sends these fields to `/api/user/personalize` which saves profile and returns an auto-generated daily plan.
3. The plan includes: calorie target (calculated via Mifflin–St Jeor + activity multiplier), suggested meal plan, suggested workout (daily), running goal, water intake, and a motivational message.

## Calorie & calorie-burn formulas

- BMR (Mifflin–St Jeor):
  - Men: BMR = 10*weight + 6.25*height - 5*age + 5
  - Women: BMR = 10*weight + 6.25*height - 5*age - 161
- Activity multipliers: sedentary 1.2, light 1.375, moderate 1.55, intense 1.725
- Daily calorie target = BMR * activity - (adjustment depending on goal: -500 for fat loss, +300 for muscle gain)
- Calories burned (exercise) = MET * weight_kg * duration_hours; example METs are included per exercise.

## Example daily plan (sample)

Calorie target: 2,100 kcal
Meals: breakfast (Oats + banana) 450 kcal; lunch (Grilled chicken salad) 650 kcal; dinner (Salmon + veg) 600 kcal; snacks & pre/post-workout 400 kcal.
Workout: Upper body strength 45 min — exercises list with sets/reps/rest and estimated calories burned.
Running goal: 5 km at 10 km/h (30 min)
Water intake: 2.5 L
Motivation: "Great start — focus on protein intake today and keep your streak!"

---

For more details, open the source files in `frontend/src` and `backend/`.

Enjoy extending this into a production-ready app.

Viewing mobile layout on a laptop

- Chrome: Open DevTools (Cmd+Option+I), click the device toolbar toggle (Ctrl+Shift+M), choose a mobile device (iPhone 12, Pixel, etc.) and reload if needed. Use responsive sizes and rotate device.
- Safari: Enable Develop -> Enter Responsive Design Mode (Develop > Enter Responsive Design Mode). Choose the device and test touch/emulation.

