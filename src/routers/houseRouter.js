const express = require("express");
const auth = require("../db/middlewares/auth");
const House = require("../db/models/houseModel.");
const router = new express.Router();

router.post("/v1/houses", auth, async (req, res) => {
  const house = House(req.body);

  try {
    const curHse = await house.save();
    res.status(201).send(curHse);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
