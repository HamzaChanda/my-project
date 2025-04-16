if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const cors = require('cors');

// Routes
const listingRouter = require("./rotues/listing.js");
const reviewRouter = require("./rotues/review.js");
const userRouter = require("./rotues/user.js");
const bookingRoutes = require("./rotues/booking.js");

// Models
const Listings = require('./models/listing.js');
const Mongo_Url = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to the db");
    }).catch(err => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(Mongo_Url);
}

const port = 8080;
app.listen(port, () => {
    console.log("server is running on port 8080");
});

// MongoStore for session
const store = MongoStore.create({
    mongoUrl: Mongo_Url,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("Session Store Error:", err);
});

// Session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",  // Enable secure cookies only in production
        domain: process.env.NODE_ENV === "production" ? '.onrender.com' : 'localhost',  // Ensure cookies work across subdomains
    }
};

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);  // Trust the proxy
    sessionOptions.cookie.secure = true;  // Enable secure cookies for HTTPS
}

// CORS configuration
const corsOptions = {
    origin: 'https://my-project-2-9ext.onrender.com',  // Ensure this matches your live frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  // Allow cookies to be sent with requests
};

// Use CORS
app.use(cors(corsOptions));

// Use session and passport
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for setting user and flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Set up view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);
app.use("/", userRouter);
app.use('/', bookingRoutes);

// Static pages
app.get('/about', (req, res) => {
    res.render('listings/aboutUs');
});
app.get('/privacy', (req, res) => {
    res.render('listings/privacy');
});
app.get('/terms', (req, res) => {
    res.render('listings/terms');
});

// Handle 404 errors
app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("error.ejs", { err });
});
