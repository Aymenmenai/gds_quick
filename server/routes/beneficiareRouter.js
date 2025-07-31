const express = require("express");
const {
  getAllBeneficiare,
  getOneBeneficiare,
  deleteBeneficiare,
  updateBeneficiare,
  createBeneficiare,
  findBeneficiare,
  clean,
} = require("../controllers/beneficiareController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findBeneficiare);
router.get("/all", getAllBeneficiare);
// router.patch("/clean", clean);
router.get("/find/:id", getOneBeneficiare);
router.delete("/delete/:id", restrictTo("viewer","admin"), deleteBeneficiare);
router.patch("/update/:id", restrictTo("viewer","admin"), updateBeneficiare);
router.post("/add", restrictTo("viewer","admin"), createBeneficiare);

module.exports = router;
