const express = require("express");
const {
  getAllMagazin,
  getOneMagazin,
  deleteMagazin,
  updateMagazin,
  createMagazin,
  findMagazin,
} = require("../controllers/magazinContoller");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findMagazin);
router.get("/all", getAllMagazin);
router.get("/find/:id", getOneMagazin);
router.delete("/delete/:id", restrictTo("admin"), deleteMagazin);
router.patch("/update/:id", restrictTo("admin"), updateMagazin);
router.post("/add", restrictTo("admin"), createMagazin);

module.exports = router;
