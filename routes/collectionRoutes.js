const { Router } = require("express");
const { isLoggedIn } = require("../controllers/middleware");
const Collection = require("../models/collection");
const Item = require("../models/item");

const router = Router();

// colleciton routes
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json(collections);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.get("/userCol", isLoggedIn, async (req, res) => {
  try {
    const collection = await Collection.find({
      createdBy: req.query.createdBy,
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

// ITEM ROUTES
router.get("/item", isLoggedIn, async (req, res) => {
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
      id: req.query.id,
    });
    res.status(200).json(item);
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.post("/create/item", isLoggedIn, async (req, res) => {
  try {
    const { title, description, collectionId, image } = req.body;
    const item = new Item({ title, description, collectionId, image });
    await item.save();
    res.status(200).json({ message: "item has been created." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.delete("/delete/item", isLoggedIn, async (req, res) => {
  try {
    const id = req.query.id;
    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: "item has been deleted." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

router.put("/update/item", isLoggedIn, async (req, res) => {
  try {
    const { id, title, description, collectionId, image } = req.body;
    await Item.findByIdAndUpdate(id, {
      title,
      description,
      collectionId,
      image,
    });
    res.status(200).json({ message: "item has been updated." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});
module.exports = router;

// router.delete("/delete/:id", isLoggedIn, async (req, res) => {
//   try {
//     await User.remove({ _id: req.params.id });
//     res.status(200).json({ message: "User has been deleted." });
//   } catch (e) {
//     res.status(400).json({ message: "Something went wrong, try again." });
//   }
// });

// router.post("/block/:id", isLoggedIn, async (req, res) => {
//   console.log(req.params);
//   try {
//     await User.findByIdAndUpdate(req.params.id, { status: "Blocked" });
//     res.status(200).json({ message: "User has been Blocked." });
//   } catch (e) {
//     res.status(400).json({ message: "Something went wrong, try again." });
//   }
// });

// router.post("/unlock/:id", isLoggedIn, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (user.status === "Blocked") {
//       user.status = "Offline";
//       await user.save();
//       res.status(200).json({ message: "User has been Unlocked." });
//     } else {
//       res.status(202).json({ message: "User is not blocked." });
//     }
//   } catch (e) {
//     res.status(400).json({ message: "Something went wrong, try again." });
//   }
// });

module.exports = router;
