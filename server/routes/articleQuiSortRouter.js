const express = require("express");
const {
  getAllArticleQuiSort,
  getOneArticleQuiSort,
  deleteArticleQuiSort,
  updateArticleQuiSort,
  addArticleQuiSort,
  getAggregation,
} = require("../controllers/articleQuiSortController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/all", getAllArticleQuiSort);
router.get("/find/:id", getOneArticleQuiSort);
router.delete(
  "/delete/:id",
  restrictTo("admin"),
  getAggregation,
  deleteArticleQuiSort
);
router.patch(
  "/update/:id",
  restrictTo("admin"),
  getAggregation,
  updateArticleQuiSort
);
router.post("/add", addArticleQuiSort);

module.exports = router;
