import React from 'react'
import { motion } from 'framer-motion'

import FoodSearchScreen from './FoodSearchScreen'
import Footer from "../components/Footer";

// NEW IMPORTS
import WorkoutServices from "../components/WorkoutServices";
import ContactForm from "../components/ContactForm";

const statHighlights = [
  { label: 'Members coached', value: '78K+' },
  { label: 'Avg. adherence', value: '92%' },
  { label: 'Meals generated', value: '2.3M' },
];

const benefits = [
  {
    title: 'Adaptive macros',
    copy: 'AI plans that rebalance macros every morning based on your logged meals.',
    icon: '🍽️',
  },
  {
    title: 'Movement twins',
    copy: 'Match with workouts from people who share your pace, equipment, and goals.',
    icon: '🏃‍♀️',
  },
  {
    title: 'Recovery radar',
    copy: 'See readiness trends and get proactive nudges when you need to deload.',
    icon: '💤',
  },
  {
    title: 'Groceries on autopilot',
    copy: 'Instant grocery lists mapped to your macros and local store inventory.',
    icon: '🛒',
  },
];

const livePreview = [
  { label: 'Calories today', value: '1,480 kcal', sub: '-12% vs goal' },
  { label: 'Hydration', value: '2.3 L', sub: 'Goal 3.2 L' },
  { label: 'Steps synced', value: '11,204', sub: '+1.4K vs avg' },
];

export default function Landing({openAuth}){
  const [searchOpen, setSearchOpen] = React.useState(false);
  return (
    <>
      <div className="landing">

        {/* HERO SECTION */}
        <section className="hero">
          <motion.div
            className="hero-content card glassy"
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.6}}
          >
            <p className="eyebrow">AI fitness copilot • Human-level personalization</p>
            <h1>Build the healthiest routine you&apos;ll actually keep.</h1>
            <p className="lead">
              FitTrack blends nutrition, workouts, running plans, and recovery signals into one adaptive flow.
              Wake up to a plan that understands your body, not just your calendar.
            </p>
            <div className="cta-row">
              <button className="btn" onClick={openAuth}>Start free</button>
              <button className="btn ghost contrast" onClick={()=>setSearchOpen(true)}>
                Try the food search
              </button>
            </div>
            <div className="stat-row">
              {statHighlights.map(item => (
                <div key={item.label} className="stat-pill">
                  <span>{item.value}</span>
                  <small>{item.label}</small>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hero-preview card glassy"
            initial={{opacity:0, x:40}}
            animate={{opacity:1, x:0}}
            transition={{duration:0.7, delay:0.1}}
          >
            <div className="preview-head">
              <p>Live Coach View</p>
              <span>Auto-sync · 3 min ago</span>
            </div>
            <div className="preview-grid">
              {livePreview.map(item => (
                <div key={item.label} className="preview-card">
                  <p className="preview-label">{item.label}</p>
                  <strong>{item.value}</strong>
                  <span>{item.sub}</span>
                </div>
              ))}
            </div>
            <div className="preview-plan">
              <p>Next up</p>
              <div>
                <strong>30 min Tempo Run</strong>
                <span>Auto-paced • Zone 3 • Guided audio</span>
              </div>
              <button className="btn small ghost contrast">See full plan</button>
            </div>
          </motion.div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section className="experience">
          <div className="experience-card card glassy">
            <div>
              <p className="eyebrow">What changes</p>
              <h3>Plans that evolve with every check-in.</h3>
              <p>
                We recalc your macros, runs, and recovery goals immediately after you log food, complete a workout,
                or personalize your profile. No more weekly spreadsheets.
              </p>
            </div>
            <div className="timeline">
              <div>
                <span>07:12</span>
                <p>Logged oatmeal • macros auto-balanced</p>
              </div>
              <div>
                <span>12:45</span>
                <p>Desk stretch pack unlocked</p>
              </div>
              <div>
                <span>18:30</span>
                <p>Tempo run updated for heat index</p>
              </div>
            </div>
          </div>
          <div className="experience-highlight card glassy">
            <h4>Obsessed with retention</h4>
            <p>Members stay for 9.2 months on average, because their plan stops guessing.</p>
            <div className="badge-grid">
              <div>
                <strong>4.9/5</strong>
                <span>Coach rating</span>
              </div>
              <div>
                <strong>37</strong>
                <span>Micro nudges / week</span>
              </div>
              <div>
                <strong>18%</strong>
                <span>Gain in NEAT</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="features-grid">
          {benefits.map(item => (
            <article key={item.title} className="feature card glassy">
              <div className="feature-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.copy}</p>
            </article>
          ))}
        </section>

        {/* TESTIMONIAL */}
        <section className="testimonial card glassy">
          <div>
            <p className="eyebrow">Coach stories</p>
            <h3>“FitTrack finally made food logging feel like progress instead of punishment.”</h3>
            <p>
              — Mila, run leader who cut 14 minutes off her half marathon while fueling sustainably.
            </p>
          </div>
          <button className="btn ghost contrast" onClick={openAuth}>Meet your plan</button>
        </section>

        {/* ⭐ NEW WORKOUT SERVICES SECTION */}
        <WorkoutServices />

        {/* ⭐ NEW CONTACT FORM SECTION */}
        <ContactForm />

        {/* ⭐ NEW FOOTER SECTION */}
        <Footer />

      </div>

      {searchOpen && <FoodSearchScreen onClose={()=>setSearchOpen(false)} />}
    </>
  )
}
