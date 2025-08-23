const jwt = require("jsonwebtoken");
const Expert = require("../models/Expert");

exports.protectExpert = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Expert.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};
