const express = require("express");
const {
  getAllVehiculeType,
  getOneVehiculeType,
  deleteVehiculeType,
  updateVehiculeType,
  createVehiculeType,
  findVehiculeType,
  searchAllVehiculeType,
} = require("../controllers/vehiculeTypeController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findVehiculeType);
router.get("/all", getAllVehiculeType);
router.get("/search", searchAllVehiculeType);
router.get("/find/:id", getOneVehiculeType);
router.delete("/delete/:id",  deleteVehiculeType);
router.patch("/update/:id", updateVehiculeType);
router.post("/add",  createVehiculeType);

module.exports = router;
