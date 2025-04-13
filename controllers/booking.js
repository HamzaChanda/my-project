const Booking = require("../models/booking");
const Listing = require("../models/listing");
const nodemailer = require("nodemailer");

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests, email, phone } = req.body.booking;
  const guestDetails = req.body.booking.guestDetails || [];

  const listing = await Listing.findById(id).populate("owner");

  const newBooking = new Booking({
    listing: listing._id,
    user: req.user._id,
    checkIn,
    checkOut,
    guests,
    email,
    phone,
    guestDetails,
    status: "pending"
  });
  
  await newBooking.save();

  console.log(`Booking placed by ${req.user.username}`);
  console.log(`Email: ${email || req.user.email}`);
  console.log(`Phone: ${phone || req.user.phone}`);
  console.log(`Listing Owner: ${listing.owner.username}`);

  // EMAIL LOGIC
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
    subject: "📩 New Booking Alert for Your Listing!",
    text: `
  Hi ${listing.owner.username},
  
  You have received a new booking for your listing:
  "${listing.title}".
  
  📅 Booking Details:
  - Booked by: ${req.user.username}
  - Guests: ${guests}
  - Check-in Date: ${checkIn}
  - Check-out Date: ${checkOut}
  
  📞 Contact Info:
  - Email: ${email || req.user.email}
  - Phone: ${phone || req.user.phone}
  
  You can view this booking and manage it from your dashboard.
  
  Best regards,  
  Team Wanderlust 🌍
    `,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to owner.");
  } catch (error) {
    console.error("Error sending email:", error);
  }

  req.flash("success", "Booking placed! Wait for owner's confirmation.");
  res.redirect(`/bookings/${newBooking._id}/confirmation`);
};
module.exports.ownerBookings = async (req, res) => {
  const bookings = await Booking.find({})
    .populate("user")
    .populate("listing");

  res.render("owner/ownerBookings", { bookings });
};