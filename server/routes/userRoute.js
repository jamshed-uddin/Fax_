const express = require("express");
const {
  authUser,
  registerUser,
  searchUsers,
  logoutUser,
} = require("../controllers/userControllers");
const { verifyJWT } = require("../middlewares/authMids");
const router = express.Router();

router.post("/auth", authUser);
router.post("/", registerUser);
router.post("/logout", logoutUser);
router.get("/", verifyJWT, searchUsers);

module.exports = router;
