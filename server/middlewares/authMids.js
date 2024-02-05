const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const verifyJWT = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwtToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById({ _id: decoded.id }).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized action,invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized action,No token");
  }
});

module.exports = { verifyJWT };
