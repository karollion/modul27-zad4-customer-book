// Imports
const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');

// import routes
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();

// middleware for diferent ports client and server
app.use(cors());

const server = app.listen(process.env.PORT || 3030, () => {
  console.log('Server is running on port: 3030');
});

const io = socket(server);

app.use(express.static(path.join(__dirname, '/public')));
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));
app.use(express.urlencoded({ extended: true }));   // x-www-form-urlencoded
app.use(express.json());    // form-data JSON format

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', testimonialsRoutes); // add testimonials routes to server
app.use('/api', concertsRoutes); // add concerts routes to server
app.use('/api', seatsRoutes); // add seats routes to server

// return client application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

io.on('connection', (socket) => {
  console.log('New socket! Id – ' + socket.id);
  
});

// Middleware for no endpoint
app.use((req, res) => {
  res.status(404).send('404 not found...');
})