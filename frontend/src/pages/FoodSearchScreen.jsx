import React, { useState, useEffect } from "react";
import api from "../services/api";
import FoodIcon from "../components/FoodIcon";

export default function FoodSearchScreen({ onClose, onLogged }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function searchFoods(q) {
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.searchFoods(q);
      setResults(res.items || []);
    } catch (err) {
      console.log("search err", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(() => searchFoods(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  async function addMeal(item) {
    try {
      await api.addFoodLog({
        food_id: item.id,
        portion_g: 100,
      });
      onLogged();
    } catch (err) {
      console.log("log err", err);
    }
  }

  return (
    <div className="food-modal">
      <div className="food-modal-box">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2>Add Meal</h2>

        {/* SEARCH BAR */}
        <input
          className="search-input"
          placeholder="Search food…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && <p>Searching…</p>}

        {results.map((item) => (
          <div key={item.id} className="food-item">
            <FoodIcon category={item.category} />
            <div className="info">
              <strong>{item.name}</strong>
              <p>{item.category}</p>
            </div>

            <button className="btn small" onClick={() => addMeal(item)}>
              Add
            </button>
          </div>
        ))}

        {!loading && results.length === 0 && query.length >= 2 && (
          <p>No foods found</p>
        )}
      </div>
    </div>
  );
}
