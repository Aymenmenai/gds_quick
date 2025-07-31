const express = require("express");
const {
  getAllRef,
  getOneRef,
  deleteRef,
  updateRef,
  addRef,
  findRef,
  autoCompleteWithRef,
} = require("../controllers/refController");
const { protection, restrictTo } = require("../controllers/authorization");
const router = express.Router();

router.use(protection);
router.get("/option", findRef);
router.get("/all", getAllRef);
router.get("/find/:id", getOneRef);
router.get("/auto/:id", autoCompleteWithRef);
router.delete("/delete/:id", restrictTo("admin","viewer"), deleteRef);
router.patch("/update/:id", restrictTo("admin","viewer"),updateRef);
router.post("/add",restrictTo("admin","viewer"), addRef);

module.exports = router;
