const express = require("express");
const User = require("../db/models/userModel");
const router = new express.Router();
const auth = require("../db/middlewares/auth");

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

router.post("/v1/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = await req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(400);
  }
});

router.post("/v1/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(400);
  }
});

router.post("/v1/users/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Empty request body");
  }
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

router.patch("/v1/users/", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allUpdates = [
    "username",
    "email",
    "dob",
    "firstname",
    "lastname",
    "favorites",
  ];
  const isValidOp = updates.every((update) => allUpdates.includes(update));

  if (!isValidOp) {
    return res
      .status(400)
      .send(
        "Invalid Operation: You are most likely trying to update a field we do not have in the db."
      );
  }
  try {
    if (!req.user || !req.user?.admin) {
      return res.status(404).send("User was not found!");
    }
    await req.user.updateOne(req.body);
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
