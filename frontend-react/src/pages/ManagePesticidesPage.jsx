import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import BackgroundContainer from '../components/BackgroundContainer';

function ManagePesticidesPage() {
  return (
    <BackgroundContainer>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#4caf50', marginBottom: '10px' }}>Manage Pesticides</h1>
          <p style={{ color: '#666', margin: 0 }}>
            Update and manage pesticide information.
          </p>
        </div>

        <Card>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Pesticide List</h3>
          <p style={{ color: '#666' }}>
            This page will display a list of pesticides, allowing administrators to add, edit, or delete pesticide information.
            (Content to be implemented: Fetch pesticide data from backend, display in a table, add CRUD actions).
          </p>
        </Card>
      </div>
    </BackgroundContainer>
  );
}

export default ManagePesticidesPage;