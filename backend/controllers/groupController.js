const Group = require("../models/Group");

// ✅ Create new group
exports.createGroup = async (req, res) => {
  const { name, members, createdBy } = req.body;

  try {
    const group = await Group.create({ name, members, createdBy });
    res.json({ success: true, group });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create group" });
  }
};

// ✅ Get groups of a user
exports.getUserGroups = async (req, res) => {
  const { userId } = req.params;

  try {
    const groups = await Group.find({ members: userId }).populate("members", "name email");
    res.json({ success: true, groups });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch groups" });
  }
};
