const mongoose = require("mongoose");

const schema = new mongoose.Schema({
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 items: Array,
 total: Number,
 address: String,
 createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", schema);