const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");

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
  console.log(userId);
  try {
    const user = await User.findById({ _id: userId }).select(
      "-password -email -isAdmin"
    );
    console.log(user);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error);
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
  const user = await User.findOne({ _id: req.user?._id });
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized action");
  }

  if (searchQuery) {
    const searchResult = await User.find({
      $or: [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { email: { $regex: new RegExp(searchQuery, "i") } },
      ],
    }).select("-password  -isAdmin");

    res.status(200).send(searchResult);
  }
});
module.exports = {
  authUser,
  registerUser,
  searchUsers,
  logoutUser,
  singleUser,
};
