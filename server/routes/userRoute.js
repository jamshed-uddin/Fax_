const express = require("express");
const { verifyJWT } = require("../middlewares/authMids");
const {
  authUser,
  registerUser,
  searchUsers,
  logoutUser,
  singleUser,
  updateUser,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteUser,
} = require("../controllers/userControllers");
const upload = require("../middlewares/multerUpload");

const router = express.Router();

router.post("/auth", authUser);
router.post("/", registerUser);
router.post("/logout", verifyJWT, logoutUser);
router.get("/", verifyJWT, searchUsers);
router.get("/singleUser", singleUser);
router.put("/", verifyJWT, upload, updateUser);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);
router.put("/changePassword", verifyJWT, changePassword);
router.delete("/deleteUser", verifyJWT, deleteUser);

module.exports = router;
