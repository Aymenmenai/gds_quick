const express = require("express");
// const { protection } = require('../controllers/authorization')
const {
  addDesigniation,
  getAllDesigniation,
  getOneDesigniation,
  updateDesigniation,
  deleteDesigniation,
  getAllArticle,
  etateStock,
  alerts,
  findDesigniation,
  maxValue,
  getExportArticles,
  getArticleStockTimeline,
} = require("../controllers/articleController");
const { restrictTo, protection } = require("../controllers/authorization");
const { calculatePrice } = require("../controllers/entreeController");
const router = express.Router();

router.use(protection);

router.get("/alert", alerts);
router.get("/etate", etateStock);
router.get("/export", getExportArticles);
router.get("/maxPrice", maxValue);
router.get("/forSortie", findDesigniation);
router.get("/group", getAllArticle);
router.get("/all", getAllDesigniation);
router.get("/find/:id", getOneDesigniation);

router.post("/add", restrictTo("admin"), addDesigniation, calculatePrice); //MAKE OPTION TO ADD ATTRIBUTES FROM INPUTS
router.get("/timeline/:id", getArticleStockTimeline);

//  UPDATE
router.patch(
  "/update/:id",
  restrictTo("admin"),
  updateDesigniation,
  calculatePrice
);
//  DELETE
router.delete(
  "/delete/:id",
  restrictTo("admin"),
  deleteDesigniation,
  calculatePrice
);

module.exports = router;
