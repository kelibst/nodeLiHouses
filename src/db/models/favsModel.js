const mongoose = require("mongoose");

const favsSchema = new mongoose.Schema({});

const Fav = mongoose.model("Favorites", favsSchema);

module.exports = Fav;
