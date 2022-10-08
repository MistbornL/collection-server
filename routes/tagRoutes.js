const { Router } = require("express");
const Tag = require("../models/tags");

const router = Router();

router.post("/create", async (req, res) => {
  try {
    const tag = new Tag();
    await tag.save();
    res.status(200).json({ message: "Tag has been created." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags[0].tags.sort());
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

module.exports = router;
