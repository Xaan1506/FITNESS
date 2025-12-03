// frontend/src/pages/Workouts.jsx
import React from "react";
import { FiActivity, FiClock, FiTrendingUp } from "react-icons/fi";

export default function Workouts() {
  const workouts = [
    {
      name: "Cardio & Core Mix",
      duration: "35 min",
      intensity: "Medium",
      description: "A balanced mix of cardio bursts and core conditioning.",
    },
    {
      name: "Full Body Strength",
      duration: "45 min",
      intensity: "High",
      description: "Strength circuits designed to increase muscle endurance.",
    },
    {
      name: "Yoga Flow",
      duration: "30 min",
      intensity: "Low",
      description: "Flexibility and mobility focused routine.",
    },
  ];

  return (
    <div className="page workouts-page">
      <header className="workouts-header card glassy">
        <p className="eyebrow">Workout Library</p>
        <h2>Your curated training sessions</h2>
        <p className="muted">Choose from your personalized workout recommendations.</p>
      </header>

      <section className="workout-grid">
        {workouts.map((w, idx) => (
          <div key={idx} className="workout-card card glassy">
            <FiActivity className="w-icon" />

            <h3>{w.name}</h3>
            <p className="muted">{w.description}</p>

            <div className="workout-meta">
              <span><FiClock /> {w.duration}</span>
              <span><FiTrendingUp /> {w.intensity} intensity</span>
            </div>

            <button className="btn small ghost">Start workout</button>
          </div>
        ))}
      </section>
    </div>
  );
}
