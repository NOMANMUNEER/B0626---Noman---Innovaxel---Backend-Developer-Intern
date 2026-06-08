const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { name, totalSeats, eventDate } = req.body;

    // Validate required fields
    if (!name || !totalSeats || !eventDate) {
      return res.status(400).json({ message: 'Missing required fields: name, totalSeats, eventDate' });
    }

    // Create new event with availableSeats equal to totalSeats
    const newEvent = new Event({
      name,
      totalSeats,
      eventDate,
      availableSeats: totalSeats
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: savedEvent });
  } catch (error) {
    // Handle duplicate event name (unique constraint)
    if (error.code === 11000 && error.keyPattern.name) {
      return res.status(400).json({ message: 'Event name already exists' });
    }
    // Handle validation errors (past date, negative seats, etc.)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

exports.viewEvents = async (req, res) => {
  try {
    const { upcoming } = req.query;
    let query = {};

    // Filter for upcoming events if query parameter is true
    if (upcoming === 'true') {
      query.eventDate = { $gt: new Date() };
    }

    // Fetch events sorted by eventDate in ascending order
    const events = await Event.find(query).sort({ eventDate: 1 });
    res.status(200).json({ message: 'Events fetched successfully', events });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
}; 
