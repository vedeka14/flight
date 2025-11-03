/**
 * Example script to add sample flights to the database
 * 
 * Usage:
 * 1. Make sure MongoDB is running
 * 2. Make sure backend server is running (or this script will connect directly)
 * 3. Make sure you have an admin user created
 * 4. Run: node examples/addFlights.js
 */

const mongoose = require('mongoose');
const Flight = require('../models/Flight');
require('dotenv').config();

const sampleFlights = [
  {
    flightNumber: 'AI101',
    airline: 'Air India',
    origin: 'Delhi',
    destination: 'Mumbai',
    departureDate: new Date('2024-12-15T08:00:00Z'),
    arrivalDate: new Date('2024-12-15T10:00:00Z'),
    departureTime: '08:00',
    arrivalTime: '10:00',
    price: 5000,
    availableSeats: 150,
    totalSeats: 180,
    aircraft: 'Boeing 737'
  },
  {
    flightNumber: 'SG202',
    airline: 'SpiceJet',
    origin: 'Mumbai',
    destination: 'Bangalore',
    departureDate: new Date('2024-12-15T14:00:00Z'),
    arrivalDate: new Date('2024-12-15T16:00:00Z'),
    departureTime: '14:00',
    arrivalTime: '16:00',
    price: 3500,
    availableSeats: 120,
    totalSeats: 180,
    aircraft: 'Airbus A320'
  },
  {
    flightNumber: 'IG303',
    airline: 'IndiGo',
    origin: 'Delhi',
    destination: 'Kolkata',
    departureDate: new Date('2024-12-16T09:00:00Z'),
    arrivalDate: new Date('2024-12-16T11:00:00Z'),
    departureTime: '09:00',
    arrivalTime: '11:00',
    price: 4500,
    availableSeats: 100,
    totalSeats: 180,
    aircraft: 'Airbus A320'
  },
  {
    flightNumber: '6E404',
    airline: 'IndiGo',
    origin: 'Mumbai',
    destination: 'Delhi',
    departureDate: new Date('2024-12-16T12:00:00Z'),
    arrivalDate: new Date('2024-12-16T14:00:00Z'),
    departureTime: '12:00',
    arrivalTime: '14:00',
    price: 4200,
    availableSeats: 140,
    totalSeats: 180,
    aircraft: 'Airbus A320'
  },
  {
    flightNumber: 'UK505',
    airline: 'Vistara',
    origin: 'Delhi',
    destination: 'Chennai',
    departureDate: new Date('2024-12-17T10:00:00Z'),
    arrivalDate: new Date('2024-12-17T12:30:00Z'),
    departureTime: '10:00',
    arrivalTime: '12:30',
    price: 6000,
    availableSeats: 160,
    totalSeats: 200,
    aircraft: 'Boeing 787'
  },
  {
    flightNumber: 'AI606',
    airline: 'Air India',
    origin: 'Bangalore',
    destination: 'Delhi',
    departureDate: new Date('2024-12-17T15:00:00Z'),
    arrivalDate: new Date('2024-12-17T17:30:00Z'),
    departureTime: '15:00',
    arrivalTime: '17:30',
    price: 5500,
    availableSeats: 130,
    totalSeats: 180,
    aircraft: 'Boeing 737'
  }
];

const addSampleFlights = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flightbooking');
    console.log('Connected to MongoDB');

    // Clear existing flights (optional - comment out if you want to keep existing flights)
    // await Flight.deleteMany({});
    // console.log('Cleared existing flights');

    // Check for existing flights and skip duplicates
    let added = 0;
    let skipped = 0;

    for (const flightData of sampleFlights) {
      const existing = await Flight.findOne({ flightNumber: flightData.flightNumber });
      if (existing) {
        console.log(`Flight ${flightData.flightNumber} already exists, skipping...`);
        skipped++;
      } else {
        const flight = await Flight.create(flightData);
        console.log(`✓ Added flight: ${flight.flightNumber} - ${flight.origin} to ${flight.destination}`);
        added++;
      }
    }

    console.log(`\n✅ Success! Added ${added} flights, skipped ${skipped} duplicates.`);
    process.exit(0);
  } catch (error) {
    console.error('Error adding flights:', error.message);
    process.exit(1);
  }
};

addSampleFlights();

