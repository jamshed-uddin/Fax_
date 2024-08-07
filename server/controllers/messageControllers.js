const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const getDataURI = require("../utils/getDataURI");
const {
  uploadToCLoud,
  deleteFromCloud,
} = require("../config/cloudinaryConfig");
const customError = require("../utils/customError");

// const uploadImage = asyncHandler(async (req, res) => {
//   const imageFile = req.file;

//   const fileUri = getDataURI(imageFile);

//   try {
//     const imageToCloud = await uploadToCLoud(fileUri.content);

//     res.status(200).send({ message: "Image recieved", data: imageToCloud });
//   } catch (error) {
//     res.status(500);
//     throw new Error(error.message);
//   }
// });

// @desc create new message
// @route POST /api/message/newMessage?type=''
// @access private

const createMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  const file = req.file;
  const type = req.query.type;

  try {
    if (type !== "image" && (!content || !chatId)) {
      throw customError(404, "Content or chatId not found");
    }

    let createNewMessage;

    if (type === "image") {
      // operation(file upload, create message) for image type message
      const fileUri = getDataURI(file);
      const cloudFileObj = await uploadToCLoud(fileUri.content);

      const newImageTypeMessage = {
        sender: req.user._id,
        chat: chatId,
        type: "image",
        file: cloudFileObj,
      };

      createNewMessage = await Message.create(newImageTypeMessage);
    } else {
      // operation for text type message
      const newMessage = {
        sender: req.user._id,
        content,
        chat: chatId,
        type: "text",
      };

      createNewMessage = await Message.create(newMessage);
    }

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
  } catch (error) {
    next(error);
  }
};

// @desc get all message
// @route GET /api/message/:chatId
// @access private

const getAllMessages = async (req, res, next) => {
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
    next(error);
  }
};

// @desc update message
// @route PATCH /api/message/:messageId
// @access private

const updateMessageReadBy = async (req, res, next) => {
  const messageId = req.params.messageId;

  try {
    await Message.findByIdAndUpdate(
      { _id: messageId },
      { $addToSet: { readBy: req.user._id } },
      { new: true }
    );

    res.status(200).send({ message: `Message read by user ${req.user._id}` });
  } catch (error) {
    next(error);
  }
};

// @desc delete message
// @route put /api/message/deleteMessage/:messageId
// @access private

const deleteMessage = async (req, res, next) => {
  const { deleteFor } = req.body;
  const messageId = req.params.messageId;

  try {
    const message = await Message.findOne({ _id: messageId });

    const isOwnMessage = message.sender.toString() === req.user._id.toString();
    // if message not found
    if (!message) {
      throw customError(404, "Message not found");
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
        throw customError(401, "Failed to delete");
      }

      if (message.type === "image") {
        if (message?.file?.publicId) {
          await deleteFromCloud(message?.file?.publicId);
        }
      }

      await Message.deleteOne({ _id: messageId });
    }

    res.status(200).send({ message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  updateMessageReadBy,
  deleteMessage,
};
