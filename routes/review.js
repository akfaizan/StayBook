const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Listing = require("../models/listing");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


//create new review
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//delete review
router.delete("/:revId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyreview));


module.exports = router;