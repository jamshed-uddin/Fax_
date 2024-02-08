const asyncHandler = require("express-async-handler");

const Chat = require("../models/chatModel");

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
    .populate("latestMessage")
    .populate({ path: "latestMessage.sender", select: "name email pic" });

  if (chatExists) {
    res.status(200).send(chatExists);
  } else {
    const chatData = {
      chatName: "singleChat",
      user: [req.user._id, userId],
    };

    try {
      const newChat = await Chat.create(chatData);

      const newCreatedChat = await Chat.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );

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
      users: { $elemeMatch: { $eq: req.user._id } },
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
      .populate("user", "-password")
      .populate({ path: "latestMessage.sender", select: "name email pic" });

    res.status(200).send(allChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { accessChat, getChats, getSignleChat };
