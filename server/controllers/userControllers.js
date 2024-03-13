const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const Chat = require("../models/chatModel");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
//@desc auth user
//route POST/api/user/auth
//access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
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
    res.status(404);
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
});

//@desc serach user
//route GET api/user?query=''
//access private

const searchUsers = asyncHandler(async (req, res) => {
  const searchQuery = req.query.query;

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
});

//@desc update user
//route PUT api/user
//access private

const updateUser = asyncHandler(async (req, res) => {
  const bodyToUpdate = req.body;

  try {
    await User.findOneAndUpdate({ _id: req.user._id }, bodyToUpdate, {
      new: true,
    });

    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@desc forget password request to server
//route POST api/user/forgotPassword
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        message: "Couldn't send sign in link.Wait before trying again.",
      });
    }

    const resetToken = await user.getResetPasswordToken();
    console.log("resettoken", resetToken);
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
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpire = undefined;
      user.save();
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
        message: "Invalid reset token.Wait before trying again.",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    user.save();
    res.status(200).send({ message: "Password reset success" });
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
};
