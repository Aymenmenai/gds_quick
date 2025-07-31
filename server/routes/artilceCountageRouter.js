const express = require("express");
const {
  delete_countage,
  update_countage,
  add_countage,
} = require("../controllers/articleCountageController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
// router.get("/all", );
// router.get("/find/:id", getOneFournisseur);
router.delete("/delete/:id", restrictTo("admin"), delete_countage);
router.patch("/update/:id", restrictTo("admin"), update_countage);
router.post("/add", add_countage);

module.exports = router;
