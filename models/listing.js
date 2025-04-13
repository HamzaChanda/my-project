const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { string, required } = require("joi");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    discription: {
        type:String,
        required:true
    },
    price: {
        type:Number
    },
    image:{
        url:String,
        filename:String
    },
    country:String,
    location:String,
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required:true
          },
          coordinates: {
            type: [Number],
            required:true
          }
    },
    category:{
        type:String,
        enum:["Trending","Arctic","Rooms","Mountains","Swimming Pool","Camping","Iconic Cities","Castles"],
    }
});
// will use most method
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});
const Listings=mongoose.model("Listings",listingSchema);
module.exports=Listings;