import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import Table from '../components/Table';
import BackgroundContainer from '../components/BackgroundContainer';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDetections: 0,
    totalReports: 0,
    totalFeedback: 0
  });
  const [recentDetections, setRecentDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      if (userObj.role !== 'admin') {
        navigate('/');
        return;
      }
      setUser(userObj);
      fetchDashboardData();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/admin/dashboard/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentDetections(data.recent_detections || []);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Network error while fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

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
            Welcome back, {user?.first_name || user?.username}! Manage your SmartPest system.
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
              <Table 
                columns={[
                  { header: 'User', accessor: 'user' },
                  { header: 'Pest', accessor: 'pest_name' },
                  { header: 'Confidence', accessor: 'confidence' },
                  { header: 'Date', accessor: 'date' }
                ]}
                data={recentDetections.map(detection => ({
                  user: detection.user_name,
                  pest_name: detection.pest_name,
                  confidence: `${(detection.confidence * 100).toFixed(1)}%`,
                  date: new Date(detection.created_at).toLocaleDateString()
                }))}
              />
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
          
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </BackgroundContainer>
  );
}

export default AdminDashboard;