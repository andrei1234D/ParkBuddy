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
});

const customerSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
});
const ParkingSpotSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  address: String,
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

app.post('/rendSpot', async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const parkingSpot = new ParkingSpot({
      latitude,
      longitude,
      address,
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
