const mongoose = require('mongoose');

// Define the Parking Spot schema
const parkingSpotSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  address: String,
  username: String,
  status: String,
  startTime: String,
  startDate: Date,
  endDate: Date,
  availability: [
    {
      day: Date,
      startTime: String,
      endTime: String,
      spotTimes: [
        {
          startDayTime: String,
          endDayTime: String,
        },
      ],
    },
  ],
  parkingHistory: [
    {
      price: Number,
      spotStartTime: String,
      spotEndTime: String,
      spotDay: Date,
    },
  ],
  ratings: [
    {
      numberOfRatings: { type: Number, default: 0 },
      avgRating: { type: Number, default: 0 },
    },
  ],
});
const ParkingSpot = mongoose.model('Parking Spot', parkingSpotSchema);
// Define the Customer schema
const customerSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  firstName: String,
  lastName: String,
  carPlate: String,
  email: String,
  paymentMethods: [
    {
      bankName: String,
      cardNumber: String,
      expiryDate: String,
      cvv: String,
      cardHolderName: String,
      isActive: { type: Boolean, default: false },
    },
  ],
  ratingsGiven: [
    {
      username: String, // username of the partner's parking spot
    },
  ],
  spotParkingHistory: [
    {
      spotAddress: String,
      price: Number,
      spotStartTime: String,
      spotEndTime: String,
      spotDay: Date,
    },
  ],
});

const Customer = mongoose.model('Customer', customerSchema);

// Define the Partner schema
const partnerSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  firstName: String,
  lastName: String,
  carPlate: String,
  email: String,
  parkingSpots: [
    {
      latitude: Number,
      longitude: Number,
      address: String,
      username: String,
      status: String,
      startTime: String,
      startDate: Date,
      endDate: Date,
      availability: [
        {
          day: Date,
          startTime: String,
          endTime: String,
          spotTimes: [{ startDayTime: String, endDayTime: String }],
        },
      ],
    },
  ],
  paymentMethods: [
    {
      bankName: String,
      cardNumber: String,
      expiryDate: String,
      cvv: String,
      cardHolderName: String,
      isActive: { type: Boolean, default: false },
    },
  ],
  ratings: [
    {
      numberOfRatings: { type: Number, default: 0 },
      avgRating: { type: Number, default: 0 },
    },
  ],
  ratingsGiven: [
    {
      username: String, // username of the partner's parking spot
    },
  ],
  spotParkingHistory: [
    {
      spotAddress: String,
      price: Number,
      spotStartTime: String,
      spotEndTime: String,
      spotDay: Date,
    },
  ],
});

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = { Customer, Partner, ParkingSpot };
