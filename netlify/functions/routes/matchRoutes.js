const express = require('express');
const Match = require('../models/Match');
const Team = require('../models/Team');
const router = express.Router();

// Schedule match
router.post('/schedule', async (req, res) => {
  const { teamA, teamB, date } = req.body;
  const newMatch = new Match({ teamA, teamB, date });
  await newMatch.save();
  res.status(201).json({ message: 'Match scheduled' });
});

// Update match result and points table
router.put('/update/:id', async (req, res) => {
  const { scoreA, scoreB } = req.body;
  const match = await Match.findById(req.params.id);

  if (!match) return res.status(404).json({ message: 'Match not found' });

  match.scoreA = scoreA;
  match.scoreB = scoreB;

  let result;
  const teamA = await Team.findOne({ name: match.teamA });
  const teamB = await Team.findOne({ name: match.teamB });

  if (scoreA > scoreB) {
    result = `${match.teamA} wins`;
    teamA.points += 2;
    teamA.wins += 1;
    teamB.losses += 1;
  } else if (scoreA < scoreB) {
    result = `${match.teamB} wins`;
    teamB.points += 2;
    teamB.wins += 1;
    teamA.losses += 1;
  } else {
    result = 'Draw';
    teamA.points += 1;
    teamB.points += 1;
  }

  match.result = result;

  teamA.matchesPlayed += 1;
  teamB.matchesPlayed += 1;

  await match.save();
  await teamA.save();
  await teamB.save();

  res.json({ message: 'Match result and points updated' });
});

// Get all matches
router.get('/', async (req, res) => {
  const matches = await Match.find();
  res.json(matches);
});

module.exports = router;