const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  uploadPitch,
  getPitches,
  reviewPitch,
  getAcceptedInvestors,
  bookAppointment,
  getMyAppointments
} = require('../controllers/pitchController');

const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');

// Upload file setup (using multer)
const upload = multer({ dest: 'uploads/' }); // Later cloudinary

// ⭐ Pitch Submission
router.post('/submit', verifyToken, upload.single('pitchDeck'), uploadPitch);

// ⭐ Admin - See All Pitches
router.get('/all', verifyAdmin, getPitches);

// ⭐ Admin - Review Pitch (accept/reject)
router.patch('/review/:id', verifyAdmin, reviewPitch);

// ⭐ Get list of accepted investor profiles (shown to startup after acceptance)
router.get('/investors', verifyToken, getAcceptedInvestors);

// ⭐ Book appointment with investor (by startup)
router.post('/appointments/book', verifyToken, bookAppointment);

// ⭐ Get my appointments (startup view)
router.get('/appointments/mine', verifyToken, getMyAppointments);

module.exports = router;
