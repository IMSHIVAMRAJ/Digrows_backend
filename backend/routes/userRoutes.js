const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/all", userController.getAllUsers);
router.post("/send-request", userController.sendRequest);
router.post("/accept-request", userController.acceptRequest);
router.get("/team/:userId", userController.getTeam);

module.exports = router;
