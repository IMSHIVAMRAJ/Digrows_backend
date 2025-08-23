const User = require("../models/User");

// ✅ Get all users (for "All" tab)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// ✅ Send connection request
exports.sendRequest = async (req, res) => {
  const { fromUserId, toUserId } = req.body;

  try {
    const toUser = await User.findById(toUserId);
    if (!toUser.requests.includes(fromUserId)) {
      toUser.requests.push(fromUserId);
      await toUser.save();
    }
    res.json({ success: true, message: "Request sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send request" });
  }
};

// ✅ Accept request (move to teams for both users)
exports.acceptRequest = async (req, res) => {
  const { fromUserId, toUserId } = req.body;

  try {
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    // add in each other's team
    fromUser.teams.push(toUserId);
    toUser.teams.push(fromUserId);

    // remove request
    toUser.requests = toUser.requests.filter(id => id.toString() !== fromUserId);

    await fromUser.save();
    await toUser.save();

    res.json({ success: true, message: "Request accepted, now in team" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to accept request" });
  }
};

// ✅ Get team members (for "Team" tab)
exports.getTeam = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("teams", "name email role");
    res.json({ success: true, team: user.teams });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch team" });
  }
};
