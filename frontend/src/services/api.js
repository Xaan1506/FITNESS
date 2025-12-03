// Always read backend URL from .env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

console.log("Backend URL →", BASE_URL);

// Generic request helper
async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(BASE_URL + path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Request failed");
  }

  return res.json();
}

const api = {
  // AUTH
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

  // USER
  personalize: (body) =>
    request("/user/personalize", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getPlan: () => request("/user/plan"),

  // MEALS
  getMealsToday: () => request("/food/today"),

  addFoodLog: (body) =>
    request("/food/add", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // FOOD SEARCH
  searchFoods(query, category = null, page = 1, pageSize = 50) {
    const qp = new URLSearchParams();
    if (query) qp.set("query", query);
    if (category) qp.set("category", category);
    qp.set("page", String(page));
    qp.set("pageSize", String(pageSize));

    return request("/foods?" + qp.toString());
  },
};

export default api;

