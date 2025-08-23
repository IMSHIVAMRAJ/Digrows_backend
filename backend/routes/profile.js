const express = require('express');
const router = express.Router();
const upload = require('../utils/cloudinary');

const {
  setupUserProfile,
  setupExpertProfile,
  getAllUsers,
} = require('../controllers/profileController');

router.post('/user', upload.single('certificate'), setupUserProfile);
router.post('/expert', upload.single('registrationCert'), setupExpertProfile);
router.get('/all-users', getAllUsers);


module.exports = router;
