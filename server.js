// Imports
const express = require('express');
const cors = require('cors')

// import routes
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));   // x-www-form-urlencoded
app.use(express.json());    // form-data JSON format
app.use('/api', testimonialsRoutes); // add testimonials routes to server
app.use('/api', concertsRoutes); // add concerts routes to server
app.use('/api', seatsRoutes); // add seats routes to server

// Middleware for no endpoint
app.use((req, res) => {
  res.status(404).send('404 not found...');
})

app.listen(3000, () => {
  console.log('Server is running on port: 3000');
});
