const express = require('express');
const routes = require('./routes/index'); // Import the combined routes
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5500','http://127.0.0.1:5500'], // Frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,UPDATE',
  credentials: true, // Allow cookies if needed
};


app.use(cors(corsOptions));

const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET, // Replace with a secure secret
  resave: false,
  saveUninitialized: true,
}));

// Use the routes
app.use(routes);
app.use(express.static('public'));
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});