const express = require("express");
const {
  getAllReference,
  getOneReference,
  deleteReference,
  updateReference,
  createReference,
  searchAllReference,
  findandGenerate,
} = require("../controllers/referenceController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/all", getAllReference);
router.get("/search", searchAllReference);
router.get("/find/:id", getOneReference);
router.delete("/delete/:id", restrictTo("admin","viewer"), deleteReference);
router.patch("/update/:id", restrictTo("admin","viewer"), updateReference);
router.post("/generate/:id", restrictTo("admin","viewer"), findandGenerate);
router.post("/add", restrictTo("admin","viewer"), createReference);

module.exports = router;
