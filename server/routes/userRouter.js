const express = require("express");

const { protection } = require("../controllers/authorization");
const {
  signup,
  login,
  logout,

  resetPassword,
  updatePassword,
} = require("../controllers/authentication");
const { getCurrentUser, updateUser } = require("../controllers/userController");
const { getAllHistory } = require("../controllers/historyController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// RESET  PASSWORD
router.post("/resetpassword", resetPassword);

// INSIDE USER
router.use(protection);
router.get("/me", getCurrentUser);
router.patch("/settings", updateUser);
router.patch("/updatepassword", updatePassword);


module.exports = router;
