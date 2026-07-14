#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyCXjupV1F-PT8-TNcDSIQhDqmXf11prhEI';
const MAX_RESULTS = 20;

// Parse CLI arguments
const args = process.argv.slice(2);
let location = '';
let industry = '';
let outputFormat = 'json'; // json or csv

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--location' && i + 1 < args.length) {
    location = args[i + 1];
    i++;
  } else if (args[i] === '--industry' && i + 1 < args.length) {
    industry = args[i + 1];
    i++;
  } else if (args[i] === '--format' && i + 1 < args.length) {
    outputFormat = args[i + 1];
    i++;
  }
}

if (!location || !industry) {
  console.error('Usage: no-website-finder --location "<location>" --industry "<industry>" [--format json|csv]');
  process.exit(1);
}

const makeRequest = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
};

const getPlaceDetails = async (placeId) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=website,name,formatted_phone_number,formatted_address,rating,review_count,url&key=${API_KEY}`;

  try {
    const response = await makeRequest(url);
    if (response.result) {
      return response.result;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching details for ${placeId}:`, error.message);
    return null;
  }
};

const searchBusinesses = async (location, industry) => {
  const query = encodeURIComponent(`${industry} ${location}`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}&pagetoken=undefined`;

  try {
    console.log(`Searching for "${industry}" businesses in "${location}"...`);
    const response = await makeRequest(url);

    if (response.status === 'REQUEST_DENIED') {
      console.error('\n❌ API ERROR: ' + (response.error_message || 'Request denied'));
      console.error('\nTo fix this:');
      console.error('1. Go to Google Cloud Console: https://console.cloud.google.com/');
      console.error('2. Enable "Places API (New)" for your project');
      console.error('3. Ensure the API key has Places API permissions');
      console.error('\nFor legacy Text Search, keep using the existing key with proper permissions.');
      process.exit(1);
    }

    if (!response.results || response.results.length === 0) {
      console.log('No results found.');
      return [];
    }

    console.log(`Found ${response.results.length} total results. Checking for websites...`);

    const businessesWithoutWebsite = [];
    let checkedCount = 0;

    for (const result of response.results.slice(0, MAX_RESULTS)) {
      checkedCount++;
      const details = await getPlaceDetails(result.place_id);

      if (details && !details.website) {
        businessesWithoutWebsite.push({
          name: details.name || result.name,
          phone: details.formatted_phone_number || 'N/A',
          address: details.formatted_address || result.formatted_address || 'N/A',
          rating: details.rating || 'N/A',
          reviewCount: details.review_count || 0,
          mapsUrl: details.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.name || result.name)}`
        });
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Sort by review count descending
    businessesWithoutWebsite.sort((a, b) => {
      const aCount = typeof a.reviewCount === 'number' ? a.reviewCount : parseInt(a.reviewCount) || 0;
      const bCount = typeof b.reviewCount === 'number' ? b.reviewCount : parseInt(b.reviewCount) || 0;
      return bCount - aCount;
    });

    console.log(`\nResults: Checked ${checkedCount} businesses, found ${businessesWithoutWebsite.length} without websites.\n`);

    return businessesWithoutWebsite;
  } catch (error) {
    console.error('Error searching businesses:', error.message);
    process.exit(1);
  }
};

const formatAsJSON = (data) => JSON.stringify(data, null, 2);

const formatAsCSV = (data) => {
  if (data.length === 0) return 'name,phone,address,rating,reviewCount,mapsUrl';

  const headers = ['name', 'phone', 'address', 'rating', 'reviewCount', 'mapsUrl'];
  const rows = [headers.join(',')];

  for (const business of data) {
    const row = [
      `"${(business.name || '').replace(/"/g, '""')}"`,
      `"${(business.phone || '').replace(/"/g, '""')}"`,
      `"${(business.address || '').replace(/"/g, '""')}"`,
      business.rating,
      business.reviewCount,
      `"${business.mapsUrl}"`
    ];
    rows.push(row.join(','));
  }

  return rows.join('\n');
};

const main = async () => {
  const results = await searchBusinesses(location, industry);

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `leads_${industry.replace(/\s+/g, '_')}_${timestamp}.${outputFormat === 'csv' ? 'csv' : 'json'}`;
  const outputPath = path.join(process.cwd(), filename);

  const output = outputFormat === 'csv' ? formatAsCSV(results) : formatAsJSON(results);

  fs.writeFileSync(outputPath, output);
  console.log(`✓ Results saved to: ${outputPath}`);
  console.log(`\nSummary:`);
  console.log(`  Total leads: ${results.length}`);
  if (results.length > 0) {
    console.log(`  Highest rated: ${results[0].name} (${results[0].rating} stars)`);
  }
};

main();
