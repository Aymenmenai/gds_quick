const express = require("express");
const {
  getAllGasoil,
  getOneGasoil,
  deleteGasoil,
  updateGasoil,
  addGasoil,
  count,
  getYear,
} = require("../controllers/gasoilController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/all", getAllGasoil);
router.post("/count", getYear, count);
router.get("/find/:id", getOneGasoil);
router.delete("/delete/:id", restrictTo("admin"), deleteGasoil);
router.patch("/update/:id", restrictTo("admin"), updateGasoil);
router.post("/add", restrictTo("admin"), addGasoil);

module.exports = router;
