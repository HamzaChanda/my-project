const Review=require("../models/review.js");
const Listings=require("../models/listing.js");

// review post route
module.exports.createReview=async (req, res, next) => {

    console.log(req.params.id)
    let listing = await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created!")
    res.redirect(`/listings/${listing._id}`);
};
//  review destroy Route
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listings.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted")
    res.redirect(`/listings/${id}`);
    };