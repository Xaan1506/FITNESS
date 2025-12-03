import React, {useState, useEffect} from 'react'
import api from '../services/api'
import FoodIcon from '../components/FoodIcon'
import { motion, AnimatePresence } from 'framer-motion'

function FavoriteButton({id, onToggle}){
  const [fav, setFav] = useState(false);
  useEffect(()=>{
    const s = localStorage.getItem('fav_'+id);
    setFav(!!s);
  },[id]);
  function toggle(){
    const next = !fav;
    setFav(next);
    if (next) localStorage.setItem('fav_'+id, '1'); else localStorage.removeItem('fav_'+id);
    onToggle && onToggle(next);
  }
  return <button className={'btn small ' + (fav ? '' : 'ghost')} onClick={toggle}>{fav ? '★' : '☆'}</button>
}

export default function FoodSearchScreen({onClose, onLogged}){
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [portion, setPortion] = useState(100); // grams or ml
  const [unitLabel, setUnitLabel] = useState('g');
  const [msg, setMsg] = useState(null);

  useEffect(()=>{ if (!query) return setResults([]); const t = setTimeout(()=> doSearch(), 250); return ()=> clearTimeout(t); },[query]);

  async function doSearch(){
    setLoading(true); setMsg(null);
    try{
      const res = await api.searchFoods(query, null, 1, 25);
      setResults(res.items || []);
    }catch(e){ setMsg(e.message); }
    setLoading(false);
  }

  function scale(item){
    // item values per 100g; user can change portion
    const factor = portion / 100;
    return {
      calories: +(item.calories * factor).toFixed(0),
      protein: +(item.protein * factor).toFixed(1),
      carbs: +(item.carbs * factor).toFixed(1),
      fats: +(item.fats * factor).toFixed(1),
      fiber: +(item.fiber * factor).toFixed(1)
    }
  }

  async function quickAdd(item){
    const scaled = scale(item);
    try{
      await api.addFoodLog({
        name:item.name,
        calories:scaled.calories,
        protein:scaled.protein,
        carbs:scaled.carbs,
        fats:scaled.fats,
        fiber:scaled.fiber,
        portion: `${portion}${unitLabel}`,
        vitamins: {category:item.category, foodId:item.id}
      });
      setMsg('Added: ' + item.name);
      onLogged && onLogged();
    }catch(e){ setMsg('Error: ' + e.message); }
  }

  return (
    <div className="food-screen">
      <header className="food-top">
        <button className="btn ghost" onClick={onClose}>Back</button>
        <div className="food-search-input">
          <input placeholder="Search foods (apple, pasta, momo)..." value={query} onChange={e=>setQuery(e.target.value)} />
        </div>
        <div style={{width:56}} />
      </header>

      <div className="food-controls">
        <label className="muted">Portion</label>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input type="number" value={portion} onChange={e=>setPortion(Math.max(1, Number(e.target.value)||100))} style={{width:88}} />
          <select value={unitLabel} onChange={e=>setUnitLabel(e.target.value)}>
            <option value="g">g</option>
            <option value="ml">ml</option>
            <option value="pc">pc</option>
          </select>
        </div>
      </div>

      <div className="food-list">
        <AnimatePresence>
          {results.map(item=> (
            <motion.div key={item.id} initial={{opacity:0,y:6}} whileHover={{scale:1.02}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.18}} className="food-row">
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <div><FoodIcon category={item.category} size={44} /></div>
                <div>
                  <div style={{fontWeight:700}}>{item.name}</div>
                  <div className="muted" style={{fontSize:13}}>
                    {scale(item).calories} kcal • P {scale(item).protein}g • C {scale(item).carbs}g • F {scale(item).fats}g
                  </div>
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <FavoriteButton id={item.id} />
                <motion.button whileTap={{scale:0.96}} className="btn small" onClick={()=>quickAdd(item)}>Quick add</motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && <div className="muted">Searching...</div>}
        {!loading && results.length === 0 && query && <div className="muted">No results for "{query}"</div>}
      </div>

      {msg && <div className="food-toast">{msg}</div>}
    </div>
  )
}
