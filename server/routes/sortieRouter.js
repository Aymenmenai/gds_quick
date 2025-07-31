const express = require("express");
const {
  getAllSortie,
  getOneSortie,
  deleteSortie,
  updateSortie,
  addSortie,
  count,
  getYear,
  exportSortie,
} = require("../controllers/sortieController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

// router.use(protection);
router.get("/all",protection, getAllSortie);
router.post("/count",protection, getYear,count);
router.get("/find/:id",protection, getOneSortie);
router.get("/export/:id",protection, exportSortie);
router.delete("/delete/:id",protection,restrictTo("admin"), deleteSortie);
router.patch("/update/:id",protection,restrictTo("admin"), updateSortie);
router.post("/add",protection,restrictTo("admin"), addSortie);

module.exports = router;
