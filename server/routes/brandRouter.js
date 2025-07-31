const express = require("express");
const {
  getAllBrand,
  getOneBrand,
  deleteBrand,
  updateBrand,
  createBrand,
  findBrand,
} = require("../controllers/brandController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findBrand);
router.get("/all", getAllBrand);
router.get("/find/:id", getOneBrand);
router.delete("/delete/:id",restrictTo("viewer","admin"), deleteBrand);
router.patch("/update/:id",restrictTo("admin","viewer"), updateBrand);
router.post("/add",restrictTo("admin","viewer"), createBrand);

module.exports = router;
