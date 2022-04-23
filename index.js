const express = require("express");
require("./src/db/app");
const userRouter = require("./src/routers/userRouter");
const houseRouter = require("./src/routers/houseRouter");
const House = require("./src/db/models/houseModel.");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(userRouter);
app.use(houseRouter);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

// const main = async () => {
//   // const user = await User.findById("626196de4f20265786a8a71d");
//   // await user.populate("houses");
//   // console.log(user.houses);

//   const hse = await House.findById("6263415559596ad5d1c1d350");
//   await hse.populate("author");
//   console.log(hse.author);
// };

// main();
