const express = require("express");
require("./db/app");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
