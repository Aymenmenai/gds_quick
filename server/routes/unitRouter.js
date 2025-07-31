const express = require("express");
const {
  getAllUnit,
  getOneUnit,
  deleteUnit,
  updateUnit,
  createUnit,
  findUnit,
} = require("../controllers/unitController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findUnit);
router.get("/all", getAllUnit);
router.get("/find/:id", getOneUnit);
router.delete("/delete/:id", restrictTo("admin","viewer"), deleteUnit);
router.patch("/update/:id", restrictTo("admin","viewer"), updateUnit);
router.post("/add", restrictTo("admin","viewer"), createUnit);

module.exports = router;
