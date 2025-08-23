const express = require("express");
const router = express.Router();
const { loginExpert,loginMentor, loginInvestor } = require("../controllers/expertAuthController");
const { updatePricing, getProfileDetails } = require("../controllers/expertController");
const { protectExpert } = require("../middleware/expertAuth");
const {
  setupExpertProfile,
  getExpertProfile,
  updateExpert,
  getAllMentors,
  getAllInvestors,
  getMentorProfile,
  getInvestorProfile,
  updateMentor,
  updateInvestor
} = require('../controllers/profileController');

// Auth routes
router.post("/login", loginExpert);
router.post("/login/mentor", loginMentor);
router.post("/login/investor", loginInvestor);

// Pricing routes (protected)
router.put("/pricing", protectExpert, updatePricing);
router.get("/me", protectExpert, getProfileDetails);

// ✅ Expert routes
router.post('/expert/register', setupExpertProfile);
router.get('/expert/:id', getExpertProfile);
router.put('/expert/:id', updateExpert);

// ✅ Mentor routes
router.get('/mentors', getAllMentors);
router.get('/mentor/:id', getMentorProfile);
router.put('/mentor/:id', updateMentor);

// ✅ Investor routes
router.get('/investors', getAllInvestors);
router.get('/investor/:id', getInvestorProfile);
router.put('/investor/:id', updateInvestor);


module.exports = router;
