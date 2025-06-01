const User = require('../models/User'); // ya 'Expert' agar experts ke liye bhi team banani hai

// 🔹 GET: Fetch My Team
const getMyTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('team', 'fullName email phone'); // Populate team details
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ success: true, team: user.team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// 🔹 GET: Browse Users Not in Team
const getUsersNotInTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const teamIds = user.team.map(member => member.toString());
    teamIds.push(id); // Exclude self also

    const others = await User.find({ _id: { $nin: teamIds } }).select('fullName email phone');
    res.status(200).json({ success: true, users: others });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// 🔹 POST: Add User to Team
const addToTeam = async (req, res) => {
  try {
    const { userId, memberId } = req.body;

    const user = await User.findById(userId);
    const member = await User.findById(memberId);

    if (!user || !member) {
      return res.status(404).json({ success: false, message: 'User or member not found' });
    }

    if (user.team.includes(memberId)) {
      return res.status(400).json({ success: false, message: 'Member already in your team' });
    }

    user.team.push(memberId);
    await user.save();

    res.status(200).json({ success: true, message: 'Member added to your team', team: user.team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getMyTeam,
  getUsersNotInTeam,
  addToTeam
};
