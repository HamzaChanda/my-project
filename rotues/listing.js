const express = require("express");
const router=express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listings=require("../models/listing.js");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});

const { isLoggedIn, validateListing } = require("../middleware.js");
// require controller
const listingsController = require("../controllers/listings.js");
// Routes for listings
router
.route("/")
 .get(wrapAsync(listingsController.index))
 .post(isLoggedIn,upload.single(`listing[image]`),wrapAsync(listingsController.createListing)
);
// new route
router.get("/new",isLoggedIn,listingsController.renderNewForm);
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const escapeRegex = (str) => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const regex = new RegExp(escapeRegex(category), "i");

  const listings = await Listings.find({
      $or: [
          { title: { $regex: regex } },
          { location: { $regex: regex } }
      ]
  });

  res.render("listings/index", { allListings: listings, category });
});

  router.get("/search", async (req, res) => {
    const { q } = req.query;
    const escapeRegex = (str) => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(escapeRegex(q), "i");

    const listings = await Listings.find({
        $or: [
            { title: { $regex: regex } },
            { location: { $regex: regex } }
        ]
    });

    res.render("listings/index", { allListings: listings, searchTerm: q, category: null });
});

router
    .route("/:id")
    .get(wrapAsync(listingsController.showListing))
    .put(isLoggedIn,upload.single(`listing[image]`),wrapAsync(listingsController.updateListing))
    .delete(isLoggedIn,wrapAsync(listingsController.destroyListing)
);  
router.get('/listings/:id/bookings', isLoggedIn, async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate('owner');
    const bookings = await Booking.find({ listing: req.params.id }).populate('user');
    res.render('bookings/show', { listing, bookings });
  });
  
// edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingsController.renderEditForm));

// export the router
module.exports=router;