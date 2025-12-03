import React, {useState} from 'react'
import Api from '../services/api'

export default function Login({onLogin}){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  async function submit(e){
    e.preventDefault(); setErr(null);
    try{
      const res = await Api.login({email,password});
      Api.setToken(res.token);
      onLogin(res);
    }catch(err){ setErr(err.message); }
  }

  return (
    <div className="card auth-card">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn">Login</button>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  )
}
