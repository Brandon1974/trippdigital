const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const DatabaseModule = require('./modules/database');
const ContentGeneratorModule = require('./modules/contentGenerator');
const SocialMediaSchedulerModule = require('./modules/socialMediaScheduler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize modules
const db = new DatabaseModule();
const contentGen = new ContentGeneratorModule();
const scheduler = new SocialMediaSchedulerModule();

db.init();

// ===================== CLIENTS =====================

// Add a new client
app.post('/api/clients', (req, res) => {
  const { name, email, phone, industry, monthlyBudget } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  try {
    const client = db.addClient({ name, email, phone, industry, monthlyBudget });
    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all clients
app.get('/api/clients', (req, res) => {
  try {
    const clients = db.getAllClients();
    res.json({ success: true, count: clients.length, clients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get client by ID
app.get('/api/clients/:id', (req, res) => {
  try {
    const client = db.getClient(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update client
app.put('/api/clients/:id', (req, res) => {
  try {
    const client = db.updateClient(req.params.id, req.body);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete client
app.delete('/api/clients/:id', (req, res) => {
  try {
    db.deleteClient(req.params.id);
    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== SOCIAL MEDIA ACCOUNTS =====================

// Connect social media account
app.post('/api/clients/:clientId/accounts', (req, res) => {
  const { platform, accountName, accessToken, accountId } = req.body;

  if (!platform || !accountName) {
    return res.status(400).json({ error: 'Platform and accountName required' });
  }

  try {
    const account = db.addSocialAccount(req.params.clientId, {
      platform,
      accountName,
      accessToken,
      accountId
    });
    res.json({ success: true, account });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get client's social accounts
app.get('/api/clients/:clientId/accounts', (req, res) => {
  try {
    const accounts = db.getClientAccounts(req.params.clientId);
    res.json({ success: true, count: accounts.length, accounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete social account
app.delete('/api/accounts/:accountId', (req, res) => {
  try {
    db.deleteSocialAccount(req.params.accountId);
    res.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== CONTENT GENERATION =====================

// Generate AI content
app.post('/api/generate-content', async (req, res) => {
  const { topic, tone, platform, industry, includeHashtags } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic required' });
  }

  try {
    console.log(`Generating content for topic: ${topic}`);
    const content = await contentGen.generateContent({
      topic,
      tone: tone || 'professional',
      platform: platform || 'instagram',
      industry: industry || 'general',
      includeHashtags: includeHashtags !== false
    });

    res.json({ success: true, content });
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate multiple posts (batch)
app.post('/api/generate-batch', async (req, res) => {
  const { clientId, topic, count, platforms } = req.body;

  if (!topic || !count) {
    return res.status(400).json({ error: 'Topic and count required' });
  }

  try {
    const client = db.getClient(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const generatedPosts = [];
    for (let i = 0; i < count; i++) {
      const content = await contentGen.generateContent({
        topic,
        industry: client.industry || 'general'
      });
      generatedPosts.push(content);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    res.json({ success: true, count: generatedPosts.length, posts: generatedPosts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== POSTS =====================

// Create a post
app.post('/api/posts', (req, res) => {
  const { clientId, content, platforms, scheduledTime, status } = req.body;

  if (!clientId || !content || !platforms || platforms.length === 0) {
    return res.status(400).json({ error: 'ClientId, content, and platforms required' });
  }

  try {
    const post = db.createPost({
      clientId,
      content,
      platforms: JSON.stringify(platforms),
      scheduledTime: scheduledTime || new Date().toISOString(),
      status: status || 'scheduled'
    });

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get posts for a client
app.get('/api/clients/:clientId/posts', (req, res) => {
  try {
    const posts = db.getClientPosts(req.params.clientId);
    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all posts
app.get('/api/posts', (req, res) => {
  const { status } = req.query;
  try {
    const posts = db.getAllPosts(status);
    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update post
app.put('/api/posts/:postId', (req, res) => {
  try {
    const post = db.updatePost(req.params.postId, req.body);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post
app.delete('/api/posts/:postId', (req, res) => {
  try {
    db.deletePost(req.params.postId);
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== SCHEDULING =====================

// Post to social media immediately
app.post('/api/posts/:postId/publish', async (req, res) => {
  try {
    const post = db.getPost(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const platforms = JSON.parse(post.platforms);
    const results = {};

    for (const platform of platforms) {
      try {
        // This would connect to actual social media APIs
        // For MVP, just log it
        console.log(`Publishing to ${platform}: ${post.content}`);
        results[platform] = { success: true, message: 'Posted' };
      } catch (error) {
        results[platform] = { success: false, error: error.message };
      }
    }

    db.updatePost(req.params.postId, { status: 'published' });

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get scheduled posts
app.get('/api/posts/scheduled', (req, res) => {
  try {
    const posts = db.getAllPosts('scheduled');
    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== ANALYTICS =====================

// Get dashboard stats
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get client stats
app.get('/api/clients/:clientId/stats', (req, res) => {
  try {
    const stats = db.getClientStats(req.params.clientId);
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== SCHEDULER (Auto-posting) =====================

// Run scheduler every minute to check for posts to publish
cron.schedule('* * * * *', async () => {
  try {
    const scheduledPosts = db.getAllPosts('scheduled');
    const now = new Date();

    for (const post of scheduledPosts) {
      const scheduledTime = new Date(post.scheduledTime);
      if (scheduledTime <= now) {
        console.log(`Publishing scheduled post: ${post.id}`);

        // Publish the post
        const platforms = JSON.parse(post.platforms);
        let allSuccess = true;

        for (const platform of platforms) {
          try {
            // Here you would call actual social media APIs
            console.log(`Posted to ${platform}: ${post.content.substring(0, 50)}...`);
          } catch (error) {
            console.error(`Error posting to ${platform}:`, error.message);
            allSuccess = false;
          }
        }

        if (allSuccess) {
          db.updatePost(post.id, { status: 'published' });
        }
      }
    }
  } catch (error) {
    console.error('Scheduler error:', error);
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Social Media Platform API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
