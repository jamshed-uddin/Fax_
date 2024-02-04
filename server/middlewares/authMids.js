const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findOne(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized action,invalid token");
    }
  } else {
    res.status(400);
    throw new Error("Unauthorized action, no token");
  }
};

module.exports = { verifyJWT };
