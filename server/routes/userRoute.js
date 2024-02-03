const express = require("express");
const { authUser, registerUser } = require("../controllers/userControllers");
const router = express.Router();

router.post("/auth", authUser);
router.post("/", registerUser);
router.post("/logout");

module.exports = router;
