const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_DB);
  console.log("DB connected port 5000");
};

module.exports = connectDB;