import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import MyButton from '../components/MyButton';
import BackgroundContainer from '../components/BackgroundContainer';

function PestResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [detectionResult, setDetectionResult] = useState(null);
  const [pestInfo, setPestInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.detectionResult) {
      setDetectionResult(location.state.detectionResult);
      fetchPestInfo(location.state.detectionResult.pest_name);
    } else {
      // If no detection result, redirect back to detection page
      navigate('/pest-detect');
    }
  }, [location, navigate]);

  const fetchPestInfo = async (pestName) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/pest-info/${pestName}/`);
      if (response.ok) {
        const data = await response.json();
        setPestInfo(data);
      } else {
        setError('Failed to fetch pest information');
      }
    } catch (err) {
      setError('Network error while fetching pest information');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!detectionResult) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/save-report/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pest_name: detectionResult.pest_name,
          confidence: detectionResult.confidence,
          image_url: detectionResult.image_url,
          detection_date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert('Report saved successfully!');
      } else {
        setError('Failed to save report');
      }
    } catch (err) {
      setError('Network error while saving report');
    } finally {
      setLoading(false);
    }
  };

  const handleNewDetection = () => {
    navigate('/pest-detect');
  };

  if (!detectionResult) {
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
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1976d2', marginBottom: '10px' }}>Detection Results</h1>
          <p style={{ color: '#666', margin: 0 }}>
            Analysis complete - here's what we found
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          {/* Detection Results */}
          <Card>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Detection Results</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                background: '#e8f5e8', 
                padding: '15px', 
                borderRadius: '8px',
                border: '2px solid #4caf50'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>
                  Detected Pest: {detectionResult.pest_name}
                </h4>
                <div style={{ 
                  background: '#4caf50', 
                  color: 'white', 
                  padding: '8px 12px', 
                  borderRadius: '20px',
                  display: 'inline-block',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Confidence: {(detectionResult.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>Detection Details:</h4>
              <div style={{ color: '#666', lineHeight: '1.6' }}>
                <p><strong>Detection Time:</strong> {new Date().toLocaleString()}</p>
                <p><strong>Image Size:</strong> {detectionResult.image_size || 'N/A'}</p>
                <p><strong>Processing Time:</strong> {detectionResult.processing_time || 'N/A'}ms</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <MyButton
                onClick={handleSaveReport}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Saving...' : 'Save Report'}
              </MyButton>
              
              <MyButton
                onClick={handleNewDetection}
                style={{
                  padding: '10px 20px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                New Detection
              </MyButton>
            </div>
          </Card>

          {/* Pest Information */}
          <Card>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Pest Information</h3>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>Loading pest information...</div>
              </div>
            ) : pestInfo ? (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '10px', color: '#333' }}>Description:</h4>
                  <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
                    {pestInfo.description || 'No description available.'}
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '10px', color: '#333' }}>Damage:</h4>
                  <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
                    {pestInfo.damage || 'No damage information available.'}
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '10px', color: '#333' }}>Control Methods:</h4>
                  <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
                    {pestInfo.control_methods || 'No control methods available.'}
                  </p>
                </div>

                {pestInfo.pesticides && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '10px', color: '#333' }}>Recommended Pesticides:</h4>
                    <ul style={{ color: '#666', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                      {pestInfo.pesticides.map((pesticide, index) => (
                        <li key={index}>{pesticide}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: '#666', textAlign: 'center' }}>
                No detailed information available for this pest.
              </div>
            )}
          </Card>
        </div>

        {/* Confidence Meter */}
        <Card style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Confidence Level</h3>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ 
              width: '100%', 
              height: '20px', 
              background: '#f0f0f0', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${detectionResult.confidence * 100}%`,
                height: '100%',
                background: detectionResult.confidence > 0.7 ? '#4caf50' : 
                           detectionResult.confidence > 0.5 ? '#ff9800' : '#f44336',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '12px', 
            color: '#666' 
          }}>
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <span style={{ 
              color: detectionResult.confidence > 0.7 ? '#4caf50' : 
                     detectionResult.confidence > 0.5 ? '#ff9800' : '#f44336',
              fontWeight: 'bold'
            }}>
              {detectionResult.confidence > 0.7 ? 'High Confidence' : 
               detectionResult.confidence > 0.5 ? 'Medium Confidence' : 'Low Confidence'}
            </span>
          </div>
        </Card>

        {/* Recommendations */}
        <Card>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Recommendations</h3>
          <div style={{ color: '#666', lineHeight: '1.6' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>🔍 Verify Detection:</strong> If the confidence is low, consider taking another photo from a different angle.
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>📋 Save Report:</strong> Save this detection to your reports for future reference.
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>🧪 Check Pesticides:</strong> Review recommended pesticides for effective control.
            </p>
            <p style={{ margin: 0 }}>
              <strong>📞 Expert Consultation:</strong> For severe infestations, consider consulting a pest control expert.
            </p>
          </div>
        </Card>
      </div>
    </BackgroundContainer>
  );
}

export default PestResultPage;