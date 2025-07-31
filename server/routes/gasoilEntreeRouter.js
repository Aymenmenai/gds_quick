const express = require("express");
const {
  getAllGasoilEntree,
  getOneGasoilEntree,
  deleteGasoilEntree,
  updateGasoilEntree,
  addGasoilEntree,
  count,
  getYear,
} = require("../controllers/gasoilEntreeController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/all", getAllGasoilEntree);
router.post("/count", getYear, count);
router.get("/find/:id", getOneGasoilEntree);
router.delete("/delete/:id", restrictTo("admin"), deleteGasoilEntree);
router.patch("/update/:id", restrictTo("admin"), updateGasoilEntree);
router.post("/add", restrictTo("admin"), addGasoilEntree);

module.exports = router;
