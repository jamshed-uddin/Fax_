const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// @desc create new message
// @route POST /api/message/newMessage
// @access private

const createMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(404).send({ message: "Content not found" });
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    const createNewMessage = await Message.create(newMessage);

    const createdNewMessage = await Message.findOne({
      _id: createNewMessage._id,
    })
      .populate("sender", "name photoURL")
      .populate("chat");

    await Chat.findByIdAndUpdate(
      { _id: chatId },
      { latestMessage: createNewMessage._id }
    );

    res.status(201).send(createdNewMessage);
  } catch (error) {}
});

// @desc get all message
// @route GET /api/message/:chatId
// @access private

const getAllMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "photoURL name ")
      .populate("chat");

    res.status(200).send(messages);
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

module.exports = { createMessage, getAllMessages };
