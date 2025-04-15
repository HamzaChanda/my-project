const express = require("express");
const passport = require("passport");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Signup Routes
router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signupForNewUser));

// Login Routes
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// Logout Route
router.get("/logout", userController.logout);

// Forgot Password Routes
router
  .route("/forgotpassword")
  .get(userController.renderForgotPassword)
  .post(wrapAsync(userController.forgotPassword));

// OTP Verification Routes
router
  .route("/verify-otp")
  .get(userController.renderVerifyOTP)
  .post(wrapAsync(userController.verifyOTP));

// Reset Password Route (after OTP is verified)
router
  .route("/resetpassword")
  .get(userController.renderResetPassword)  // This will now use GET method to render reset form
  .post(wrapAsync(userController.resetPassword));

module.exports = router;
