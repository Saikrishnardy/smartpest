import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and user in localStorage on initial load
    const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        logout();
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token); // Changed from 'token' to 'authToken'
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    // Redirect based on role if needed, or default to home/dashboard
    if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Changed from 'token' to 'authToken'
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
