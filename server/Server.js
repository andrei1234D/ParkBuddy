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
const partnerSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  parkingSpots: [
    {
      latitude: Number,
      longitude: Number,
      address: String,
      status: String,
    },
  ],
});

const customerSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
});
const ParkingSpotSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  address: String,
  username: String,
  status: String,
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
  //add new parking spot to the partner
  const { latitude, longitude, address, username } = req.body;
  const status = 'free';
  const partner = await Partner.findOne({ username });
  const parkingSpotPartner = {
    latitude,
    longitude,
    address,
    status,
  };
  partner.parkingSpots.push(parkingSpotPartner);
  await partner.save();

  //add new parking spot
  try {
    const parkingSpot = new ParkingSpot({
      latitude,
      longitude,
      address,
      username,
      status,
    });
    await parkingSpot.save();
    res.json({ success: true, message: 'Parking spot added successfully.' });
  } catch (error) {
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
app.get('/Rent-A-Spot', async (req, res) => {
  try {
    const parkingSpots = await ParkingSpot.find();
    console.log(parkingSpots);
    res.json(parkingSpots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
