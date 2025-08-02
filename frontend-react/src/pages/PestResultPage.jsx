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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('PestResultPage mounted, location state:', location.state);
    if (location.state?.detectionResult) {
      console.log('Setting detection result:', location.state.detectionResult);
      setDetectionResult(location.state.detectionResult);
    } else {
      console.log('No detection result found, redirecting to pest-detect');
      // If no detection result, redirect back to detection page
      navigate('/pest-detect');
    }
  }, [location, navigate]);

  // Sample pest data for demonstration
  const getPestInfo = (pestName) => {
    const pestDatabase = {
      'Aphids': {
        description: 'Small, soft-bodied insects that feed on plant sap',
        damage: 'Cause yellowing leaves, stunted growth, and honeydew secretion',
        control_methods: 'Use insecticidal soap, neem oil, or introduce ladybugs',
        pesticides: ['Insecticidal Soap', 'Neem Oil', 'Pyrethrin']
      },
      'Spider Mites': {
        description: 'Tiny arachnids that create fine webbing on plants',
        damage: 'Cause stippling on leaves, webbing, and leaf drop',
        control_methods: 'Increase humidity, use miticides, or predatory mites',
        pesticides: ['Miticide', 'Horticultural Oil', 'Insecticidal Soap']
      },
      'Whiteflies': {
        description: 'Small, white, winged insects that cluster on leaf undersides',
        damage: 'Cause yellowing, wilting, and transmit plant viruses',
        control_methods: 'Use yellow sticky traps, insecticidal soap, or systemic insecticides',
        pesticides: ['Insecticidal Soap', 'Neem Oil', 'Systemic Insecticide']
      },
      'Sample Pest': {
        description: 'This is a sample pest detection for demonstration purposes',
        damage: 'Sample damage description for testing the application',
        control_methods: 'Sample control methods for demonstration',
        pesticides: ['Sample Pesticide 1', 'Sample Pesticide 2', 'Organic Option']
      }
    };
    
    return pestDatabase[pestName] || {
      description: 'Pest information not available in database',
      damage: 'Damage assessment requires further analysis',
      control_methods: 'General pest control methods recommended',
      pesticides: ['Consult local pest control expert']
    };
  };

  const handleSaveReport = async () => {
    if (!detectionResult) return;

    setLoading(true);
    try {
      // Simulate saving report since we removed authentication
      setTimeout(() => {
        alert('Report saved successfully!');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to save report');
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
                <p><strong>Description:</strong> {detectionResult.description}</p>
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
            
            {(() => {
              const pestInfo = getPestInfo(detectionResult.pest_name);
              return (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '10px', color: '#333' }}>Description:</h4>
                    <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
                      {pestInfo.description}
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '10px', color: '#333' }}>Damage:</h4>
                    <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
                      {pestInfo.damage}
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '10px', color: '#333' }}>Control Methods:</h4>
                    <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
                      {pestInfo.control_methods}
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '10px', color: '#333' }}>Recommended Pesticides:</h4>
                    <ul style={{ color: '#666', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                      {pestInfo.pesticides.map((pesticide, index) => (
                        <li key={index}>{pesticide}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
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
      </div>
    </BackgroundContainer>
  );
}

export default PestResultPage;