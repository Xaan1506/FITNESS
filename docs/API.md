# API Design

Base URL: http://localhost:4000

Auth
- POST /api/auth/signup
  - body: {email, password, name?}
  - response: {user: {id,email,name}, token}
- POST /api/auth/login
  - body: {email, password}
  - response: {user, token}

User
- POST /api/user/personalize (auth)
  - body: profile fields (see personalization doc)
  - response: {profile, plan}
- GET /api/user/plan (auth)
  - response: {calorieTarget}

Food
- POST /api/food/add (auth)
  - body: {name, calories, protein, carbs, fats, fiber, vitamins, portion}

Workouts
- POST /api/workout/add (auth)
  - body: {name, duration_min, intensity, exercises, weight_kg}

Runs
- POST /api/run/add (auth)
  - body: {distance_km, duration_min, weight_kg}
