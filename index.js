const express = require("express");
// const cors = require("cors");
require("./src/db/app");
const userRouter = require("./src/routers/userRouter");
const houseRouter = require("./src/routers/houseRouter");

const app = express();
const port = process.env.PORT || 3001;

// app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(houseRouter);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
