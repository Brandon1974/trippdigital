import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SearchPanel from './components/SearchPanel';
import ProspectList from './components/ProspectList';
import Stats from './components/Stats';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [prospects, setProspects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('search');

  useEffect(() => {
    loadProspects();
    loadStats();
  }, []);

  const loadProspects = async () => {
    try {
      const response = await axios.get(`${API_URL}/prospects`);
      setProspects(response.data.prospects || []);
    } catch (err) {
      console.error('Error loading prospects:', err);
      setError('Failed to load prospects');
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/search/google-maps`, searchParams);
      setProspects(response.data.businesses || []);
      loadStats();
      setActiveTab('prospects');
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFindEmails = async (businessId, website, companyName) => {
    try {
      const response = await axios.post(`${API_URL}/find-emails`, {
        businessId,
        website,
        companyName
      });

      // Update prospect in list
      const updated = prospects.map(p =>
        p.id === businessId ? { ...p, emails: response.data.emails } : p
      );
      setProspects(updated);
      loadStats();
    } catch (err) {
      console.error('Error finding emails:', err);
      setError('Failed to find emails for this prospect');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.get(`${API_URL}/export/csv`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'prospects.csv');
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError('Failed to export CSV');
      console.error('Export error:', err);
    }
  };

  const handleDeleteProspect = async (prospectId) => {
    try {
      await axios.delete(`${API_URL}/prospects/${prospectId}`);
      setProspects(prospects.filter(p => p.id !== prospectId));
      loadStats();
    } catch (err) {
      setError('Failed to delete prospect');
      console.error('Delete error:', err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure? This will delete all prospects.')) {
      try {
        await axios.delete(`${API_URL}/prospects`);
        setProspects([]);
        loadStats();
      } catch (err) {
        setError('Failed to clear prospects');
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎯 Lead Generation Tool</h1>
          <p>Find businesses needing websites + AI services</p>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="app-container">
        <nav className="tabs">
          <button
            className={`tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            🔍 Search
          </button>
          <button
            className={`tab ${activeTab === 'prospects' ? 'active' : ''}`}
            onClick={() => setActiveTab('prospects')}
          >
            📋 Prospects ({prospects.length})
          </button>
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Stats
          </button>
        </nav>

        <main className="main-content">
          {activeTab === 'search' && (
            <SearchPanel onSearch={handleSearch} loading={loading} />
          )}

          {activeTab === 'prospects' && (
            <div className="prospects-section">
              <div className="prospects-header">
                <h2>Prospects ({prospects.length})</h2>
                <div className="prospects-actions">
                  {prospects.length > 0 && (
                    <>
                      <button className="btn btn-primary" onClick={handleExportCSV}>
                        📥 Export CSV
                      </button>
                      <button className="btn btn-danger" onClick={handleClearAll}>
                        🗑️ Clear All
                      </button>
                    </>
                  )}
                </div>
              </div>

              {prospects.length === 0 ? (
                <div className="empty-state">
                  <p>No prospects yet. Use the Search tab to find businesses.</p>
                </div>
              ) : (
                <ProspectList
                  prospects={prospects}
                  onFindEmails={handleFindEmails}
                  onDelete={handleDeleteProspect}
                />
              )}
            </div>
          )}

          {activeTab === 'stats' && stats && (
            <Stats stats={stats} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
