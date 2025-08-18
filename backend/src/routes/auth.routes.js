const express = require("express");
const {
  signup,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controllers");

const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth.validator");
const { authLimiter } = require("../middleware/ratelimiter");

const router = express.Router();

router.post("/signup", authLimiter, signupValidator, signup);
router.post("/login", authLimiter, loginValidator, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot", authLimiter, forgotPasswordValidator, forgotPassword);
router.post("/reset", authLimiter, resetPasswordValidator, resetPassword);

module.exports = router;
