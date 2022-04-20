const express = require("express");
const User = require("../db/models/userModel");
const router = new express.Router();

router.post("/v1/users", async (req, res) => {
  const user = User(req.body);
  try {
    const curUser = await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
