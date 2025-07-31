const express = require("express");
const {
  getAllTag,
  getOneTag,
  deleteTag,
  updateTag,
  createTag,
  findTag,
} = require("../controllers/tagController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findTag);
router.get("/all", getAllTag);
router.get("/find/:id", getOneTag);
router.delete("/delete/:id",restrictTo("admin","viewer"), deleteTag);
router.patch("/update/:id",restrictTo("admin","viewer"), updateTag);
router.post("/add",restrictTo("admin","viewer"), createTag);

module.exports = router;

