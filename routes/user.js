const express = require('express');
const router = express.Router({mergeParams:true});
const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

//signUp
router.route("/signup")
.get(userController.signupForm)//signupForm
.post(wrapAsync(userController.signup));//signup


//login
router.route("/login")
.get(userController.loginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{//it authenticates and automatically logs in using req.login automiatically
        failureRedirect:"/login",
        failureFlash:true
    }),
    userController.login);

//logout
router.get("/logout",userController.logout);

//signup
// router.get("/signup",userController.signupForm)
// router.post("/signup",wrapAsync(userController.signup));


//login
// router.get("/login",userController.loginForm);

// router.post(
//     "/login",
//     saveRedirectUrl,
//     passport.authenticate("local",{//it authenticates and automatically logs in using req.login automiatically
//         failureRedirect:"/login",
//         failureFlash:true
//     }),
//     userController.login);


module.exports = router;