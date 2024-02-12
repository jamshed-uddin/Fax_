const express = require("express");
const { verifyJWT } = require("../middlewares/authMids");
const {
  accessChat,
  getChats,
  getSignleChat,
  createGroup,
  updateGroup,
} = require("../controllers/chatController");
const router = express.Router();

router.post("/accessChat", verifyJWT, accessChat);
router.get("/", verifyJWT, getChats);
router.get("/:chatId", verifyJWT, getSignleChat);
router.get("/group", verifyJWT, createGroup);
router.get("/group/:groupId", verifyJWT, updateGroup);
module.exports = router;
