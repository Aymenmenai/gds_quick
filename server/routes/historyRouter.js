const express = require("express");

const { protection } = require("../controllers/authorization");
const { getAllHistory } = require("../controllers/historyController");

const router = express.Router();

router.get("/", getAllHistory);

module.exports = router;
