const express = require("express");
const {
  getAllVehiculeClient,
  getOneVehiculeClient,
  deleteVehiculeClient,
  updateVehiculeClient,
  createVehiculeClient,
  findVehiculeClient,
} = require("../controllers/vehiculeClientController");
const { protection } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findVehiculeClient);
router.get("/all", getAllVehiculeClient);
router.get("/find/:id", getOneVehiculeClient);
router.delete("/delete/:id", deleteVehiculeClient);
router.patch("/update/:id", updateVehiculeClient);
router.post("/add", createVehiculeClient);

module.exports = router;