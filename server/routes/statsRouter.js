const express = require("express");
const { protection, restrictTo } = require("../controllers/authorization");
const {
  getStatsIO,
  getStatsPie,
  getStatsStandard,
} = require("../controllers/statsController");
const router = express.Router();

router.use(protection);
router.get("/pie", getStatsPie);
router.get("/standard", getStatsStandard);
router.get("/io", getStatsIO);

module.exports = router;
