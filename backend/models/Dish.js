const mongoose = require("mongoose");

const schema = new mongoose.Schema({
 title: String,
 description: String,
 price: Number,
 category: String,
 image: String,
 rating: { type: Number, default: 0 },
 ratingCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Dish", schema);