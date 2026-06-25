import React from 'react';

function Stats({ stats }) {
  return (
    <div className="stats-section">
      <h2>📊 Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Prospects</h3>
          <div className="number">{stats.total_prospects || 0}</div>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>Businesses found</p>
        </div>

        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        }}>
          <h3>Prospects with Emails</h3>
          <div className="number">{stats.prospects_with_emails || 0}</div>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>Ready to contact</p>
        </div>

        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }}>
          <h3>Contacted</h3>
          <div className="number">{stats.prospects_contacted || 0}</div>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>Already reached out</p>
        </div>
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', background: '#f9f9f9', borderRadius: '12px' }}>
        <h3>Next Steps</h3>
        <ol style={{ marginLeft: '1.5rem', lineHeight: '2', color: '#666' }}>
          <li>
            <strong>Use the Search tab</strong> to find prospects in your target industry/location
          </li>
          <li>
            <strong>Click "Email" button</strong> to find email addresses for each prospect
          </li>
          <li>
            <strong>Export as CSV</strong> to download all prospects with their contact info
          </li>
          <li>
            <strong>Prepare your pitch</strong> from the video transcript:
            <blockquote style={{
              marginLeft: '1rem',
              marginTop: '0.5rem',
              borderLeft: '3px solid #667eea',
              paddingLeft: '1rem',
              color: '#555',
              fontStyle: 'italic'
            }}>
              "I noticed your Google Business Profile doesn't have a website. Most customers check for a website before calling. I'd like to offer you a free website. No strings attached. Would you be open to a quick 10-minute call this week?"
            </blockquote>
          </li>
          <li>
            <strong>Start calling or emailing</strong> using the exported contact list
          </li>
          <li>
            <strong>Close deals</strong> and start building recurring revenue with monthly subscriptions
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
        <h3>🚀 Quick Win Strategy</h3>
        <p style={{ color: '#2e7d32', lineHeight: '1.8' }}>
          Based on the video, here's what works best:
        </p>
        <ul style={{ marginLeft: '1.5rem', color: '#2e7d32', lineHeight: '2' }}>
          <li>
            <strong>Offer free websites</strong> as your entry point (to local service businesses)
          </li>
          <li>
            <strong>Upsell monthly subscriptions:</strong> Social media posting ($300-1000/mo), Google Business optimization ($750/mo), AI search optimization ($500-5000/mo)
          </li>
          <li>
            <strong>Use phone calls</strong> - they have the highest close rate (script provided above)
          </li>
          <li>
            <strong>Use GoHighLevel</strong> to manage clients and deliver all services
          </li>
          <li>
            <strong>Target businesses with:</strong> Cash flow (avoid broke startups), existing presence on Google Maps, no website
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Stats;
