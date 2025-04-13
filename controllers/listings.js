const Listings = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geoCodingClient =mbxGeocoding({ accessToken: mapToken });
// index route
module.exports.index = async (req, res) => {
  console.log("Inside /listings route");
  const allListings = await Listings.find({});
  console.log("Found listings:", allListings.length);
  res.render("./listings/index.ejs", { allListings });
};
    
// new route
module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);
    res.render("./listings/new.ejs");
};
// show route
module.exports.showListing=async (req, res) => {
        let { id } = req.params;
        const listing = await Listings.findById(id).populate({path:"review",
            populate: {path: "author"}}).populate("owner");
        if (!listing) {
            req.flash("error","Listing does not exist!")
            return res.redirect("/listings");
            }
            console.log(listing);
        res.render("listings/show.ejs", { listing });
};
// create route
module.exports.createListing=async (req,res,next)=>{
    let response=await geoCodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
        }).send();
        
    let url=req.file.path;
    let filename=req.file.filename;
    //console.log(url,"..",filename);
    const newListing=new Listings(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","new listing created!");
    res.redirect("/listings");
}
// edit Form route
module.exports.renderEditForm=async(req,res)=>{
    let { id } = req.params;
    let findlisting= await Listings.findById(id);
    if(!findlisting.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You do not have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    const listing = await Listings.findById(id); // Add await here
    if (!listing) {
        req.flash("error","Listing does not exist!")
        return res.redirect("/listings");
        }
        let originalImageUrl=listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
};
  
//Listing Route
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing= await Listings.findById(id); 
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You do not have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    if(typeof req.file !=="undefined"){ 
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    await Listings.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    req.flash("success","Listing updated succefully")
    res.redirect(`/listings/${id}`);
};


// destroy listing Route
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let listing= await Listings.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You do not have permission to delete this listing");
        return res.redirect(`/listings/${id}`);
    }
    let deletedListing=await Listings.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
};

