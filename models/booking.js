const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  guestDetails: [
    {name:String,
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
      },
      ageGroup: {
        type: String,
        enum: ['Under 18', '18-25', '26-35', '36-50', '51+']
      }
    }
  ],
  email: String,
  phone: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listings'
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected", "cancelled"],
    default: "pending"
  }
});


module.exports = mongoose.model('Booking', bookingSchema);
