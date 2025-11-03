import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await axios.put(`/api/bookings/${bookingId}`, { bookingStatus: 'cancelled' });
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  if (loading) {
    return <div className="bookings-container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="bookings-container">
      <div className="bookings-card">
        <h2>My Bookings</h2>
        {error && <div className="error-message">{error}</div>}
        
        {bookings.length === 0 ? (
          <div className="no-bookings">No bookings found</div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className={`booking-card ${booking.bookingStatus === 'cancelled' ? 'cancelled' : ''}`}>
                <div className="booking-header">
                  <div className="booking-id">Booking ID: {booking._id.slice(-8)}</div>
                  <div className={`booking-status ${booking.bookingStatus}`}>
                    {booking.bookingStatus.toUpperCase()}
                  </div>
                </div>
                
                <div className="booking-details">
                  <div className="flight-details">
                    <h4>Outbound Flight</h4>
                    <div className="flight-info-row">
                      <span><strong>Flight:</strong> {booking.flight?.flightNumber}</span>
                      <span><strong>Airline:</strong> {booking.flight?.airline}</span>
                    </div>
                    <div className="flight-info-row">
                      <span><strong>From:</strong> {booking.flight?.origin}</span>
                      <span><strong>To:</strong> {booking.flight?.destination}</span>
                    </div>
                    <div className="flight-info-row">
                      <span><strong>Departure:</strong> {new Date(booking.flight?.departureDate).toLocaleString()}</span>
                      <span><strong>Time:</strong> {booking.flight?.departureTime} - {booking.flight?.arrivalTime}</span>
                    </div>
                  </div>

                  {booking.returnFlight && (
                    <div className="flight-details">
                      <h4>Return Flight</h4>
                      <div className="flight-info-row">
                        <span><strong>Flight:</strong> {booking.returnFlight?.flightNumber}</span>
                        <span><strong>Airline:</strong> {booking.returnFlight?.airline}</span>
                      </div>
                      <div className="flight-info-row">
                        <span><strong>From:</strong> {booking.returnFlight?.origin}</span>
                        <span><strong>To:</strong> {booking.returnFlight?.destination}</span>
                      </div>
                      <div className="flight-info-row">
                        <span><strong>Departure:</strong> {new Date(booking.returnFlight?.departureDate).toLocaleString()}</span>
                        <span><strong>Time:</strong> {booking.returnFlight?.departureTime} - {booking.returnFlight?.arrivalTime}</span>
                      </div>
                    </div>
                  )}

                  <div className="passengers-details">
                    <h4>Passengers ({booking.passengers.length})</h4>
                    {booking.passengers.map((passenger, index) => (
                      <div key={index} className="passenger-item">
                        {passenger.name} (Age: {passenger.age})
                      </div>
                    ))}
                  </div>

                  <div className="booking-footer">
                    <div className="booking-price">
                      Total Price: <strong>₹{booking.totalPrice}</strong>
                    </div>
                    <div className="booking-actions">
                      {booking.bookingStatus === 'confirmed' && (
                        <button
                          className="cancel-button"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteBooking(booking._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
