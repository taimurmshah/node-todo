const express = require("express");
require("./db/mongoose");
const userRouter = require("./routes/user");
const questRouter = require("./routes/quest");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(userRouter);
app.use(questRouter);

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
