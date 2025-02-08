const express = require('express');
const Team = require('../models/Team');
const router = express.Router();

// Create team
router.post('/create', async (req, res) => {
  const { name, players } = req.body;
  const existingTeam = await Team.findOne({ name });
  if (existingTeam) return res.status(400).json({ message: 'Team already exists' });
  const newTeam = new Team({ name, players });
  await newTeam.save();
  res.status(201).json({ message: 'Team created' });
});

// Get all teams
router.get('/', async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});

module.exports = router;
