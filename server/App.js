// server/app.js
const express = require('express');
const cors = require('cors');
const resumeRoutes = require('./routes/resumeRoute');

const app = express();

app.get('/', (req, res) => {
  res.send('✅ Resume Parser API is working');
});


// ✅ Allow frontend origin
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use('/api/resume', resumeRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
