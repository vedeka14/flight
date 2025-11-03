import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ✈️ Flight Booking
        </Link>
        <div className="nav-links">
          <Link to="/search" className="nav-link">Search Flights</Link>
          {user ? (
            <>
              <Link to="/bookings" className="nav-link">My Bookings</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">Admin Panel</Link>
              )}
              <span className="nav-user">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="nav-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
