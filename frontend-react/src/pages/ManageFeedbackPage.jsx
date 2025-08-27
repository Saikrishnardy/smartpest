import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import BackgroundContainer from '../components/BackgroundContainer';
import ApiService from '../services/api';
import { useAuth } from '../context/AuthContext'; // Import useAuth

function ManageFeedbackPage() {
  const { user } = useAuth(); // Get the authenticated user
  const isAdmin = user && user.role === 'admin';
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const response = await ApiService.getFeedback();
      setFeedbackList(response);
    } catch (err) {
      console.error('Error fetching feedback in ManageFeedbackPage:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFeedback();
    const interval = setInterval(fetchFeedback, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleDeleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await ApiService.deleteFeedback(id);
        fetchFeedback(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Failed to delete feedback.');
      }
    }
  };

  const handleToggleImportant = async (id, currentStatus) => {
    try {
      await ApiService.updateFeedback(id, { is_important: !currentStatus });
      fetchFeedback(); // Refresh the list after update
    } catch (error) {
      console.error('Error updating feedback importance:', error);
      alert('Failed to update feedback importance.');
    }
  };

  if (loading) {
    return (
      <BackgroundContainer>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading feedback...</div>
      </BackgroundContainer>
    );
  }

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
          {feedbackList.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={tableHeaderStyle}>User</th>
                    <th style={tableHeaderStyle}>Subject</th>
                    <th style={tableHeaderStyle}>Message</th>
                    <th style={tableHeaderStyle}>Date</th>
                    {isAdmin && <th style={tableHeaderStyle}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((feedback) => (
                    <tr key={feedback.id} style={{ borderBottom: '1px solid #eee', background: feedback.is_important ? '#fffde7' : 'white' }}>
                      <td style={tableCellStyle}>
                        {feedback.user ? 
                          `${feedback.user.first_name} ${feedback.user.last_name} (${feedback.user.email})` :
                          'Anonymous'}
                          {feedback.is_important && <span style={{ color: 'gold', marginLeft: '5px' }}>★</span>}
                      </td>
                      <td style={tableCellStyle}>{feedback.subject}</td>
                      <td style={tableCellStyle}>{feedback.message}</td>
                      <td style={tableCellStyle}>{new Date(feedback.timestamp).toLocaleDateString()}</td>
                      {isAdmin && (
                        <td style={tableCellStyle}>
                          <button
                            onClick={() => handleDeleteFeedback(feedback.id)}
                            style={{
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginRight: '8px',
                            }}
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => handleToggleImportant(feedback.id, feedback.is_important)}
                            style={{
                              background: feedback.is_important ? '#607d8b' : '#2196f3',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            {feedback.is_important ? 'Unmark Important' : 'Mark as Important'}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#666', textAlign: 'center', margin: 0 }}>No feedback submitted yet.</p>
          )}
        </Card>
      </div>
    </BackgroundContainer>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '16px',
};

const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const tableCellStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee',
};

export default ManageFeedbackPage;