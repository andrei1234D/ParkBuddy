const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const moment = require('moment');

const {
  sendRentalDetailsCustomer,
  sendRentalDetailsPartner,
  sendConfirmationEmail,
} = require('./mailer');
const { Customer, Partner, ParkingSpot } = require('./schemas');

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

//decide witch collection to browse
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

      // Determine the initial status of the spot based on the general availability
      let spotStatus = 'unavailable';
      if (
        currentDate >= startDate &&
        currentDate <= endDate &&
        currentDate >= startTime &&
        currentDate <= endTime
      ) {
        spotStatus = 'free';

        // Find today's availability entry based on the exact date
        const todayAvailability = spot.availability.find(
          (avail) =>
            new Date(avail.day).toDateString() === currentDate.toDateString()
        );

        if (todayAvailability) {
          // Check all spotTimes for today to see if the spot is occupied
          for (const timeSlot of todayAvailability.spotTimes) {
            const spotStartTime = new Date(
              `${currentDate.toDateString()} ${timeSlot.startDayTime}`
            );
            const spotEndTime = new Date(
              `${currentDate.toDateString()} ${timeSlot.endDayTime}`
            );

            if (currentDate >= spotStartTime && currentDate <= spotEndTime) {
              spotStatus = 'occupied';
              break; // No need to check further if it's already occupied
            }
          }
        }
      }

      spot.status = spotStatus;
      availableSpots.push(spot);
      await spot.save();
    }

    return availableSpots;
  } catch (error) {
    throw error; // Just rethrow the caught error
  }
}

app.get('/get-google-maps-key', (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  res.json({ apiKey });
});

app.post('/addPaymentMethod', async (req, res) => {
  const { username, role, newPaymentMethod } = req.body;

  try {
    const User = getUserModel(role);
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Set all existing payment methods' isDefault to false
    user.paymentMethods.forEach((method) => {
      method.isActive = false;
    });

    // Set the new payment method's isDefault to true
    user.paymentMethods.push(newPaymentMethod);

    console.log(user.paymentMethods);

    await user.save();

    console.log(user.paymentMethods);

    res.status(200).send({ message: 'Payment method added successfully' });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.post('/changeActivePaymentMethod', async (req, res) => {
  const { username, role, paymentMethodIndex } = req.body;

  try {
    const User = getUserModel(role);
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    user.paymentMethods.forEach((method, index) => {
      method.isActive = index === paymentMethodIndex;
    });

    await user.save();
    res
      .status(200)
      .send({ message: 'Active payment method changed successfully' });
  } catch (error) {
    console.error('Error changing active payment method:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});
app.post('/fetchPaymentMethods', async (req, res) => {
  const { username, role } = req.body;
  console.log(username, role);
  try {
    const User = getUserModel(role);
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    } else {
      return res.json({ paymentMethods: user.paymentMethods });
    }
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});
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
    res.json({ token, firstName: user.firstName, email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint for user registration
app.post('/register', async (req, res) => {
  const { firstName, lastName, carPlate, email, username, password, role } =
    req.body;
  try {
    const existingUser = await getUserModel(role).findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    if (role === 'partner') {
      const newPartner = new Partner({
        firstName,
        lastName,
        carPlate,
        email,
        username,
        passwordHash,
      });
      await newPartner.save();
    } else if (role === 'customer') {
      const newCustomer = new Customer({
        firstName,
        lastName,
        carPlate,
        email,
        username,
        passwordHash,
      });
      await newCustomer.save();
    }
    sendConfirmationEmail(firstName, email, role);

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
  // Add new parking spot to the partner
  const { username } = req.body;
  try {
    const partner = await Partner.findOne({ username });

    // Check each parking spot
    partner.parkingSpots.forEach((spot) => {
      const currentTime = new Date();
      const lastAvailability = spot.availability[spot.availability.length - 1];
      const endDate = new Date(spot.endDate);
      const lastEndTime = new Date(
        `${spot.endDate.toDateString()} ${lastAvailability.endTime}`
      );

      // Check if current date is after endDate and if current time is after last availability endTime
      if (currentTime > endDate && currentTime > lastEndTime) {
        spot.status = 'unavailable';
      } else {
        const firstAvailability = spot.availability[0];
        const startDate = new Date(spot.startDate);
        const firstStartTime = new Date(
          `${spot.startDate.toDateString()} ${firstAvailability.startTime}`
        );
        const firstEndTime = new Date(
          `${spot.endDate.toDateString()} ${firstAvailability.endTime}`
        );

        // Check if current time is between first availability startTime and endTime
        if (currentTime >= firstStartTime && currentTime <= firstEndTime) {
          if (
            !spot.availability.spotTimes ||
            spot.availability.spotTimes.length === 0
          ) {
            spot.status = 'free'; // Set status to 'free' if spotTimes array is undefined or empty
          } else {
            const spotTime = spot.availability.spotTimes.find((time) => {
              const startDateTime = new Date(
                `${spot.startDate.toDateString()} ${time.startDayTime}`
              );
              return currentTime >= startDateTime;
            });

            if (spotTime) {
              const endDateTime = new Date(
                `${spot.endDate.toDateString()} ${spotTime.endDayTime}`
              );
              if (currentTime >= endDateTime) {
                spot.status = 'occupied';
              }
            } else {
              spot.status = 'free'; // Set status to 'free' if no spot time matches the current time
            }
          }
        } else {
          spot.status = 'unavailable';
        }
      }
    });

    // Save the updated partner document
    await partner.save();

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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/Preferences-Spots', async (req, res) => {
  const { username, selectedDate, startRentTime, endRentTime } = req.body;
  try {
    const parkingSpots = await ParkingSpot.find();

    const availableSpots = parkingSpots.filter((spot) => {
      // Check if the spot has availability for the selected date
      const availabilityForDate = spot.availability.some((avail) => {
        const availDate = new Date(avail.day);
        const selectedDateTime = new Date(selectedDate);

        // Check if the selected date matches any day in the availability array
        return selectedDateTime.toDateString() === availDate.toDateString();
      });

      if (availabilityForDate) {
        // Check if spotTimes is empty, if so, consider the spot available
        if (spot.availability.length === 0) {
          return true;
        }

        // Extract time parts from startRentTime and endRentTime
        const rentStartTimeParts = startRentTime.split('T')[1];
        const rentEndTimeParts = endRentTime.split('T')[1];

        // Check if the rent time overlaps with any spot time intervals
        const overlaps = spot.availability.some((avail) => {
          return avail.spotTimes.some((spotTime) => {
            const spotStartTimeString = `${selectedDate.split('T')[0]}T${
              spotTime.startDayTime
            }`;
            const spotEndTimeString = `${selectedDate.split('T')[0]}T${
              spotTime.endDayTime
            }`;
            const rentStartTimeString = `${
              selectedDate.split('T')[0]
            }T${rentStartTimeParts}`;
            const rentEndTimeString = `${
              selectedDate.split('T')[0]
            }T${rentEndTimeParts}`;

            const spotStartTime = new Date(spotStartTimeString);
            const spotEndTime = new Date(spotEndTimeString);
            const rentStartTime = new Date(rentStartTimeString);
            const rentEndTime = new Date(rentEndTimeString);
            // Check for overlap in time intervals
            const timeOverlap =
              rentStartTime < spotEndTime && rentEndTime > spotStartTime;

            return timeOverlap;
          });
        });

        // If the spot has availability on the selected date and no overlaps, return true
        return !overlaps;
      } else {
        // If the selected date is not in the spot's available dates return false
        return false;
      }
    });

    res.json(availableSpots);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post('/addParkingRentalTimes', async (req, res) => {
  try {
    const {
      startTime,
      endTime,
      spotAddress,
      spotUsername,
      selectedStartDate,
      username,
      role,
      firstName,
      email,
    } = req.body;
    let startDate = new Date(selectedStartDate);

    // Find the partner who owns the parking spot
    const partner = await Partner.findOne({ username: spotUsername });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    const spotSchema = await ParkingSpot.findOne({ address: spotAddress });
    if (!spotSchema) {
      return res.status(404).json({ message: 'Spot Not Found' });
    }
    // Find the parking spot within the partner's parking spots
    const parkingSpot = partner.parkingSpots.find(
      (spot) => spot.address === spotAddress
    );
    if (!parkingSpot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }

    // Calculate the rental duration in minutes
    const startDateTime = moment.utc(
      `${selectedStartDate.split('T')[0]}T${startTime}`
    );
    const endDateTime = moment.utc(
      `${selectedStartDate.split('T')[0]}T${endTime}`
    );
    let durationMinutes;
    if (startDateTime.isValid() && endDateTime.isValid()) {
      // Calculate duration in minutes
      durationMinutes = endDateTime.diff(startDateTime, 'minutes');
    } else {
      console.error('Invalid date or time format');
    }
    const price = 0.3 * durationMinutes;

    // Update partner's parking history
    partner.spotParkingHistory = partner.spotParkingHistory || [];
    partner.spotParkingHistory.push({
      spotAddress,
      price,
      spotStartTime: startTime,
      spotEndTime: endTime,
      spotDay: new Date(selectedStartDate),
    });

    // Update partner's parking spot availability
    const partnerAvailability = parkingSpot.availability.find(
      (avail) => avail.day.toDateString() === startDate.toDateString()
    );
    if (partnerAvailability) {
      partnerAvailability.spotTimes.push({
        startDayTime: startTime,
        endDayTime: endTime,
      });
    }

    // Save the updated partner document
    await partner.save();
    const spotSchemaAvailability = spotSchema.availability.find(
      (avail) => avail.day.toDateString() === startDate.toDateString()
    );
    if (spotSchemaAvailability) {
      spotSchemaAvailability.spotTimes.push({
        startDayTime: startTime,
        endDayTime: endTime,
      });
    }
    await spotSchema.save();
    // Update customer's parking history
    const userModel = getUserModel(role);
    const user = await userModel.findOne({ username });
    if (user) {
      user.spotParkingHistory = user.spotParkingHistory || [];
      user.spotParkingHistory.push({
        spotAddress,
        price,
        spotStartTime: startTime,
        spotEndTime: endTime,
        spotDay: new Date(selectedStartDate),
      });

      // Save the updated customer document
      await user.save();
    } else {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update ParkingSpot's parking history
    const parkingSpotDoc = await ParkingSpot.findOne({ address: spotAddress });
    if (parkingSpotDoc) {
      parkingSpotDoc.parkingHistory = parkingSpotDoc.parkingHistory || [];
      parkingSpotDoc.parkingHistory.push({
        price,
        spotStartTime: startTime,
        spotEndTime: endTime,
        spotDay: new Date(selectedStartDate),
      });

      // Update ParkingSpot availability
      const spotAvailability = parkingSpotDoc.availability.find((avail) =>
        moment(avail.day).isSame(new Date(selectedStartDate), 'day')
      );
      if (spotAvailability) {
        spotAvailability.spotTimes.push({
          startDayTime: startTime,
          endDayTime: endTime,
        });
      } else {
        parkingSpotDoc.availability.push({
          day: new Date(selectedStartDate),
          startTime: startTime,
          endTime: endTime,
          spotTimes: [{ startDayTime: startTime, endDayTime: endTime }],
        });
      }

      // Save the updated ParkingSpot document
      await parkingSpotDoc.save();

      sendRentalDetailsCustomer(
        firstName,
        email,
        startTime,
        endTime,
        startDateTime,
        spotAddress,
        price
      );

      sendRentalDetailsPartner(
        partner.firstName,
        partner.email,
        startTime,
        endTime,
        startDateTime,
        spotAddress,
        price
      );
    } else {
      return res
        .status(404)
        .json({ message: 'Parking spot document not found' });
    }

    return res
      .status(200)
      .json({ message: 'Parking rental time added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
