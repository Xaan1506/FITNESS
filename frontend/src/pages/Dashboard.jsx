import React, {useCallback, useEffect, useMemo, useState} from 'react'
import Api from '../services/api'
import FoodSearchScreen from './FoodSearchScreen'
import FoodIcon from '../components/FoodIcon'
import { FiDroplet, FiActivity, FiTrendingUp, FiCoffee } from 'react-icons/fi'

function Metric({label,value,progress=0}){
  return (
    <div className="insight-card">
      <p className="metric-label">{label}</p>
      <div className="metric-value">{value}</div>
      <div className="metric-bar">
        <span style={{width:`${Math.min(progress,1)*100}%`}} />
      </div>
    </div>
  )
}

function MealCard({meal}){
  const time = useMemo(()=>{
    if (!meal?.loggedAt) return 'Not logged';
    return new Intl.DateTimeFormat('en', {hour:'numeric', minute:'2-digit'}).format(new Date(meal.loggedAt));
  },[meal?.loggedAt]);
  const foods = meal?.foods && meal.foods.length ? meal.foods : [{name: meal?.name, category: meal?.category}];

  return (
    <article className="meal-card card glassy">
      <header className="meal-card-head">
        <div className="meal-card-info">
          <div className="meal-icon-row">
            {foods.slice(0,3).map((food,idx)=> (
              <div key={food.name + idx} className="meal-icon">
                <FoodIcon category={food.category} size={32} />
              </div>
            ))}
          </div>
          <div>
            <p className="eyebrow">{meal?.name || 'Meal'}</p>
            <h4>{meal?.label || meal?.name || 'Logged meal'}</h4>
            <small className="muted">Logged at {time}</small>
          </div>
        </div>
        <div className="health-chip">
          <span>Health score</span>
          <strong>{meal?.healthScore ?? '—'}</strong>
        </div>
      </header>
      <div className="macro-grid">
        <span>Calories <strong>{meal?.calories ?? 0} kcal</strong></span>
        <span>Protein <strong>{meal?.protein ?? 0} g</strong></span>
        <span>Carbs <strong>{meal?.carbs ?? 0} g</strong></span>
        <span>Fats <strong>{meal?.fats ?? 0} g</strong></span>
        <span>Fiber <strong>{meal?.fiber ?? 0} g</strong></span>
      </div>
      {meal?.fitSummary && <p className="muted">{meal.fitSummary}</p>}
      {meal?.alternatives?.length > 0 && (
        <ul className="alt-list">
          {meal.alternatives.map(alt => <li key={alt}>{alt}</li>)}
        </ul>
      )}
      <footer>
        <button className="btn ghost small">View details</button>
      </footer>
    </article>
  )
}

export default function Dashboard({user}){
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [foodOpen, setFoodOpen] = useState(false);
  const [foodQuery, setFoodQuery] = useState('');
  const [foodCategory, setFoodCategory] = useState('fruit');
  const [foodResults, setFoodResults] = useState([]);
  const [searchMsg, setSearchMsg] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [stats, setStats] = useState({calories:0, hydration:0, steps:0, mealsLogged:0});
  const [mealsToday, setMealsToday] = useState([]);
  const [mealsLoading, setMealsLoading] = useState(false);

  const targets = useMemo(()=>({
    calories: plan?.calorieTarget || 2000,
    protein: plan?.macros?.protein_g || 90,
    carbs: plan?.macros?.carbs_g || 220,
    fats: plan?.macros?.fats_g || 70,
    fiber: 30
  }), [plan]);

  const computeHealthScore = useCallback((meal)=>{
    if (!meal) return 0;
    const safe = (val)=> Number(val) || 0;
    const proteinRatio = Math.min((safe(meal.protein) / targets.protein) || 0, 1.3);
    const fiberRatio = Math.min((safe(meal.fiber) / targets.fiber) || 0, 1.3);
    const carbRatio = (safe(meal.carbs) / targets.carbs) || 0;
    const fatRatio = (safe(meal.fats) / targets.fats) || 0;
    const carbPenalty = Math.abs(carbRatio - 1);
    const fatPenalty = Math.abs(fatRatio - 1);
    const processedPenalty = meal.category && ['snack','fast food','fast_food'].includes(meal.category?.toLowerCase?.() || '') ? 0.15 : 0;
    const score = (60 * ((proteinRatio + fiberRatio) / 2)) + (20 * (1 - 0.5 * carbPenalty)) + (10 * (1 - 0.5 * fatPenalty)) - processedPenalty * 100;
    return Math.round(Math.min(100, Math.max(0, score)));
  }, [targets]);

  const describeFit = useCallback((meal)=>{
    if (!meal) return '';
    const calPct = targets.calories ? Math.round((meal.calories / targets.calories) * 100) : 0;
    const proteinPct = targets.protein ? Math.round((meal.protein / targets.protein) * 100) : 0;
    return `Adds ${isNaN(calPct)?0:calPct}% of calories and ${isNaN(proteinPct)?0:proteinPct}% of protein target.`;
  }, [targets]);

  const suggestAlternatives = useCallback((meal)=>{
    if (!meal) return [];
    const suggestions = [];
    if ((meal.fiber || 0) < 4){
      suggestions.push('Add leafy greens or berries to lift fiber.');
    }
    if ((meal.protein || 0) < targets.protein * 0.15){
      suggestions.push('Include Greek yogurt, tofu, or eggs for more protein.');
    }
    if ((meal.fats || 0) > targets.fats * 0.35){
      suggestions.push('Swap creamy toppings for lean protein or nuts.');
    }
    return suggestions.slice(0,2);
  }, [targets]);

  const transformMeal = useCallback((entry)=>{
    const category = entry.meta?.category || entry.category || '';
    const base = {...entry, category};
    return {
      ...base,
      healthScore: computeHealthScore(base),
      fitSummary: describeFit(base),
      alternatives: suggestAlternatives(base),
      foods: [{name: base.name, category}]
    };
  }, [computeHealthScore, describeFit, suggestAlternatives]);

  const loadMeals = useCallback(async ()=>{
    setMealsLoading(true);
    try{
      const res = await Api.getMealsToday();
      const mapped = (res.items || []).map(transformMeal);
      setMealsToday(mapped);
      const totalCalories = mapped.reduce((sum,meal)=> sum + (meal.calories || 0), 0);
      setStats(prev => ({...prev, calories: Math.round(totalCalories), mealsLogged: mapped.length}));
    }catch(err){
      console.error('meals load error', err);
    }
    setMealsLoading(false);
  }, [transformMeal]);

  const handleMealLogged = useCallback(()=>{
    setFoodOpen(false);
    loadMeals();
  }, [loadMeals]);

  const handleHydrationAdd = (amount) => {
    setStats(prev => {
      const nextHydration = +(prev.hydration + amount).toFixed(2);
      return {...prev, hydration: nextHydration};
    });
  };

  useEffect(()=>{
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

  useEffect(()=>{
    loadMeals();
  },[loadMeals]);

  useEffect(()=>{
    const timeout = setTimeout(()=>{
      fetchFoods();
    }, 300);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[foodQuery, foodCategory]);

  async function fetchFoods(){
    setSearchLoading(true);
    try{
      const res = await Api.searchFoods(foodQuery, foodCategory || null, 1, 6);
      setFoodResults(res.items || []);
      setSearchMsg((res.items && res.items.length) ? '' : 'No foods found');
    }catch(e){
      setSearchMsg(e.message);
      setFoodResults([]);
    }
    setSearchLoading(false);
  }

  const metrics = [
    {
      label: 'Calorie target',
      value: plan ? `${plan.calorieTarget} kcal` : 'Syncing…',
      progress: plan ? 0.62 : 0.2,
    },
    {
      label: 'Water goal',
      value: plan ? `${plan.water_liters} L` : '—',
      progress: plan ? Math.min((plan.water_liters || 0) / 3.5, 1) : 0,
    },
    {
      label: 'Run distance',
      value: plan?.runningGoal ? `${plan.runningGoal.distance_km} km` : '—',
      progress: plan?.runningGoal ? Math.min(plan.runningGoal.distance_km / 10, 1) : 0,
    },
    {
      label: 'Workout load',
      value: plan?.workout?.name || 'Auto-selecting…',
      progress: plan?.workout ? 0.78 : 0.15,
    },
  ];

  const suggestions = plan?.nutrition?.meals || [];
  const nextMeal = suggestions[0];
  const hydrationGoal = plan?.water_liters || 3;
  const hydrationProgress = hydrationGoal ? Math.min(stats.hydration / hydrationGoal, 1) : 0;

  return (
    <div className="dashboard">
      <div className="today-card card glassy">
        <div>
          <p className="eyebrow">Today&apos;s Flow</p>
          <h2>Hey {user?.name?.split(' ')[0] || 'athlete'}, here&apos;s your next best action.</h2>
          <p className="muted">
            We prioritize the next step based on your last log, recovery window, and upcoming events.
            Keep the streak alive with one tap.
          </p>
        </div>
        <div className="today-actions">
          <button className="btn small" onClick={()=>setFoodOpen(true)}>Add food</button>
        </div>
      </div>

      <section className="stat-grid">
        <div className="stat-card">
          <FiTrendingUp className="stat-icon" />
          <div>
            <p>Calories consumed</p>
            <h3>{stats.calories} kcal</h3>
            <small className="muted">Target {plan?.calorieTarget || '—'} kcal</small>
          </div>
        </div>
        <div className="stat-card">
          <FiDroplet className="stat-icon" />
          <div>
            <p>Hydration</p>
            <h3>{stats.hydration.toFixed(2)} L</h3>
            <small className="muted">Goal {hydrationGoal} L</small>
          </div>
        </div>
        <div className="stat-card">
          <FiActivity className="stat-icon" />
          <div>
            <p>Steps</p>
            <h3>{stats.steps}</h3>
            <small className="muted">Sync device to update</small>
          </div>
        </div>
        <div className="stat-card">
          <FiCoffee className="stat-icon" />
          <div>
            <p>Meals logged</p>
            <h3>{stats.mealsLogged}</h3>
            <small className="muted">Start with your first meal</small>
          </div>
        </div>
      </section>

      <section className="hydration-card card glassy">
        <div className="hydration-head">
          <FiDroplet />
          <div>
            <p className="eyebrow">Hydration</p>
            <h4>{stats.hydration.toFixed(2)} L / {hydrationGoal} L</h4>
            <small className="muted">{Math.round(hydrationProgress * 100)}% of daily target</small>
          </div>
        </div>
        <div className="hydration-bar">
          <span style={{width:`${hydrationProgress*100}%`}} />
        </div>
        <div className="hydration-actions">
          {[0.25,0.5,1].map(amount=>(
            <button key={amount} className="btn ghost small" onClick={()=>handleHydrationAdd(amount)}>+{amount} L</button>
          ))}
        </div>
      </section>

      <div className="insight-grid">
        {metrics.map(m => (
          <Metric key={m.label} label={m.label} value={m.value} progress={m.progress} />
        ))}
      </div>

      <div className="grid">
        <div className="card dash-card">
          <h4>Energy balance</h4>
          <div className="stat">Calories eaten: <strong>0 kcal</strong></div>
          <div className="stat">Calories burned: <strong>0 kcal</strong></div>
          <div className="stat">Remaining: <strong>{plan ? `${plan.calorieTarget} kcal` : '—'}</strong></div>
        </div>

        <div className="card dash-card">
          <h4>Workout</h4>
          <div>{plan ? plan.workout?.name || '—' : 'Loading workout…'}</div>
          {plan?.workout?.duration_min && (
            <p className="muted">{plan.workout.duration_min} min • curated for your goal</p>
          )}
        </div>

        <div className="card dash-card">
          <h4>Hydration</h4>
          <div>Goal: {plan ? `${plan.water_liters} L` : '—'}</div>
          <p className="muted">Break it into 4 check-ins throughout the day.</p>
        </div>

        <div className="card dash-card">
          <h4>Run</h4>
          {plan?.runningGoal ? (
            <div>Goal: {`${plan.runningGoal.distance_km} km @ ${plan.runningGoal.pace_kmh} km/h`}</div>
          ) : (
            <div>Link your run profile to unlock pacing tips.</div>
          )}
        </div>
      </div>

      <div className="panel">
        <h3>Personalized Plan</h3>
        {error && <div className="error">{error} — check your backend server</div>}
        {!error && !plan && <div>Loading plan… If you just personalized, it may take a moment; open the personalization modal again if needed.</div>}
        {plan && (
          <div className="plan-details">
            <p>Calorie target: <strong>{plan.calorieTarget} kcal</strong> (BMR {plan.bmr})</p>
            <div className="macro-row">
              <div><span>Protein</span><strong>{plan.macros?.protein_g || '—'} g</strong></div>
              <div><span>Carbs</span><strong>{plan.macros?.carbs_g || '—'} g</strong></div>
              <div><span>Fats</span><strong>{plan.macros?.fats_g || '—'} g</strong></div>
            </div>
            <div className="plan-grid">
              <div>
                <h4>Daily meals</h4>
                <div className="diet-grid">
                  {plan.nutrition?.meals?.map(meal => (
                    <div key={meal.slot} className="diet-card">
                      <div className="diet-head">
                        <span>{meal.label}</span>
                        <strong>{meal.totalCalories} kcal</strong>
                      </div>
                      <ul className="diet-items">
                        {meal.items.map(item => (
                          <li key={item.name}>
                            <strong>{item.name}</strong>
                            <span>{item.portion_g} g • P {item.protein}g • C {item.carbs}g • F {item.fats}g</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4>Workout</h4>
                <div>{plan.workout?.name} — {plan.workout?.duration_min} min</div>
                <p className="muted">{plan.workout?.notes}</p>
                <h4 style={{marginTop:16}}>Motivation</h4>
                <div className="motivation">{plan.message}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="meal-log card glassy">
        <header className="meal-log-head">
          <div>
            <p className="eyebrow">Meals today</p>
            <h4>{stats.mealsLogged === 0 ? 'Log your first meal' : 'Meals you logged'}</h4>
          </div>
          <button className="btn small" onClick={()=>setFoodOpen(true)}>Log meal</button>
        </header>
        {mealsLoading && <div className="muted">Loading meals…</div>}
        {!mealsLoading && mealsToday.length === 0 ? (
          <div className="empty-state">
            <p>You haven&apos;t logged anything yet. Add your breakfast to unlock trends.</p>
            <button className="btn ghost" onClick={()=>setFoodOpen(true)}>Add meal</button>
          </div>
        ) : (
          mealsToday.map(meal => <MealCard key={meal.id} meal={meal} />)
        )}
      </section>

      <div className="nutrition-lab card glassy">
        <div className="nutrition-head">
          <div>
            <p className="eyebrow">Food explorer</p>
            <h4>Search fruits, vegetables, meals & macros</h4>
          </div>
        </div>
        <div className="nutrition-search">
          <input
            placeholder="Search apples, paneer, smoothie…"
            value={foodQuery}
            onChange={e=>setFoodQuery(e.target.value)}
          />
          <select value={foodCategory} onChange={e=>setFoodCategory(e.target.value)}>
            <option value="fruit">Fruit</option>
            <option value="vegetable">Vegetable</option>
            <option value="grain">Grain</option>
            <option value="rice">Rice</option>
            <option value="pulse">Pulse</option>
            <option value="dairy">Dairy</option>
            <option value="non-veg">Non-veg</option>
            <option value="snack">Snack</option>
            <option value="beverage">Beverage</option>
          </select>
        </div>
        <div className="nutrition-results">
          {searchLoading && <div className="muted">Loading foods…</div>}
          {!searchLoading && foodResults.map(item=> (
            <div key={item.id} className="nutrition-row">
              <div>
                <strong>{item.name}</strong>
                <span>{item.category}</span>
              </div>
              <div className="nutrition-macros">
                <span>{item.calories} kcal /100g</span>
                <span>P {item.protein}g • C {item.carbs}g • F {item.fats}g</span>
              </div>
            </div>
          ))}
          {!searchLoading && !foodResults.length && searchMsg && (
            <div className="muted">{searchMsg}</div>
          )}
        </div>
      </div>

      <section className="suggestion-grid">
        <div className="card glassy">
          <p className="eyebrow">Food suggestions</p>
          <h4>What matches your profile</h4>
          <div className="diet-grid">
            {suggestions.map(meal=>(
              <div key={meal.slot} className="diet-card">
                <div className="diet-head">
                  <span>{meal.label}</span>
                  <strong>{meal.totalCalories} kcal</strong>
                </div>
                <ul className="diet-items">
                  {meal.items.map(item=>(
                    <li key={item.name}>
                      <strong>{item.name}</strong>
                      <span>{item.portion_g} g • P {item.protein}g • C {item.carbs}g • F {item.fats}g</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="card glassy">
          <p className="eyebrow">Next meal</p>
          {nextMeal ? (
            <>
              <h4>{nextMeal.label}</h4>
              <p className="muted">Aim for {nextMeal.totalCalories} kcal with:</p>
              <ul className="diet-items">
                {nextMeal.items.map(item=>(
                  <li key={item.name}>
                    <strong>{item.name}</strong>
                    <span>{item.portion_g} g • P {item.protein}g • C {item.carbs}g • F {item.fats}g</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No recommendation yet. Personalize to unlock.</p>
          )}
        </div>
      </section>
      {foodOpen && <FoodSearchScreen onClose={()=>setFoodOpen(false)} onLogged={handleMealLogged} />}
    </div>
  )
}
