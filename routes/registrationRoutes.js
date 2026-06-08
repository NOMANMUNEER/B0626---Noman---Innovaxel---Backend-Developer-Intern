const express = require('express');
const router = express.Router();
const { registerUser, cancelRegistration } = require('../controllers/registrationController');

// POST /register - Register a user for an event
router.post('/register', registerUser);

// POST /cancel/:registrationId - Cancel a registration
router.post('/cancel/:registrationId', cancelRegistration);

module.exports = router; 
