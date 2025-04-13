const User=require("../models/user.js");

// render signup form
module.exports.renderSignUpForm=(req , res)=>{
    res.render("users/signup.ejs");
};
// signup for user
module.exports.signupForNewUser=async(req , res)=>{
    try{
        let {username , password , email} = req.body;
    const newUser=new User({username , email});
    const registerUser= await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser , (err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");    
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/listings");
    }
}
// login for user
module.exports.renderLoginForm=(req , res)=>{
    res.render("users/login.ejs");
}
// login post route for authentication
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust, You are successfully LogedIn");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
// logout
module.exports.logout= (req , res,next)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
    req.flash("success","You have logged out");
    res.redirect("/listings");
    });   
}