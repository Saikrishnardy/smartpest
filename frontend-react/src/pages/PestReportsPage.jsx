import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import BackgroundContainer from '../components/BackgroundContainer';
import ApiService from '../services/api'; // Import ApiService

function PestReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const fetchedReports = await ApiService.getReports();
        // Assuming fetchedReports items have id, date (timestamp), pest_name, confidence, user_id
        // Map backend data to frontend expected structure (if needed, currently backend returns compatible structure)
        setReports(fetchedReports);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []); // Empty dependency array means this runs once on mount

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would filter the reports on frontend or send a search query to backend
    console.log('Searching for:', searchTerm);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    console.log('Filter changed to:', value);
  };

  const handleViewReport = (reportId) => {
    console.log('Viewing report:', reportId);
    // In a real app, you might fetch detailed report data or navigate to a dedicated report detail page
    // For now, navigate to pest-result with sample data or fetch actual data if available
    const reportToView = reports.find(r => r.id === reportId);
    if (reportToView) {
      // This assumes your Report model in Django has description and pesticides fields
      // which is what the PestResultPage now expects.
      navigate('/pest-result', {
        state: {
          detectionResult: {
            pest_name: reportToView.pest_name,
            confidence: reportToView.confidence,
            description: reportToView.description, 
            pesticides: reportToView.pesticides || [] // Ensure pesticides is an array
          }
        }
      });
    } else {
      setError('Report not found!');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    // TODO: Implement actual backend API call for deleting reports
    // For now, simulate deletion on frontend
    setReports(reports.filter(report => report.id !== reportId));
    console.log('Deleted report:', reportId);
    // If backend delete is implemented, re-fetch reports after successful deletion
  };

  const filterOptions = [
    { value: 'all', label: 'All Reports' },
    { value: 'recent', label: 'Recent (Last 7 days)' },
    { value: 'high_confidence', label: 'High Confidence' },
    { value: 'low_confidence', label: 'Low Confidence' }
  ];

  const filteredReports = reports.filter(report => {
    // Ensure report.pest_name exists before calling toLowerCase
    if (searchTerm && (!report.pest_name || !report.pest_name.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    if (filter === 'high_confidence' && report.confidence < 0.8) {
      return false;
    }
    if (filter === 'low_confidence' && report.confidence >= 0.8) {
      return false;
    }
    // Filter by recent (last 7 days) if needed, based on report.timestamp or report.date
    // For now, assuming report.timestamp is available for recent filtering
    if (filter === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return new Date(report.timestamp) >= sevenDaysAgo; // Use timestamp for filtering
    }
    return true;
  });

  return (
    <BackgroundContainer>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1976d2', marginBottom: '10px' }}>Pest Reports</h1>
          <p style={{ color: '#666', margin: 0 }}>
            View and manage all pest detection reports
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Filters and Search */}
        <Card style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#333',
                fontWeight: '500'
              }}>
                Filter by:
              </label>
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <form onSubmit={handleSearch}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#333',
                  fontWeight: '500'
                }}>
                  Search:
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by pest name..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      background: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button
                onClick={() => navigate('/pest-detect')}
                style={{
                  padding: '10px 20px',
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                New Detection
              </button>
            </div>
          </div>
        </Card>

        {/* Reports Table */}
        <Card>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div>Loading reports...</div>
            </div>
          ) : filteredReports.length > 0 ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#333' }}>
                  Found {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
                </h3>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Pest Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Confidence</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>User</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map(report => (
                      <tr key={report.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{new Date(report.timestamp).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>{report.pest_name}</td>
                        <td style={{ padding: '12px' }}>{(report.confidence * 100).toFixed(1)}%</td>
                        <td style={{ padding: '12px' }}>{report.user_id}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              onClick={() => handleViewReport(report.id)}
                              style={{
                                padding: '4px 8px',
                                background: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              style={{
                                padding: '4px 8px',
                                background: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>No Reports Found</h3>
              <p style={{ color: '#666', margin: '0 0 20px 0' }}>
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by detecting a pest to create your first report!'
                }
              </p>
              <button
                onClick={() => navigate('/pest-detect')}
                style={{
                  padding: '10px 20px',
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Detect Pest
              </button>
            </div>
          )}
        </Card>

        {/* Summary Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginTop: '30px' 
        }}>
          <Card style={{ textAlign: 'center', background: '#e3f2fd' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Total Reports</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {reports.length}
            </div>
          </Card>
          <Card style={{ textAlign: 'center', background: '#f3e5f5' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9c27b0' }}>Filtered Results</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>
              {filteredReports.length}
            </div>
          </Card>
          <Card style={{ textAlign: 'center', background: '#e8f5e8' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#4caf50' }}>Avg Confidence</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
              {reports.length > 0 
                ? `${((reports.reduce((sum, r) => sum + r.confidence, 0) / reports.length) * 100).toFixed(1)}%`
                : '0%'
              }
            </div>
          </Card>
        </div>
      </div>
    </BackgroundContainer>
  );
}

export default PestReportsPage;