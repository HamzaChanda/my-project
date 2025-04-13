const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const nodemailer = require("nodemailer");
require("dotenv").config();

const Listings = require("../models/listing.js");
const Booking = require("../models/booking.js");
const bookingController = require("../controllers/booking.js");

// GET: View all bookings for a specific listing
router.get("/listings/:id/bookings", isLoggedIn, async (req, res) => {
  try {
    const listing = await Listings.findById(req.params.id).populate("owner");
    const bookings = await Booking.find({ listing: req.params.id }).populate("user");
    res.render("bookings/show", { listing, bookings });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while fetching bookings!");
    res.redirect("/listings");
  }
});

// GET: Booking Confirmation Page
router.get("/bookings/:id/confirmation", isLoggedIn, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("listing")
      .populate("user");

    if (!booking) {
      req.flash("error", "Booking not found!");
      return res.redirect("/profile");
    }

    res.render("bookings/confirmation", { booking });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while fetching booking confirmation!");
    res.redirect("/profile");
  }
});

// POST: Book a listing
router.post("/listings/:id/bookings", isLoggedIn, bookingController.createBooking, async (req, res) => {
  try {
    const listing = await Listings.findById(req.params.id).populate("owner");
    const { checkIn, checkOut, guests, email, phone, gender, ageGroup, guestDetails } = req.body.booking;

    const newBooking = new Booking({
      checkIn,
      checkOut,
      guests,
      email,
      phone,
      guestDetails,  // ✅ Add this
      user: req.user._id,
      listing: listing._id,
      status: "rejected"
    });
    
    

    await newBooking.save();

    console.log(`Booking placed by ${req.user.username}`);
    console.log(`Email: ${email || req.user.email}`);
    console.log(`Phone: ${phone || req.user.phone}`);
    console.log(`Listing Owner: ${listing.owner.username}`);

    // Send email to the listing owner
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: listing.owner.email,
      subject: "New Booking Request! Action Needed.",
      html: `
        <p>Hello ${listing.owner.username},</p>
        <p>${req.user.username} is requesting to book your listing "<strong>${listing.title}</strong>".</p>
        <ul>
          <li>Guests: ${guests}</li>
          <li>Check-in: ${checkIn}</li>
          <li>Check-out: ${checkOut}</li>
        </ul>
        <p>Please respond:</p>
        <a href="http://localhost:3000/bookings/${newBooking._id}/accept">✅ Accept</a> |
        <a href="http://localhost:3000/bookings/${newBooking._id}/reject">❌ Reject</a>
        <p>Thanks, <br> Wanderlust Team</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log("Email sent to owner.");

    req.flash("success", "Booking successful!");
    // Redirect to the confirmation page or listing page
    res.redirect(`/bookings/${newBooking._id}/confirmation`);
  } catch (error) {
    console.error(error);
    req.flash("error", "There was an error processing your booking.");
    res.redirect(`/listings/${req.params.id}`);
  }
});
router.get("/owner/bookings", isLoggedIn, async (req, res) => {
  const listings = await Listings.find({ owner: req.user._id });
  const listingIds = listings.map(l => l._id);

  const bookings = await Booking.find({ listing: { $in: listingIds } })
    .populate("listing")
    .populate("user");

  res.render("owner/ownerBookings", { bookings });
});
router.post("/bookings/:id/accept", isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("listing");

  if (!booking.listing.owner.equals(req.user._id)) {
    req.flash("error", "Unauthorized");
    return res.redirect("/owner/bookings");
  }

  booking.status = "confirmed";
  await booking.save();

  req.flash("success", "Booking accepted!");
  res.redirect("/owner/bookings");
});
router.post("/bookings/:id/reject", isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("listing");

  if (!booking.listing.owner.equals(req.user._id)) {
    req.flash("error", "Unauthorized");
    return res.redirect("/owner/bookings");
  }

  booking.status = "rejected";
  await booking.save();

  req.flash("info", "Booking rejected.");
  res.redirect("/owner/bookings");
});

// GET: Profile page showing user’s own bookings
router.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const today = new Date();

    const upcomingBookings = await Booking.find({
      user: req.user._id,
      checkIn: { $gte: today },
    }).populate("listing");

    const pastBookings = await Booking.find({
      user: req.user._id,
      checkOut: { $lt: today },
    }).populate("listing");

    res.render("user/profile", { upcomingBookings, pastBookings });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while fetching your bookings.");
    res.redirect("/user/profile");
  }
});
// Accept booking
router.get("/bookings/:id/accept", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user listing");
    booking.status = "confirmed";
    await booking.save();

    // Notify user
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: booking.email || booking.user.email,
      subject: "Booking Confirmed ✅",
      html: `
        <p>Your booking for "<strong>${booking.listing.title}</strong>" is confirmed!</p>
        <p>Check-in: ${booking.checkIn} <br> Check-out: ${booking.checkOut}</p>
        <p>Thank you for using Wanderlust.</p>
      `
    });

    res.send("✅ Booking accepted and user notified.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error accepting booking.");
  }
});

// Reject booking
router.get("/bookings/:id/reject", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user listing");
    booking.status = "rejected";
    await booking.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: booking.email || booking.user.email,
      subject: "Booking Rejected ❌",
      html: `
        <p>Unfortunately, your booking for "<strong>${booking.listing.title}</strong>" was not accepted.</p>
        <p>We're sorry for the inconvenience.</p>
        <p>Keep exploring other listings on Wanderlust.</p>
      `
    });

    res.send("❌ Booking rejected and user notified.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rejecting booking.");
  }
});


module.exports = router;