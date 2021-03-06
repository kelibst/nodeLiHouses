const express = require("express");
const User = require("../db/models/userModel");
const router = new express.Router();
const auth = require("../db/middlewares/auth");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email/sendEmail");
const clientURL = process.env.CLIENT_URL;
const bcryptSalt = process.env.BCRYPT_SALT;

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

router.patch("/v1/users/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allUpdates = ["dob", "firstname", "lastname", "favorites"];
  const isValidOp = updates.every((update) => allUpdates.includes(update));

  if (!isValidOp) {
    return res
      .status(400)
      .send(
        "Invalid Operation: You are most likely trying to update a field we do not have in the db."
      );
  }
  try {
    if (!req.user) {
      return res.status(404).send("User was not found!");
    }
    if (req.user.admin || req.user._id === _id) {
      await req.user.updateOne(req.body);
      return res.send("user update was successful!");
    } else {
      return res
        .status(400)
        .send({ error: "You need to be an admin to update a profile." });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/v1/users/password/reset", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).send({ error: "that email does not exist!" });
    if (user.tokens?.length) {
      user.tokens = [];
      await user.save();
    }
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
    const userResetPassword = {
      token: hash,
    };
    user.updateOne({
      resetToken: userResetPassword,
    });
    const link = `${clientURL}/v1/users/passwordReset?token=${resetToken}&id=${user._id}`;
    const sendMail = await sendEmail(
      user.email,
      "Password Reset Request",
      {
        name: user.name,
        link: link,
      },
      "./template/requestResetPassword.handlebars"
    );
    console.log(sendMail);
    res.send("password reset link was sent");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// router.patch("/v1/users/:id/password", auth, async (req, res) => {
//   const _id = req.params.id;
//   const updates = Object.keys(req.body);
//   const allUpdates = ["password"];
//   const isValidOp = updates.every((update) => allUpdates.includes(update));

//   if (!isValidOp) {
//     return res.status(400).status(400).send("Unable to update your password.");
//   }
//   try {
//     if (!req.user) {
//       return res.status(404).send("User was not found!");
//     }
//     if (req.user.admin || req.user._id === _id) {
//       await req.user.updateOne(req.body);
//       return res.send(req.user);
//     } else {
//       return res
//         .status(400)
//         .send({ error: "You need to be an admin to update a profile." });
//     }
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

module.exports = router;
