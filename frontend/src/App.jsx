// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import PersonalizeModal from './components/PersonalizeModal';
import Landing from './pages/Landing';
import AuthModal from './components/AuthModal';
import Api from './services/api';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [dark, setDark] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Load auth from localStorage on startup
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('ft_token');
      const storedUser = localStorage.getItem('ft_user');

      if (storedToken) {
        Api.setToken(storedToken);
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn("Failed to hydrate auth", e);
    }
  }, []);

  // 🔥 FIXED LOGIN HANDLER — Now matches login/signup response
  function onLogin(res) {
    const { user, token } = res;

    setUser(user);
    setToken(token);

    Api.setToken(token);

    localStorage.setItem("ft_token", token);
    localStorage.setItem("ft_user", JSON.stringify(user));

    setAuthOpen(false);
  }

  // Logout function
  function onLogout() {
    setUser(null);
    setToken(null);
    Api.setToken(null);
    localStorage.removeItem("ft_token");
    localStorage.removeItem("ft_user");
  }

  function onPersonalized() {
    setShowPersonalize(false);
  }

  return (
    <div className={dark ? 'theme-dark' : ''}>
      <Navbar 
        user={user} 
        onOpenAuth={() => setAuthOpen(true)} 
        onLogout={onLogout} 
      />

      <main>
        {user ? (
          <Dashboard 
            user={user} 
            token={token} 
            openPersonalize={() => setShowPersonalize(true)} 
          />
        ) : (
          <Landing openAuth={() => setAuthOpen(true)} />
        )}
      </main>

      {showPersonalize && (
        <PersonalizeModal
          onClose={() => setShowPersonalize(false)}
          onSaved={onPersonalized}
        />
      )}

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onLogin={onLogin}
        />
      )}
    </div>
  );
}
