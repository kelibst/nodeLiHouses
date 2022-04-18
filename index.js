const express = require("express");
require("./src/db/app");
const userRouter = require("./src/routers/userRouter");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
