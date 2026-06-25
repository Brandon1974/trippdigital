# 🎯 Lead Generation Tool

A full-stack web application to find businesses needing websites and AI services, extract their contact information, and export as CSV for outreach.

## Features

✅ **Google Maps Scraping** - Find local service businesses in any location  
✅ **Email Finding** - Extract email addresses from company websites  
✅ **Email Validation** - Validate found emails for accuracy  
✅ **CSV Export** - Download all prospects with contact info  
✅ **Database Storage** - Persistent SQLite database  
✅ **React Dashboard** - Beautiful, responsive web UI  

## Architecture

```
lead-gen/
├── backend/
│   ├── modules/
│   │   ├── googleMapsScraper.js    (Google Maps scraper using Puppeteer)
│   │   ├── emailFinder.js          (Email extraction + validation)
│   │   └── database.js             (SQLite database)
│   ├── server.js                   (Express API)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchPanel.js      (Search form)
│   │   │   ├── ProspectList.js     (Results table)
│   │   │   └── Stats.js            (Statistics)
│   │   ├── App.js                  (Main app)
│   │   ├── App.css                 (Styling)
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## Setup Instructions

### 1. Backend Setup

```bash
cd lead-gen/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Create data directory
mkdir -p data

# Start the backend
npm start
```

The backend will run on `http://localhost:5000`

API Endpoints:
- `POST /api/search/google-maps` - Search for businesses
- `POST /api/find-emails` - Find emails for a company
- `GET /api/prospects` - Get all prospects
- `GET /api/export/csv` - Export prospects as CSV
- `DELETE /api/prospects/:id` - Delete a prospect
- `DELETE /api/prospects` - Clear all prospects

### 2. Frontend Setup

```bash
cd lead-gen/frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start the frontend
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Search for Prospects**
   - Go to the Search tab
   - Enter what you're looking for (e.g., "Roofing contractors")
   - Enter location (e.g., "Maui, Hawaii")
   - Click "Start Search"

2. **Find Emails**
   - Click the "📧 Email" button next to each prospect
   - The tool will extract email addresses from their website

3. **Export Results**
   - Click "📥 Export CSV" to download all prospects
   - Use the CSV to start your outreach

## Technologies Used

**Backend:**
- Node.js + Express
- Puppeteer (web scraping)
- Cheerio (HTML parsing)
- SQLite3 (database)
- Axios (HTTP requests)
- Email-validator (email validation)

**Frontend:**
- React 18
- Axios (API calls)
- CSS3 (styling)
- Responsive design

## API Examples

### Search for Businesses
```bash
curl -X POST http://localhost:5000/api/search/google-maps \
  -H "Content-Type: application/json" \
  -d '{
    "searchTerm": "Roofing contractors",
    "location": "Maui, Hawaii",
    "limit": 50
  }'
```

### Find Emails for a Company
```bash
curl -X POST http://localhost:5000/api/find-emails \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "ABC Roofing",
    "website": "https://abcroofing.com"
  }'
```

### Export as CSV
```bash
curl http://localhost:5000/api/export/csv > prospects.csv
```

## Database Schema

### Prospects Table
```sql
CREATE TABLE prospects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  address TEXT,
  emails TEXT,           -- JSON array of emails
  source TEXT,           -- google_maps, etc.
  rating TEXT,
  contacted BOOLEAN DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME
)
```

## Performance Tips

- Start with 25-50 results per search
- Use specific industries in search terms
- Target smaller geographic areas for better results
- Cache results - don't re-scrape the same search

## Troubleshooting

### Puppeteer Issues
If you get browser errors:
```bash
# Install missing dependencies
apt-get install -y libx11-xcb1 libxcb1
```

### CORS Issues
Make sure backend is running on port 5000 and accessible from frontend

### Email Finding Not Working
- Ensure the website URL is correct
- Some websites block scrapers - try manual lookup

## Future Enhancements

- [ ] Hunter.io API integration for better email finding
- [ ] LinkedIn integration for finding decision makers
- [ ] Email verification/validation service
- [ ] Automated outreach (email/SMS templates)
- [ ] Lead scoring based on fit
- [ ] CRM integration (Pipedrive, HubSpot, GoHighLevel)
- [ ] Multi-account support
- [ ] Team collaboration features

## License

MIT

## Support

For issues or feature requests, create an issue in the repository.
