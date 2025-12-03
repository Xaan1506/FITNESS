import React from 'react'
import { motion } from 'framer-motion'

import FoodSearchScreen from './FoodSearchScreen'

export default function Landing({openAuth}){
  const [searchOpen, setSearchOpen] = React.useState(false);
  return (
    <>
    <div className="landing">
      <div className="hero">
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.6}}>
          <h2>Personalized fitness that adapts to you</h2>
          <p className="lead">Track calories, workouts, runs and get auto-generated meal & exercise plans tailored to your body and goals.</p>
          <div style={{marginTop:16}}>
            <button className="btn" onClick={openAuth}>Get started — it's free</button>
            <button className="btn ghost" style={{marginLeft:8}} onClick={()=>setSearchOpen(true)}>Search foods</button>
          </div>
        </motion.div>
      </div>

      <div className="features">
        <div className="feature">
          <h4>Smart Plans</h4>
          <p>Auto personalized daily plans based on BMR, goals & activity.</p>
        </div>
        <div className="feature">
          <h4>Nutrition</h4>
          <p>Meal suggestions, macros, grocery lists and food tracking.</p>
        </div>
        <div className="feature">
          <h4>Movement</h4>
          <p>Running tracking, workout routines, and progress graphs.</p>
        </div>
      </div>
    </div>
    {searchOpen && <FoodSearchScreen onClose={()=>setSearchOpen(false)} />}
    </>
  )
}
