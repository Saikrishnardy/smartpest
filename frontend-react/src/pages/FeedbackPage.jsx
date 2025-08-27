import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
// Removed MyButton, it will be replaced by standard button
import BackgroundContainer from '../components/BackgroundContainer';
import ApiService from '../services/api'; // Import ApiService
import { useAuth } from '../context/AuthContext'; // Import useAuth

function FeedbackPage() {
  const { user } = useAuth(); // Get authenticated user
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const feedbackData = {
        subject: formData.subject,
        message: formData.message,
        // The backend will associate the user if authenticated via perform_create
        // No need to send user ID from frontend here
      };

      await ApiService.submitFeedback(feedbackData);

      setSuccess('Feedback submitted successfully! Thank you for your input.');
      // Clear form
      setFormData({
        subject: '',
        message: '',
      });
      setLoading(false);
      // No automatic redirect, let user stay on page to see success message
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(`Failed to submit feedback: ${err.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <BackgroundContainer>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1976d2', marginBottom: '10px' }}>Send Feedback</h1>
          <p style={{ color: '#666', margin: 0 }}>
            We value your feedback! Help us improve SmartPest.
          </p>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <Card>
          <form onSubmit={handleSubmit}>

            {/* Removed Name and Email fields as backend automatically associates user if authenticated */}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#333',
                fontWeight: '500'
              }}>
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Enter feedback subject"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Removed Rating field as not part of backend model */}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#333',
                fontWeight: '500'
              }}>
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your experience with SmartPest..."
                required
                rows="6"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  padding: '12px 24px',
                  background: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>

        <Card style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>What We Value</h3>
          <div style={{ color: '#666', lineHeight: '1.6' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>💡 Suggestions:</strong> Help us improve features and functionality.
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>🐛 Bug Reports:</strong> Report any issues you encounter.
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>🌟 Feature Requests:</strong> Suggest new features you'd like to see.
            </p>
            <p style={{ margin: 0 }}>
              <strong>📝 General Feedback:</strong> Share your overall experience with SmartPest.
            </p>
          </div>
        </Card>
      </div>
    </BackgroundContainer>
  );
}

export default FeedbackPage;