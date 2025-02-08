const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const matchRoutes = require('./routes/matchRoutes');
const teamRoutes = require('./routes/teamRoutes');

// Adjusting the base path for Netlify Functions
app.use('/.netlify/functions/api/admin', adminRoutes);
app.use('/.netlify/functions/api/matches', matchRoutes);
app.use('/.netlify/functions/api/teams', teamRoutes);

module.exports.handler = serverless(app);
