const User = require("../models/user.js");

const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
// Render signup form
module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Signup for new user
module.exports.signupForNewUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);

        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Login post route for authentication
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust, You are successfully logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have logged out");
        res.redirect("/listings");
    });
};

// Forgot password logic with OTP
module.exports.forgotPassword = async (req, res) => {
    const { emailOrUsername } = req.body;

    try {
        await User.init();

        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        }).lean();

        if (!user) {
            req.flash("error", "Invalid Email or Username!");
            return res.redirect("/forgotpassword");
        }

        // Generate OTP (6-digit number)
        const otp = (Math.floor(100000 + Math.random() * 900000)).toString();

        // Set OTP expiry time to 2 minutes from now
        const expiryTime = Date.now() + 2 * 60 * 1000;

        console.log(`Generated OTP: ${otp}`);
        console.log(`Expiry time: ${new Date(expiryTime)}`);

        // Update user with OTP and expiry time
        await User.updateOne(
            { _id: user._id },
            { $set: { resetPasswordOTP: otp, resetPasswordExpires: expiryTime } }
        );

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"WANDERLUST" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Your Secure OTP Code",
            html: `
                <p>Hello,</p>
                <p><strong>Your OTP for password reset is: <span style="font-size:18px;">${otp}</span></strong></p>
                <p>It will expire in 2 minutes. Please do not share this code with anyone.</p>
                <p>Thank you,</p>
                <p><strong>Wanderlust Team</strong></p>
            `,
        };

        // Send email with OTP
        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully.");
            res.redirect(
                `/verify-otp?emailOrUsername=${encodeURIComponent(emailOrUsername)}`
            );
        } catch (error) {
            console.error("Error sending email:", error);
            req.flash("error", "Failed to send OTP. Please try again.");
            return res.redirect("/forgotpassword");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};



// Verify OTP logic
// In your verifyOTP function
module.exports.verifyOTP = async (req, res) => {
    const { emailOrUsername, otp } = req.body;

    console.log("Received emailOrUsername:", emailOrUsername);

    try {
        // Case-insensitive search for email or username
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${emailOrUsername}$`, "i") } },
                { username: { $regex: new RegExp(`^${emailOrUsername}$`, "i") } }
            ]
        }).lean();

        if (!user) {
            console.log("User not found for:", emailOrUsername);  // Log if user is not found
            req.flash("error", "Invalid User!");
            return res.redirect(`/verify-otp?emailOrUsername=${emailOrUsername}`);
        }

        // Convert OTP to string for comparison
        const storedOtp = user.resetPasswordOTP.toString();
        const enteredOtp = otp.toString();

        console.log(`Entered OTP: ${enteredOtp}`);
        console.log(`Stored OTP: ${storedOtp}`);
        console.log(`Expiry Time: ${new Date(user.resetPasswordExpires)}`);

        // Check if the OTP matches the stored one
        if (storedOtp !== enteredOtp) {
            req.flash("error", "Invalid OTP!");
            return res.redirect(`/verify-otp?emailOrUsername=${emailOrUsername}`);
        }

        // Check if OTP has expired
        if (Date.now() > user.resetPasswordExpires) {
            req.flash("error", "OTP has expired!");
            return res.redirect(`/verify-otp?emailOrUsername=${emailOrUsername}`);
        }

        // OTP is valid and not expired, redirect to reset password page with parameters
        return res.redirect(`/resetpassword?emailOrUsername=${emailOrUsername}&userId=${user._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};




// Render reset password form
module.exports.renderResetPassword = (req, res) => {
    const { emailOrUsername, userId } = req.query;

    // Check if emailOrUsername and userId exist
    if (!emailOrUsername || !userId) {
        req.flash("error", "Invalid Request!");
        return res.redirect("/forgotpassword");
    }

    res.render("users/resetpassword", {
        emailOrUsername: emailOrUsername,  // Pass these as data to the reset form
        userId: userId
    });
};

// Reset password logic
module.exports.resetPassword = async (req, res) => {
    const { emailOrUsername, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match!');
        return res.redirect(`/resetpassword?emailOrUsername=${emailOrUsername}`);
    }

    try {
        // Find the user by email or username
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername },
            ],
        });

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect(`/resetpassword?emailOrUsername=${emailOrUsername}`);
        }

        // Hash the new password
        await user.setPassword(password);


        // Clear the OTP fields as the password has been reset
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;

        // Save the updated user document
        await user.save();

        // Send success message and redirect to login page
        req.flash('success', 'Password has been updated!');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Render forgot password page
module.exports.renderForgotPassword = (req, res) => {
    res.render("users/forgotpassword");
};

// Render OTP verification page
module.exports.renderVerifyOTP = (req, res) => {
    const { emailOrUsername } = req.query;
    res.render("users/verifyotp", { emailOrUsername });
};
