import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px 20px', background: '#1976d2', color: '#fff', display: 'flex', gap: 20 }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>SmartPest</Link>
      <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
      <Link to="/signup" style={{ color: '#fff', textDecoration: 'none' }}>Signup</Link>
      <Link to="/feedback" style={{ color: '#fff', textDecoration: 'none' }}>Feedback</Link>
      {/* Add more links as needed */}
    </nav>
  );
}

export default Navbar;