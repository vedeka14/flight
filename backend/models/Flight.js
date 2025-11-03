const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, 'Please provide a flight number'],
    unique: true,
    trim: true
  },
  airline: {
    type: String,
    required: [true, 'Please provide an airline name'],
    trim: true
  },
  origin: {
    type: String,
    required: [true, 'Please provide origin'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Please provide destination'],
    trim: true
  },
  departureDate: {
    type: Date,
    required: [true, 'Please provide departure date']
  },
  arrivalDate: {
    type: Date,
    required: [true, 'Please provide arrival date']
  },
  departureTime: {
    type: String,
    required: [true, 'Please provide departure time']
  },
  arrivalTime: {
    type: String,
    required: [true, 'Please provide arrival time']
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: 0
  },
  availableSeats: {
    type: Number,
    required: [true, 'Please provide available seats'],
    min: 0
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please provide total seats'],
    min: 1
  },
  aircraft: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Flight', flightSchema);
