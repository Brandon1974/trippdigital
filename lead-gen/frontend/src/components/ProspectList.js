import React, { useState } from 'react';

function ProspectList({ prospects, onFindEmails, onDelete }) {
  const [findingEmailsFor, setFindingEmailsFor] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const handleFindEmails = (prospect) => {
    setFindingEmailsFor(prospect.id);
    onFindEmails(prospect.id, prospect.website, prospect.name);
    setTimeout(() => setFindingEmailsFor(null), 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="prospect-list">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Phone</th>
              <th>Emails</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prospects.map((prospect) => (
              <React.Fragment key={prospect.id}>
                <tr
                  style={{
                    cursor: 'pointer',
                    background: expandedId === prospect.id ? '#f5f5f5' : 'white'
                  }}
                >
                  <td>
                    <strong>{prospect.name}</strong>
                    {prospect.rating && (
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                        {prospect.rating}
                      </div>
                    )}
                  </td>
                  <td>
                    {prospect.phone ? (
                      <a href={`tel:${prospect.phone}`} style={{ color: '#667eea' }}>
                        {prospect.phone}
                      </a>
                    ) : (
                      <span style={{ color: '#ccc' }}>—</span>
                    )}
                  </td>
                  <td>
                    {prospect.emails && prospect.emails.length > 0 ? (
                      <div>
                        <span className="badge">
                          {prospect.emails.length} email{prospect.emails.length !== 1 ? 's' : ''}
                        </span>
                        {prospect.emails.slice(0, 2).map((email, idx) => (
                          <div key={idx} style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            <code style={{
                              background: '#f0f0f0',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px'
                            }}>
                              {email}
                            </code>
                          </div>
                        ))}
                        {prospect.emails.length > 2 && (
                          <div style={{ fontSize: '0.875rem', color: '#999', marginTop: '0.25rem' }}>
                            +{prospect.emails.length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="badge empty">No emails found</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.875rem', color: '#666' }}>
                    {prospect.address ? prospect.address.substring(0, 30) + '...' : '—'}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => handleFindEmails(prospect)}
                      disabled={findingEmailsFor === prospect.id}
                      title="Find email addresses for this company"
                    >
                      {findingEmailsFor === prospect.id ? '⏳' : '📧'} Email
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => onDelete(prospect.id)}
                      title="Delete this prospect"
                      style={{ marginLeft: '0.5rem' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>

                {expandedId === prospect.id && (
                  <tr>
                    <td colSpan="5" style={{ background: '#fafafa', padding: '1.5rem' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem'
                      }}>
                        <div>
                          <h4 style={{ marginBottom: '0.5rem' }}>Full Details</h4>
                          <p><strong>Name:</strong> {prospect.name}</p>
                          <p><strong>Phone:</strong> {prospect.phone || '—'}</p>
                          <p><strong>Website:</strong> {prospect.website || '—'}</p>
                          <p><strong>Address:</strong> {prospect.address || '—'}</p>
                          <p><strong>Source:</strong> {prospect.source}</p>
                        </div>

                        {prospect.emails && prospect.emails.length > 0 && (
                          <div>
                            <h4 style={{ marginBottom: '0.5rem' }}>All Emails</h4>
                            <ul style={{ listStyle: 'none' }}>
                              {prospect.emails.map((email, idx) => (
                                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                  <code style={{
                                    background: '#f0f0f0',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}>
                                    {email}
                                    <button
                                      className="btn btn-secondary btn-small"
                                      onClick={() => copyToClipboard(email)}
                                      style={{ marginLeft: '0.5rem' }}
                                    >
                                      📋
                                    </button>
                                  </code>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
        <strong>Total Prospects:</strong> {prospects.length} |
        <strong> With Emails:</strong> {prospects.filter(p => p.emails && p.emails.length > 0).length}
      </div>
    </div>
  );
}

export default ProspectList;
