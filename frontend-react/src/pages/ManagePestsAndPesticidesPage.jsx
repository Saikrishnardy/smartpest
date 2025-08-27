import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import BackgroundContainer from '../components/BackgroundContainer';
import ApiService from '../services/api';
import Alert from '../components/Alert';

function ManagePestsAndPesticidesPage() { // Renamed function
  const [pesticideList, setPesticideList] = useState([]);
  const [pestList, setPestList] = useState([]); // New state for pest list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pesticideSubmitSuccess, setPesticideSubmitSuccess] = useState(false); // Specific for pesticides
  const [pestSubmitSuccess, setPestSubmitSuccess] = useState(false); // Specific for pests
  const [pesticideFormData, setPesticideFormData] = useState({
    name: '',
    description: '',
    chemical_name: '',
    toxicity_level: '',
    application_methods: '',
    safety_precautions: '',
  });
  const [pestFormData, setPestFormData] = useState({
    name: '',
    description: '',
  });

  // State for currently edited item
  const [editingPesticide, setEditingPesticide] = useState(null);
  const [editingPest, setEditingPest] = useState(null);

  const fetchPesticides = async () => {
    try {
      const response = await ApiService.getPesticides();
      setPesticideList(response);
    } catch (err) {
      console.error('Error fetching pesticides:', err);
      setError('Failed to load pesticide data.');
    }
  };

  const fetchPests = async () => {
    try {
      const response = await ApiService.getPests();
      setPestList(response);
    } catch (err) {
      console.error('Error fetching pests:', err);
      setError('Failed to load pest data.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    await Promise.all([fetchPesticides(), fetchPests()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh all data every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePesticideChange = (e) => {
    const { name, value } = e.target;
    setPesticideFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePestChange = (e) => {
    const { name, value } = e.target;
    setPestFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddPesticideSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPesticideSubmitSuccess(false);

    try {
      if (editingPesticide) {
        await ApiService.updatePesticide(editingPesticide.id, pesticideFormData);
        alert('Pesticide updated successfully!');
        setEditingPesticide(null);
      } else {
        await ApiService.createPesticide(pesticideFormData);
        setPesticideSubmitSuccess(true);
        alert('Pesticide added successfully!');
      }
      setPesticideFormData({ // Clear form after successful submission/update
        name: '',
        description: '',
        chemical_name: '',
        toxicity_level: '',
        application_methods: '',
        safety_precautions: '',
      });
      fetchPesticides(); // Refresh the list
    } catch (err) {
      console.error('Error submitting pesticide:', err);
      setError(`Failed to save pesticide: ${err.message}`);
    }
  };

  const handleAddPestSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPestSubmitSuccess(false);

    try {
      if (editingPest) {
        await ApiService.updatePest(editingPest.id, pestFormData);
        alert('Pest updated successfully!');
        setEditingPest(null);
      } else {
        await ApiService.createPest(pestFormData);
        setPestSubmitSuccess(true);
        alert('Pest added successfully!');
      }
      setPestFormData({ // Clear form after successful submission/update
        name: '',
        description: '',
      });
      fetchPests(); // Refresh the list
    } catch (err) {
      console.error('Error submitting pest:', err);
      setError(`Failed to save pest: ${err.message}`);
    }
  };

  const handleEditPesticide = (pesticide) => {
    setEditingPesticide(pesticide);
    setPesticideFormData({
      name: pesticide.name,
      description: pesticide.description,
      chemical_name: pesticide.chemical_name,
      toxicity_level: pesticide.toxicity_level,
      application_methods: pesticide.application_methods,
      safety_precautions: pesticide.safety_precautions,
    });
  };

  const handleDeletePesticide = async (id) => {
    if (window.confirm('Are you sure you want to delete this pesticide?')) {
      try {
        await ApiService.deletePesticide(id);
        alert('Pesticide deleted successfully!');
        fetchPesticides();
      } catch (err) {
        console.error('Error deleting pesticide:', err);
        setError(`Failed to delete pesticide: ${err.message}`);
      }
    }
  };

  const handleEditPest = (pest) => {
    setEditingPest(pest);
    setPestFormData({
      name: pest.name,
      description: pest.description,
    });
  };

  const handleDeletePest = async (id) => {
    if (window.confirm('Are you sure you want to delete this pest?')) {
      try {
        await ApiService.deletePest(id);
        alert('Pest deleted successfully!');
        fetchPests();
      } catch (err) {
        console.error('Error deleting pest:', err);
        setError(`Failed to delete pest: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <BackgroundContainer>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading data...</div>
      </BackgroundContainer>
    );
  }

  return (
    <BackgroundContainer>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#4caf50', marginBottom: '10px' }}>Manage Pests and Pesticides</h1> {/* Updated title */}
          <p style={{ color: '#666', margin: 0 }}>
            Add, update, and manage pest and pesticide information.
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Manage Pests Section */}
        <Card style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Add New Pest</h3>
          <form onSubmit={handleAddPestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              name="name"
              placeholder="Pest Name"
              value={pestFormData.name}
              onChange={handlePestChange}
              style={inputStyle}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={pestFormData.description}
              onChange={handlePestChange}
              style={{ ...inputStyle, minHeight: '80px' }}
            ></textarea>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#00bcd4',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1em',
                marginTop: '10px',
              }}
            >
              {editingPest ? 'Update Pest' : 'Add Pest'}
            </button>
            {editingPest && (
              <button
                type="button"
                onClick={() => setEditingPest(null)}
                style={{
                  padding: '10px 20px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1em',
                  marginTop: '10px',
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
          {pestSubmitSuccess && <Alert type="success" message="Pest saved successfully!" />}
        </Card>

        <Card style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Existing Pests</h3>
          {pestList.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Description</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pestList.map((pest) => (
                    <tr key={pest.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tableCellStyle}>{pest.name}</td>
                      <td style={tableCellStyle}>{pest.description}</td>
                      <td style={tableCellStyle}>
                        <button
                          onClick={() => handleEditPest(pest)}
                          style={{
                            background: '#2196f3',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '8px',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePest(pest.id)}
                          style={{
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#666', textAlign: 'center', margin: 0 }}>No pests added yet.</p>
          )}
        </Card>

        {/* Manage Pesticides Section (Existing) */}
        <Card style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Add New Pesticide</h3>
          <form onSubmit={handleAddPesticideSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              name="name"
              placeholder="Pesticide Name"
              value={pesticideFormData.name}
              onChange={handlePesticideChange}
              style={inputStyle}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={pesticideFormData.description}
              onChange={handlePesticideChange}
              style={{ ...inputStyle, minHeight: '80px' }}
            ></textarea>
            <input
              type="text"
              name="chemical_name"
              placeholder="Chemical Name"
              value={pesticideFormData.chemical_name}
              onChange={handlePesticideChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="toxicity_level"
              placeholder="Toxicity Level (e.g., Low, Moderate, High)"
              value={pesticideFormData.toxicity_level}
              onChange={handlePesticideChange}
              style={inputStyle}
            />
            <textarea
              name="application_methods"
              placeholder="Application Methods"
              value={pesticideFormData.application_methods}
              onChange={handlePesticideChange}
              style={{ ...inputStyle, minHeight: '80px' }}
            ></textarea>
            <textarea
              name="safety_precautions"
              placeholder="Safety Precautions"
              value={pesticideFormData.safety_precautions}
              onChange={handlePesticideChange}
              style={{ ...inputStyle, minHeight: '80px' }}
            ></textarea>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1em',
                marginTop: '10px',
              }}
            >
              {editingPesticide ? 'Update Pesticide' : 'Add Pesticide'}
            </button>
            {editingPesticide && (
              <button
                type="button"
                onClick={() => setEditingPesticide(null)}
                style={{
                  padding: '10px 20px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1em',
                  marginTop: '10px',
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
          {pesticideSubmitSuccess && <Alert type="success" message="Pesticide saved successfully!" />}
        </Card>

        <Card>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Existing Pesticides</h3>
          {pesticideList.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Chemical Name</th>
                    <th style={tableHeaderStyle}>Toxicity</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pesticideList.map((pesticide) => (
                    <tr key={pesticide.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tableCellStyle}>{pesticide.name}</td>
                      <td style={tableCellStyle}>{pesticide.chemical_name}</td>
                      <td style={tableCellStyle}>{pesticide.toxicity_level}</td>
                      <td style={tableCellStyle}>
                        <button
                          onClick={() => handleEditPesticide(pesticide)}
                          style={{
                            background: '#2196f3',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '8px',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePesticide(pesticide.id)}
                          style={{
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#666', textAlign: 'center', margin: 0 }}>No pesticides added yet.</p>
          )}
        </Card>
      </div>
    </BackgroundContainer>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '16px',
};

const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const tableCellStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee',
};

export default ManagePestsAndPesticidesPage;
