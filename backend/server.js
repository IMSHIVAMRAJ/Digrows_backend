const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
require('dotenv').config();

const profileRoutes = require('./routes/profile');
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team');
const walletRoutes = require('./routes/wallet');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/team', teamRoutes); 
app.use('/api/wallet', walletRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
