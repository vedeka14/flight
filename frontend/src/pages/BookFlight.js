import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/BookFlight.css';

const BookFlight = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passengers, setPassengers] = useState([
    { name: '', age: '' }
  ]);
  const [tripType, setTripType] = useState('one-way');
  const [returnFlightId] = useState(null);

  const fetchFlight = useCallback(async () => {
    try {
      const res = await axios.get(`/api/flights/${flightId}`);
      setFlight(res.data);
      
      // Get trip type from location state if available
      if (location.state) {
        setTripType(location.state.tripType || 'one-way');
        if (location.state.passengers) {
          const passengerCount = location.state.passengers;
          setPassengers(Array(passengerCount).fill(null).map(() => ({ name: '', age: '' })));
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch flight details');
    } finally {
      setLoading(false);
    }
  }, [flightId, location.state]);

  useEffect(() => {
    fetchFlight();
  }, [fetchFlight]);

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setPassengers(updated);
  };

  const addPassenger = () => {
    setPassengers([...passengers, { name: '', age: '' }]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passengers
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name || !passengers[i].name.trim()) {
        setError(`Please enter name for Passenger ${i + 1}`);
        return;
      }
      if (!passengers[i].age || passengers[i].age === '') {
        setError(`Please enter age for Passenger ${i + 1}`);
        return;
      }
      const age = parseInt(passengers[i].age);
      if (isNaN(age) || age < 1 || age > 120) {
        setError(`Please enter a valid age (1-120) for Passenger ${i + 1}`);
        return;
      }
    }

    setLoading(true);

    try {
      const bookingData = {
        flightId,
        returnFlightId: returnFlightId || null,
        passengers: passengers.map(p => ({
          name: p.name.trim(),
          age: parseInt(p.age)
        })),
        tripType
      };

      const response = await axios.post('/api/bookings', bookingData);
      if (response.data) {
        navigate('/bookings', { state: { message: 'Booking confirmed successfully!' } });
      }
    } catch (err) {
      console.error('Booking error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to book flight. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (loading && !flight) {
    return <div className="book-flight-container"><div className="loading">Loading flight details...</div></div>;
  }

  if (!flight && !loading) {
    return <div className="book-flight-container"><div className="error-message">Flight not found</div></div>;
  }

  const totalPrice = flight.price * passengers.length;

  return (
    <div className="book-flight-container">
      <div className="book-flight-card">
        <h2>Book Flight</h2>
        
        <div className="flight-summary">
          <h3>Flight Details</h3>
          <div className="summary-row">
            <span><strong>Flight:</strong> {flight.flightNumber}</span>
            <span><strong>Airline:</strong> {flight.airline}</span>
          </div>
          <div className="summary-row">
            <span><strong>From:</strong> {flight.origin}</span>
            <span><strong>To:</strong> {flight.destination}</span>
          </div>
          <div className="summary-row">
            <span><strong>Date:</strong> {new Date(flight.departureDate).toLocaleDateString()}</span>
            <span><strong>Time:</strong> {flight.departureTime} - {flight.arrivalTime}</span>
          </div>
          <div className="summary-row">
            <span><strong>Price per passenger:</strong> ₹{flight.price}</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <h3>Passenger Details</h3>
          
          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-form">
              <div className="passenger-header">
                <h4>Passenger {index + 1}</h4>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    className="remove-passenger-btn"
                    onClick={() => removePassenger(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="add-passenger-btn"
            onClick={addPassenger}
          >
            + Add Another Passenger
          </button>

          <div className="booking-summary">
            <div className="summary-item">
              <span>Passengers:</span>
              <span>{passengers.length}</span>
            </div>
            <div className="summary-item">
              <span>Price per passenger:</span>
              <span>₹{flight.price}</span>
            </div>
            <div className="summary-item total">
              <span>Total Price:</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="confirm-booking-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/search')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFlight;
