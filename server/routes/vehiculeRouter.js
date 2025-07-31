const express = require("express");
const {
  getAllVehicule,
  getOneVehicule,
  deleteVehicule,
  updateVehicule,
  createVehicule,
  findVehicule,
  searchAllVehicule,
  superSearchVehicule,
} = require("../controllers/vehiculeController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findVehicule);
router.get("/all", getAllVehicule);
router.get("/search", searchAllVehicule);
router.get("/find/:id", getOneVehicule);
router.delete("/delete/:id", deleteVehicule);
router.patch("/update/:id", updateVehicule);
router.post("/add",createVehicule);
router.get("/supersearch/:term", superSearchVehicule);

module.exports = router;
