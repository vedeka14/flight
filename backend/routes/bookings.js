const express = require('express');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('flight')
      .populate('returnFlight')
      .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flight')
      .populate('returnFlight');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { flightId, returnFlightId, passengers, tripType } = req.body;

    if (!flightId || !passengers || passengers.length === 0) {
      return res.status(400).json({ message: 'Please provide flight and passenger details' });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.availableSeats < passengers.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    let returnFlight = null;
    if (returnFlightId) {
      returnFlight = await Flight.findById(returnFlightId);
      if (!returnFlight) {
        return res.status(404).json({ message: 'Return flight not found' });
      }
      if (returnFlight.availableSeats < passengers.length) {
        return res.status(400).json({ message: 'Not enough seats available in return flight' });
      }
    }

    const totalPrice = flight.price * passengers.length + (returnFlight ? returnFlight.price * passengers.length : 0);

    const booking = await Booking.create({
      user: req.user._id,
      flight: flightId,
      returnFlight: returnFlightId || null,
      passengers,
      totalPrice,
      tripType: tripType || 'one-way'
    });

    // Update available seats
    flight.availableSeats -= passengers.length;
    await flight.save();

    if (returnFlight) {
      returnFlight.availableSeats -= passengers.length;
      await returnFlight.save();
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('flight')
      .populate('returnFlight');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update a booking (cancel)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Restore seats
    const flight = await Flight.findById(booking.flight);
    if (flight) {
      flight.availableSeats += booking.passengers.length;
      await flight.save();
    }

    if (booking.returnFlight) {
      const returnFlight = await Flight.findById(booking.returnFlight);
      if (returnFlight) {
        returnFlight.availableSeats += booking.passengers.length;
        await returnFlight.save();
      }
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Restore seats
    const flight = await Flight.findById(booking.flight);
    if (flight) {
      flight.availableSeats += booking.passengers.length;
      await flight.save();
    }

    if (booking.returnFlight) {
      const returnFlight = await Flight.findById(booking.returnFlight);
      if (returnFlight) {
        returnFlight.availableSeats += booking.passengers.length;
        await returnFlight.save();
      }
    }

    await Booking.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
