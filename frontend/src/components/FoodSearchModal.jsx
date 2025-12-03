import React, {useState, useEffect} from 'react'
import api from '../services/api'

export default function FoodSearchModal({onClose}){
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(()=>{
    if (!query) return setResults([]);
    const t = setTimeout(()=> doSearch(1), 300);
    return ()=> clearTimeout(t);
  },[query]);

  async function doSearch(page=1){
    setLoading(true); setMsg(null);
    try{
      const res = await api.searchFoods(query, null, page, 25);
      setResults(res.items || []);
    }catch(e){ setMsg(e.message); }
    setLoading(false);
  }

  async function addLog(item){
    try{
      await api.addFoodLog({name: item.name, calories: item.calories, protein:item.protein, carbs:item.carbs, fats:item.fats, fiber:item.fiber});
      setMsg('Added to food log');
    }catch(e){ setMsg('Error: ' + e.message); }
  }

  return (
    <div className="modal">
      <div className="modal-card">
        <h3>Search foods</h3>
        <input placeholder="Search foods (apple, pasta, chicken)..." value={query} onChange={e=>setQuery(e.target.value)} />
        {loading && <div>Searching…</div>}
        {msg && <div className="muted">{msg}</div>}
        <div style={{maxHeight:300,overflow:'auto',marginTop:8}}>
          {results.map(r=> (
            <div key={r.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 4px',borderBottom:'1px solid #eee'}}>
              <div>
                <div style={{fontWeight:600}}>{r.name}</div>
                <div className="muted" style={{fontSize:13}}>{r.calories} kcal • P {r.protein}g • C {r.carbs}g • F {r.fats}g</div>
              </div>
              <div>
                <button className="btn small" onClick={()=>addLog(r)}>Add</button>
              </div>
            </div>
          ))}
          {!loading && results.length === 0 && <div className="muted">No results</div>}
        </div>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
