const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  housename: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  region: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});
const House = mongoose.model("Houses", houseSchema);

module.exports = House;
