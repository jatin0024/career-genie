import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import UploadPage from "./pages/UploadPage"; 
import ResultPage from "./pages/ResultPage";
import "./App.css";

function App() {
  const [role, setRole] = useState("student");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home role={role} setRole={setRole} />} />
        <Route path="/login" element={<Login role={role} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<UploadPage />} /> 
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
