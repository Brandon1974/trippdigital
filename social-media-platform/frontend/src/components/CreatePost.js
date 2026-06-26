import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function CreatePost({ clients, onPostCreated, onError }) {
  const [step, setStep] = useState('generate'); // generate, schedule, confirm
  const [clientId, setClientId] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [platforms, setPlatforms] = useState(['instagram', 'facebook']);
  const [generatedContent, setGeneratedContent] = useState('');
  const [scheduledTime, setScheduledTime] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [loading, setLoading] = useState(false);
  const [postCreated, setPostCreated] = useState(false);

  const generateContent = async () => {
    if (!clientId || !topic) {
      onError('Please select a client and enter a topic');
      return;
    }

    setLoading(true);
    try {
      const client = clients.find(c => c.id === clientId);
      const response = await axios.post(`${API_URL}/generate-content`, {
        topic,
        tone,
        platform: platforms[0] || 'instagram',
        industry: client.industry || 'general'
      });

      setGeneratedContent(response.data.content);
      setStep('schedule');
    } catch (err) {
      onError(err.response?.data?.error || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const schedulePost = async () => {
    try {
      const response = await axios.post(`${API_URL}/posts`, {
        clientId,
        content: generatedContent,
        platforms,
        scheduledTime,
        status: 'scheduled'
      });

      setPostCreated(true);
      setStep('confirm');
      onPostCreated();

      // Reset form after 3 seconds
      setTimeout(() => {
        setStep('generate');
        setClientId('');
        setTopic('');
        setGeneratedContent('');
        setPlatforms(['instagram', 'facebook']);
        setPostCreated(false);
      }, 3000);
    } catch (err) {
      onError(err.response?.data?.error || 'Failed to schedule post');
    }
  };

  const togglePlatform = (platform) => {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  if (postCreated && step === 'confirm') {
    return (
      <div className="empty-state">
        <h2>✅ Post Scheduled Successfully!</h2>
        <p>Your post has been scheduled and will be published at:</p>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }}>
          {new Date(scheduledTime).toLocaleString()}
        </p>
        <p style={{ color: '#999', marginTop: '1rem' }}>Creating new post...</p>
      </div>
    );
  }

  return (
    <div className="create-post">
      <h2>✏️ Create & Schedule Post</h2>

      <div style={{ marginTop: '2rem' }}>
        {step === 'generate' && (
          <div>
            <div className="card">
              <div className="card-header">
                <h3>Step 1: Generate Content with AI</h3>
              </div>

              <div className="form-group">
                <label>Select Client *</label>
                <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
                  <option value="">Choose a client...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.industry})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>What should the post be about? *</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Spring roof inspection, New HVAC system benefits, 10 tips to prevent plumbing issues"
                />
              </div>

              <div className="grid">
                <div className="form-group">
                  <label>Tone</label>
                  <select value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual & Friendly</option>
                    <option value="educational">Educational</option>
                    <option value="promotional">Promotional</option>
                    <option value="inspiring">Inspiring</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Platforms</label>
                  <div className="platform-selector">
                    {['instagram', 'facebook', 'linkedin'].map(platform => (
                      <label key={platform} className="platform-checkbox">
                        <input
                          type="checkbox"
                          checked={platforms.includes(platform)}
                          onChange={() => togglePlatform(platform)}
                        />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={generateContent}
                disabled={loading || !clientId || !topic}
                style={{ marginTop: '1rem' }}
              >
                {loading ? '⏳ Generating...' : '🚀 Generate Content'}
              </button>
            </div>
          </div>
        )}

        {step === 'schedule' && generatedContent && (
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <h3>Preview</h3>
              </div>
              <div className="content-preview">{generatedContent}</div>

              <div style={{ marginTop: '1rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => generateContent()}
                  disabled={loading}
                  style={{ marginRight: '0.5rem' }}
                >
                  🔄 Regenerate
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep('schedule')}
                >
                  ✓ Use This Content
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Step 2: Schedule Post</h3>
              </div>

              <div className="form-group">
                <label>When should this post be published?</label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setStep('generate')}
                >
                  ← Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={schedulePost}
                >
                  ✓ Schedule Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {clients.length === 0 && (
        <div className="empty-state">
          <p>Add clients first before creating posts.</p>
          <p style={{ fontSize: '0.9rem', color: '#999' }}>Go to Clients tab to add your first client</p>
        </div>
      )}
    </div>
  );
}

export default CreatePost;
