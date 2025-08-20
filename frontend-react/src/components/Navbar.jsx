import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <nav style={{ padding: '10px 20px', background: '#1976d2', color: '#fff', display: 'flex', gap: 20, alignItems: 'center' }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2em' }}>SmartPest</Link>

      <div style={{ flexGrow: 1, display: 'flex', gap: 20 }}>
        {/* Always visible links */}
        <Link to="/description" style={{ color: '#fff', textDecoration: 'none' }}>Description</Link>
        <Link to="/feedback" style={{ color: '#fff', textDecoration: 'none' }}>Feedback</Link>

        {/* Links visible only when logged in */}
        {isLoggedIn && (
          <>
            <Link to="/pest-detect" style={{ color: '#fff', textDecoration: 'none' }}>Detect Pest</Link>
            <Link to="/pest-reports" style={{ color: '#fff', textDecoration: 'none' }}>Pest Reports</Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin Dashboard</Link>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Auth links */}
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/signup" style={{ color: '#fff', textDecoration: 'none' }}>Signup</Link>
          </>
        ) : (
          <button 
            onClick={logout} 
            style={{
              background: 'none',
              border: '1px solid white',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em'
            }}
          >
            Logout ({user?.email})
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;