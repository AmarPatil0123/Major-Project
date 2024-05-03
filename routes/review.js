const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../util/wrapAsync.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview, isReviewAuthor}=require("../middleware.js");
const {isLogged}=require("../middleware.js");


const listingController=require("../controllers/review.js")

// review route

router.post("/",isLogged,validateReview,wrapAsync(listingController.createReview));

//review delete 

router.delete("/:reviewId",isLogged,isReviewAuthor,wrapAsync(listingController.destroyReview));

module.exports=router;