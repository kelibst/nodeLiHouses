const express = require("express");
const auth = require("../db/middlewares/auth");
const House = require("../db/models/houseModel.");
const router = new express.Router();

router.post("/v1/houses", auth, async (req, res) => {
  try {
    const house = House({
      ...req.body,
      author: req.user._id,
    });
    const curHse = await house.save();
    res.status(201).send(curHse);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/v1/houses", async (req, res) => {
  try {
    const houses = await House.find({});
    res.status(200).send(houses);
  } catch (error) {
    res.status(400).send("Couldn't get the houses.");
  }
});

module.exports = router;
