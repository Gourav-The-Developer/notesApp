const router = require("express").Router();
const { google } = require("googleapis");
const { vmmigration } = require("googleapis/build/src/apis/vmmigration");
const Jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { errorMonitor } = require("nodemailer/lib/xoauth2");
const User = require("../models/user");
const REDIRECT_uri = "https://developers.google.com/oauthplayground";
const client_ID =
  "293470734641-6qh2sv3rfjh05pqatgqamjjsnqmhilht.apps.googleusercontent.com";
const client_secret = "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";
const REFRESH_TOKEN =
  "1//04-cCZQGcWPEaCgYIARAAGAQSNwF-L9IrFV3ZVDPkfNjDfa9gEzO2btQ3WPi3VPcsuibDi21sxIWjzHqRPx4ccIMDCXtDPAnCKF4";

router.post("/signup", async (req, res) => {
  const oauth2client = new google.auth.OAuth2(
    client_ID,
    client_secret,
    REDIRECT_uri
  );
  const { email } = req.body;
  const userexist = await User.findOne({ Email: email });
  if (userexist) {
    console.log(userexist);
    res.status(404).json({
      success: false,
      message: "User already exist",
    });
    return;
  }
  oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });
  const user = new User();
  user.Email = email;
  await user.save();

  const accessToken = await oauth2client.getAccessToken();

  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mgadia1@gmail.com",
      type: "oauth2",
      clientId: client_ID,
      clientSecret: client_secret,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  const mailOptions = {
    from: "mgadia1@gmail.com", // Sender address
    to: email, // List of recipients
    subject: "Node Mailer", // Subject line
    text:
      "Thankyou for signing up in my website you can further continue and set your password through the link given below: https://localhost:3000/" +
      user.id, // Plain text body
  };
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info);
    }
  });
  res.status(200).json({
    success: true,
    msg: "user created",
  });
});

router.get("/signup/:id", async (req, res) => {
  try {
    const userexist = await User.findOne({ _id: req.params.id });
    if (!userexist) {
      return res.status(404).json({
        success: false,
        message: "Bad request",
      });
    }
    if (userexist.activated) {
      return res.status(404).json({
        success: false,
        message: "user already created",
      });
    }
    const user = await User.findOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      user: user.Email,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
});
router.put("/signup/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    Password: req.body.pass,
    Email: req.body.email,
    activated: true,
  });
  const payload = {
    user: {
      id: user.id,
    },
  };
  const refreshtoken = Jwt.sign(payload, "goAwayFromHerehihihihi", {
    expiresIn: "7d",
  });

  res.status(202).cookie("token", refreshtoken).json({
    success: true,
    message: "user created",
  });
});
router.post("/login", async (req, res) => {
  const { email } = req.body;
  const { pass } = req.body;
  console.log(email);
  const user = await User.findOne({ Email: email });
  console.log(user);
  if (user) {
    if (user.Password == pass) {
      const payload = {
        user: {
          id: user.id,
        },
      };
      const refreshtoken = Jwt.sign(payload, "goAwayFromHerehihihihi", {
        expiresIn: "7d",
      });

      res.status(200).cookie("token", refreshtoken).json({
        success: true,
        message: "user got logged in",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "password is incorrect",
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
});
router.post("/forgot", async (req, res) => {
  const oauth2client = new google.auth.OAuth2(
    client_ID,
    client_secret,
    REDIRECT_uri
  );
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }

  await User.findByIdAndUpdate(user.id, { activated: false });

  res.status(200).json({
    success: true,
    message: "sents",
  });
  oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });
  const accessToken = await oauth2client.getAccessToken();
  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mgadia1@gmail.com",
      type: "oauth2",
      clientId: client_ID,
      clientSecret: client_secret,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  const mailOptions = {
    from: "mgadia1@gmail.com", // Sender address
    to: req.body.email, // List of recipients
    subject: "Node Mailer", // Subject line
    text:
      "you can reset your password in the following site : http://localhost:3000/" +
      user.id, // Plain text body
  };
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info);
    }
  });
});
router.get("/token", async (req, res) => {
  try {
    var user;
    console.log(req.cookies);
    const token = req.cookies.token;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "login",
      });
    }
    await Jwt.verify(
      req.cookies.token,
      "goAwayFromHerehihihihi",
      (err, decoded) => {
        if (err) {
          return res.status(401).json({
            msg: "Token not valid",
          });
        } else {
          const payload = {
            user: {
              id: decoded.user.id,
            },
          };
          const token = Jwt.sign(payload, "goAwayFromHere", {
            expiresIn: "1h",
          });
          return res.status(200).json({
            success: true,
            token: token,
          });
        }
      }
    );
  } catch (err) {
    console.log("Something wend wrong with middleware " + err);
    res.json(500).json({
      msg: "Server error",
    });
  }
});

module.exports = router;
