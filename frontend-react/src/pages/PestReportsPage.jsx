import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import Dropdown from '../components/Dropdown';
import BackgroundContainer from '../components/BackgroundContainer';

function PestReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, [currentPage, filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        filter: filter,
        search: searchTerm
      });

      const response = await fetch(`http://localhost:8000/api/pest-reports/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.results || []);
        setTotalPages(data.total_pages || 1);
      } else {
        setError('Failed to fetch reports');
      }
    } catch (err) {
      setError('Network error while fetching reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReports();
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewReport = (reportId) => {
    navigate(`/pest-result/${reportId}`);
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/pest-reports/${reportId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh reports
        fetchReports();
      } else {
        setError('Failed to delete report');
      }
    } catch (err) {
      setError('Network error while deleting report');
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Reports' },
    { value: 'recent', label: 'Recent (Last 7 days)' },
    { value: 'high_confidence', label: 'High Confidence' },
    { value: 'low_confidence', label: 'Low Confidence' }
  ];

  const tableColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Pest Name', accessor: 'pest_name' },
    { header: 'Confidence', accessor: 'confidence' },
    { header: 'User', accessor: 'user' },
    { header: 'Actions', accessor: 'actions' }
  ];

  const tableData = reports.map(report => ({
    date: new Date(report.created_at).toLocaleDateString(),
    pest_name: report.pest_name,
    confidence: `${(report.confidence * 100).toFixed(1)}%`,
    user: report.user_name,
    actions: (
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
    )
  }));

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
              <Dropdown
                options={filterOptions}
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
              />
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
          ) : reports.length > 0 ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#333' }}>
                  Found {reports.length} report{reports.length !== 1 ? 's' : ''}
                </h3>
              </div>
              
              <Table columns={tableColumns} data={tableData} />
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
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
            <h3 style={{ margin: '0 0 10px 0', color: '#9c27b0' }}>This Page</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>
              {reports.length}
            </div>
          </Card>
          <Card style={{ textAlign: 'center', background: '#e8f5e8' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#4caf50' }}>Page</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
              {currentPage} of {totalPages}
            </div>
          </Card>
        </div>
      </div>
    </BackgroundContainer>
  );
}

export default PestReportsPage;