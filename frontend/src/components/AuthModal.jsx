import React, {useState} from 'react'
import { motion } from 'framer-motion'
import Api from '../services/api'

function LoginForm({onLogin}){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);
  const [loading,setLoading] = useState(false);

  async function submit(e){
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try{
      const res = await Api.login({email,password});
      Api.setToken(res.token);
      onLogin(res);
    }catch(e){
      setErr(e.message || 'Unable to sign in');
    }finally{
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="auth-form">
      <label>
        Email
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>
      <label>
        Password
        <input
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      <button className="btn" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      {err && <div className="error">{err}</div>}
    </form>
  )
}

function SignupForm({onLogin}){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);
  const [loading,setLoading] = useState(false);

  async function submit(e){
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try{
      const res = await Api.signup({name,email,password});
      Api.setToken(res.token);
      onLogin(res);
    }catch(e){
      setErr(e.message || 'Unable to create account');
    }finally{
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="auth-form">
      <label>
        Name
        <input
          placeholder="Full name"
          value={name}
          onChange={e=>setName(e.target.value)}
          autoComplete="name"
        />
      </label>
      <label>
        Email
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>
      <label>
        Password
        <input
          placeholder="Create a password"
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </label>
      <button className="btn" disabled={loading}>{loading ? 'Creating…' : 'Sign up'}</button>
      {err && <div className="error">{err}</div>}
    </form>
  )
}

const benefitBullets = [
  'Adaptive macros recalc every log',
  'Coach summaries every morning',
  'Run + strength plans in one flow',
  'Grocery list automation',
];

export default function AuthModal({onClose,onLogin}){
  const [mode,setMode] = useState('login');
  return (
    <div className="modal">
      <motion.div
        initial={{scale:0.98,opacity:0}}
        animate={{scale:1,opacity:1}}
        className="modal-card auth-modal card glassy"
      >
        <div className="auth-modal-head">
          <div>
            <p className="eyebrow">Account access</p>
            <h3>{mode === 'login' ? 'Welcome back.' : 'Create your FitTrack ID.'}</h3>
            <p className="muted">Securely sync workouts, meals, and recovery data.</p>
          </div>
          <button className="btn ghost small" onClick={onClose}>Cancel</button>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={()=>setMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            onClick={()=>setMode('signup')}
            type="button"
          >
            Sign up
          </button>
        </div>

        <div className="auth-modal-grid">
          <div className="auth-panel">
            {mode === 'login'
              ? <LoginForm onLogin={onLogin} />
              : <SignupForm onLogin={onLogin} />
            }
            <p className="tiny-muted">By continuing you agree to the updated Terms & Privacy.</p>
          </div>
          <div className="auth-info">
            <p className="eyebrow">Why members stay</p>
            <h4>A single hub for food, training, and recovery.</h4>
            <ul className="auth-benefits">
              {benefitBullets.map(item => <li key={item}>{item}</li>)}
            </ul>
            <div className="auth-highlight">
              <p>Avg. streak</p>
              <strong>32 days</strong>
              <span>People who personalize hit 3× better consistency.</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
