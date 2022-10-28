const mongoose = require("mongoose");

const Notes = new mongoose.Schema({
  title: {
    type: String,
  },
  published: {
    type: Boolean,
  },
  note: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
});
module.exports = mongoose.model("notes", Notes);
