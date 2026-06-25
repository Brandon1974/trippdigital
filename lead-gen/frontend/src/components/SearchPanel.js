import React, { useState } from 'react';

function SearchPanel({ onSearch, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [limit, setLimit] = useState(50);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!searchTerm || !location) {
      alert('Please enter both search term and location');
      return;
    }

    onSearch({
      searchTerm,
      location,
      limit: parseInt(limit)
    });
  };

  return (
    <div className="search-panel">
      <h2>🔍 Search for Prospects</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Find businesses that need websites and want to use AI services
      </p>

      <form onSubmit={handleSubmit} className="search-form">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label>What to search for?</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., small businesses, contractors, service companies"
              disabled={loading}
            />
            <small style={{ color: '#999', marginTop: '0.5rem', display: 'block' }}>
              Examples: "Roofing contractors", "HVAC companies", "Plumbers", "Solar installers"
            </small>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Maui, Hawaii or New York City"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Number of results</label>
            <select value={limit} onChange={(e) => setLimit(e.target.value)} disabled={loading}>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="150">150</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Searching...' : '🚀 Start Search'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>How it works:</h3>
        <ol style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
          <li>Enter what kind of businesses you want to find (e.g., "roofing contractors")</li>
          <li>Enter the location where you want to find them</li>
          <li>Click "Start Search" to find businesses using Google Maps</li>
          <li>Go to Prospects tab to see results and find their email addresses</li>
          <li>Export as CSV and start your outreach!</li>
        </ol>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <h3>💡 Pro Tips:</h3>
        <ul style={{ marginLeft: '1.5rem', color: '#2e7d32', lineHeight: '1.8' }}>
          <li>Search for specific industries: "Roofing", "HVAC", "Plumbing", "Solar"</li>
          <li>Target local areas to find easier-to-contact businesses</li>
          <li>Start with 50-100 results for your first search</li>
          <li>Once you have prospects, use "Find Emails" to get their contact info</li>
          <li>Export and organize by industry or location for better targeting</li>
        </ul>
      </div>
    </div>
  );
}

export default SearchPanel;
