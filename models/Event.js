const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    unique: [true, 'Event name must be unique']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    validate: {
      validator: (value) => value > 0,
      message: 'Total seats must be greater than 0'
    }
  },
  availableSeats: {
    type: Number,
    default: function() {
      return this.totalSeats;
    }
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: (value) => {
        const now = new Date();
        return value > now;
      },
      message: 'Event date must be in the future'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema); 
