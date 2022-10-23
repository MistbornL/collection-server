require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const User = require("../models/user"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const { isLoggedIn } = require("./middleware");
const axios = require("axios");

const router = Router(); // create router to create route bundle

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const SECRET = process.env.SECRET;

// Signup route to create a new user
router.post("/signup", async (req, res) => {
  try {
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const candidate = await User.findOne({ email: req.body.email });
    if (candidate) {
      res.status(409).json({ error: "email already exists" });
    } else {
      const user = await User.create(req.body);
      res.json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  var newDate = year + "/" + month + "/" + day;

  if (req.body.googleAccessToken) {
    // google-auth
    const { googleAccessToken } = req.body;

    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const firstName = response.data.name;
        const lastName = response.data.given_name;
        const email = response.data.email;

        const result = await User.findOne({ email });

        if (result) {
          const token = jwt.sign(
            {
              email: result.email,
              id: result._id,
            },
            SECRET,
            { expiresIn: 60 * 60 }
          );

          return res.status(200).json({ token, result });
        }

        if (result && result.status === "blocked") {
          return res.status(403).json({ message: "user is blocked." });
        } else {
          const result = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            dateLastAuthorization: newDate,
            status: "online",
            theme: "light",
          });

          const token = jwt.sign(
            {
              email: result.email,
              id: result._id,
            },
            SECRET,
            { expiresIn: 60 * 60 }
          );
          res.status(200).json({ result, token });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: err });
      });
  } else {
    try {
      // check if the user exists
      const user = await User.findOne({ email: req.body.email });
      if (user.status === "Blocked") {
        return res.status(403).json({ message: "This email is blocked." });
      }

      if (user) {
        //check if password matches
        const result = bcrypt.compare(req.body.password, user.password);
        if (result) {
          // sign token and send it in response
          const token = jwt.sign({ email: user.email }, SECRET, {
            expiresIn: 60 * 60,
          });
          user.dateLastAuthorization = newDate;
          user.status = "Online";
          await user.save();
          res.json({ user, token, userId: user.id });
        } else {
          res.status(401).json({ error: "password doesn't match" });
        }
      } else {
        res.status(404).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  }
});

router.get("/logout", isLoggedIn, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { email: req.query.email },
      { status: "Offline" }
    );
    res.status(200).json({ message: "User changed." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

module.exports = router;
