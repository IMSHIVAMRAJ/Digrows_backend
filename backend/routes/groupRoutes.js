const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.post("/create", groupController.createGroup);
router.get("/my-groups/:userId", groupController.getUserGroups);


module.exports = router;
