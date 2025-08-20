import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import MyButton from '../components/MyButton';
import BackgroundContainer from '../components/BackgroundContainer';
import ApiService from '../services/api'; // Import ApiService

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0, // Placeholder, needs backend API
    totalDetections: 0, // Placeholder, needs backend API, or count all reports
    totalReports: 0,
    totalFeedback: 0 // Placeholder, needs backend API
  });
  const [recentDetections, setRecentDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const reports = await ApiService.getReports();
        
        // Calculate total reports
        const totalReportsCount = reports.length;

        // Get recent detections (e.g., last 5)
        // Assuming reports are already ordered by timestamp descending from backend
        const recent = reports.slice(0, 5).map(report => ({
          user_name: report.user_id, // Use user_id for now
          pest_name: report.pest_name,
          confidence: report.confidence,
          created_at: report.timestamp
        }));

        setStats(prevStats => ({
          ...prevStats,
          totalReports: totalReportsCount,
          // totalDetections can be considered totalReports for now if no separate detection logging
          totalDetections: totalReportsCount 
        }));
        setRecentDetections(recent);
        
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin data. Please check backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const adminFeatures = [
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: '👥',
      link: '/user-management',
      color: '#2196f3'
    },
    {
      title: 'Manage Feedback',
      description: 'View and respond to user feedback',
      icon: '💬',
      link: '/manage-feedback',
      color: '#ff9800'
    },
    {
      title: 'Manage Pesticides',
      description: 'Update pesticide information',
      icon: '🧪',
      link: '/manage-pesticides',
      color: '#4caf50'
    },
    {
      title: 'Pest Reports',
      description: 'View all pest detection reports',
      icon: '📊',
      link: '/pest-reports',
      color: '#9c27b0'
    }
  ];

  if (loading) {
    return (
      <BackgroundContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Loading admin dashboard...</div>
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
          background: 'linear-gradient(135deg, #ff9800, #ffb74d)', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Welcome to the SmartPest Admin Panel. Manage your system effectively.
          </p>
        </div>

        {/* Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <Card style={{ textAlign: 'center', background: '#e3f2fd' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Total Users</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {stats.totalUsers}
            </div>
          </Card>
          <Card style={{ textAlign: 'center', background: '#f3e5f5' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9c27b0' }}>Total Detections</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>
              {stats.totalDetections}
            </div>
          </Card>
          <Card style={{ textAlign: 'center', background: '#e8f5e8' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#4caf50' }}>Total Reports</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
              {stats.totalReports}
            </div>
          </Card>
          <Card style={{ textAlign: 'center', background: '#fff3e0' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff9800' }}>Total Feedback</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
              {stats.totalFeedback}
            </div>
          </Card>
        </div>

        {/* Admin Features */}
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Admin Tools</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {adminFeatures.map((feature, index) => (
            <Card key={index} style={{ 
              cursor: 'pointer', 
              transition: 'transform 0.2s',
              border: `2px solid ${feature.color}`,
              background: 'white'
            }}
            onClick={() => navigate(feature.link)}>
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

        {/* Recent Detections */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Recent Detections</h2>
          {recentDetections.length > 0 ? (
            <Card>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>User</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Pest</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Confidence</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDetections.map((detection, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{detection.user_name}</td>
                        <td style={{ padding: '12px' }}>{detection.pest_name}</td>
                        <td style={{ padding: '12px' }}>{(detection.confidence * 100).toFixed(1)}%</td>
                        <td style={{ padding: '12px' }}>{new Date(detection.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card>
              <p style={{ color: '#666', textAlign: 'center', margin: 0 }}>
                No recent detections found.
              </p>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <MyButton
              onClick={() => navigate('/user-management')}
              style={{
                padding: '10px 20px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Manage Users
            </MyButton>
            
            <MyButton
              onClick={() => navigate('/manage-feedback')}
              style={{
                padding: '10px 20px',
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              View Feedback
            </MyButton>
            
            <MyButton
              onClick={() => navigate('/manage-pesticides')}
              style={{
                padding: '10px 20px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Manage Pesticides
            </MyButton>
            
            <MyButton
              onClick={() => navigate('/pest-reports')}
              style={{
                padding: '10px 20px',
                background: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              View Reports
            </MyButton>
          </div>
        </Card>

        {/* Admin Actions */}
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </BackgroundContainer>
  );
}

export default AdminDashboard;