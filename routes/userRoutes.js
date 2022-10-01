const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const usersForFront = users.map((user) => {
      return {
        id: user._id,
        userName: user.userName,
      };
    });
    res.status(200).json(usersForFront);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

module.exports = router;
