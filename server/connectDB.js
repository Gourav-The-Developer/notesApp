const mongoose = require("mongoose");
function connect() {
  mongoose.connect(
    "mongodb+srv://nikunj:gadia7420@cluster0.94xph.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("mongoDb connected");
}
module.exports = connect;
