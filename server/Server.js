const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Secret key for JWT
const secretKey = process.env.SECRET_JWT_TOKEN;
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define schemas for partner and customer collections
const customerSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
});

const partnerSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  parkingSpots: [
    {
      latitude: Number,
      longitude: Number,
      address: String,
      status: String,
      availability: [
        {
          day: Date,
          startTime: String, // Beginning time
          endTime: String, // End time
          spotTimes: [
            {
              startDayTime: String,
              endDayTime: String,
            },
          ],
        },
      ],
    },
  ],
});
const ParkingSpotSchema = new mongoose.Schema({
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
      startTime: String, // Beginning time
      endTime: String, // End time
      spotTimes: [
        {
          startDayTime: String,
          endDayTime: String,
        },
      ],
    },
  ],
});

// Models for partner and customer collections
const Partner = mongoose.model('Partner', partnerSchema);
const Customer = mongoose.model('Customer', customerSchema);
const ParkingSpot = mongoose.model('Parking Spot', ParkingSpotSchema);
const getUserModel = (role) => {
  if (role === 'partner') {
    return Partner;
  } else if (role === 'customer') {
    return Customer;
  }
};
async function checkAvailabilityAndSetStatus() {
  const currentDate = new Date();
  try {
    const parkingSpots = await ParkingSpot.find();
    const availableSpots = [];
    for (const spot of parkingSpots) {
      const startDate = new Date(spot.startDate);
      const endDate = new Date(spot.endDate);
      const startTime = new Date(
        `${startDate.toDateString()} ${spot.availability[0].startTime}`
      );
      const endTime = new Date(
        `${endDate.toDateString()} ${spot.availability[0].endTime}`
      );
      if (
        currentDate >= startDate &&
        currentDate <= endDate &&
        currentDate >= startTime &&
        currentDate <= endTime
      ) {
        spot.status = 'free';
        availableSpots.push(spot);
      } else {
        spot.status = 'unavailable';
      }
      await spot.save();
    }
    return availableSpots;
  } catch (error) {
    throw error; // Just rethrow the caught error
  }
}
// Endpoint for user login
app.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    //see if th username is found in the database(partner/customer)
    const user = await getUserModel(role).findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    //checks if the passwordHash matches the password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign(
      { userId: user._id, userRole: role, userName: username },
      secretKey,
      {
        expiresIn: '1h',
      }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint for user registration
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await getUserModel(role).findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    if (role === 'partner') {
      const newPartner = new Partner({ username, passwordHash });
      await newPartner.save();
    } else if (role === 'customer') {
      const newCustomer = new Customer({ username, passwordHash });
      await newCustomer.save();
    }
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/Lend-A-Spot', async (req, res) => {
  // Extract data from the request body
  const {
    latitude,
    longitude,
    address,
    username,
    selectedStartDate,
    selectedEndDate,
    startTime,
    endTime,
  } = req.body;

  // Calculate the current date
  const currentDate = new Date();
  const startDate = new Date(selectedStartDate);
  const endDate = new Date(selectedEndDate);
  const startDateTime = new Date(`${startDate.toDateString()} ${startTime}`);
  const endDateTime = new Date(`${endDate.toDateString()} ${endTime}`);

  // Determine status based on current date
  let status;

  if (
    currentDate >= startDate &&
    currentDate <= endDate &&
    currentDate.getHours() * 60 + currentDate.getMinutes() >=
      startDateTime.getHours() * 60 + startDateTime.getMinutes() &&
    currentDate.getHours() * 60 + currentDate.getMinutes() <=
      endDateTime.getHours() * 60 + endDateTime.getMinutes()
  ) {
    // If the current date is within the selected range, set status to free
    status = 'free';
  } else {
    // If the current date is outside the selected range, set status to unavailable
    status = 'unavailable';
  }

  // Create an array to store availability objects for each date
  const availability = [];

  // Loop through each date between the selected start date and end date
  let currentDateIter = new Date(startDate);
  while (currentDateIter <= endDate) {
    const availabilityObject = {
      day: new Date(currentDateIter),
      startTime,
      endTime,
    };
    availability.push(availabilityObject);
    // Move to the next day
    currentDateIter.setDate(currentDateIter.getDate() + 1);
  }

  // Create a new parking spot object
  const parkingSpot = new ParkingSpot({
    latitude,
    longitude,
    address,
    username,
    status,
    startDate,
    endDate,
    availability,
  });

  try {
    // Save the parking spot to the database
    await parkingSpot.save();

    // Find the partner by username
    const partner = await Partner.findOne({ username });

    // If the partner is found, push the new parking spot to their parkingSpots array and save
    if (partner) {
      partner.parkingSpots.push(parkingSpot);
      await partner.save();
    }

    // Respond with success message
    res.json({ success: true, message: 'Parking spot added successfully.' });
  } catch (error) {
    // If an error occurs, log the error and respond with an error message
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to add parking spot.' });
  }
});

app.post('/Your-Spots', async (req, res) => {
  //add new parking spot to the partner
  const { username } = req.body;
  try {
    const partner = await Partner.findOne({ username });

    // Send back all parking spots of the partner
    res.status(200).json({ parkingSpots: partner.parkingSpots });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/Get-Spots', async (req, res) => {
  try {
    const availableSpots = await checkAvailabilityAndSetStatus();
    res.json(availableSpots);
    console.log(availableSpots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/Rent-A-Spot', async (req, res) => {
  const { username, selectedDate, startRentTime, endRentTime } = req.body;
  try {
    const parkingSpots = await ParkingSpot.find();

    // Filter available spots
    const availableSpots = parkingSpots.filter((parkingSpot) => {
      // Check if the spot is available on the selected date
      const availabilityOnSelectedDate = parkingSpot.availability.find(
        (avail) => avail.day === selectedDate
      );
      if (!availabilityOnSelectedDate) return false; // Spot not available on the selected date

      // Convert day limits to comparable format
      const dayStartTime = new Date(
        `${selectedDate}T${availabilityOnSelectedDate.startTime}`
      );
      const dayEndTime = new Date(
        `${selectedDate}T${availabilityOnSelectedDate.endTime}`
      );

      // Convert startRentTime and endRentTime to comparable format
      const selectedStartTime = new Date(`${selectedDate}T${startRentTime}`);
      const selectedEndTime = new Date(`${selectedDate}T${endRentTime}`);

      // Check if user-selected timeframe is within day limits
      if (selectedStartTime < dayStartTime || selectedEndTime > dayEndTime)
        return false;

      // Check if any of the available time slots overlap with the user-selected timeframe
      return !availabilityOnSelectedDate.spotTimes.some((timeSlot) => {
        const startTime = new Date(`${selectedDate}T${timeSlot.startDayTime}`);
        const endTime = new Date(`${selectedDate}T${timeSlot.endDayTime}`);
        return (
          (selectedStartTime <= endTime && selectedEndTime >= startTime) || // Overlap condition
          (selectedStartTime >= startTime && selectedEndTime <= endTime)
        ); // Contained condition
      });
    });

    res.json(availableSpots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
