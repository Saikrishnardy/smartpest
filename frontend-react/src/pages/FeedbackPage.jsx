import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import MyTextField from '../components/MyTextField';
import MyButton from '../components/MyButton';
import BackgroundContainer from '../components/BackgroundContainer';

function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Feedback submitted successfully! Thank you for your input.');
        // Clear form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          rating: 5
        });
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
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
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#333',
                fontWeight: '500'
              }}>
                Name *
              </label>
              <MyTextField
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#333',
                fontWeight: '500'
              }}>
                Email *
              </label>
              <MyTextField
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#333',
                fontWeight: '500'
              }}>
                Subject *
              </label>
              <MyTextField
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#333',
                fontWeight: '500'
              }}>
                Rating
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: star <= formData.rating ? '#ffd700' : '#ddd'
                    }}
                  >
                    ★
                  </button>
                ))}
                <span style={{ color: '#666', marginLeft: '10px' }}>
                  {formData.rating} out of 5
                </span>
              </div>
            </div>

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
              <MyButton
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
              </MyButton>
              
              <MyButton
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
              </MyButton>
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