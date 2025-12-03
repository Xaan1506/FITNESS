import React, {useState, useEffect} from 'react'
import Dashboard from './pages/Dashboard'
import PersonalizeModal from './components/PersonalizeModal'
import Landing from './pages/Landing'
import AuthModal from './components/AuthModal'
import Api from './services/api'

export default function App(){
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(true);

  // ✅ You forgot these:
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(()=>{
    if (token) {
      // after login/signup, show personalization after 3s
      const t = setTimeout(()=> setShowPersonalize(true), 3000);
      return () => clearTimeout(t);
    }
  }, [token]);

  const onLogin = ({user, token}) => {
    setUser(user); 
    setToken(token);
    Api.setToken(token);
  };

  const onPersonalized = (profile) => {
    setUser(prev => ({...prev, profile}));
    setShowPersonalize(false);
  };

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <header className="topbar">
        <h1>FitTrack</h1>
        <div>
          <button onClick={()=>setDark(d=>!d)} className="btn small">Toggle Theme</button>
          <button onClick={()=>setMobilePreview(m=>!m)} className="btn small ghost" style={{marginLeft:8}}>
            {mobilePreview ? 'Desktop View' : 'Mobile Preview'}
          </button>

          {!token && (
            <button 
              className="btn ghost" 
              onClick={()=>setAuthOpen(true)} 
              style={{marginLeft:10}}
            >
              Login / Sign up
            </button>
          )}
        </div>
      </header>

      {mobilePreview ? (
        <div className="device-shell">
          <div className="device-frame card">
            <main className="mobile-root">
              {!token ? (
                <Landing openAuth={() => setAuthOpen(true)} />
              ) : (
                <Dashboard user={user} token={token} />
              )}
            </main>
          </div>
        </div>
      ) : (
        <main>
          {!token ? (
            <Landing openAuth={() => setAuthOpen(true)} />
          ) : (
            <Dashboard user={user} token={token} />
          )}
        </main>
      )}

      {showPersonalize && token && (
        <PersonalizeModal 
          onClose={()=>setShowPersonalize(false)} 
          onSaved={onPersonalized} 
        />
      )}

      {authOpen && (
        <AuthModal 
          onClose={()=>setAuthOpen(false)} 
          onLogin={onLogin} 
        />
      )}
    </div>
  );
}
