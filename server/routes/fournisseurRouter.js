const express = require("express");
const {
  getAllFournisseur,
  getOneFournisseur,
  deleteFournisseur,
  updateFournisseur,
  addFournisseur,
  findFournisseur,
  clean,
} = require("../controllers/fournisseurController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findFournisseur);
router.get("/all", getAllFournisseur);
// router.patch("/clean", clean);
router.get("/find/:id", getOneFournisseur);
router.delete("/delete/:id", restrictTo("admin","viewer"), deleteFournisseur);
router.patch("/update/:id", restrictTo("admin","viewer"), updateFournisseur);
router.post("/add", restrictTo("admin","viewer"), addFournisseur);

module.exports = router;
