const Listing=require("./models/listing");
const Review=require("./models/review.js");
const expressError=require("./utils/expressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl)
    //from this we can check if our user is logged in or not
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to perform an operation");
        res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();        
}
// ValidateListing obj
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new expressError(400, errMsg); // Fix reference here
    }
    next();
};
// validation of review 
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new expressError(400, errMsg); // Fix reference here
    }
    next();
};
module.exports.isReviewAutor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You must be the author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.preventOwnerBooking = async (req, res, next) => {
    const Listing = require("../models/listing");
    const listing = await Listing.findById(req.body.listing);
    if (listing.owner.equals(req.user._id)) {
      req.flash("error", "You can't book your own listing.");
      return res.redirect(`/listings/${listing._id}`);
    }
    next();
  };
  