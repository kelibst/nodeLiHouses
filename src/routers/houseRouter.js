const express = require("express");
const House = require("../db/models/houseModel.");
const User = require("../db/models/userModel");
const router = new express.Router();

router.post("/v1/houses", async (req, res) => {
  const house = House(req.body);
  const user = User.findOneAndUpdate(
    { _id: house.author },
    { houses: house._id }
  );
  try {
    const curHse = await house.save();
    await User.findOneAndUpdate({ _id: house.author }, { houses: house._id });
    res.status(201).send(curHse);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
