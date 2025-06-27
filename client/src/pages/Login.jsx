import React from "react";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

export default function Login({ role }) {
  const handleLogin = (data) => {
    console.log("Logging in:", data);
  };

  return (
    <div className="page-container">
      <div className="auth-box">
        <h2>Logging in as <strong>{role}</strong></h2>
        <AuthForm type="login" onSubmit={handleLogin} />
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
