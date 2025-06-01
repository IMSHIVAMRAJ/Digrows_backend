const express = require('express');
const router = express.Router();
const {
  getMyTeam,
  getUsersNotInTeam,
  addToTeam,
} = require('../controllers/teamController'); // Ye controller banayenge

// GET: My team list
router.get('/my-team/:id', getMyTeam);

// GET: Browse other users not in team
router.get('/browse-users/:id', getUsersNotInTeam);

// POST: Add user to team
router.post('/add-to-team', addToTeam);

module.exports = router;
