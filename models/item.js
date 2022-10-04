const { Schema, model } = require("../db/connection");

const ItemSchema = new Schema({
  createdBy: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  tags: { type: Array, default: [] },
  price: { type: Number, default: null },
  year: { type: String, default: null },
  from: { type: String, default: "" },
  link: { type: String, default: "" },
  likes: { type: Array, default: [] },
  comments: { type: Array, default: [] },
});

const Item = model("Item", ItemSchema);

module.exports = Item;
