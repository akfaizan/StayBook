const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
 });

router.route("/")
.get(wrapAsync(listingController.index))//index route
.post(isLoggedIn,
    upload.array('listing[images]', 10),
    validateListing,
    wrapAsync(listingController.createListing)
);//create route


//new route
router.get("/new",isLoggedIn,wrapAsync(listingController.newForm));

router.route("/:id")
.get(wrapAsync(listingController.showListing))//show route
.put(isLoggedIn,isOwner,upload.array('listing[images]', 10),validateListing,wrapAsync(listingController.updateListing))//update route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));//destroy route

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));


// //index route
// router.get("/",wrapAsync(listingController.index));


//show route
// router.get("/:id",wrapAsync(listingController.showListing));


//create route
// router.post("/",isLoggedIn,validateListing , wrapAsync(listingController.createListing));



//update route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//destroy route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports = router;
