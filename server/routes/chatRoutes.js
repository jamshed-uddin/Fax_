const express = require("express");
const { verifyJWT } = require("../middlewares/authMids");
const {
  accessChat,
  getChats,
  getSignleChat,
  createGroup,
  updateGroup,
  deleteChat,
} = require("../controllers/chatController");
const upload = require("../middlewares/multerUpload");
const router = express.Router();

router.post("/accessChat", verifyJWT, accessChat);
router.get("/", verifyJWT, getChats);
router.get("/:chatId", verifyJWT, getSignleChat);
router.post("/group", verifyJWT, upload, createGroup);
router.put("/group/:groupId", verifyJWT, upload, updateGroup);
router.put("/deleteChat/:chatId", verifyJWT, deleteChat);
module.exports = router;
