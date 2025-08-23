const express = require('express');
const router = express.Router();
const { 
  startExpertSession,   // ✅ order create (chat/audio/video)
  verifySessionPayment  // ✅ payment verify & session create
} = require('../controllers/chatController');

// ✅ Step 1: User selects expert + type (chat/audio/video) -> order create
router.post('/start-session', startExpertSession);

// ✅ Step 2: Payment verify -> create session entry
router.post('/verify-payment', verifySessionPayment);



module.exports = router;
