const express = require("express");
const {
  add_ref_countage,
  update_ref_countage,
  delete_ref_countage,
} = require("../controllers/countageController");
const { protection, restrictTo } = require("../controllers/authorization");

const router = express.Router();

router.use(protection);

// Add a new ref countage
router.post("/add", add_ref_countage);

// Update an existing ref countage
router.patch("/update/:id", restrictTo("admin"), update_ref_countage);

// Delete a ref countage
router.delete("/delete/:id", restrictTo("admin"), delete_ref_countage);

module.exports = router;
