import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import MyButton from '../components/MyButton';
import BackgroundContainer from '../components/BackgroundContainer';
import ApiService from '../services/api';

function PestDetectPage() {
  console.log('PestDetectPage component loaded');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, GIF)');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleClickUpload = () => {
    console.log('Click upload triggered');
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked');
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Starting pest detection...');
      
      // Call the actual API
      const result = await ApiService.detectPest(selectedFile);
      console.log('API Response:', result);
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Transform the API response to match our expected format
      const detectionResult = {
        pest_name: result.class,
        confidence: result.confidence,
        description: `Detected ${result.class} with ${(result.confidence * 100).toFixed(1)}% confidence`,
        recommendations: ['Use appropriate pesticides', 'Apply preventive measures', 'Monitor regularly']
      };

      setSuccess('Pest detected successfully!');
      
      // Navigate to results page with detection data
      navigate('/pest-result', { 
        state: { 
          detectionResult: detectionResult,
          imageFile: selectedFile
        } 
      });
      setLoading(false);

    } catch (err) {
      console.error('Error during detection:', err);
      setError('Failed to connect to the detection service. Please check if the backend server is running.');
      setLoading(false);
    }
  };

  const handleClear = () => {
    console.log('Clear button clicked');
    setSelectedFile(null);
    setPreview(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <BackgroundContainer>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1976d2', marginBottom: '10px' }}>Pest Detection</h1>
          <p style={{ color: '#666', margin: 0 }}>
            Upload an image to detect and identify pests
          </p>
        </div>

        {/* Debug Section */}
        <Card style={{ marginBottom: '20px', background: '#fff3cd', border: '1px solid #ffeaa7' }}>
          <h3 style={{ marginBottom: '15px', color: '#856404' }}>🔧 Debug Information</h3>
          <div style={{ color: '#856404', fontSize: '14px' }}>
            <p><strong>Current URL:</strong> {window.location.pathname}</p>
            <p><strong>Selected File:</strong> {selectedFile ? selectedFile.name : 'None'}</p>
            <p><strong>Loading State:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Error State:</strong> {error || 'None'}</p>
          </div>
          <div style={{ marginTop: '15px' }}>
            <button
              onClick={() => {
                console.log('Direct navigation test');
                window.location.href = '/pest-result';
              }}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Test Direct Navigation
            </button>
            <button
              onClick={() => {
                console.log('Navigate test');
                navigate('/pest-result');
              }}
              style={{
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Test React Router Navigation
            </button>
          </div>
        </Card>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <Card style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Upload Image</h3>
          
          {/* Test Navigation Button */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <button
              onClick={() => {
                console.log('Test navigation button clicked');
                navigate('/pest-result', { 
                  state: { 
                    detectionResult: {
                      pest_name: 'Test Pest',
                      confidence: 0.95,
                      description: 'This is a test pest detection result',
                      recommendations: ['Test recommendation 1', 'Test recommendation 2']
                    }
                  } 
                });
              }}
              style={{
                padding: '10px 20px',
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              🧪 Test Navigation (Skip Upload)
            </button>
          </div>
          
          <div 
            style={{ 
              border: `2px dashed ${isDragOver ? '#1976d2' : '#ddd'}`, 
              borderRadius: '8px', 
              padding: '40px', 
              textAlign: 'center',
              background: isDragOver ? '#e3f2fd' : '#fafafa',
              marginBottom: '20px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickUpload}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
            <div style={{ color: '#666', marginBottom: '10px', fontSize: '16px' }}>
              {isDragOver ? 'Drop your image here' : 'Click to select an image or drag and drop'}
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              Supported formats: JPG, PNG, GIF (Max 5MB)
            </div>
          </div>

          {preview && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>Preview:</h4>
              <div style={{ 
                position: 'relative', 
                display: 'inline-block',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #ddd'
              }}>
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px',
                    display: 'block'
                  }} 
                />
                <button
                  onClick={handleClear}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <MyButton
              onClick={handleSubmit}
              disabled={!selectedFile || loading}
              style={{
                padding: '12px 24px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: selectedFile && !loading ? 'pointer' : 'not-allowed',
                opacity: selectedFile && !loading ? 1 : 0.6,
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? '🔍 Detecting...' : '🔍 Detect Pest'}
            </MyButton>
            
            {selectedFile && (
              <MyButton
                onClick={handleClear}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
                }}
              >
                Clear
              </MyButton>
            )}
          </div>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Instructions</h3>
          <ul style={{ color: '#666', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
            <li>Take a clear photo of the pest or plant damage</li>
            <li>Ensure good lighting for better detection accuracy</li>
            <li>Include the entire pest or affected area in the image</li>
            <li>Supported image formats: JPG, PNG, GIF</li>
            <li>Maximum file size: 5MB</li>
          </ul>
        </Card>

        <Card style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Tips for Better Detection</h3>
          <div style={{ color: '#666', lineHeight: '1.6' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>📸 Clear Photos:</strong> Make sure the pest is clearly visible and in focus.
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>🌞 Good Lighting:</strong> Natural daylight works best for accurate detection.
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>📏 Proper Distance:</strong> Don't get too close or too far from the subject.
            </p>
            <p style={{ margin: 0 }}>
              <strong>🎯 Multiple Angles:</strong> Try different angles if the first detection isn't accurate.
            </p>
          </div>
        </Card>
      </div>
    </BackgroundContainer>
  );
}

export default PestDetectPage;