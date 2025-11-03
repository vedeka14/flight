const express = require('express');
const Flight = require('../models/Flight');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/flights
// @desc    Get all flights (with search and pagination)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { origin, destination, departureDate, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (origin) {
      query.origin = { $regex: origin, $options: 'i' };
    }
    
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }
    
    if (departureDate) {
      const date = new Date(departureDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      query.departureDate = {
        $gte: date,
        $lt: nextDay
      };
    }

    const skip = (page - 1) * limit;
    
    const flights = await Flight.find(query)
      .sort({ departureDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Flight.countDocuments(query);

    res.json({
      flights,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalFlights: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/flights/:id
// @desc    Get single flight
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/flights
// @desc    Create a new flight (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/flights/:id
// @desc    Update a flight (Admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    
    res.json(flight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/flights/:id
// @desc    Delete a flight (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    
    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
