const mongoose = require("mongoose");
const User = require("../models/user");
const Quest = require("../models/quest");

mongoose.connect("mongodb://127.0.0.1:27017/todo-list-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
