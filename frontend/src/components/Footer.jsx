import React from "react";
import { FiHeart, FiInstagram, FiTwitter, FiGithub } from "react-icons/fi";

export default function Footer() {
  return (
    <footer 
      id="footer"
      className="card glassy"
      style={{
        marginTop: "60px",
        padding: "32px",
        textAlign: "center",
        borderRadius: "16px"
      }}
    >
      <h3 style={{ marginBottom: "8px" }}>FitTrack</h3>
      <p className="muted" style={{ maxWidth: "500px", margin: "0 auto 20px" }}>
        Your AI-powered fitness companion for nutrition, workouts, hydration, and recovery.
      </p>

      <div 
        className="footer-links" 
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "18px",
          marginBottom: "18px"
        }}
      >
        <a href="/#hero" className="muted">Home</a>
        <a href="/#workouts" className="muted">Workouts</a>
        <a href="/#contact" className="muted">Contact</a>
      </div>

      <div 
        className="footer-social" 
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          fontSize: "22px",
          marginBottom: "18px"
        }}
      >
        <a href="#" className="muted"><FiInstagram /></a>
        <a href="#" className="muted"><FiTwitter /></a>
        <a href="#" className="muted"><FiGithub /></a>
      </div>

      <small className="muted">
        © {new Date().getFullYear()} FitTrack • Made with <FiHeart style={{ color: "red", verticalAlign: "middle" }} /> for better health
      </small>
    </footer>
  );
}
