module.exports = (req, res, next) => {
  console.log("ADMIN CHECK:", req.user); // debug

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};