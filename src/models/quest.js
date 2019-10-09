const mongoose = require("mongoose");

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const Quest = mongoose.model("Quest", questSchema);

module.exports = Quest;
