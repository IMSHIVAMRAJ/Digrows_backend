const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyAdmin = require('../middleware/verifyAdmin');

// auth
router.post('/register', adminController.register);
router.post('/login', adminController.login);

// counts
router.get('/counts', verifyAdmin, adminController.getCounts);

// lists
router.get('/freelancers', verifyAdmin, adminController.getFreelancers);
router.get('/entrepreneurs', verifyAdmin, adminController.getEntrepreneurs);
router.get('/startup-founders', verifyAdmin, adminController.startupFounder);
router.get('/experts', verifyAdmin, adminController.getExperts);
router.get('/mentors', verifyAdmin, adminController.getMentors);
router.get('/investors', verifyAdmin, adminController.getInvestors);

// delete
router.delete('/user/:id', verifyAdmin, adminController.deleteUser);
router.delete('/expert/:id', verifyAdmin, adminController.deleteExpert);

// categories
router.post('/category', verifyAdmin, adminController.addCategory);
router.get('/categories', verifyAdmin, adminController.getCategories);
router.put('/category/:id', verifyAdmin, adminController.updateCategory);
router.delete('/category/:id', verifyAdmin, adminController.deleteCategory);

// transactions
router.get('/transactions', verifyAdmin, adminController.getTransactions);
router.get('/revenue', verifyAdmin, adminController.getRevenueStats);

module.exports = router;
