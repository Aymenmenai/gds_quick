const express = require("express");
const {
  getAllGasoilElement,
  getOneGasoilElement,
  deleteGasoilElement,
  updateGasoilElement,
  addGasoilElement,
} = require("../controllers/gasoilElementController");
const { protection, restrictTo } = require("../controllers/authorization");
const {
  calculateGasoilPrice,
} = require("../controllers/gasoilSortieController");
const router = express.Router();

router.use(protection);
router.get("/all", getAllGasoilElement);
router.get("/find/:id", getOneGasoilElement);
router.delete("/delete/:id", restrictTo("admin"), deleteGasoilElement);
router.patch(
  "/update/:id",
  restrictTo("admin"),
  updateGasoilElement,
  calculateGasoilPrice
);
router.post(
  "/add",
  restrictTo("admin"),
  addGasoilElement,
  calculateGasoilPrice
);

module.exports = router;
