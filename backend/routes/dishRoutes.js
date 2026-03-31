const router = require("express").Router();
const {
 getDishes,
 createDish,
 // rateDish,
 deleteDish,
 updateDish,
} = require("../controllers/dishController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", getDishes);
router.post("/", auth, admin, createDish);
router.put("/:id", auth, admin, updateDish);
router.delete("/:id", auth, admin, deleteDish);
// router.post("/:id/rate", auth, rateDish);

module.exports = router;