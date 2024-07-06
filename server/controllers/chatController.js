const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const getDataURI = require("../utils/getDataURI");
const {
  uploadToCLoud,
  deleteFromCloud,
} = require("../config/cloudinaryConfig");
const customError = require("../utils/customError");

//@desc access or create chat
// route POST /api/chat/accessChat
//access private

const accessChat = async (req, res, next) => {
  try {
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
      await Chat.updateOne(
        { _id: chatExists[0]._id },
        { $pull: { deletedBy: req.user._id } }
      );
      res.status(200).send(chatExists[0]);
    } else {
      const chatData = {
        chatName: "",
        chatPhotoURL: "",
        users: [req.user._id, userId],
      };

      const newChat = await Chat.create(chatData);

      const newCreatedChat = await Chat.findOne({ _id: newChat._id }).populate({
        path: "users",
        select: " -password -email",
      });

      res.status(201).send(newCreatedChat);
    }
  } catch (error) {
    next(error);
  }
};

//@desc get all chat for specific user
//@route get /api/chat
//@access private

const getChats = async (req, res, next) => {
  try {
    // const allChat = await Chat.find({
    //   users: req.user._id,
    // })
    //   .populate("users", "name photoURL ")
    //   .populate({
    //     path: "latestMessage",
    //     populate: {
    //       path: "sender",
    //       select: "name photoURL",
    //     },
    //   })
    //   .exec();

    const allChat = await Chat.aggregate([
      {
        $match: {
          users: req.user._id,
          deletedBy: { $nin: [req.user._id] },
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "latestMessage",
          foreignField: "_id",
          as: "latestMessage",
        },
      },
      {
        $addFields: {
          latestMessage: {
            $arrayElemAt: ["$latestMessage", 0],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unset: ["users.email", "users.password", "users.isAdmin", "users.bio"],
      },

      {
        $lookup: {
          from: "users",
          localField: "latestMessage.sender",
          foreignField: "_id",
          as: "latestMessage.sender",
        },
      },
      {
        $addFields: {
          "latestMessage.sender": {
            $arrayElemAt: ["$latestMessage.sender", 0],
          },
        },
      },
      {
        $unset: [
          "latestMessage.sender.email",
          "latestMessage.sender.password",
          "latestMessage.sender.isAdmin",
          "latestMessage.sender.bio",
        ],
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    res.status(200).send(allChat);
  } catch (error) {
    next(error);
  }
};

//@desc get single chat
//@route POST /api/chat/:chatId
//@access private
const getSingleChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.chatId })
      .populate("latestMessage")
      .populate("users", "name photoURL")
      .populate({ path: "latestMessage.sender", select: "name photoURL" })
      .populate("groupAdmin");

    if (chat?.deletedBy.includes(req.user._id)) {
      await Chat.updateOne(
        { _id: chat._id },
        { $pull: { deletedBy: req.user._id } }
      );
    }

    res.status(200).send(chat);
  } catch (error) {
    next(error);
  }
};

//@desc create group
//@route POST /api/chat/group
//@access private

const createGroup = async (req, res, next) => {
  const { chatName, chatDescription, users } = req.body;
  const file = req.file;
  if (users.length < 2) {
    throw customError(400, "At least 2 members required to create a group. ");
  }

  try {
    let cloudFileObj;

    if (file) {
      const fileUri = getDataURI(file);
      cloudFileObj = await uploadToCLoud(fileUri.content);
    }

    const groupData = {
      chatName,
      chatDescription,
      users: JSON.parse(users),
      chatPhotoURL: cloudFileObj,
      groupAdmin: [req.user._id],
      isGroupChat: true,
    };
    const newGroup = await Chat.create(groupData);

    const newCreatedGroup = await Chat.findOne({ _id: newGroup._id }).populate({
      path: "users",
      select: " -password -email",
    });

    const newEventMessage = {
      content: "created this group",
      type: "event",
      chat: newCreatedGroup._id,
      sender: req.user._id,
    };
    await Message.create(newEventMessage);
    res.status(201).send(newCreatedGroup);
  } catch (error) {
    next(error);
  }
};

//@desc update group
//@route PUT /api/chat/group/:groupId
//@access private

const updateGroup = async (req, res, next) => {
  const groupId = req.params.groupId;
  const { chatName, users, chatDescription, deleteCurrentPhoto } = req.body;
  const file = req.file;

  try {
    let photoURLObj;
    const group = await Chat.findOne({ _id: groupId });

    // if (
    //   !group?.groupAdmin
    //     ?.map((admin) => admin._id)
    //     .includes(req.user._id.toString())
    // ) {
    //   return res.status(401).send({ message: "Unauthorized action" });
    // }

    if (file) {
      const fileUri = getDataURI(file);
      photoURLObj = await uploadToCLoud(fileUri.content);

      if (group?.chatPhotoURL.publicId) {
        await deleteFromCloud(group?.chatPhotoURL.publicId);
      }
    }

    if (deleteCurrentPhoto === "true") {
      const result = await deleteFromCloud(group?.chatPhotoURL.publicId);
      photoURLObj = {
        url: "https://i.ibb.co/mz6J26q/usergroup.png",
        publicId: "",
      };
    }

    const groupInfoToUpdate = {
      chatName: chatName || group.chatName,
      chatDescription: chatDescription || group.chatDescription,
      users: JSON.parse(users),
      chatPhotoURL: photoURLObj || group.chatPhotoURL,
    };

    const updatedGroup = await Chat.findByIdAndUpdate(
      { _id: groupId },
      groupInfoToUpdate,
      { new: true }
    );

    res.status(200).send(updatedGroup);
  } catch (error) {
    next(error);
  }
};

//@desc delete chat
//@route PUT /api/chat/deleteChat/:chatId
//@access private
const deleteChat = async (req, res, next) => {
  const chatId = req.params.chatId;

  try {
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      throw customError(404, "Chat not found");
    }

    await Message.updateMany(
      { chat: chatId },
      { $push: { deletedBy: req.user._id } }
    );

    await Chat.updateOne(
      { _id: chatId },
      { $push: { deletedBy: req.user._id } }
    );

    res.status(200).send({ message: "Chat deleted succesfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  accessChat,
  getChats,
  getSingleChat,
  createGroup,
  updateGroup,
  deleteChat,
};
