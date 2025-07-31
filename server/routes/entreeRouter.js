const express = require("express");
const {
  getAllEntree,
  getOneEntree,
  deleteEntree,
  updateEntree,
  addEntree,
  count,
  getMaxMinValue,
  getYear,
  Activites,
  getArticleAndArticleQuiSort,
  exportEntree,
} = require("../controllers/entreeController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/all", getAllEntree);
router.post("/count", getYear, count);
router.get("/maxmin/:field", getMaxMinValue);
router.get("/find/:id", getOneEntree);
router.get("/export/:id", exportEntree);
router.delete("/delete/:id", restrictTo("admin"), deleteEntree);
router.patch("/update/:id", restrictTo("admin"), updateEntree);
router.post("/add", restrictTo("admin"), addEntree);

module.exports = router;
