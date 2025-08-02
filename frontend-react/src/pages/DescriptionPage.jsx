import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import BackgroundContainer from '../components/BackgroundContainer';

function DescriptionPage() {
  const [pesticides, setPesticides] = useState([]);
  const [pestDescriptions, setPestDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pesticides');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const samplePesticides = [
        {
          name: 'Insecticidal Soap',
          type: 'Organic',
          description: 'A natural pesticide made from potassium salts of fatty acids. Safe for plants and beneficial insects.',
          usage: 'Mix 2-5 tablespoons per gallon of water. Apply to affected plants, covering both sides of leaves.',
          safety: 'Low toxicity to humans and pets. Wash hands after use. Avoid contact with eyes.'
        },
        {
          name: 'Neem Oil',
          type: 'Organic',
          description: 'Extracted from neem tree seeds, acts as both insecticide and fungicide.',
          usage: 'Mix 1-2 tablespoons per gallon of water. Apply every 7-14 days as needed.',
          safety: 'Generally safe but may cause skin irritation. Keep away from children and pets.'
        },
        {
          name: 'Pyrethrin',
          type: 'Natural',
          description: 'Extracted from chrysanthemum flowers, effective against many insects.',
          usage: 'Follow label instructions. Apply in evening to avoid harming beneficial insects.',
          safety: 'Moderate toxicity. Wear protective gear and avoid breathing spray mist.'
        },
        {
          name: 'Horticultural Oil',
          type: 'Mineral',
          description: 'Petroleum-based oil that suffocates insects and their eggs.',
          usage: 'Apply during dormant season or when temperatures are below 90°F.',
          safety: 'Can cause plant damage if applied in hot weather. Follow temperature guidelines.'
        },
        {
          name: 'Diatomaceous Earth',
          type: 'Natural',
          description: 'Powdered fossilized algae that damages insect exoskeletons.',
          usage: 'Dust lightly on affected areas. Reapply after rain or watering.',
          safety: 'Low toxicity but avoid breathing dust. Wear mask during application.'
        }
      ];

      const samplePests = [
        {
          name: 'Aphids',
          category: 'Sap-Sucking Insects',
          description: 'Small, soft-bodied insects that feed on plant sap. Usually green, black, or brown.',
          damage: 'Cause yellowing leaves, stunted growth, honeydew secretion, and sooty mold.',
          control: 'Use insecticidal soap, neem oil, or introduce ladybugs. Remove heavily infested leaves.'
        },
        {
          name: 'Spider Mites',
          category: 'Arachnids',
          description: 'Tiny arachnids that create fine webbing on plants. Difficult to see with naked eye.',
          damage: 'Cause stippling on leaves, webbing, leaf drop, and plant stress.',
          control: 'Increase humidity, use miticides, or predatory mites. Regular misting helps.'
        },
        {
          name: 'Whiteflies',
          category: 'Flying Insects',
          description: 'Small, white, winged insects that cluster on leaf undersides.',
          damage: 'Cause yellowing, wilting, and transmit plant viruses.',
          control: 'Use yellow sticky traps, insecticidal soap, or systemic insecticides.'
        },
        {
          name: 'Mealybugs',
          category: 'Scale Insects',
          description: 'Small, white, cottony insects that feed on plant sap.',
          damage: 'Cause stunted growth, yellowing leaves, and honeydew secretion.',
          control: 'Remove manually with alcohol-soaked cotton swab or use systemic insecticide.'
        },
        {
          name: 'Scale Insects',
          category: 'Sap-Sucking Insects',
          description: 'Small, immobile insects that appear as bumps on stems and leaves.',
          damage: 'Cause yellowing, wilting, and honeydew secretion.',
          control: 'Scrape off manually or use horticultural oil during dormant season.'
        }
      ];

      setPesticides(samplePesticides);
      setPestDescriptions(samplePests);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPesticides = pesticides.filter(pesticide =>
    pesticide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pesticide.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPests = pestDescriptions.filter(pest =>
    pest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pest.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <BackgroundContainer>
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
            Browse pesticides and pest information
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
            {filteredPesticides.map((pesticide, index) => (
              <Card key={index} style={{ 
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
                  <div style={{ 
                    background: '#e8f5e8', 
                    color: '#2e7d32', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    display: 'inline-block'
                  }}>
                    {pesticide.type}
                  </div>
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

                {pesticide.usage && (
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Usage:</h4>
                    <p style={{ 
                      margin: 0, 
                      color: '#666', 
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}>
                      {pesticide.usage}
                    </p>
                  </div>
                )}

                {pesticide.safety && (
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Safety:</h4>
                    <p style={{ 
                      margin: 0, 
                      color: '#666', 
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}>
                      {pesticide.safety}
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
            {filteredPests.map((pest, index) => (
              <Card key={index} style={{ 
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
                  <div style={{ 
                    background: '#fff3e0', 
                    color: '#f57c00', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    display: 'inline-block'
                  }}>
                    {pest.category}
                  </div>
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

                {pest.damage && (
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Damage:</h4>
                    <p style={{ 
                      margin: 0, 
                      color: '#666', 
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}>
                      {pest.damage}
                    </p>
                  </div>
                )}

                {pest.control && (
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Control:</h4>
                    <p style={{ 
                      margin: 0, 
                      color: '#666', 
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}>
                      {pest.control}
                    </p>
                  </div>
                )}
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