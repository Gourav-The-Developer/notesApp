//importing modules
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const connectDb = require("./connectDB");
connectDb();
const app = express();
app.use(cookieParser());
app.listen(9000);
app.use(
  express.json({
    urlencoded: true,
  })
);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);

app.use(express.json({}));
app.use("/user", require("./router/user"));

const corsOptions = {
  origin: "http://localhost:3000/",
};
app.use("/notes", require("./router/Notes"));
