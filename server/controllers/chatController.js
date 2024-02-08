const asyncHandler = require("express-async-handler");

const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@desc access or create chat
// route POST /api/chat/accessChat
//access private

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(404).send({ message: "UserId not found" });
  }

  const chatExists = await Chat.find({
    isGroupChat: false,

    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate({
      path: "users",
      select: " -password -email",
    })
    .populate("latestMessage")
    .populate({ path: "latestMessage.sender", select: "name email pic" });

  if (chatExists.length) {
    res.status(200).send(chatExists[0]);
  } else {
    const user = await User.findOne({ _id: userId });

    const chatData = {
      chatName: user?.name,
      chatPhotoURL: user?.photoURL,
      users: [req.user._id, userId],
    };

    try {
      const newChat = await Chat.create(chatData);

      const newCreatedChat = await Chat.findOne({ _id: newChat._id }).populate({
        path: "users",
        select: " -password -email",
      });
      console.log("new chat", newCreatedChat);
      res.status(201).send(newCreatedChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//@desc get all chat for specific user
//@route POST /api/chat
//@access private

const getChats = asyncHandler(async (req, res) => {
  try {
    const allChat = await Chat.find({
      users: req.user._id,
    })

      .populate("latestMessage")
      .populate({ path: "latestMessage.sender", select: "name email pic" });

    res.status(200).send(allChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@desc get single chat
//@route POST /api/chat/:chatId
//@access private
const getSignleChat = asyncHandler(async (req, res) => {
  try {
    const allChat = await Chat.findOne({ _id: req.params.chatId })
      .populate("latestMessage")
      .populate("user", "-password -email")
      .populate({ path: "latestMessage.sender", select: "name email pic" });

    res.status(200).send(allChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { accessChat, getChats, getSignleChat };
