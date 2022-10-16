const { Router } = require("express");
const Item = require("../models/item");
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

router.get("/search/", async (req, res) => {
  try {
    const items = await Item.find();
    var found = [];

    items.map((item) => {
      item.tags.map((tag) => {
        if (tag.toLowerCase().includes(req.query.tag.toLowerCase())) {
          found.push(item);
        }
      });
    });

    items.map((item) => {
      item.comments.map((comment) => {
        if (
          comment.comment
            .toLocaleLowerCase()
            .includes(req.query.tag.toLocaleLowerCase())
        ) {
          found.push(item);
        }
      });
    });

    found = found.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.place === value.place && t.id === value.id)
    );

    res.status(200).json(found);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

module.exports = router;
