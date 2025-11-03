import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/FlightSearch.css';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FlightSearch = () => {
  const [tripType, setTripType] = useState('one-way');
  const [flights, setFlights] = useState([]);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: null,
    returnDate: null,
    passengers: 1,
    currency: 'INR'
  });
  const [multiCityFlights, setMultiCityFlights] = useState([
    { origin: '', destination: '', departureDate: null }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearchParamsChange = (field, value) => {
    setSearchParams({
      ...searchParams,
      [field]: value
    });
  };

  const handleMultiCityChange = (index, field, value) => {
    const updated = [...multiCityFlights];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setMultiCityFlights(updated);
  };

  const addFlightSegment = () => {
    setMultiCityFlights([
      ...multiCityFlights,
      { origin: '', destination: '', departureDate: null }
    ]);
  };

  const removeFlightSegment = (index) => {
    if (multiCityFlights.length > 1) {
      setMultiCityFlights(multiCityFlights.filter((_, i) => i !== index));
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month} ${dayName}`;
  };

  const searchFlights = async () => {
    setLoading(true);
    setError('');
    
    try {
      let queryParams = {};
      
      if (tripType === 'multi-city') {
        // For multi-city, search for first flight
        if (!multiCityFlights[0].origin || !multiCityFlights[0].destination) {
          setError('Please enter origin and destination for at least the first flight');
          setLoading(false);
          return;
        }
        queryParams = {
          origin: multiCityFlights[0].origin.trim(),
          destination: multiCityFlights[0].destination.trim()
        };
        if (multiCityFlights[0].departureDate) {
          queryParams.departureDate = multiCityFlights[0].departureDate.toISOString();
        }
      } else {
        // Validate origin and destination for one-way and round-trip
        if (!searchParams.origin || !searchParams.origin.trim()) {
          setError('Please enter origin (From)');
          setLoading(false);
          return;
        }
        if (!searchParams.destination || !searchParams.destination.trim()) {
          setError('Please enter destination (To)');
          setLoading(false);
          return;
        }
        
        queryParams = {
          origin: searchParams.origin.trim(),
          destination: searchParams.destination.trim()
        };
        if (searchParams.departureDate) {
          queryParams.departureDate = searchParams.departureDate.toISOString();
        }
      }

      const response = await axios.get('/api/flights', { params: queryParams });
      if (response.data.flights && response.data.flights.length > 0) {
        setFlights(response.data.flights);
      } else {
        setFlights([]);
        setError('No flights found matching your criteria');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search flights. Please try again.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = (flightId) => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    
    navigate(`/book-flight/${flightId}`, {
      state: {
        flightId,
        tripType,
        passengers: searchParams.passengers,
        returnDate: searchParams.returnDate
      }
    });
  };

  return (
    <div className="flight-search-container">
      <div className="flight-search-card">
        <div className="trip-type-selector">
          <button
            className={`trip-type-btn ${tripType === 'one-way' ? 'active' : ''}`}
            onClick={() => setTripType('one-way')}
          >
            One Way
          </button>
          <button
            className={`trip-type-btn ${tripType === 'round-trip' ? 'active' : ''}`}
            onClick={() => setTripType('round-trip')}
          >
            Round Trip
          </button>
          <button
            className={`trip-type-btn ${tripType === 'multi-city' ? 'active' : ''}`}
            onClick={() => setTripType('multi-city')}
          >
            Multi City
          </button>
          <select
            className="currency-selector"
            value={searchParams.currency}
            onChange={(e) => handleSearchParamsChange('currency', e.target.value)}
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>

        {tripType === 'one-way' && (
          <div className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label>From: Flying from? Search by place/airport</label>
                <input
                  type="text"
                  placeholder="Search by place/airport"
                  value={searchParams.origin}
                  onChange={(e) => handleSearchParamsChange('origin', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>To: Going to? Search by place/airport</label>
                <input
                  type="text"
                  placeholder="Search by place/airport"
                  value={searchParams.destination}
                  onChange={(e) => handleSearchParamsChange('destination', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Departure: {formatDate(searchParams.departureDate)}</label>
                <DatePicker
                  selected={searchParams.departureDate}
                  onChange={(date) => handleSearchParamsChange('departureDate', date)}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select departure date"
                  minDate={new Date()}
                  className="date-input"
                />
              </div>
              <div className="form-group">
                <label>Return: Save more and enjoy up to 1000 off</label>
                <div className="promo-text">Save more and enjoy up to 1000 off</div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Travellers + Special Fares: {searchParams.passengers} Passenger{searchParams.passengers > 1 ? 's' : ''}</label>
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={searchParams.passengers}
                  onChange={(e) => handleSearchParamsChange('passengers', parseInt(e.target.value))}
                />
              </div>
            </div>
            <button className="search-button" onClick={searchFlights} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        )}

        {tripType === 'round-trip' && (
          <div className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label>From: Flying from? Search by place/airport</label>
                <input
                  type="text"
                  placeholder="Search by place/airport"
                  value={searchParams.origin}
                  onChange={(e) => handleSearchParamsChange('origin', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>To: Going to? Search by place/airport</label>
                <input
                  type="text"
                  placeholder="Search by place/airport"
                  value={searchParams.destination}
                  onChange={(e) => handleSearchParamsChange('destination', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Departure: {formatDate(searchParams.departureDate)}</label>
                <DatePicker
                  selected={searchParams.departureDate}
                  onChange={(date) => handleSearchParamsChange('departureDate', date)}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select departure date"
                  minDate={new Date()}
                  className="date-input"
                />
              </div>
              <div className="form-group">
                <label>Return: {formatDate(searchParams.returnDate)}</label>
                <DatePicker
                  selected={searchParams.returnDate}
                  onChange={(date) => handleSearchParamsChange('returnDate', date)}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select return date"
                  minDate={searchParams.departureDate || new Date()}
                  className="date-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Travellers + Special Fares: {searchParams.passengers} Passenger{searchParams.passengers > 1 ? 's' : ''}</label>
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={searchParams.passengers}
                  onChange={(e) => handleSearchParamsChange('passengers', parseInt(e.target.value))}
                />
              </div>
            </div>
            <button className="search-button" onClick={searchFlights} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        )}

        {tripType === 'multi-city' && (
          <div className="search-form">
            <h3 className="multi-city-heading">Multi city</h3>
            {multiCityFlights.map((flight, index) => (
              <div key={index} className="multi-city-segment">
                <div className="form-row">
                  <div className="form-group">
                    <label>From: Flying from? Search by place/airport</label>
                    <input
                      type="text"
                      placeholder="Search by place/airport"
                      value={flight.origin}
                      onChange={(e) => handleMultiCityChange(index, 'origin', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>To: Going to? Search by place/airport</label>
                    <input
                      type="text"
                      placeholder="Search by place/airport"
                      value={flight.destination}
                      onChange={(e) => handleMultiCityChange(index, 'destination', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Departure ({formatDate(flight.departureDate)}):</label>
                    <DatePicker
                      selected={flight.departureDate}
                      onChange={(date) => handleMultiCityChange(index, 'departureDate', date)}
                      dateFormat="dd MMM yyyy"
                      placeholderText="Select departure date"
                      minDate={new Date()}
                      className="date-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Travellers: {searchParams.passengers} Passenger{searchParams.passengers > 1 ? 's' : ''}</label>
                    <input
                      type="number"
                      min="1"
                      max="9"
                      value={searchParams.passengers}
                      onChange={(e) => handleSearchParamsChange('passengers', parseInt(e.target.value))}
                    />
                  </div>
                  {index > 0 && (
                    <button
                      className="remove-flight-btn"
                      onClick={() => removeFlightSegment(index)}
                      title="Remove flight"
                    >
                      <FaMinus />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button className="add-flight-btn" onClick={addFlightSegment}>
              <FaPlus /> Add a flight
            </button>
            <button className="search-button" onClick={searchFlights} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {flights.length > 0 && (
          <div className="flight-results">
            <h3>Available Flights</h3>
            {flights.map((flight) => (
              <div key={flight._id} className="flight-card">
                <div className="flight-info">
                  <div className="flight-airline">{flight.airline}</div>
                  <div className="flight-number">{flight.flightNumber}</div>
                  <div className="flight-route">
                    <div className="route-item">
                      <div className="route-time">{flight.departureTime}</div>
                      <div className="route-city">{flight.origin}</div>
                    </div>
                    <div className="route-arrow">→</div>
                    <div className="route-item">
                      <div className="route-time">{flight.arrivalTime}</div>
                      <div className="route-city">{flight.destination}</div>
                    </div>
                  </div>
                  <div className="flight-date">
                    {new Date(flight.departureDate).toLocaleDateString()}
                  </div>
                  <div className="flight-seats">
                    Available Seats: {flight.availableSeats}
                  </div>
                </div>
                <div className="flight-price">
                  <div className="price-amount">₹{flight.price}</div>
                  <button
                    className="book-button"
                    onClick={() => handleBookFlight(flight._id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
