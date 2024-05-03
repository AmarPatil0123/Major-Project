const express = require("express");
const router = express.Router();
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");


const listingController=require("../controllers/user.js");


//signUp
router.get("/signUp", listingController.renderSignupForm)

router.post("/signup", listingController.signup)

//Login

router.get("/login",listingController.renderLoginForm)

router.post("/login",savedRedirectUrl,passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}), listingController.login);

//Logout
router.get("/logout",listingController.logout);

module.exports = router;