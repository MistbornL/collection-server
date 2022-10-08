const { Router } = require("express");
const { isLoggedIn } = require("../controllers/middleware");
const Collection = require("../models/collection");
const Item = require("../models/item");

const router = Router();

// colleciton routes
router.get("/", async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json(collections);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.get("/userCol", async (req, res) => {
  try {
    const collection = await Collection.find({
      createdBy: req.query.createdBy,
    });
    res.status(200).json(collection);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.get("/specific/:id", async (req, res) => {
  try {
    const collection = await Collection.find({
      _id: req.params.id,
    });
    res.status(200).json(collection);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.post("/create", isLoggedIn, async (req, res) => {
  try {
    const { createdBy, title, description } = req.body;
    const collection = new Collection({ createdBy, title, description });
    await collection.save();
    res.status(200).json({ message: "collection has been created." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.put("/update/:id", isLoggedIn, async (req, res) => {
  console.log(req.body);
  try {
    const { title, description, tags } = req.body;
    await Collection.findByIdAndUpdate(req.params.id, {
      title,
      description,
      tags,
    });
    res.status(200).json({ message: "collection has been updated." });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.delete("/delete/:id", isLoggedIn, async (req, res) => {
  try {
    await Collection.remove({ _id: req.params.id });
    res.status(200).json({ message: "collection has been deleted." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

// ITEM ROUTES
router.get("/item", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.get("/userItem", isLoggedIn, async (req, res) => {
  try {
    const item = await Item.find({
      _id: req.query.id,
    });

    res.status(200).json(item);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.get("/userItems", async (req, res) => {
  try {
    const item = await Item.find({
      collectionId: req.query.CollectionId,
    });

    res.status(200).json(item);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.post("/create/item", isLoggedIn, async (req, res) => {
  try {
    const { createdBy, title, description, collectionId, image } = req.body;
    const item = new Item({
      createdBy,
      title,
      description,
      collectionId,
      image,
    });
    await item.save();
    res.status(200).json({ message: "item has been created." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.delete("/delete/item/:id", isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;

    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: "item has been deleted." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.put("/item/update/:id", isLoggedIn, async (req, res) => {
  try {
    const { title, description, image, tags } = req.body;
    const id = req.params.id;
    await Item.findByIdAndUpdate(id, {
      title,
      description,
      image,
      tags,
    });
    res.status(200).json({ message: "item has been updated." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});
module.exports = router;
