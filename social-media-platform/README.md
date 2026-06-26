# 📱 Social Media Management Platform

**Your own GoHighLevel alternative** - AI-powered social media content creation and scheduling platform. Find leads, close deals, and deliver social media services directly to clients at 100% margins.

## Features

✅ **AI Content Generation** - Uses Claude API to generate platform-specific social media content  
✅ **Client Management** - Add and manage all your service clients in one place  
✅ **Multi-Platform Posting** - Schedule posts to Instagram, Facebook, and LinkedIn  
✅ **Smart Scheduling** - Automatic posting at specified times  
✅ **Dashboard & Analytics** - Track clients, posts, and publishing stats  
✅ **Industry-Specific Content** - AI adapts to roofing, HVAC, plumbing, solar, and more  

## Business Model

```
Lead Gen Tool (finds prospects)
    ↓
Cold Call Prospects with pitch:
"I'll manage your social media for $500-1000/month"
    ↓
Use This Platform to deliver the service
    ↓
100% revenue (no platform fees!)
```

## Quick Start

### 1. Backend Setup

```bash
cd social-media-platform/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Claude API key to .env
# ANTHROPIC_API_KEY=sk-...

# Create data directory
mkdir -p data

# Start backend
npm start
```

Backend runs on: `http://localhost:5001`

### 2. Frontend Setup

```bash
cd social-media-platform/frontend

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5001/api" > .env

# Start frontend
npm start
```

Frontend runs on: `http://localhost:3000`

## How to Use

### Step 1: Add Clients
1. Go to **Clients** tab
2. Click **"Add Client"**
3. Enter client info (name, email, industry)
4. Click **Add Client**

### Step 2: Generate AI Content
1. Go to **Create Post** tab
2. Select a client
3. Enter a topic (e.g., "spring roof inspection tips")
4. Choose tone (professional, casual, educational, etc.)
5. Select platforms (Instagram, Facebook, LinkedIn)
6. Click **Generate Content**

### Step 3: Schedule Posts
1. Review the AI-generated content
2. Click **Regenerate** if needed, or **Use This Content**
3. Set when post should go live
4. Click **Schedule Post**

### Step 4: Track Posts
1. Go to **All Posts** tab
2. View all scheduled/published posts
3. Publish early or delete as needed

## API Endpoints

### Clients
```bash
# Add client
POST /api/clients
Body: { name, email, phone, industry, monthlyBudget }

# Get all clients
GET /api/clients

# Get client
GET /api/clients/:id

# Update client
PUT /api/clients/:id

# Delete client
DELETE /api/clients/:id
```

### Content Generation
```bash
# Generate single post
POST /api/generate-content
Body: { topic, tone, platform, industry, includeHashtags }

# Generate batch (multiple variations)
POST /api/generate-batch
Body: { clientId, topic, count, platforms }
```

### Posts
```bash
# Create post
POST /api/posts
Body: { clientId, content, platforms, scheduledTime, status }

# Get all posts
GET /api/posts
GET /api/posts?status=scheduled

# Get client posts
GET /api/clients/:clientId/posts

# Update post
PUT /api/posts/:postId

# Delete post
DELETE /api/posts/:postId

# Publish now
POST /api/posts/:postId/publish
```

### Analytics
```bash
# Dashboard stats
GET /api/stats

# Client stats
GET /api/clients/:clientId/stats
```

## Database Schema

### Clients Table
```sql
- id (UUID)
- name (text)
- email (text)
- phone (text)
- industry (text)
- monthly_budget (number)
- status (active/inactive)
- created_at (datetime)
- updated_at (datetime)
```

### Posts Table
```sql
- id (UUID)
- client_id (FK)
- content (text)
- platforms (JSON array: [instagram, facebook, linkedin])
- scheduled_time (datetime)
- status (scheduled/published)
- created_at (datetime)
- published_at (datetime)
```

### Social Accounts Table
```sql
- id (UUID)
- client_id (FK)
- platform (instagram/facebook/linkedin)
- account_name (text)
- access_token (text)
- connected_at (datetime)
```

## Tech Stack

**Backend:**
- Node.js + Express
- SQLite3 (database)
- Anthropic Claude API (content generation)
- node-cron (scheduling)
- Axios (HTTP requests)

**Frontend:**
- React 18
- Axios (API calls)
- CSS3 (styling)
- Responsive design

## Content Generation

### Platform-Specific Guidance

**Instagram:**
- Character limit: 2,200
- 3-5 hashtags
- Liberal emoji use
- Visual/lifestyle appeal
- Call to action

**Facebook:**
- 1-3 short paragraphs
- Line breaks for readability
- 1-2 hashtags (optional)
- Community engagement
- Questions to drive comments

**LinkedIn:**
- Professional tone
- 1-3 paragraphs
- Minimal hashtags
- Business value
- B2B audience focus

### Industry Context

The AI automatically adjusts content based on industry:
- **Roofing:** Durability, weather, energy, certifications
- **HVAC:** Comfort, efficiency, air quality, maintenance
- **Plumbing:** Reliability, quick response, water conservation
- **Solar:** Savings, sustainability, incentives, ROI

## Social Media API Integration

Currently, the platform logs posts for MVP testing. To enable actual posting:

### Instagram & Facebook (Meta)
```javascript
// Use Meta Graph API
// https://developers.facebook.com/docs/instagram-graph-api/reference/ig-user/feed

POST https://graph.instagram.com/v18.0/{accountId}/media
{
  image_url: imageUrl,
  caption: post.content,
  access_token: accessToken
}
```

### LinkedIn
```javascript
// Use LinkedIn Share API
// https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api

POST https://api.linkedin.com/v2/ugcPosts
{
  author: personUrn,
  lifecycleState: "PUBLISHED",
  specificContent: {
    "com.linkedin.ugc.ShareContent": {
      shareCommentary: { text: post.content }
    }
  }
}
```

## Pricing Model

### Recommended Client Pricing
- **Social Media Posting:** $300-$1,000/month
  - 3-5 posts per week
  - AI-generated content
  - Multi-platform posting
  - Platform-specific optimization

### Your Margins
- Client pays: $500/month
- Your costs: ~$5/month (Claude API usage)
- **Your profit: $495/month per client**

With just 10 clients: **$4,950/month recurring revenue**

## Roadmap

### MVP (Now)
- ✅ Client management
- ✅ AI content generation
- ✅ Post scheduling
- ✅ Dashboard & stats

### V2 (Next)
- [ ] Live social media posting (API integrations)
- [ ] Analytics integration (view post performance)
- [ ] Client login portal
- [ ] Email notifications
- [ ] Post performance tracking

### V3 (Future)
- [ ] Additional services (Google Business, website hosting, etc.)
- [ ] White-label option
- [ ] Team management
- [ ] A/B testing
- [ ] AI learning from performance

## Getting Started Script

```bash
#!/bin/bash

# Setup backend
cd social-media-platform/backend
npm install
mkdir -p data
cp .env.example .env
echo "Add your ANTHROPIC_API_KEY to .env"

# Setup frontend
cd ../frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5001/api" > .env

echo "✅ Setup complete!"
echo ""
echo "Start backend: cd backend && npm start"
echo "Start frontend: cd frontend && npm start"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5001/api"
```

## Environment Variables

### Backend (.env)
```
PORT=5001
NODE_ENV=development
ANTHROPIC_API_KEY=sk-...  (required for Claude API)
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5001/api
```

## Support & Troubleshooting

**"No database connection"**
- Ensure `data/` folder exists: `mkdir -p data`

**"Claude API error"**
- Check `ANTHROPIC_API_KEY` is set correctly in `.env`
- Verify you have API credits on anthropic.com

**"Frontend can't reach API"**
- Check `REACT_APP_API_URL` in `.env`
- Ensure backend is running on port 5001

**"Social media posting not working"**
- Social media APIs are stubbed for MVP
- See "Social Media API Integration" section to add real integration

## File Structure

```
social-media-platform/
├── backend/
│   ├── modules/
│   │   ├── database.js          (SQLite data layer)
│   │   ├── contentGenerator.js  (Claude API wrapper)
│   │   └── socialMediaScheduler.js (scheduling logic)
│   ├── server.js                (Express API)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js     (stats overview)
│   │   │   ├── ClientList.js    (client management)
│   │   │   ├── CreatePost.js    (AI generation & scheduling)
│   │   │   └── PostsList.js     (post management)
│   │   ├── App.js               (main app)
│   │   ├── App.css              (styling)
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
├── README.md
└── .gitignore
```

## Next Steps

1. **Start the platform** locally
2. **Add your first client** from the lead gen tool results
3. **Generate some test posts** to understand the workflow
4. **Make your first cold call** with the pitch
5. **Deliver the service** using this platform
6. **Scale to 10+ clients** at $500/month each

Good luck! 🚀

---

Built with Node.js, React, Claude API, and ❤️
