import React, { useState } from 'react';
import axios from 'axios';
// import './ResumeUploadForm.css';

const ResumeUploadForm = () => {
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resume || resume.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5001/api/resume/upload', formData);
      setResult(res.data);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to parse resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleUpload} className="upload-form">
        <h2>Upload Your Resume (PDF only)</h2>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Upload"}
        </button>
      </form>

      {result && (
        <div className="result">
          <h3>Parsed Resume Data</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadForm;
