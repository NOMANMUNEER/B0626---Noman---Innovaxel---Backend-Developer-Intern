const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound unique index to prevent duplicate registrations and handle idempotency
registrationSchema.index({ eventId: 1, userName: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema); 
