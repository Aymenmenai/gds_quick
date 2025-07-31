const express = require("express");
const { getEntreeSortie, getArticleAndArticleQuiSort, exportArticleAndArticleQuiSort, exportEntreeSortie, } = require("../controllers/movementControlle");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/entree/all", getEntreeSortie);
router.get("/entree/export", exportEntreeSortie);
router.get("/article/all", getArticleAndArticleQuiSort);
router.get("/article/export", exportArticleAndArticleQuiSort);



module.exports = router;
