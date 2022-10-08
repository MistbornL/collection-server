const { Schema, model } = require("../db/connection");

const CollectionSchema = new Schema({
  createdBy: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  tags: { type: Array, default: [] },
});

const Collection = model("Collection", CollectionSchema);

module.exports = Collection;
