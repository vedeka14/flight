const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  passengers: [{
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true,
      min: 1
    },
    seatNumber: String
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  tripType: {
    type: String,
    enum: ['one-way', 'round-trip', 'multi-city'],
    default: 'one-way'
  },
  returnFlight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
