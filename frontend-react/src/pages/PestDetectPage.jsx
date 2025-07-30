import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import MyButton from '../components/MyButton';
import BackgroundContainer from '../components/BackgroundContainer';

function PestDetectPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/detect-pest/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Pest detected successfully!');
        // Navigate to results page with detection data
        navigate('/pest-result', { 
          state: { 
            detectionResult: data,
            imageFile: selectedFile
          } 
        });
      } else {
        setError(data.message || 'Detection failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    setSuccess('');
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

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <Card style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Upload Image</h3>
          
          <div style={{ 
            border: '2px dashed #ddd', 
            borderRadius: '8px', 
            padding: '40px', 
            textAlign: 'center',
            background: '#fafafa',
            marginBottom: '20px'
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
              <div style={{ color: '#666', marginBottom: '10px' }}>
                Click to select an image or drag and drop
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </div>
            </label>
          </div>

          {preview && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>Preview:</h4>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }} 
              />
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
                opacity: selectedFile && !loading ? 1 : 0.6
              }}
            >
              {loading ? 'Detecting...' : 'Detect Pest'}
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
                  cursor: loading ? 'not-allowed' : 'pointer'
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