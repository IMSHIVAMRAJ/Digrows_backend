const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.post('/register', adminController.register);
router.post('/login', adminController.login);

router.get('/users', verifyAdmin, adminController.getUsers);
router.get('/experts', verifyAdmin, adminController.getExperts);
router.get('/chats', verifyAdmin, adminController.getChats);
router.get('/messages', verifyAdmin, adminController.getMessages);
router.delete('/user/:id', verifyAdmin, adminController.deleteUser);

module.exports = router;
