const express = require("express");
const Message = require("../models/messageModel");
const { verifyJWT } = require("../middlewares/authMids");
const {
  createMessage,
  getAllMessages,
  updateMessageReadBy,
  deleteMessage,
} = require("../controllers/messageControllers");
const upload = require("../middlewares/multerUpload");
const router = express.Router();

router.post("/newMessage", verifyJWT, upload, createMessage);
router.get("/:chatId", verifyJWT, getAllMessages);
router.patch("/:messageId", verifyJWT, updateMessageReadBy);
router.put("/deleteMessage/:messageId", verifyJWT, deleteMessage);

module.exports = router;
