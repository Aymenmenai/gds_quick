const express = require("express");
const {
  getAllSousFamily,
  getOneSousFamily,
  deleteSousFamily,
  updateSousFamily,
  createSousFamily,
  findSousFamily,
} = require("../controllers/sousFamilyController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findSousFamily);
router.get("/all", getAllSousFamily);
router.get("/find/:id", getOneSousFamily);
router.delete("/delete/:id",restrictTo("admin","viewer"), deleteSousFamily);
router.patch("/update/:id",restrictTo("admin","viewer"), updateSousFamily);
router.post("/add",restrictTo("admin","viewer"), createSousFamily);

module.exports = router;
