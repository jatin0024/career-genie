const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require("../models/Resume");

const path = require('path');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


async function getGPTSuggestions(parsedData) {
  const prompt = `
You are a professional resume coach. Based on the following extracted resume content, provide up to 5 personalized suggestions to improve the resume.

Resume:
Name: ${parsedData.name}
Email: ${parsedData.email}
Skills: ${parsedData.skills.join(", ")}
Education: ${parsedData.education}
Experience: ${parsedData.experience}

Respond with only a numbered list of suggestions.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // or "gpt-4" if you have access
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const text = response.choices[0].message.content;
  return text.split("\n").filter(s => s.trim() !== "");
}


router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    console.log("Received file:", req.file);

    if (!req.file) {
      console.log("No file uploaded.");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfPath = path.join(__dirname, '..', req.file.path);
    console.log("📂 Reading file from:", pdfPath);

    const dataBuffer = fs.readFileSync(pdfPath);
    console.log("📄 PDF file read successfully");

    const pdfData = await pdfParse(dataBuffer);
    console.log("🧠 PDF parsed. Extracted text length:", pdfData.text.length);

    // function generateSuggestions(data) {
    //   const suggestions = [];

    //   if (data.skills.length < 5) {
    //     suggestions.push("Consider adding more technical skills relevant to the job.");
    //   }

    //   if (!data.experience.toLowerCase().includes("year")) {
    //     suggestions.push("Mention how many years of experience you have in each role.");
    //   }

    //   if (!data.education.toLowerCase().includes("b.tech") && !data.education.toLowerCase().includes("bachelor")) {
    //     suggestions.push("Add clear mention of your degree and institution.");
    //   }

    //   if (!data.email.includes('@')) {
    //     suggestions.push("Please make sure your email is correctly formatted.");
    //   }

    //   return suggestions;
    // }

    const rawText = pdfData.text;

    const extractedData = {
      name: extractName(rawText),
      email: extractEmail(rawText),
      skills: extractSkills(rawText),
      education: extractEducation(rawText),
      experience: extractExperience(rawText),
    };
    const suggestions = await getGPTSuggestions(extractedData);
    const result = {
      ...extractedData,
      suggestions,
    };
    await Resume.create(result);
    console.log(" Resume saved to MongoDB");

    res.json(result);

    console.log(" Parsed Resume Data:", extractedData);

    fs.unlinkSync(pdfPath); // delete uploaded file


  } catch (error) {
    console.error(" Error during parsing:", error.message);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});




function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  return match ? match[0] : 'Not found';
}

function extractName(text) {
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  for (let line of lines) {
    // Only letters and spaces, no digits or emails
    if (
      /^[A-Za-z\s]+$/.test(line) &&                // contains only letters and spaces
      line.split(" ").length >= 2 &&               // at least two words (like First Last)
      !line.toLowerCase().includes("resume") &&    // skip lines like "Resume"
      !line.includes("@") &&                       // skip emails
      !/\d/.test(line)                             // skip phone numbers or years
    ) {
      return line;
    }
  }

  return "Not found";
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
