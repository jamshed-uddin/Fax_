const express = require("express");
const { verifyJWT } = require("../middlewares/authMids");
const {
  createMessage,
  getAllMessages,
} = require("../controllers/messageControllers");
const router = express.Router();

router.post("/newMessage", verifyJWT, createMessage);
router.get("/:chatId", verifyJWT, getAllMessages);

module.exports = router;
