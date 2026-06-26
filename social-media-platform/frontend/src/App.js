import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ClientList from './components/ClientList';
import CreatePost from './components/CreatePost';
import PostsList from './components/PostsList';
import Dashboard from './components/Dashboard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    loadClients();
    loadStats();
  }, []);

  const loadClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      setClients(response.data.clients || []);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('Failed to load clients');
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

  const handleAddClient = async (clientData) => {
    try {
      const response = await axios.post(`${API_URL}/clients`, clientData);
      setClients([...clients, response.data.client]);
      loadStats();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add client');
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axios.delete(`${API_URL}/clients/${clientId}`);
        setClients(clients.filter(c => c.id !== clientId));
        setSelectedClient(null);
        loadStats();
      } catch (err) {
        setError('Failed to delete client');
      }
    }
  };

  const handlePostCreated = () => {
    loadStats();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📱 Social Media Manager</h1>
          <p>AI-powered content creation & scheduling platform</p>
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
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            👥 Clients ({clients.length})
          </button>
          <button
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            ✏️ Create Post
          </button>
          <button
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            📋 All Posts
          </button>
        </nav>

        <main className="main-content">
          {activeTab === 'dashboard' && (
            <Dashboard stats={stats} clients={clients} />
          )}

          {activeTab === 'clients' && (
            <ClientList
              clients={clients}
              onAddClient={handleAddClient}
              onDeleteClient={handleDeleteClient}
              selectedClient={selectedClient}
              onSelectClient={setSelectedClient}
            />
          )}

          {activeTab === 'create' && (
            <CreatePost
              clients={clients}
              onPostCreated={handlePostCreated}
              onError={setError}
            />
          )}

          {activeTab === 'posts' && (
            <PostsList onPostsChange={loadStats} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
