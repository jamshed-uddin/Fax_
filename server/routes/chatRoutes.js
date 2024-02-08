const express = require("express");
const { verifyJWT } = require("../middlewares/authMids");
const {
  accessChat,
  getChats,
  getSignleChat,
} = require("../controllers/chatController");
const router = express.Router();

router.post("/accessChat", verifyJWT, accessChat);
router.get("/", verifyJWT, getChats);
router.get("/:chatId", verifyJWT, getSignleChat);

module.exports = router;
