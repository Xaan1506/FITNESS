// frontend/src/services/api.js

// Read backend URL from .env or fallback (make sure your VITE_API_URL includes /api)
let BASE_URL = import.meta.env.VITE_API_URL || "https://fitness-1-3u07.onrender.com/api";

// Ensure trailing slash so we can safely append paths like "auth/login"
if (!BASE_URL.endsWith("/")) {
  BASE_URL = BASE_URL + "/";
}

console.log("Backend URL →", BASE_URL);

let authToken = localStorage.getItem("ft_token") || null;

// Save token
function setToken(t) {
  authToken = t;
  if (t) localStorage.setItem("ft_token", t);
  else localStorage.removeItem("ft_token");
}

// Helper: parse response safely (handles empty 204 responses)
async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  if (res.status === 204) return null; // No Content
  if (contentType.includes("application/json")) {
    return res.json();
  }
  // Fallback to text
  return res.text();
}

// Generic request wrapper
async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(BASE_URL + path, {
    ...options,
    headers,
  });

  const parsed = await parseResponse(res);

  if (!res.ok) {
    // Try to extract meaningful message from parsed body (json or text)
    let message = "Request failed";
    try {
      if (parsed) {
        if (typeof parsed === "string") message = parsed;
        else if (parsed.error) message = parsed.error;
        else if (parsed.message) message = parsed.message;
        else message = JSON.stringify(parsed);
      }
    } catch (e) {
      message = "Request failed (unable to parse error)";
    }
    const err = new Error(message);
    err.status = res.status;
    err.body = parsed;
    throw err;
  }

  return parsed;
}

// API endpoints
const api = {
  setToken,

  // AUTH -----------------------------
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

  // USER -----------------------------
  personalize: (body) =>
    request("user/personalize", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getPlan: () => request("user/plan"),

  // MEALS ----------------------------
  getMealsToday: () => request("food/today"),

  addFoodLog: (body) =>
    request("food/add", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // FOOD SEARCH ----------------------
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
