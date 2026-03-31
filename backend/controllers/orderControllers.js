const Order = require("../models/Order");

const createOrder = async (req, res) => {
 const { items, address } = req.body;
 const total = items.reduce((s, i) => s + i.price, 0);
 const order = await Order.create({
   user: req.userId,
   items,
   total,
   address
 });
 res.json(order);
};

const getOrders = async (req, res) => {
 const orders = await Order.find().populate("user", "email");
 res.json(orders);
};

module.exports = { createOrder, getOrders };