import React from "react";
import AuthForm from "../components/AuthForm";

export default function Signup() {
  const handleSignup = (data) => {
    console.log("Signup Data:", data);
    // TODO: Send to backend
  };

  return (
    <div className="page-container">
      <AuthForm type="signup" onSubmit={handleSignup} />
    </div>
  );
}
