import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resume || resume.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        navigate("/result", { state: result });
      } else {
        alert("Failed to parse resume");
      }
    } catch (err) {
      alert("Error uploading resume");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>CareerGenie</h1>
        <button onClick={() => navigate("/login")} className="login-btn">Login</button>
      </header>

      <main className="home-main">
        <h2>Upload Your Resume</h2>
        <form onSubmit={handleUpload} className="upload-form">
          <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
          <button type="submit" disabled={loading}>
            {loading ? "Parsing..." : "Upload & Analyze"}
          </button>
        </form>
      </main>
    </div>
  );
}
