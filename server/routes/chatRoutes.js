const express = require("express");
const { verifyJWT } = require("../middlewares/authMids");
const {
  accessChat,
  getChats,

  createGroup,
  updateGroup,
  deleteChat,
  getSingleChat,
} = require("../controllers/chatController");
const upload = require("../middlewares/multerUpload");
const router = express.Router();

router.post("/accessChat", verifyJWT, accessChat);
router.get("/", verifyJWT, getChats);
router.get("/:chatId", verifyJWT, getSingleChat);
router.post("/group", verifyJWT, upload, createGroup);
router.put("/group/:groupId", verifyJWT, upload, updateGroup);
router.put("/deleteChat/:chatId", verifyJWT, deleteChat);
module.exports = router;
