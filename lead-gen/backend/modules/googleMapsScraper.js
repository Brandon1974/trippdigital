const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class GoogleMapsScraper {
  constructor() {
    this.browser = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async scrape(searchQuery, limit = 50) {
    try {
      if (!this.browser) await this.init();

      const page = await this.browser.newPage();
      await page.setViewport({ width: 1280, height: 720 });

      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
      console.log(`Navigating to: ${searchUrl}`);

      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('div[data-item-id]', { timeout: 10000 }).catch(() => {});

      // Scroll to load more results
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => {
          const resultsDiv = document.querySelector('div[role="feed"]');
          if (resultsDiv) resultsDiv.scrollTop += 1000;
        });
        await page.waitForTimeout(1000);
      }

      const html = await page.content();
      const businesses = this.parseBusinesses(html, limit);

      await page.close();
      return businesses;
    } catch (error) {
      console.error('Scraping error:', error);
      return [];
    }
  }

  parseBusinesses(html, limit) {
    const $ = cheerio.load(html);
    const businesses = [];

    // Parse Google Maps results
    const items = $('div[data-item-id]').slice(0, limit);

    items.each((index, element) => {
      try {
        const $item = $(element);
        const name = $item.find('div[role="button"] span').first().text().trim();
        const ratingElement = $item.find('span[aria-label*="star"]').first();
        const rating = ratingElement.length ? ratingElement.attr('aria-label') : 'N/A';

        if (name) {
          businesses.push({
            id: `google_${Date.now()}_${index}`,
            name: name,
            phone: this.extractPhoneFromElement($item),
            website: '',
            address: this.extractAddressFromElement($item),
            source: 'google_maps',
            rating: rating,
            createdAt: new Date().toISOString()
          });
        }
      } catch (e) {
        console.error('Parse error for item:', e.message);
      }
    });

    console.log(`Parsed ${businesses.length} businesses from Google Maps`);
    return businesses;
  }

  extractPhoneFromElement($element) {
    const text = $element.text();
    const phoneMatch = text.match(/(\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4}))/);
    return phoneMatch ? phoneMatch[0] : '';
  }

  extractAddressFromElement($element) {
    const text = $element.text();
    const addressMatch = text.match(/([0-9]+\s[A-z]+\s[A-z]+.*)/);
    return addressMatch ? addressMatch[0] : '';
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = GoogleMapsScraper;
