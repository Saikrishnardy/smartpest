import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import BackgroundContainer from '../components/BackgroundContainer';
import ApiService from '../services/api'; // Import ApiService

function DescriptionPage() {
  const [pesticides, setPesticides] = useState([]);
  const [pestDescriptions, setPestDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pesticides');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const fetchedPesticides = await ApiService.getPesticides();
      setPesticides(fetchedPesticides);

      const fetchedPests = await ApiService.getPests();
      setPestDescriptions(fetchedPests);
    } catch (err) {
      console.error('Error fetching data in DescriptionPage:', err);
      setError('Failed to load information. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Optionally refresh data periodically
    const interval = setInterval(fetchAllData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredPesticides = pesticides.filter(pesticide =>
    pesticide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pesticide.chemical_name && pesticide.chemical_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pesticide.description && pesticide.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPests = pestDescriptions.filter(pest =>
    pest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pest.description && pest.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <BackgroundContainer>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Loading information...</div>
        </div>
      </BackgroundContainer>
    );
  }

  return (
    <BackgroundContainer>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1976d2', marginBottom: '10px' }}>Information Center</h1>
          <p style={{ color: '#666', margin: 0 }}>
            Browse pests and pesticide information
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Search Bar */}
        <Card style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pesticides or pests..."
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
            <button
              onClick={() => setSearchTerm('')}
              style={{
                padding: '12px 16px',
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '2px solid #eee',
          paddingBottom: '10px'
        }}>
          <button
            onClick={() => setActiveTab('pesticides')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'pesticides' ? '#1976d2' : '#f5f5f5',
              color: activeTab === 'pesticides' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeTab === 'pesticides' ? 'bold' : 'normal'
            }}
          >
            Pesticides ({filteredPesticides.length})
          </button>
          <button
            onClick={() => setActiveTab('pests')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'pests' ? '#1976d2' : '#f5f5f5',
              color: activeTab === 'pests' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeTab === 'pests' ? 'bold' : 'normal'
            }}
          >
            Pests ({filteredPests.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'pesticides' ? (
          <div style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {filteredPesticides.map((pesticide) => (
              <Card key={pesticide.id} style={{
                border: '2px solid #e8f5e8',
                background: 'white'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{
                    margin: '0 0 8px 0', 
                    color: '#2e7d32',
                    fontSize: '18px'
                  }}>
                    {pesticide.name}
                  </h3>
                  {pesticide.toxicity_level && (
                    <div style={{
                      background: '#e8f5e8', 
                      color: '#2e7d32', 
                      padding: '4px 8px', 
                      borderRadius: '12px',
                      fontSize: '12px',
                      display: 'inline-block'
                    }}>
                      {pesticide.toxicity_level}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Description:</h4>
                  <p style={{
                    margin: 0, 
                    color: '#666', 
                    lineHeight: '1.6',
                    fontSize: '14px'
                  }}>
                    {pesticide.description}
                  </p>
                </div>

                {pesticide.application_methods && (
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Application Methods:</h4>
                    <p style={{
                      margin: 0, 
                      color: '#666', 
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}>
                      {pesticide.application_methods}
                    </p>
                  </div>
                )}

                {pesticide.safety_precautions && (
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Safety Precautions:</h4>
                    <p style={{
                      margin: 0, 
                      color: '#666', 
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}>
                      {pesticide.safety_precautions}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {filteredPests.map((pest) => (
              <Card key={pest.id} style={{
                border: '2px solid #fff3e0',
                background: 'white'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{
                    margin: '0 0 8px 0', 
                    color: '#f57c00',
                    fontSize: '18px'
                  }}>
                    {pest.name}
                  </h3>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Description:</h4>
                  <p style={{
                    margin: 0, 
                    color: '#666', 
                    lineHeight: '1.6',
                    fontSize: '14px'
                  }}>
                    {pest.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {((activeTab === 'pesticides' && filteredPesticides.length === 0) ||
          (activeTab === 'pests' && filteredPests.length === 0)) && (
          <Card style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>
              {activeTab === 'pesticides' ? '🧪' : '🐛'}
            </div>
            <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>
              No {activeTab} found
            </h3>
            <p style={{ color: '#666', margin: 0 }}>
              {searchTerm 
                ? `No ${activeTab} match "${searchTerm}". Try a different search term.`
                : `No ${activeTab} available at the moment.`
              }
            </p>
          </Card>
        )}

        {/* Information Footer */}
        <Card style={{ marginTop: '30px', background: '#f8f9fa' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Important Information</h3>
          <div style={{ color: '#666', lineHeight: '1.6' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>⚠️ Safety First:</strong> Always read and follow pesticide labels carefully.
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>🧤 Protective Equipment:</strong> Use appropriate protective gear when applying pesticides.
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>🌱 Integrated Pest Management:</strong> Consider non-chemical control methods first.
            </p>
            <p style={{ margin: 0 }}>
              <strong>📞 Expert Consultation:</strong> For severe infestations, consult a pest control professional.
            </p>
          </div>
        </Card>
      </div>
    </BackgroundContainer>
  );
}

export default DescriptionPage;