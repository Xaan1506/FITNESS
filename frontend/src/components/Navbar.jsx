// frontend/src/components/Navbar.jsx
import React from "react";
import { FiLogOut } from "react-icons/fi";

export default function Navbar({ user, onOpenAuth, onLogout, onNavigate }) {
  return (
    <header className="ft-nav">
      <div className="ft-nav-left">
        <a 
          className="brand" 
          onClick={() => onNavigate("/")}
          style={{ cursor: "pointer" }}
        >
          FitTrack
        </a>
      </div>

      <nav className="ft-nav-right">

        {/* HOME */}
        <a 
          onClick={() => onNavigate("/")}
          style={{ cursor: "pointer" }}
        >
          Home
        </a>

        {user ? (
          <>
            {/* WORKOUTS */}
            <a 
              onClick={() => onNavigate("/workouts")}
              style={{ cursor: "pointer" }}
            >
              Workouts
            </a>

            {/* RUNS (optional, not implemented yet) */}
            <a 
              onClick={() => onNavigate("/runs")}
              style={{ cursor: "pointer" }}
            >
              Runs
            </a>

            {/* LOGOUT */}
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
