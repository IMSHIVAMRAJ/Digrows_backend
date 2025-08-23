const Expert = require('../models/Expert');

// ✅ Update pricing (expert, mentor, investor)
exports.updatePricing = async (req, res) => {
  try {
    const userId = req.user.id; // token se milega
    const { chatFee, chatDurationMinutes, audioFee, audioDurationMinutes, videoFee, videoDurationMinutes } = req.body;

    // find by ID
    const person = await Expert.findById(userId);
    if (!person) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // update fields
    person.chatFee = chatFee ?? person.chatFee;
    person.chatDurationMinutes = chatDurationMinutes ?? person.chatDurationMinutes;
    person.audioFee = audioFee ?? person.audioFee;
    person.audioDurationMinutes = audioDurationMinutes ?? person.audioDurationMinutes;
    person.videoFee = videoFee ?? person.videoFee;
    person.videoDurationMinutes = videoDurationMinutes ?? person.videoDurationMinutes;

    await person.save();

    res.json({
      success: true,
      message: `${person.type} pricing updated successfully`,
      person
    });
  } catch (err) {
    console.error("Error updating pricing:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get logged-in user details (expert/mentor/investor)
exports.getProfileDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const person = await Expert.findById(userId, "-password");
    if (!person) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      profile: person
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
