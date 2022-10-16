const { Schema, model } = require("../db/connection");
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();
var newDate = year + "/" + month + "/" + day;
const ItemSchema = new Schema({
  collectionId: { type: String, required: true },
  createdBy: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  tags: {
    type: Array,
    default: [],
  },
  price: { type: Number, default: null },
  year: { type: String, default: null },
  from: { type: String, default: "" },
  link: { type: String, default: "" },
  likes: {
    type: Array,
    default: [],
  },
  comments: { type: Array, default: [] },
  createdAt: { type: Date, default: newDate },
});

const Item = model("Item", ItemSchema);

module.exports = Item;
