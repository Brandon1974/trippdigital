import React from 'react';

function Dashboard({ stats, clients }) {
  return (
    <div className="dashboard">
      <h2>📊 Dashboard Overview</h2>

      {stats && (
        <div className="grid">
          <div className="stat-card">
            <h3>Total Clients</h3>
            <div className="number">{stats.total_clients || 0}</div>
          </div>

          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          }}>
            <h3>Posts Published</h3>
            <div className="number">{stats.total_posts_published || 0}</div>
          </div>

          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          }}>
            <h3>Posts Scheduled</h3>
            <div className="number">{stats.total_posts_scheduled || 0}</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem' }}>
        <h3>📋 Recent Clients</h3>
        {clients.length === 0 ? (
          <div className="empty-state">
            <p>No clients yet. Add your first client to get started!</p>
          </div>
        ) : (
          <div className="grid-2">
            {clients.slice(-6).map(client => (
              <div key={client.id} className="card">
                <div className="card-header">
                  <h4>{client.name}</h4>
                </div>
                <p><strong>Email:</strong> {client.email}</p>
                <p><strong>Industry:</strong> {client.industry || '—'}</p>
                <p><strong>Budget:</strong> ${client.monthly_budget || '—'}/mo</p>
                <p style={{ fontSize: '0.875rem', color: '#999', marginTop: '0.75rem' }}>
                  Added: {new Date(client.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', background: '#f9f9f9', borderRadius: '12px' }}>
        <h3>🚀 Quick Start Guide</h3>
        <ol style={{ marginLeft: '1.5rem', lineHeight: '2', color: '#666' }}>
          <li>
            <strong>Add Clients:</strong> Go to "Clients" tab and add your service clients
          </li>
          <li>
            <strong>Create Posts:</strong> Go to "Create Post" and use AI to generate content
          </li>
          <li>
            <strong>Select Platforms:</strong> Choose which social media platforms to post to (Instagram, Facebook, LinkedIn)
          </li>
          <li>
            <strong>Schedule:</strong> Pick a date/time for automatic posting
          </li>
          <li>
            <strong>Track:</strong> Monitor all posts in the "All Posts" tab
          </li>
        </ol>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '2rem',
        background: '#e8f5e9',
        borderRadius: '12px',
        border: '2px solid #4caf50'
      }}>
        <h3>💡 How This Works</h3>
        <p style={{ color: '#2e7d32', lineHeight: '1.8', marginBottom: '1rem' }}>
          This platform replaces GoHighLevel and lets you deliver social media services directly to your clients:
        </p>
        <ul style={{ marginLeft: '1.5rem', color: '#2e7d32', lineHeight: '2' }}>
          <li>
            <strong>Use lead gen tool</strong> to find clients with no social media presence
          </li>
          <li>
            <strong>Sell monthly subscriptions</strong> ($300-$1000/month for social media posting)
          </li>
          <li>
            <strong>AI generates content</strong> based on client industry and business type
          </li>
          <li>
            <strong>You manage everything</strong> from this dashboard
          </li>
          <li>
            <strong>100% of revenue</strong> stays with you (no GoHighLevel fees!)
          </li>
          <li>
            <strong>Scale easily</strong> by adding more clients and automating posts
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
