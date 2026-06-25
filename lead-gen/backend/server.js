const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const GoogleMapsScraperModule = require('./modules/googleMapsScraper');
const EmailFinderModule = require('./modules/emailFinder');
const DatabaseModule = require('./modules/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = new DatabaseModule();
db.init();

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// Search for businesses - Google Maps
app.post('/api/search/google-maps', async (req, res) => {
  const { searchTerm, location, limit = 50 } = req.body;

  if (!searchTerm || !location) {
    return res.status(400).json({ error: 'searchTerm and location required' });
  }

  try {
    console.log(`Scraping Google Maps for: ${searchTerm} in ${location}`);
    const scraper = new GoogleMapsScraperModule();
    const businesses = await scraper.scrape(`${searchTerm} ${location}`, limit);

    // Save to database
    businesses.forEach(business => {
      db.addBusiness(business);
    });

    res.json({
      success: true,
      count: businesses.length,
      businesses: businesses,
      message: `Found ${businesses.length} businesses`
    });
  } catch (error) {
    console.error('Google Maps scrape error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Find emails for a business
app.post('/api/find-emails', async (req, res) => {
  const { companyName, website, businessId } = req.body;

  if (!website && !companyName) {
    return res.status(400).json({ error: 'website or companyName required' });
  }

  try {
    const emailFinder = new EmailFinderModule();
    const emails = await emailFinder.findEmails(website || companyName);

    if (businessId) {
      db.updateBusinessEmails(businessId, emails);
    }

    res.json({
      success: true,
      emails: emails,
      source: website ? 'website scrape' : 'company name lookup'
    });
  } catch (error) {
    console.error('Email finding error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all prospects
app.get('/api/prospects', (req, res) => {
  try {
    const prospects = db.getAllProspects();
    res.json({
      success: true,
      count: prospects.length,
      prospects: prospects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get prospect by ID
app.get('/api/prospects/:id', (req, res) => {
  try {
    const prospect = db.getProspect(req.params.id);
    if (!prospect) {
      return res.status(404).json({ error: 'Prospect not found' });
    }
    res.json({ success: true, prospect });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export prospects as CSV
app.get('/api/export/csv', (req, res) => {
  try {
    const prospects = db.getAllProspects();

    if (prospects.length === 0) {
      return res.status(400).json({ error: 'No prospects to export' });
    }

    let csv = 'Company Name,Phone,Website,Email,Address,Created At\n';

    prospects.forEach(p => {
      const emails = p.emails ? p.emails.join('; ') : '';
      csv += `"${p.name}","${p.phone}","${p.website}","${emails}","${p.address}","${p.createdAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="prospects.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete prospect
app.delete('/api/prospects/:id', (req, res) => {
  try {
    db.deleteProspect(req.params.id);
    res.json({ success: true, message: 'Prospect deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all prospects
app.delete('/api/prospects', (req, res) => {
  try {
    db.clearAllProspects();
    res.json({ success: true, message: 'All prospects cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stats
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Lead generation API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
