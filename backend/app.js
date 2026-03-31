const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const dishRoutes = require("./routes/dishRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});


// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const app = express();

// app.use(cors());
// app.use(express.json());

// connectDB();

// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/dishes", require("./routes/dishRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));
// app.listen(5000, () => console.log("Server running"));