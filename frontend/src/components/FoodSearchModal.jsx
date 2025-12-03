import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FoodIcon from './FoodIcon';

export default function FoodSearchModal({ onClose, onLogged }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => doSearch(), 400);
    return () => clearTimeout(t);
  }, [query]);

  async function doSearch(page = 1) {
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.searchFoods(query, null, page, 25);
      setResults(res.items || []);
      if (!res.items || res.items.length === 0) setMsg('No foods found');
    } catch (err) {
      setMsg(err.message);
    }
    setLoading(false);
  }

  async function addMeal(item) {
    try {
      await api.addFoodLog({
        food_id: item.id,
        portion_g: 100,
      });
      onLogged && onLogged();
      onClose();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="food-modal">
      <div className="food-modal-box">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2>Add Meal</h2>

        <input
          className="search-input"
          placeholder="Search food…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && <p>Searching…</p>}

        {!loading && msg && <p className="muted">{msg}</p>}

        {results.map(item => (
          <div key={item.id} className="food-item">
            <FoodIcon category={item.category} size={28} />
            <div className="info">
              <strong>{item.name}</strong>
              <p>{item.category}</p>
            </div>

            <button className="btn small" onClick={() => addMeal(item)}>
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
