const Admin = require('../models/Admin');
const User = require('../models/User');
const Expert = require('../models/Expert');
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    // 🧠 Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in .env");
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err); // 👈 add this
    res.status(500).json({ message: 'Login failed', err });
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.getExperts = async (req, res) => {
  const experts = await Expert.find();
  res.json(experts);
};

exports.getChats = async (req, res) => {
  const chats = await ChatSession.find().populate('user expert');
  res.json(chats);
};

exports.getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;
  const messages = await Message.find({ senderId, receiverId });
  res.json(messages);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};
