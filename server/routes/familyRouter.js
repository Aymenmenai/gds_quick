const express = require("express");
const {
  getAllFamily,
  getOneFamily,
  deleteFamily,
  updateFamily,
  createFamily,
  findFamily,
  searchAllFamily,
} = require("../controllers/familyController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findFamily);
router.get("/all", getAllFamily);
router.get("/search", searchAllFamily);
router.get("/find/:id", getOneFamily);
router.delete("/delete/:id",restrictTo("admin","viewer"), deleteFamily);
router.patch("/update/:id",restrictTo("admin","viewer"), updateFamily);
router.post("/add",restrictTo("admin","viewer"), createFamily);

module.exports = router;
