# Personalization Flow

1. User signs up or logs in. Frontend stores JWT token.
2. After 3 seconds the `PersonalizeModal` opens and prompts the user for required fields.
3. On save, frontend calls POST /api/user/personalize with the profile object.
4. Backend stores the profile in users.profile and runs the plan generation logic:
   - Calculates BMR using Mifflin–St Jeor formula
   - Applies activity multiplier
   - Adjusts for goal (fat_loss: -500 kcal, muscle_gain: +300 kcal)
   - Generates simple meal suggestions and a workout template
5. Backend returns a `plan` object containing calorieTarget, meals, workout, runningGoal, water_liters, and message.

The frontend displays the plan on the dashboard and stores profile in client state.
