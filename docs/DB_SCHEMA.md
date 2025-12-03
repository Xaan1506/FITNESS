# Database Schema

SQLite database `fittrack.db` with tables:

- users(id, name, email, password_hash, profile JSON, created_at)
- food_logs(id, user_id, name, calories, protein, carbs, fats, fiber, vitamins JSON, portion, created_at)
- workouts(id, user_id, name, calories_burned, duration_min, intensity, exercises JSON, created_at)
- runs(id, user_id, distance_km, duration_min, pace_kmh, calories, created_at)
- weights(id, user_id, weight_kg, recorded_at)
- goals(id, user_id, goal JSON, created_at)
- badges(id, user_id, name, awarded_at)

Profile JSON structure (stored in users.profile):
{
  name, age, gender, height, currentWeight, targetWeight, bodyType, activityLevel, diet, allergies, goal, targetBodyPart
}
