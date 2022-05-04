const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismynewtoken");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error({ error: "Invalid token" });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(201).send({ error: "Authentication error" });
  }
};

module.exports = auth;
