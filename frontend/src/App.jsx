// frontend/src/App.jsx  (replace contents with this or patch in)
import React, {useState, useEffect} from 'react'
import Dashboard from './pages/Dashboard'
import PersonalizeModal from './components/PersonalizeModal'
import Landing from './pages/Landing'
import AuthModal from './components/AuthModal'
import Api from './services/api'
import Navbar from './components/Navbar'

export default function App(){
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('ft_token');
      const storedUser = localStorage.getItem('ft_user');
      if (storedToken) {
        Api.setToken(storedToken); // ensures API sends Authorization header
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Failed to hydrate auth', e);
    }
  }, []);

  // Called by AuthModal after successful login
  function onLogin(userObj, tokenStr){
    setUser(userObj);
    setToken(tokenStr);
    Api.setToken(tokenStr);
    localStorage.setItem('ft_token', tokenStr);
    localStorage.setItem('ft_user', JSON.stringify(userObj));
    setAuthOpen(false);
  }

  function onLogout(){
    setUser(null);
    setToken(null);
    Api.setToken(null);
    localStorage.removeItem('ft_token');
    localStorage.removeItem('ft_user');
  }

  function onPersonalized() {
    setShowPersonalize(false);
    // reload dashboard / user data if necessary
  }

  return (
    <div className={dark ? 'theme-dark' : ''}>
      <Navbar user={user} onOpenAuth={()=>setAuthOpen(true)} onLogout={onLogout} />

      {/* simple routing (existing app used Landing/Dashboard) */}
      <main>
        {user ? (
          <Dashboard user={user} token={token} openPersonalize={()=>setShowPersonalize(true)} />
        ) : (
          <Landing openAuth={()=>setAuthOpen(true)} />
        )}
      </main>

      {showPersonalize && (
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
