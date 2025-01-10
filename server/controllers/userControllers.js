const User = require("../models/userModel");
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
const customError = require("../utils/customError");
//@desc auth user
//route POST/api/user/auth
//access public
const authUser = async (req, res, next) => {
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
      throw customError(400, "Invalid credentials");
    }
  } catch (error) {
    next(error);
  }
};

// @desc single user
// route GET api/user/singleUser
// access private
const singleUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById({ _id: userId }).select(
      "-password -email -isAdmin"
    );

    if (user) {
      res.status(200).send(user);
    } else {
      throw customError(404, "User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc user logout
// route POST api/user/logout
// access public
const logoutUser = async (req, res) => {
  res.cookie("jwtToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).send({ message: "User logged out" });
};

//@desc create user
//route POST/api/user
//access public
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw customError(400, "Account already exists with this email.");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    generateToken(res, user._id);
    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

//@desc serach user
//route GET api/user?query=''
//access private

const searchUsers = async (req, res, next) => {
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
    next(error);
  }
};

//@desc update user
//route PUT api/user
//access private

const updateUser = async (req, res, next) => {
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
    next(error);
  }
};

//@desc forget password request to server
//route POST api/user/forgotPassword
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw customError(
        401,
        "Couldn't send sign in link.Wait before trying again"
      );
    }

    const resetToken = await user.getResetPasswordToken();

    await user.save();
    const urlOrigin = req.headers.origin || "https://fax-pbi7.onrender.com";
    const resetURL = `${urlOrigin}/resetPassword/${resetToken}`;
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
      throw customError(
        401,
        "Couldn't send sign in link.Wait before trying again"
      );
    }
  } catch (error) {
    next();
  }
};

//@desc reset password
//route PUT api/user/resetPassword
const resetPassword = async (req, res, next) => {
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
      throw customError(401, "Link expired or invalid reset link.");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();
    res.status(200).send({ message: "Password reset success" });
  } catch (error) {
    next(error);
  }
};

//@desc change password
//route PUT api/user/changePassword
//access private

const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(401).send({
        message: "Unauthorized action",
      });
    }

    if (!(await user.matchPassword(currentPassword))) {
      throw customError(
        401,
        "Couldn't change password.Wait before trying again."
      );
    }

    user.password = newPassword;
    await user.save();
    res.status(201).send({ message: "Password changed" });
  } catch (error) {
    next(error);
  }
};

//@desc delete user
//route Delete api/user/deleteUser
//access private
const deleteUser = async (req, res, next) => {
  const { password } = req.body;

  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!(await user.matchPassword(password))) {
      throw customError(
        401,
        "Couldn't delete account.Wait before trying again."
      );
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
    next(error);
  }
};

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
