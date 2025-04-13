const express=require("express");
const passport = require("passport");
const router = require('express').Router()
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");
// signup form 
router
    .route("/signup")
    .get(userController.renderSignUpForm)
    .post( wrapAsync(userController.signupForNewUser));
// login form
router
    .route("/login")
    .get( userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login);
// logout
router.get('/logout' ,userController.logout)
module.exports  = router;
// authenticat is an imp method in passport which i use for check the authentication for more check passport website