// frontend/src/services/api.js

// Always read backend URL from .env
let BASE_URL = import.meta.env.VITE_API_URL || "https://fitness-nlyp.onrender.com/api";

// Guarantee trailing slash (VERY IMPORTANT)
if (!BASE_URL.endsWith("/")) {
  BASE_URL = BASE_URL + "/";
}

console.log("Backend URL →", BASE_URL);

let authToken = localStorage.getItem("ft_token") || null;

// Save token for all requests
function setToken(t) {
  authToken = t;
  if (t) localStorage.setItem("ft_token", t);
  else localStorage.removeItem("ft_token");
}

// Generic request wrapper
async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(BASE_URL + path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
}

// API methods
const api = {
  setToken,

  // AUTH ---------------------------
  signup: (body) =>
    request("auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body) =>
    request("auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // USER ---------------------------
  personalize: (body) =>
    request("user/personalize", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getPlan: () => request("user/plan"),

  // MEALS --------------------------
  getMealsToday: () => request("food/today"),

  addFoodLog: (body) =>
    request("food/add", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // FOOD SEARCH --------------------
  searchFoods(query, category = null, page = 1, pageSize = 50) {
    const qp = new URLSearchParams();
    if (query) qp.set("query", query);
    if (category) qp.set("category", category);
    qp.set("page", page);
    qp.set("pageSize", pageSize);

    return request("foods?" + qp.toString());
  },
};

export default api;
