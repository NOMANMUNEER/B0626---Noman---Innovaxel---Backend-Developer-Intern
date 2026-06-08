const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.registerUser = async (req, res) => {
  try {
    const { userName, eventId } = req.body;

    // Validate required fields
    if (!userName || !eventId) {
      return res.status(400).json({ message: 'Missing required fields: userName, eventId' });
    }

    // CRITICAL: Use atomic findOneAndUpdate to prevent race conditions
    // Only decrement if availableSeats > 0
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gt: 0 } },
      { $inc: { availableSeats: -1 } },
      { new: true }
    );

    // If null, either event doesn't exist or availableSeats is 0 (Event is Full)
    if (!updatedEvent) {
      return res.status(400).json({ message: 'Event not found or no seats available' });
    }

    // Seat successfully decremented, now create registration record
    try {
      const newRegistration = new Registration({
        eventId,
        userName,
        status: 'active'
      });

      const savedRegistration = await newRegistration.save();
      res.status(201).json({ message: 'User registered successfully', registration: savedRegistration });
    } catch (error) {
      // Handle duplicate registration (compound unique index violation)
      if (error.code === 11000 && error.keyPattern.eventId && error.keyPattern.userName) {
        // ROLLBACK: Restore the seat that was decremented
        await Event.findByIdAndUpdate(eventId, { $inc: { availableSeats: 1 } });
        return res.status(400).json({ message: 'User already registered for this event' });
      }
      throw error; // Re-throw other errors
    }
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;

    // Find the registration
    const registration = await Registration.findById(registrationId);

    // Check if registration exists
    if (!registration) {
      return res.status(400).json({ message: 'Registration not found' });
    }

    // Check if already cancelled
    if (registration.status === 'cancelled') {
      return res.status(400).json({ message: 'Registration is already cancelled' });
    }

    // Update registration status to 'cancelled'
    registration.status = 'cancelled';
    await registration.save();

    // ATOMIC ROLLBACK: Restore the seat for the event
    await Event.findByIdAndUpdate(registration.eventId, { $inc: { availableSeats: 1 } });

    res.status(200).json({ message: 'Registration cancelled successfully', registration });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling registration', error: error.message });
  }
}; 
