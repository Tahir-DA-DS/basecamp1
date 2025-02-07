const express = require('express');
const routes = require('./routes/index'); // Import the combined routes
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'], // Frontend URLs
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'UPDATE'],
  credentials: true, // Allow cookies if needed
};

// Middleware setup
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET));
app.use(cors(corsOptions));
app.use(bodyParser.json());



// app.use((req, res, next) => {
//   console.log('Headers:', req.headers);
//   next();
// });

// Use the routes
app.use(routes);


app.use(express.static('public'));

// app.get('/check-session', (req, res) => {
//   console.log(req.session);
//   res.json({ session: req.session });
// });

// Start the server
const PORT = 3000;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});