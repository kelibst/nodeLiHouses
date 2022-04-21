const express = require("express");
const User = require("../db/models/userModel");
const router = new express.Router();

router.post("/v1/users", async (req, res) => {
  try {
    const user = User(req.body);
    const curUser = await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ curUser, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/v1/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400);
  }
});

router.post("/v1/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res
      .status(400)
      .send({ error: "Unable to login check you username or password" });
  }
});

module.exports = router;
