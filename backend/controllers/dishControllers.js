const Dish = require("../models/Dish");
const rateDishFn = require("../functions/rating");

exports.getDishes = async (req, res) => {
  const dishes = await Dish.find();
  res.json(dishes);
};

exports.createDish = async (req, res) => {
  const dish = new Dish(req.body);
  await dish.save();
  res.json(dish);
};

exports.rateDish = async (req, res) => {
  const dish = await Dish.findById(req.params.id);
  rateDish(dish);
  await dish.save();
  res.json(dish);
};

exports.deleteDish = async (req, res) => {
  await Dish.findByIdAndDelete(req.params.id);
  res.json("Deleted");
};

exports.updateDish = async (req, res) => {
 const dish = await Dish.findByIdAndUpdate(
   req.params.id,
   req.body,
   { new: true }
 );
 res.json(dish);
};