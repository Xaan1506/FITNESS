function inferApiBase(){
  if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE.replace(/\/$/, '');
  if (typeof window !== 'undefined'){
    const {protocol, hostname} = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1'){
      return `${protocol}//${hostname}:4000`;
    }
    return window.location.origin;
  }
  return 'http://localhost:4000';
}

const API_BASE = inferApiBase();

let _token = null;
function setToken(t){ _token = t; }

async function request(path, opts={}){
  const headers = opts.headers || {};
  if (_token) headers['Authorization'] = 'Bearer ' + _token;
  let res;
  try{
    res = await fetch(API_BASE + path, {...opts, headers});
  }catch(e){
    const hint = API_BASE.includes('localhost') ? 'Is the backend server running on port 4000?' : 'Check your network or API base URL.';
    throw new Error(`Network error: ${e.message}. ${hint}`);
  }
  let data = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')){
    data = await res.json();
  } else {
    const text = await res.text();
    try{ data = JSON.parse(text); }catch(e){ data = {raw: text}; }
  }
  if (!res.ok) throw new Error((data && data.error) ? data.error : ('API error: ' + (data && data.raw ? data.raw : res.status)));
  return data;
}

const api = {
  setToken,
  signup: (body)=> request('/api/auth/signup', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}),
  login: (body)=> request('/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}),
  personalize: (body)=> request('/api/user/personalize', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}),
  getPlan: ()=> request('/api/user/plan'),
  getMealsToday: ()=> request('/api/food/today'),
  searchFoods: async function(query, category, page=1, pageSize=50){
    const qp = new URLSearchParams();
    if (query) qp.set('query', query);
    if (category) qp.set('category', category);
    qp.set('page', String(page)); qp.set('pageSize', String(pageSize));
    return request('/api/foods?' + qp.toString());
  },
  addFoodLog: async function(body){
    return request('/api/food/add', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  }
};

export default api;
