exports.rateDish = async (req, res) => {
 const dish = await Dish.findById(req.params.id);
 const user = await User.findById(req.userId);
 const alreadyRated = user.rated.includes(dish._id);
if (alreadyRated) {
   dish.rating -= 1;
   dish.ratingCount -= 1;
   user.rated.pull(dish._id);
} else {
   dish.rating += 1;
   dish.ratingCount += 1;
   user.rated.push(dish._id);
}
 await dish.save();
 await user.save();
 res.json(dish);
};