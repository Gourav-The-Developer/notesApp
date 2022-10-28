const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const token = req.header("Authorization");
  console.log(req.headers);
  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied",
    });
  }

  console.log(token);
  try {
    await jwt.verify(token, "goAwayFromHere", (err, decoded) => {
      if (err) {
        res.status(401).json({
          msg: "Token not valid",
        });
      } else {
        req.user = decoded.user;
        console.log(req.user.id);
        next();
      }
    });
  } catch (err) {
    console.log("Something wend wrong with middleware " + err);
    res.json(500).json({
      msg: "Server error",
    });
  }
};
