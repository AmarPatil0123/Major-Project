const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../util/wrapAsync.js");
const {isLogged}=require("../middleware.js");
const {saveRedirectUrl,isOwner,}=require("../middleware.js");
const {validateListing}=require("../middleware.js");
const {listingSchema}=require("../schema.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage}); 

const listingController=require("../controllers/listing.js")



router.get("/",wrapAsync(listingController.index))


//create listing

router.post("/",isLogged,upload.single('image'),validateListing,wrapAsync(listingController.createListing));



//new route

router.get("/new",isLogged,wrapAsync(listingController.renderNewForm));

router.post("/search",wrapAsync(listingController.findListing));

// show route
router.get("/:id",wrapAsync(listingController.showListing));



//update route


router.put("/:id",isLogged,isOwner, upload.single('listing[image]'),wrapAsync(listingController.updateListing))


//delete route

router.delete("/:id",isLogged,isOwner,wrapAsync(listingController.destroyListing));

//update 
router.get("/:id/edit",isLogged,wrapAsync(listingController.renderEditForm))


module.exports=router;