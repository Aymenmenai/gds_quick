const express = require("express");
const {
  getAllGasoilSortie,
  getOneGasoilSortie,
  deleteGasoilSortie,
  updateGasoilSortie,
  addGasoilSortie,
  count,
  getYear,
  excelExport,
} = require("../controllers/gasoilSortieController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/all", getAllGasoilSortie);
router.post("/count", getYear, count);
router.get("/excel/:id", excelExport);
router.get("/find/:id", getOneGasoilSortie);
router.delete("/delete/:id", restrictTo("admin"), deleteGasoilSortie);
router.patch("/update/:id", restrictTo("admin"), updateGasoilSortie);
router.post("/add", restrictTo("admin"), addGasoilSortie);

module.exports = router;
