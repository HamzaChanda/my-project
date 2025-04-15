const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    // username and password will addd yb default by passport-local-mongoose
    email:{
        type:String,
        required:true,
        unique:true
    },   resetPasswordOTP: { type: String }, // Store OTP
    resetPasswordExpires: { type: Date },   
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);
