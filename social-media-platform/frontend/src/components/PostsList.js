import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function PostsList({ onPostsChange }) {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const url = filter === 'all'
        ? `${API_URL}/posts`
        : `${API_URL}/posts?status=${filter}`;

      const response = await axios.get(url);
      setPosts(response.data.posts || []);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (postId) => {
    try {
      await axios.post(`${API_URL}/posts/${postId}/publish`);
      loadPosts();
      onPostsChange();
    } catch (err) {
      console.error('Error publishing post:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Delete this post?')) {
      try {
        await axios.delete(`${API_URL}/posts/${postId}`);
        loadPosts();
        onPostsChange();
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.status === filter);

  return (
    <div className="posts-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>📋 All Posts</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-group"
          style={{ width: 'auto', marginBottom: 0 }}
        >
          <option value="all">All Posts</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </div>

      {loading ? (
        <div className="empty-state"><p>Loading...</p></div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <p>No {filter === 'all' ? '' : filter} posts yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredPosts.map(post => (
            <div key={post.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className={`badge ${post.status}`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {post.platforms && typeof post.platforms === 'string' && JSON.parse(post.platforms).map(p => (
                        <span
                          key={p}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#f0f0f0',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                          }}
                        >
                          {p}
                        </span>
                      ))}
                      {post.platforms && Array.isArray(post.platforms) && post.platforms.map(p => (
                        <span
                          key={p}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#f0f0f0',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    className="content-preview"
                    style={{
                      maxHeight: expandedId === post.id ? 'none' : '100px',
                      overflow: expandedId === post.id ? 'visible' : 'hidden',
                      textOverflow: expandedId === post.id ? 'clip' : 'ellipsis',
                      cursor: 'pointer'
                    }}
                    onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                  >
                    {post.content}
                  </div>

                  <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#999' }}>
                    <div>
                      Created: {new Date(post.created_at).toLocaleString()}
                    </div>
                    {post.scheduledTime && (
                      <div>
                        Scheduled: {new Date(post.scheduledTime).toLocaleString()}
                      </div>
                    )}
                    {post.published_at && (
                      <div>
                        Published: {new Date(post.published_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  {post.status === 'scheduled' && (
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => handlePublish(post.id)}
                      title="Publish now"
                    >
                      📤 Publish
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(post.id)}
                    title="Delete post"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
        <strong>Total Posts:</strong> {posts.length} |
        <strong> Scheduled:</strong> {posts.filter(p => p.status === 'scheduled').length} |
        <strong> Published:</strong> {posts.filter(p => p.status === 'published').length}
      </div>
    </div>
  );
}

export default PostsList;
