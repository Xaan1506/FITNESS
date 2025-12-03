import React from "react";
import { FiActivity, FiTrendingUp, FiClock, FiZap } from "react-icons/fi";

export default function WorkoutServices() {
  const services = [
    {
      icon: <FiActivity />,
      title: "Strength Training",
      copy: "Progressive hypertrophy routines tailored to your body type and recovery.",
    },
    {
      icon: <FiTrendingUp />,
      title: "Fat Loss HIIT",
      copy: "High-intensity interval blocks optimized for maximum calorie burn.",
    },
    {
      icon: <FiClock />,
      title: "Endurance Runs",
      copy: "Goal-paced training plans with adaptive mileage and pacing feedback.",
    },
    {
      icon: <FiZap />,
      title: "Mobility & Flex",
      copy: "Low-impact sessions to improve joint range and reduce soreness.",
    }
  ];

  return (
    <section id="workouts" className="features-grid card glassy" style={{marginTop:"60px"}}>
      {services.map((s, i) => (
        <article key={i} className="feature card glassy">
          <div className="feature-icon">{s.icon}</div>
          <h4>{s.title}</h4>
          <p>{s.copy}</p>
        </article>
      ))}
    </section>
  );
}
