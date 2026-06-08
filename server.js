require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Event Registration API is running' });
});

// Event Routes
app.use('/api/events', eventRoutes);

// Registration Routes
app.use('/api/registrations', registrationRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
