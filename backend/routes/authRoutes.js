const router = require("express").Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);


// router.get("/", getUsers);
// router.delete("/:id", deleteUser);
// router.post("/:id/block", blockUser);

module.exports = router;
