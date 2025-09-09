import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import BackgroundContainer from '../components/BackgroundContainer';
import ApiService from '../services/api';
import { useAuth } from '../context/AuthContext'; // To potentially show admin-only actions later

function UserManagementPage() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth(); // Get current logged-in user to check role

  const fetchUsers = async () => {
    try {
      const response = await ApiService.getUsers();
      setUserList(response);
    } catch (err) {
      console.error('Error fetching users in UserManagementPage:', err);
      setError('Failed to load user data. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers();
    const interval = setInterval(fetchUsers, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <BackgroundContainer>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading user data...</div>
      </BackgroundContainer>
    );
  }

  return (
    <BackgroundContainer>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2196f3', marginBottom: '10px' }}>User Management</h1>
          <p style={{ color: '#666', margin: 0 }}>
            View and manage registered user accounts.
          </p>
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <Card>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Registered Users</h3>
          {userList.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={tableHeaderStyle}>ID</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>First Name</th>
                    <th style={tableHeaderStyle}>Last Name</th>
                    <th style={tableHeaderStyle}>Role</th>
                    {/* Add actions column later if needed */}
                  </tr>
                </thead>
                <tbody>
                  {userList.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tableCellStyle}>{user.id}</td>
                      <td style={tableCellStyle}>{user.email}</td>
                      <td style={tableCellStyle}>{user.first_name}</td>
                      <td style={tableCellStyle}>{user.last_name}</td>
                      <td style={tableCellStyle}>{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#666', textAlign: 'center', margin: 0 }}>No users registered yet.</p>
          )}
        </Card>
      </div>
    </BackgroundContainer>
  );
}

const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const tableCellStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee',
};

export default UserManagementPage;