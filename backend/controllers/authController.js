const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    // patikrinam kiek yra user DB
    const usersCount = await User.countDocuments();

    let role = "user";

    // jei pirmas user → admin
    if (usersCount === 0) {
      role = "admin";
    }

    const user = new User({
      ...req.body,
      role
    });

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Register error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(400).json({ message: "Wrong data" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "SECRET",
    { expiresIn: "1d" }
  );

  res.json({
  user: {
    _id: user._id,
    email: user.email,
    role: user.role
  },
  token
});
};

module.exports = { register, login };