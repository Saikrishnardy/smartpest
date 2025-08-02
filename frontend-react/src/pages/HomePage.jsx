import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import BackgroundContainer from '../components/BackgroundContainer';

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  const features = [
    {
      title: 'Pest Detection',
      description: 'Upload images to detect and identify pests',
      icon: '🔍',
      link: '/pest-detect',
      color: '#4caf50'
    },
    {
      title: 'Pest Reports',
      description: 'View and manage pest detection reports',
      icon: '📊',
      link: '/pest-reports',
      color: '#2196f3'
    },
    {
      title: 'Pesticides Info',
      description: 'Browse information about pesticides',
      icon: '🧪',
      link: '/description',
      color: '#ff9800'
    },
    {
      title: 'Feedback',
      description: 'Send feedback and suggestions',
      icon: '💬',
      link: '/feedback',
      color: '#9c27b0'
    }
  ];

  if (loading) {
    return (
      <BackgroundContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Loading...</div>
        </div>
      </BackgroundContainer>
    );
  }

  return (
    <BackgroundContainer>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {error && <Alert type="error" message={error} />}
        
        {/* Welcome Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>
            Welcome to SmartPest!
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            SmartPest helps you identify and manage pests effectively
          </p>
          
          {/* Test Navigation Button */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => {
                console.log('Test button clicked - navigating to pest-detect');
                navigate('/pest-detect');
              }}
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🧪 Test Navigation to Pest Detection
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <Card style={{ textAlign: 'center', background: '#e3f2fd' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Total Detections</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>0</div>
          </Card>
          <Card style={{ textAlign: 'center', background: '#f3e5f5' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9c27b0' }}>Reports</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>0</div>
          </Card>
          <Card style={{ textAlign: 'center', background: '#e8f5e8' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#4caf50' }}>Pesticides</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>0</div>
          </Card>
        </div>

        {/* Main Features */}
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Quick Actions</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {features.map((feature, index) => (
            <Card key={index} style={{ 
              cursor: 'pointer', 
              transition: 'transform 0.2s',
              border: `2px solid ${feature.color}`,
              background: 'white'
            }}
            onClick={() => {
              console.log('Card clicked:', feature.title, 'navigating to:', feature.link);
              console.log('Current URL before navigation:', window.location.pathname);
              try {
                navigate(feature.link);
                console.log('Navigation called successfully');
              } catch (error) {
                console.error('Navigation error:', error);
              }
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px' 
              }}>
                <div style={{ 
                  fontSize: '40px', 
                  width: '60px', 
                  textAlign: 'center' 
                }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    color: feature.color,
                    fontSize: '18px'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: '#666', 
                    fontSize: '14px' 
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Recent Activity</h2>
          <Card>
            <p style={{ color: '#666', textAlign: 'center', margin: 0 }}>
              No recent activity. Start by detecting a pest!
            </p>
          </Card>
        </div>

        {/* Admin Access */}
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Link to="/admin">
            <button style={{
              padding: '10px 20px',
              background: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Admin Dashboard
            </button>
          </Link>
        </div>
      </div>
    </BackgroundContainer>
  );
}

export default HomePage;