const { Schema, model } = require("../db/connection");

const CollectionSchema = new Schema({
  createdBy: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  topic: { type: String },
});

const Collection = model("Collection", CollectionSchema);

module.exports = Collection;
