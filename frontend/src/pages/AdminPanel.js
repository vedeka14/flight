import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: '',
    origin: '',
    destination: '',
    departureDate: null,
    arrivalDate: null,
    departureTime: '',
    arrivalTime: '',
    price: '',
    availableSeats: '',
    totalSeats: '',
    aircraft: ''
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/flights');
      setFlights(res.data.flights);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch flights');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (field, date) => {
    setFormData({
      ...formData,
      [field]: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const flightData = {
        ...formData,
        departureDate: formData.departureDate,
        arrivalDate: formData.arrivalDate,
        price: parseFloat(formData.price),
        availableSeats: parseInt(formData.availableSeats),
        totalSeats: parseInt(formData.totalSeats)
      };

      if (editingFlight) {
        await axios.put(`/api/flights/${editingFlight._id}`, flightData);
      } else {
        await axios.post('/api/flights', flightData);
      }

      setShowForm(false);
      setEditingFlight(null);
      resetForm();
      fetchFlights();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save flight');
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setFormData({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      origin: flight.origin,
      destination: flight.destination,
      departureDate: new Date(flight.departureDate),
      arrivalDate: new Date(flight.arrivalDate),
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      price: flight.price,
      availableSeats: flight.availableSeats,
      totalSeats: flight.totalSeats,
      aircraft: flight.aircraft || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (flightId) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) {
      return;
    }

    try {
      await axios.delete(`/api/flights/${flightId}`);
      fetchFlights();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete flight');
    }
  };

  const resetForm = () => {
    setFormData({
      flightNumber: '',
      airline: '',
      origin: '',
      destination: '',
      departureDate: null,
      arrivalDate: null,
      departureTime: '',
      arrivalTime: '',
      price: '',
      availableSeats: '',
      totalSeats: '',
      aircraft: ''
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFlight(null);
    resetForm();
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-header">
          <h2>Admin Panel - Flight Management</h2>
          <button
            className="add-flight-button"
            onClick={() => {
              setShowForm(true);
              setEditingFlight(null);
              resetForm();
            }}
          >
            + Add New Flight
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="flight-form-card">
            <h3>{editingFlight ? 'Edit Flight' : 'Add New Flight'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Flight Number *</label>
                  <input
                    type="text"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Airline *</label>
                  <input
                    type="text"
                    name="airline"
                    value={formData.airline}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Origin *</label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Destination *</label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Departure Date *</label>
                  <DatePicker
                    selected={formData.departureDate}
                    onChange={(date) => handleDateChange('departureDate', date)}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    className="date-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Arrival Date *</label>
                  <DatePicker
                    selected={formData.arrivalDate}
                    onChange={(date) => handleDateChange('arrivalDate', date)}
                    dateFormat="yyyy-MM-dd"
                    minDate={formData.departureDate || new Date()}
                    className="date-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Departure Time *</label>
                  <input
                    type="time"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Arrival Time *</label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Seats *</label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Available Seats *</label>
                  <input
                    type="number"
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Aircraft</label>
                  <input
                    type="text"
                    name="aircraft"
                    value={formData.aircraft}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  {editingFlight ? 'Update Flight' : 'Create Flight'}
                </button>
                <button type="button" className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading flights...</div>
        ) : (
          <div className="flights-table">
            <table>
              <thead>
                <tr>
                  <th>Flight #</th>
                  <th>Airline</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Price</th>
                  <th>Seats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">No flights found</td>
                  </tr>
                ) : (
                  flights.map((flight) => (
                    <tr key={flight._id}>
                      <td>{flight.flightNumber}</td>
                      <td>{flight.airline}</td>
                      <td>{flight.origin} → {flight.destination}</td>
                      <td>{new Date(flight.departureDate).toLocaleDateString()}</td>
                      <td>{flight.departureTime} - {flight.arrivalTime}</td>
                      <td>₹{flight.price}</td>
                      <td>{flight.availableSeats}/{flight.totalSeats}</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(flight)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(flight._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
