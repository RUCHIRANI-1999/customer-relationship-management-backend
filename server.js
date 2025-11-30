require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // For cross-origin requests
const connectDB = require('./config/db');

// Import routes
const leadRoutes = require('./routes/leadRoutes');
const customerRoutes = require('./routes/customerRoutes');
const followUpRoutes = require('./routes/followUpRoutes');
const integrationRoutes = require('./routes/integrationRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Body parser for JSON data

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/followups', followUpRoutes);
app.use('/api/integrations', integrationRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('CRM Backend API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));