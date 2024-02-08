const express = require("express");
const { verifyJWT } = require("../middlewares/authMids");
const {
  authUser,
  registerUser,
  searchUsers,
  logoutUser,
  singleUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/auth", authUser);
router.post("/", registerUser);
router.post("/logout", verifyJWT, logoutUser);
router.get("/", verifyJWT, searchUsers);
router.get("/singleUser", singleUser);

module.exports = router;
