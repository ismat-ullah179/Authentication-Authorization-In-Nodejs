const express = require("express");
const {
  register,
  login,
  profile,
  refreshAccessToken,
  logout,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.post("/Refresh-Token", refreshAccessToken);
router.post("/logout", logout);

module.exports = router;
