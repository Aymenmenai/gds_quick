const express = require("express");

const { protection, restrictTo } = require("../controllers/authorization");
const {
  findFeedback,
  getAllFeedback,
  getOneFeedback,
  deleteFeedback,
  updateFeedback,
  createFeedback,
} = require("../controllers/feedbackController");
const router = express.Router();

router.use(protection);
router.get("/option", findFeedback);
router.get("/all", getAllFeedback);
router.get("/find/:id", getOneFeedback);
router.delete("/delete/:id", restrictTo("admin"), deleteFeedback);
router.patch("/update/:id", restrictTo("admin"), updateFeedback);
router.post("/add", restrictTo("admin"), createFeedback);

module.exports = router;
