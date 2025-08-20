import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import BackgroundContainer from '../components/BackgroundContainer';

function ManageFeedbackPage() {
  return (
    <BackgroundContainer>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#ff9800', marginBottom: '10px' }}>Manage Feedback</h1>
          <p style={{ color: '#666', margin: 0 }}>
            View and respond to user feedback.
          </p>
        </div>

        <Card>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Feedback List</h3>
          <p style={{ color: '#666' }}>
            This page will display a list of user feedback entries, allowing administrators to view and respond to them.
            (Content to be implemented: Fetch feedback from backend, display in a table, add response/archive actions).
          </p>
        </Card>
      </div>
    </BackgroundContainer>
  );
}

export default ManageFeedbackPage;