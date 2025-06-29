require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const resumeRoutes = require('./routes/resumeRoute');



const app = express();



mongoose.connect(process.env.MONGO_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB connected"))
.catch((err) => console.error(" MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.send(' Resume Parser API is working');
});

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use('/api/resume', resumeRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
