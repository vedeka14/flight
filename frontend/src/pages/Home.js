import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>Welcome to Flight Booking</h1>
        <p>Book your flights easily and securely</p>
        <Link to="/search" className="hero-button">Search Flights</Link>
      </div>
    </div>
  );
};

export default Home;
