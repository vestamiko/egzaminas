const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: "user" },
  rated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }]
});

module.exports = mongoose.model("User", userSchema);