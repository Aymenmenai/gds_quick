const express = require("express");

const { protection, restrictTo } = require("../controllers/authorization");
const { entreeSortieeExcel } = require("../controllers/dfcController");
const router = express.Router();

router.use(protection);
router.post("/",restrictTo("dfc"), entreeSortieeExcel);

module.exports = router;
