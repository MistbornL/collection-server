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
        status: user.status,
        dateRegister: user.dateRegister,
        dateLastAuthorization: user.dateLastAuthorization,
      };
    });
    res.status(200).json(usersForFront);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.delete("/delete/:id", isLoggedIn, async (req, res) => {
  try {
    await User.remove({ _id: req.params.id });
    res.status(200).json({ message: "User has been deleted." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.post("/block/:id", isLoggedIn, async (req, res) => {
  console.log(req.params);
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "Blocked" });
    res.status(200).json({ message: "User has been Blocked." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.post("/unlock/:id", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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

router.get("/logout", isLoggedIn, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, { status: "Offline" });
    res.status(200).json({ message: "User changed." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

module.exports = router;
