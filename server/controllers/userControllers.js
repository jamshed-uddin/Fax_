const User = require("../models/userModel");

const asyncHandler = require("express-async-handler");
const router = require("../routes/userRoute");
const generateToken = require("../utils/generateToken");

//@desc auth user
//route POST/api/user/auth
//access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
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
    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
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
  const user = await User.findOne({ _id: req.user?._id });
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized action");
  }
  const searchQuery = req.query.query;

  if (searchQuery) {
    const searchResult = await User.find({
      $or: [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { email: { $regex: new RegExp(searchQuery, "i") } },
      ],
    }).select("-password -token -isAdmin");

    res.status(200).send(searchResult);
  }
});
module.exports = { authUser, registerUser, searchUsers };
