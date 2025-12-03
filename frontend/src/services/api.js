const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

let _token = null;
function setToken(t){ _token = t; }

async function request(path, opts={}){
  const headers = opts.headers || {};
  if (_token) headers['Authorization'] = 'Bearer ' + _token;
  let res;
  try{
    res = await fetch(API_BASE + path, {...opts, headers});
  }catch(e){
    throw new Error('Network error: ' + e.message);
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
