const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");  
const Review=require("../models/review.js");
const Listings=require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAutor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
// post review route
router.post("/:id/reviews", isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// delete review route  
router.delete("/:id/reviews/:reviewId",isLoggedIn,isReviewAutor,wrapAsync(reviewController.destroyReview));
module.exports=router;