const express = require('express');
const router = express.Router();
const { createEvent, viewEvents } = require('../controllers/eventController');

// POST / - Create a new event
router.post('/', createEvent);

// GET / - View all events with optional upcoming filter
router.get('/', viewEvents);

module.exports = router; 
