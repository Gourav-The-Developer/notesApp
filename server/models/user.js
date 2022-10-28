const mongoose = require("mongoose");

const User = mongoose.Schema({
  Email: {
    type: String,
  },
  Password: {
    type: String,
  },
  activated: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("user", User);
