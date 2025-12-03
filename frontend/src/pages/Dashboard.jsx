import React, {useEffect, useState} from 'react'
import Api from '../services/api'
import FoodSearchScreen from './FoodSearchScreen'

function Card({title,children}){
  return <div className="card dash-card"><h4>{title}</h4>{children}</div>
}

export default function Dashboard({user}){
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [foodOpen, setFoodOpen] = useState(false);
  useEffect(()=>{
    // reload plan on mount and whenever user's profile changes (after personalization)
    async function load(){
      setError(null);
      try{
        const p = await Api.getPlan();
        setPlan(p);
      }catch(e){
        console.log('plan error', e.message);
        setError(e.message || 'Could not load plan');
        setPlan(null);
      }
    }
    load();
  },[user && user.profile]);

  return (
    <div className="dashboard">
      <div style={{display:'flex',justifyContent:'flex-end',padding:'8px 0'}}>
        <button className="btn" onClick={()=>setFoodOpen(true)}>Add food</button>
      </div>
      <div className="grid">
        <Card title="Today">
          <div className="stat">Calories eaten: <strong>0 kcal</strong></div>
          <div className="stat">Calories burned: <strong>0 kcal</strong></div>
          <div className="stat">Remaining: <strong>{plan ? plan.calorieTarget : '—'} kcal</strong></div>
        </Card>

        <Card title="Workout">
          <div>Today's workout: {plan ? plan.workout?.name || '—' : 'loading...'}</div>
        </Card>

        <Card title="Water">
          <div>Goal: {plan ? plan.water_liters : '—'} L</div>
        </Card>

        <Card title="Run">
          <div>Goal: {plan ? `${plan.runningGoal.distance_km} km @ ${plan.runningGoal.pace_kmh} km/h` : '—'}</div>
        </Card>
      </div>

      <div className="panel">
        <h3>Personalized Plan</h3>
        {error && <div className="error">{error} — check your backend server</div>}
        {!error && !plan && <div>Loading plan… If you just personalized, it may take a moment; open the personalization modal again if needed.</div>}
        {plan && (
          <div>
            <p>Calorie target: <strong>{plan.calorieTarget} kcal</strong> (BMR {plan.bmr})</p>
            <h4>Meals</h4>
            <ul>
              {plan.meals && Object.entries(plan.meals).map(([k,v])=> <li key={k}><strong>{k}</strong>: {v.name} — {v.calories} kcal</li>)}
            </ul>
            <h4>Workout</h4>
            <div>{plan.workout?.name} — {plan.workout?.duration_min} min</div>
            <h4>Motivation</h4>
            <div className="motivation">{plan.message}</div>
          </div>
        )}
      </div>
  {foodOpen && <FoodSearchScreen onClose={()=>setFoodOpen(false)} />}
    </div>
  )
}
