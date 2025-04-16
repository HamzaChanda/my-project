if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
   // console.log(process.env.cloud_api_secret)
}
const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expressError=require("./utils/expressError.js");
const { error } = require("console");
const cookieparser=require("cookie-parser");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

//routes
const listingRouter=require("./rotues/listing.js");
const reviewRouter=require("./rotues/review.js");
const userRouter=require("./rotues/user.js");
const bookingRoutes = require("./rotues/booking.js")

const Listings = require('./models/listing.js');
const Mongo_Url=process.env.ATLASDB_URL;
main()
.then(() => {
    console.log("connected to the db");
}).catch(err => {
    console.log(err);
});
async function main() {
    await mongoose.connect(Mongo_Url);
}
const port=8080;
app.listen(port,()=>{
    console.log("server is running on port 8080");
})
//making mongostore
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

// session option
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" // Enable secure cookies in production
    }
  };
  
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1); // Trust Render's proxy for secure cookies
  }
  
  app.use(session(sessionOptions)); 
   
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport.use(new LocalStrategy({
//   usernameField: 'username',
//   passwordField: 'password'
// }, async (username, password, done) => {
//   const user = await User.findOne({ username });
//   if (!user) {
//       return done(null, false, { message: 'Incorrect username.' });
//   }
//   const isValid = await user.validatePassword(password);
//   if (!isValid) {
//       return done(null, false, { message: 'Incorrect password.' });
//   }
//   return done(null, user);
// }));

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})
//calling the db function

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// listings file
// register static method he register method will save the user in DB and automatically checks if the username is unique or not 
// app.get("/demoUser",async(req,res)=>{
//     let fakeUser=new User({
//         username:"Newuser",
//         email:"testuser@gmail.com",
//     });
//    let registerUser= await User.register(fakeUser,"helloworld");
//    res.send("you are hacked!");
//   console.log(registerUser);
// })
// implemented router model
app.use("/listings",listingRouter);
app.use("/listings",reviewRouter);
app.use("/",userRouter);
app.use('/', bookingRoutes);

app.get('/about', (req, res) => {
    res.render('listings/aboutUs');
});
app.get('/privacy', (req, res) => {
    res.render('listings/privacy');
});
app.get('/terms', (req, res) => {
    res.render('listings/terms');
});

app.all("*",(req,res,next)=>{
    next(new expressError(404, "Page Not Found!"));
})      
app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err); // If headers are already sent, don't try sending another response
    }
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("error.ejs", { err });
  });
  