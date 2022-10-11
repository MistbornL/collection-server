const { Schema, model } = require("../db/connection");

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  status: { type: String, required: true, default: "Active" },
});

// User model
const User = model("User", UserSchema);

module.exports = User;
