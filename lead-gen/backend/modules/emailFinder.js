const axios = require('axios');
const cheerio = require('cheerio');
const validateEmail = require('email-validator');

class EmailFinder {
  constructor() {
    this.commonEmailPatterns = [
      'info@',
      'contact@',
      'hello@',
      'support@',
      'sales@',
      'mail@',
      'admin@',
      'business@'
    ];
  }

  async findEmails(input) {
    try {
      let website = input;

      // If input looks like a company name, try to find website
      if (!input.includes('.') || !input.includes('http')) {
        website = await this.findWebsiteForCompany(input);
        if (!website) {
          return [];
        }
      }

      // Normalize URL
      if (!website.includes('http')) {
        website = 'https://' + website;
      }

      console.log(`Finding emails from: ${website}`);

      // Scrape emails from website
      const emails = await this.scrapeWebsiteForEmails(website);

      // Filter and validate
      const validEmails = emails
        .filter(email => validateEmail.validate(email))
        .filter((email, index, self) => self.indexOf(email) === index); // Remove duplicates

      return validEmails;
    } catch (error) {
      console.error('Email finding error:', error.message);
      return [];
    }
  }

  async findWebsiteForCompany(companyName) {
    try {
      // Try common domains
      const domains = ['.com', '.co', '.io', '.net', '.org'];
      const cleanName = companyName
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');

      for (const domain of domains) {
        const url = `https://${cleanName}${domain}`;
        try {
          const response = await axios.head(url, { timeout: 5000 });
          if (response.status === 200) {
            return url;
          }
        } catch (e) {
          // Continue to next domain
        }
      }

      return null;
    } catch (error) {
      console.error('Website finding error:', error.message);
      return null;
    }
  }

  async scrapeWebsiteForEmails(website) {
    const emails = new Set();

    try {
      const response = await axios.get(website, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Extract emails from href attributes
      $('a[href^="mailto:"]').each((i, elem) => {
        const email = $(elem).attr('href').replace('mailto:', '').split('?')[0];
        if (email) emails.add(email);
      });

      // Extract emails from text content
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const bodyText = $.text();
      const foundEmails = bodyText.match(emailRegex) || [];

      foundEmails.forEach(email => {
        // Filter out common false positives
        if (!email.includes('example.com') && !email.includes('domain.com')) {
          emails.add(email);
        }
      });

      // Check common contact pages
      const contactPages = ['/contact', '/contact-us', '/about', '/team'];
      for (const page of contactPages) {
        try {
          const contactUrl = website + page;
          const contactResponse = await axios.get(contactUrl, {
            timeout: 5000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
          });

          const contactHtml = contactResponse.data;
          const contactEmails = contactHtml.match(emailRegex) || [];
          contactEmails.forEach(email => emails.add(email));
        } catch (e) {
          // Skip if page doesn't exist
        }
      }
    } catch (error) {
      console.error(`Error scraping ${website}:`, error.message);
    }

    return Array.from(emails);
  }
}

module.exports = EmailFinder;
