// frontend/src/services/api.js

// Always read backend URL from .env (Render adds this automatically)
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://fitness-nlyp.onrender.com/api";

console.log("Backend URL →", BASE_URL);

// Load token from storage
let authToken = localStorage.getItem("ft_token") || null;

// -----------------------------
// SAVE TOKEN FOR ALL REQUESTS
// -----------------------------
function setToken(t) {
  authToken = t;
  if (t) {
    localStorage.setItem("ft_token", t);
  } else {
    localStorage.removeItem("ft_token");
  }
}

// -----------------------------
// GENERIC REQUEST WRAPPER
// -----------------------------
async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Include auth token if logged in
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(BASE_URL + path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Request failed");
  }

  return res.json();
}

// -----------------------------
// API METHODS
// -----------------------------
const api = {
  setToken,

  // -------------------------
  // AUTH
  // -------------------------
  signup: (body) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // -------------------------
  // USER
  // -------------------------
  personalize: (body) =>
    request("/user/personalize", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getPlan: () => request("/user/plan"),

  // -------------------------
  // MEALS
  // -------------------------
  getMealsToday: () => request("/food/today"),

  addFoodLog: (body) =>
    request("/food/add", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // -------------------------
  // FOOD SEARCH
  // -------------------------
  searchFoods(query, category = null, page = 1, pageSize = 50) {
    const qp = new URLSearchParams();
    if (query) qp.set("query", query);
    if (category) qp.set("category", category);
    qp.set("page", page);
    qp.set("pageSize", pageSize);

    return request("/foods?" + qp.toString());
  },
};

export default api;
