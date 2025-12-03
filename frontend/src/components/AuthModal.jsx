import React, {useState} from 'react'
import { motion } from 'framer-motion'
import Api from '../services/api'

function LoginForm({onLogin, onSwitch}){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState(null);
  async function submit(e){ e.preventDefault(); setErr(null); try{ const res = await Api.login({email,password}); Api.setToken(res.token); onLogin(res); }catch(e){ setErr(e.message);} }
  return (
    <form onSubmit={submit} className="auth-form">
      <h3>Welcome back</h3>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn">Login</button>
      <div className="muted">New? <a onClick={onSwitch}>Create an account</a></div>
      {err && <div className="error">{err}</div>}
    </form>
  )
}

function SignupForm({onLogin, onSwitch}){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState(null);
  async function submit(e){ e.preventDefault(); setErr(null); try{ const res = await Api.signup({name,email,password}); Api.setToken(res.token); onLogin(res); }catch(e){ setErr(e.message);} }
  return (
    <form onSubmit={submit} className="auth-form">
      <h3>Create account</h3>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn">Sign up</button>
      <div className="muted">Already registered? <a onClick={onSwitch}>Login</a></div>
      {err && <div className="error">{err}</div>}
    </form>
  )
}

export default function AuthModal({onClose,onLogin}){
  const [mode,setMode] = useState('login');
  return (
    <div className="modal">
      <motion.div initial={{scale:0.98,opacity:0}} animate={{scale:1,opacity:1}} className="modal-card" style={{maxWidth:760}}>
        <div style={{display:'flex',gap:24}}>
          <div style={{flex:1}}>
            {mode === 'login' ? <LoginForm onLogin={onLogin} onSwitch={()=>setMode('signup')} /> : <SignupForm onLogin={onLogin} onSwitch={()=>setMode('login')} />}
          </div>
          <div style={{flex:1, padding:16, background:'linear-gradient(180deg, #f6fbff, #eef6ff)', borderRadius:8}}>
            <h4>Why FitTrack?</h4>
            <ul>
              <li>Personalized daily plans</li>
              <li>Nutrition & macro tracking</li>
              <li>Running & workout analytics</li>
            </ul>
            <div style={{marginTop:12}}>
              <button className="btn ghost" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
