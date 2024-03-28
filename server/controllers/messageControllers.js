const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// @desc create new message
// @route POST /api/message/newMessage
// @access private

const createMessage = asyncHandler(async (req, res) => {
  const { content, chatId, type } = req.body;

  if (!content || !chatId) {
    return res.status(404).send({ message: "Content or chatId not found" });
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
    type: type || "",
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
    const messages = await Message.find({
      chat: chatId,
      deletedBy: { $nin: [req.user._id] },
    })
      .populate("sender", "photoURL name ")
      .populate("chat");

    res.status(200).send(messages);
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

// @desc update message
// @route PATCH /api/message/:messageId
// @access private

const updateMessageReadBy = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId;

  try {
    await Message.findByIdAndUpdate(
      { _id: messageId },
      { $push: { readBy: req.user._id } },
      { new: true }
    );

    res.status(200).send({ message: `Message read by user ${req.user._id}` });
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

// @desc delete message
// @route put /api/message/deleteMessage/:messageId
// @access private

const deleteMessage = asyncHandler(async (req, res) => {
  const { deleteFor } = req.body;
  const messageId = req.params.messageId;

  console.log(req.body, messageId);

  try {
    const message = await Message.findOne({ _id: messageId });
    const isOwnMessage = message.sender === req.user._id;
    // if message not found
    if (!message) {
      return res.status(404).send({ message: "Message not found" });
    }
    // deleting for only me.
    if (deleteFor === "own") {
      await Message.updateOne(
        { _id: messageId },
        { $addToSet: { deletedBy: req.user._id } }
      );

      // deleting for everyone.but first check if the message getting deleted by the sender
    } else {
      if (!isOwnMessage) {
        return res.status(401).send({ message: "Failed to delete" });
      }

      await Message.deleteOne({ _id: messageId });
    }

    res.status(200).send({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

module.exports = {
  createMessage,
  getAllMessages,
  updateMessageReadBy,
  deleteMessage,
};
