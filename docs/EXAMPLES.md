# Example Outputs

Example plan returned after personalization:

{
  "calorieTarget": 2100,
  "bmr": 1600,
  "meals": {
    "breakfast": {"name":"Oats with banana & milk","calories":420},
    "lunch": {"name":"Grilled chicken salad","calories":735},
    "dinner": {"name":"Salmon with veggies","calories":630},
    "snacks": {"name":"Greek yogurt / nuts","calories":315}
  },
  "workout": {"name":"Full body strength","duration_min":50,...},
  "runningGoal": {"distance_km":5,"pace_kmh":10},
  "water_liters":2.5,
  "message":"Welcome! This is your personalized plan. Stay consistent and adjust as needed."
}

UI mockups (textual):
- Dashboard top: cards for calories, burned, remaining, steps, water, sleep, today's workout.
- Center: weekly graphs for calories and runs, progress rings for goal progress.
- Bottom: recommended meals with macros and grocery list export.
