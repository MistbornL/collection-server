const { Router } = require("express");
const User = require("../models/user");
const { isLoggedIn } = require("../controllers/middleware");

const router = Router();

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const users = await User.find();
    const usersForFront = users.map((user) => {
      return {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        dateRegister: user.dateRegister,
        dateLastAuthorization: Date.now(),
      };
    });
    res.status(200).json(usersForFront);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const email = req.query.email;
    const profile = await User.findOne({ email });
    res.status(200).json(profile);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.delete("/delete/:email", isLoggedIn, async (req, res) => {
  try {
    await User.remove({ email: req.params.email });
    res.status(200).json({ message: "User has been deleted." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.put("/block/:email", isLoggedIn, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { email: req.params.email },
      { status: "Blocked" }
    );
    res.status(200).json({ message: "User has been Blocked." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.put("/unblock/:email", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    console.log(user);
    if (user.status === "Blocked") {
      user.status = "Offline";
      await user.save();
      res.status(200).json({ message: "User has been Unlocked." });
    } else {
      res.status(202).json({ message: "User is not blocked." });
    }
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.put("/changeRole/:email", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user.role === "user") {
      user.role = "admin";
      await user.save();
      res.status(200).json({ message: "User role has been changed." });
    } else {
      user.role = "user";
      await user.save();
      res.status(200).json({ message: "User role has been changed." });
    }
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

module.exports = router;
