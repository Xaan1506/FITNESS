// frontend/src/components/Navbar.jsx
import React from "react";
import { FiLogOut } from "react-icons/fi";

export default function Navbar({ user, onOpenAuth, onLogout }) {
  return (
    <header className="ft-nav">
      <div className="ft-nav-left">
        <a href="/" className="brand">FitTrack</a>
      </div>

      <nav className="ft-nav-right">
        <a href="/">Home</a>

        {user ? (
          <>
            <a href="/workouts">Workouts</a>
            <a href="/#runs">Runs</a>

            <button className="btn-link" onClick={onLogout}>
              <FiLogOut style={{ verticalAlign: "middle" }} /> Logout
            </button>
          </>
        ) : (
          <button className="btn" onClick={onOpenAuth}>Login</button>
        )}
      </nav>
    </header>
  );
}
