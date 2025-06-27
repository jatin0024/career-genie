const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    console.log("✅ Received file:", req.file);

    if (!req.file) {
      console.log("❌ No file uploaded.");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfPath = path.join(__dirname, '..', req.file.path);
    console.log("📂 Reading file from:", pdfPath);

    const dataBuffer = fs.readFileSync(pdfPath);
    console.log("📄 PDF file read successfully");

    const pdfData = await pdfParse(dataBuffer);
    console.log("🧠 PDF parsed. Extracted text length:", pdfData.text.length);

    const rawText = pdfData.text;

    const extractedData = {
      name: extractName(rawText),
      email: extractEmail(rawText),
      skills: extractSkills(rawText),
      education: extractEducation(rawText),
      experience: extractExperience(rawText),
    };

    console.log("✅ Parsed Resume Data:", extractedData);

    fs.unlinkSync(pdfPath); // delete uploaded file
    res.json(extractedData);

  } catch (error) {
    console.error("❌ Error during parsing:", error.message);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});



// Helper functions (very basic for now)
function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  return match ? match[0] : 'Not found';
}

function extractName(text) {
  return text.split('\n')[0]; // crude: assumes first line is name
}

function extractSkills(text) {
  const skillKeywords = ['JavaScript', 'React', 'Node', 'MongoDB', 'Express', 'Python', 'C++', 'Java'];
  return skillKeywords.filter(skill => text.includes(skill));
}

function extractEducation(text) {
  const match = text.match(/(B\.?Tech|M\.?Tech|Bachelor|Master).*?\n/i);
  return match ? match[0].trim() : 'Not found';
}

function extractExperience(text) {
  const match = text.match(/(\d+ years? of experience|Internship|Work Experience)/i);
  return match ? match[0] : 'Not found';
}

module.exports = router;
