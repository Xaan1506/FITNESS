import React, {useState} from 'react'
import Api from '../services/api'

export default function Signup({onLogin}){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [err, setErr] = useState(null);

  async function submit(e){
    e.preventDefault(); setErr(null);
    try{
      const res = await Api.signup({email,password,name});
      Api.setToken(res.token);
      onLogin(res);
    }catch(err){ setErr(err.message); }
  }

  return (
    <div className="card auth-card">
      <h3>Sign up</h3>
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn">Create account</button>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  )
}
