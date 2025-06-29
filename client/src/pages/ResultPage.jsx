import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>No resume data found. Please <button onClick={() => navigate("/")}>Upload again</button>.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>📄 Parsed Resume Details</h2>

      <div style={{ marginTop: "1rem", lineHeight: "1.6" }}>
        <p><strong>👤 Name:</strong> {data.name}</p>
        <p><strong>📧 Email:</strong> {data.email}</p>
        <p><strong>🎓 Education:</strong> {data.education}</p>
        <p><strong>💼 Experience:</strong> {data.experience}</p>
        <p><strong>🛠️ Skills:</strong> {data.skills?.join(", ") || "Not found"}</p>
      </div>

      {data.suggestions?.length > 0 && (
        <>
          <h3 style={{ marginTop: "2rem" }}>🧠 Suggestions to Improve Your Resume</h3>
          <ul>
            {data.suggestions.map((s, idx) => (
              <li key={idx} style={{ marginBottom: "0.5rem" }}>🔹 {s}</li>
            ))}
          </ul>
        </>
      )}

      <button 
        onClick={() => navigate("/")} 
        style={{ marginTop: "2rem", padding: "10px 20px", background: "#48A9A6", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        ⬅️ Upload Another Resume
      </button>
    </div>
  );
}
