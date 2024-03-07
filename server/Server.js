const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Secret key for JWT
const secretKey = 'tR$3^aLp@SsW0rD!kEy#f0rJWt';

// Dummy user for testing
const users = [
  {
    id: 1,
    username: 'testuser',
    password: 'testpassword',
  },
];

// Endpoint for user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are valid
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
