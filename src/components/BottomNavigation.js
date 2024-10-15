import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/BottomNavigation.css';
import chatIcon from '../assets/chat.svg';
import bookIcon from '../assets/book.svg';
import tripsIcon from '../assets/trips.svg';
import profileIcon from '../assets/profile.svg';

function BottomNavigation() {
  const location = useLocation(); // 현재 경로 확인

  return (
    <nav className="bottom-navigation">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <img src={chatIcon} className="icon" alt="Chat Icon" />
        <span>Chat</span>
      </Link>
      <Link to="/book" className={`nav-item ${location.pathname === '/book' ? 'active' : ''}`}>
        <img src={bookIcon} className="icon" alt="Book Icon" />
        <span>Book</span>
      </Link>
      <Link to="/trips" className={`nav-item ${location.pathname === '/trips' ? 'active' : ''}`}>
        <img src={tripsIcon} className="icon" alt="Trips Icon" />
        <span>Trips</span>
      </Link>
      <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
        <img src={profileIcon} className="icon" alt="Profile Icon" />
        <span>Profile</span>
      </Link>
    </nav>
  );
}

export default BottomNavigation;
