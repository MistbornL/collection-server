const Message = require("../models/message");
const User = require("../models/user");
const { Router } = require("express");

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const candidate = await User.findOne({ userName: req.body.userName });
    if (candidate) {
      res.status(200).json(candidate);
    } else {
      const user = new User({
        userName: req.body.userName,
      });
      await user.save();
      return res.json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

router.post("/sendMessage", async (req, res) => {
  try {
    const message = await Message.create(req.body);
    await message.save();
    res.json(message);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

router.get("/messages", async (req, res) => {
  try {
    const receiver = req.query.receiver;
    const messages = await Message.find();
    const messagesForFront = messages.filter(
      (message) => message.receiver === receiver
    );
    console.log(messagesForFront);
    res.status(200).json(messagesForFront);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

module.exports = router;
