const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const getDataURI = require("../utils/getDataURI");
const {
  uploadToCLoud,
  deleteFromCloud,
} = require("../config/cloudinaryConfig");
//@desc auth user
//route POST/api/user/auth
//access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
      });
    } else {
      res.status(400);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// @desc single user
// route POST api/user/singleUser
// access private
const singleUser = asyncHandler(async (req, res) => {
  const userId = req.query.userId;

  try {
    const user = await User.findById({ _id: userId }).select(
      "-password -email -isAdmin"
    );

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// @desc user logout
// route POST api/user/logout
// access public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwtToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).send({ message: "User logged out" });
});

//@desc create user
//route POST/api/user
//access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("Account already exists with this email.");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user info");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

//@desc serach user
//route GET api/user?query=''
//access private

const searchUsers = asyncHandler(async (req, res) => {
  const searchQuery = req.query.query;

  try {
    if (searchQuery) {
      const users = await User.find({
        $or: [
          { name: { $regex: new RegExp(searchQuery, "i") } },
          { email: { $regex: new RegExp(searchQuery, "i") } },
        ],
      }).select("-password  -isAdmin -email");

      const chats = await Chat.find({
        chatName: { $regex: new RegExp(searchQuery, "i") },
      });

      const searchResult = { users, chats };

      res.status(200).send(searchResult);
    } else {
      res.status(200).send({});
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

//@desc update user
//route PUT api/user
//access private

const updateUser = asyncHandler(async (req, res) => {
  const bodyToUpdate = req.body;
  const { deleteCurrentPhoto } = req.body;
  const file = req.file;

  try {
    let updatedProfile;
    const user = await User.findOne({ _id: req.user._id });

    // when user just delete the profile photo
    if (deleteCurrentPhoto) {
      if (user?.photoURL.publicId) {
        await deleteFromCloud(user.photoURL.publicId);
      }
      updatedProfile = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          photoURL: {
            url: "https://i.ibb.co/Twp960D/default-profile-400x400.png",
            publicId: "",
          },
        },
        {
          new: true,
        }
      );
      return res
        .status(200)
        .send({ message: "User updated successfully", data: updatedProfile });
    }

    // when user change profile photo
    if (file) {
      const fileUri = getDataURI(file);
      const cloudFileObj = await uploadToCLoud(fileUri.content);
      await deleteFromCloud(user.photoURL.publicId); // deleting current profile photo from cloud before updating with new one
      updatedProfile = await User.findOneAndUpdate(
        { _id: req.user._id },
        { photoURL: cloudFileObj },
        {
          new: true,
        }
      );
      return res
        .status(200)
        .send({ message: "User updated successfully", data: updatedProfile });
    }

    // when user change name or bio
    updatedProfile = await User.findOneAndUpdate(
      { _id: req.user._id },
      bodyToUpdate,
      {
        new: true,
      }
    );

    res
      .status(200)
      .send({ message: "User updated successfully", data: updatedProfile });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

//@desc forget password request to server
//route POST api/user/forgotPassword
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        message: "Couldn't send sign in link.Wait before trying again.",
      });
    }

    const resetToken = await user.getResetPasswordToken();

    await user.save();

    const resetURL = `http://localhost:5173/resetPassword/${resetToken}`;
    const message = `
<h3>Hey ${user.name}</h3>
<p>
Reset your Fax password by clicking the link below.If you did not request for password reset, please ignore this email.
</p>
<a href=${resetURL} clicktracking=off>Reset password</a>
`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password reset",
        text: message,
      });

      res.status(200).send({ message: "Email send" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpire = undefined;
      await user.save();
      return res.status(401).send({
        message: "Couldn't send sign in link.Wait before trying again.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error(error.message);
  }
});

//@desc reset password
//route PUT api/user/resetPassword
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).send({
        message: "Link expired or invalid reset link.",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();
    res.status(200).send({ message: "Password reset success" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@desc change password
//route PUT api/user/changePassword
//access private

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(401).send({
        message: "Unauthorized action",
      });
    }

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).send({
        message: "Couldn't change password.Wait before trying again.",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(201).send({ message: "Password changed" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@desc delete user
//route Delete api/user/deleteUser
//access private
const deleteUser = asyncHandler(async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!(await user.matchPassword(password))) {
      return res
        .status(401)
        .send({ message: "Couldn't delete account.Wait before trying again." });
    }

    const chatFilterOption = {
      users: { $size: 1, $in: [req.user._id] },
    };
    // getting all chat that's only participent is the user
    const prevChat = await Chat.find(chatFilterOption);

    // for (const chat of prevChat) {
    //   await Message.deleteMany({ chat: chat._id });
    // }

    // deleteing messages of those chat where user is the only participent
    await Message.deleteMany({
      chat: { $in: prevChat.map((chat) => chat._id) },
    });

    // then deleting those chat that only participent is the user
    await Chat.deleteMany(chatFilterOption);

    // pulling user from that chats or group where user is not the only participent
    await Chat.updateMany(
      { users: req.user._id },
      { $pull: { users: req.user._id } }
    );
    // finally deleting the user
    await User.deleteOne({ _id: req.user._id });

    res.status(200).send({ message: "User deleted" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  authUser,
  registerUser,
  searchUsers,
  logoutUser,
  singleUser,
  updateUser,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteUser,
};
