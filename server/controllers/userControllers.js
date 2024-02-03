const User = require("../models/userModel");

const asyncHandler = require("express-async-handler");
const router = require("../routes/userRoute");
const generateToken = require("../utils/generateToken");

//@desc auth user
//route POST/api/users/auth
//access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //   const user = await User.findOne({ email });
  const user = true;

  if (user) {
    res.status(201).send({ message: "User logged in" });
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

module.exports = { authUser, registerUser };
