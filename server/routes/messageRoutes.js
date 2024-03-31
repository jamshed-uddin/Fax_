const express = require("express");
const Message = require("../models/messageModel");
const { verifyJWT } = require("../middlewares/authMids");
const {
  createMessage,
  getAllMessages,
  updateMessageReadBy,
  deleteMessage,
  uploadImage,
} = require("../controllers/messageControllers");
const upload = require("../middlewares/multerUpload");
const router = express.Router();

router.post("/newMessage", verifyJWT, createMessage);
router.get("/:chatId", verifyJWT, getAllMessages);
router.patch("/:messageId", verifyJWT, updateMessageReadBy);
router.put("/deleteMessage/:messageId", verifyJWT, deleteMessage);
router.post("/uploadImage", upload, uploadImage);

module.exports = router;
