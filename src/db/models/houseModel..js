const mongoose = require("mongoose");
const { Schema } = mongoose;

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
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
const House = mongoose.model("House", houseSchema);

module.exports = House;
