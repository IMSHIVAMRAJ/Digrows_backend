// controllers/searchController.js
const User = require("../models/User");
const Expert = require("../models/Expert");

exports.globalSearch = async (req, res) => {
  try {
    const { q, type } = req.query; // frontend se query aayegi ?q=abc&type=expert

    if (!q) {
      return res.status(400).json({ success: false, message: "Search query required" });
    }

    let result = {};

    // Agar sirf expert search karna hai
    if (type === "expert") {
      result.experts = await Expert.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
        ],
      });
    }
    // Agar sirf user search karna hai
    else if (type === "user") {
      result.users = await User.find({
        name: { $regex: q, $options: "i" },
      });
    }
    // Agar sab me search karna hai
    else {
      result.users = await User.find({ name: { $regex: q, $options: "i" } });
      result.experts = await Expert.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
        ],
      });
    }

    res.json({ success: true, result });
  } catch (err) {
    console.error("Error in search:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
