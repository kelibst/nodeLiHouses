const mongoose = require("mongoose");
require("dotenv").config();
let DB_URL = process.env.DB_URL;
try {
  mongoose.connect(DB_URL);
} catch (error) {
  console.log(error);
}
