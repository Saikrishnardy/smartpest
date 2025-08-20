import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import BackgroundContainer from '../components/BackgroundContainer';

function UserManagementPage() {
  return (
    <BackgroundContainer>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2196f3', marginBottom: '10px' }}>User Management</h1>
          <p style={{ color: '#666', margin: 0 }}>
            Manage user accounts and permissions.
          </p>
        </div>

        <Card>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>User List</h3>
          <p style={{ color: '#666' }}>
            This page will display a list of users, allowing administrators to manage their accounts, roles, and permissions.
            (Content to be implemented: Fetch users from backend, display in a table, add edit/delete actions, role management).
          </p>
        </Card>
      </div>
    </BackgroundContainer>
  );
}

export default UserManagementPage;