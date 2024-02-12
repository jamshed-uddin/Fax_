const express = require("express");
const Message = require("../models/messageModel");
const { verifyJWT } = require("../middlewares/authMids");
const {
  createMessage,
  getAllMessages,
  updateMessageReadBy,
} = require("../controllers/messageControllers");
const router = express.Router();

router.post("/newMessage", verifyJWT, createMessage);
router.get("/:chatId", verifyJWT, getAllMessages);
router.patch("/:messageId", verifyJWT, updateMessageReadBy);

module.exports = router;
