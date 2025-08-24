const Admin = require('../models/Admin');
const User = require('../models/User');
const Expert = require('../models/Expert');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ---------------------- AUTH ------------------------
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', err });
  }
};

// ---------------------- COUNTS ------------------------
exports.getCounts = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalExperts = await Expert.countDocuments({ type: 'expert' });
    const totalMentors = await Expert.countDocuments({ type: 'mentor' });
    const totalInvestors = await Expert.countDocuments({ type: 'investor' });
    const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
    const totalEntrepreneurs = await User.countDocuments({ role: 'entrepreneur' });

    const expertCategories = await Category.countDocuments({ type: 'expert' });
    const mentorCategories = await Category.countDocuments({ type: 'mentor' });

    res.json({
      totalUsers,
      totalFreelancers,
      totalEntrepreneurs,
      totalExperts,
      totalMentors,
      totalInvestors,
      expertCategories,
      mentorCategories
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching counts", err });
  }
};

// ---------------------- LISTS ------------------------
exports.getFreelancers = async (req, res) => {
  const users = await User.find({ type: 'freelancer' }).select('name phone email');
  res.json(users);
};

exports.getEntrepreneurs = async (req, res) => {
  const users = await User.find({ type: 'entrepreneur' }).select('name phone email businessName businessLink category');
  res.json(users);
};
exports.startupFounder = async (req, res) => {
  const users = await User.find({ type: 'startup-founder' }).select('name phone email businessName businessLink category');
  res.json(users);
};

exports.getExperts = async (req, res) => {
  // ADD _id
  const experts = await Expert.find({ type: 'expert' })
    .select('_id name phone email address skills companyName website officeAddress gstin category');
  res.json(experts);
};

exports.getMentors = async (req, res) => {
  // ADD _id
  const mentors = await Expert.find({ type: 'mentor' })
    .select('_id name phone email address skills companyName website officeAddress gstin category');
  res.json(mentors);
};

exports.getInvestors = async (req, res) => {
  // ADD _id
  const investors = await Expert.find({ type: 'investor' })
    .select('_id name phone email address skills companyName website officeAddress gstin category');
  res.json(investors);
};


// ---------------------- DELETE ------------------------
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

exports.deleteExpert = async (req, res) => {
  await Expert.findByIdAndDelete(req.params.id);
  res.json({ message: 'Expert/Mentor/Investor deleted' });
};

// ---------------------- CATEGORY ------------------------
// Add category
exports.addCategory = async (req, res) => {
  try {
    const { name, type } = req.body; 
    const category = await Category.create({ name, type });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error adding category", err });
  }
};

// Get categories with expert/mentor count

 exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    const result = await Promise.all(
      categories.map(async (cat) => {
        // This now correctly queries ONLY the Expert model
        const count = await Expert.countDocuments({
          category: cat._id, // Match the category ID
          type: cat.type,    // Match the type ('expert' or 'mentor')
        });

        return { ...cat._doc, count };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("💥 ERROR IN getCategories:", err);
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error updating category", err });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category", err });
  }
};

// ---------------------- TRANSACTIONS ------------------------
exports.getTransactions = async (req, res) => {
  const txns = await Transaction.find().populate("user", "name").sort({ createdAt: -1 });
  res.json(txns);
};

exports.getRevenueStats = async (req, res) => {
  const totalRevenue = await Transaction.aggregate([
    { $match: { status: 'success' } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const pendingPayments = await Transaction.countDocuments({ status: 'pending' });
  const failedTransactions = await Transaction.countDocuments({ status: 'failed' });

  // monthly growth
  const monthly = await Transaction.aggregate([
    { $match: { status: 'success' } },
    { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, revenue: { $sum: "$amount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  res.json({
    totalRevenue: totalRevenue[0]?.total || 0,
    pendingPayments,
    failedTransactions,
    monthly
  });
};
