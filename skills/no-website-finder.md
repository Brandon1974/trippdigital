# no-website-finder Skill

## Task Description

Find local businesses in a specific location and industry that have an **active Google Business Profile** (real reviews, phone number, hours) but **NO website listed**. These are ideal cold-outreach leads for the web agency workflow.

## Why This Matters

Businesses without websites are prime prospects for Tripp Digital's web agency model:
1. They're established (have Google reviews + phone)
2. They've never invested in a website (cold leads)
3. Easy to pitch: "Here's your free starter site" → $97/month recurring

## Inputs Required

- **`--location`** (required): City or area to search (e.g., "Virginia Beach, VA", "Austin, TX")
- **`--industry`** (required): Business type or keyword (e.g., "handyman", "pressure washing", "landscaping", "plumbing")
- **`--format`** (optional): Output format — `json` (default) or `csv`

## Installation

No installation needed if npm dependencies are already set up. The tool uses the Google Places API (API key pre-configured).

## Usage

```bash
no-website-finder --location "Virginia Beach, VA" --industry "handyman"
no-website-finder --location "Austin, TX" --industry "pressure washing" --format csv
```

## How It Works

1. **Text Search**: Searches Google Places for businesses matching "[industry] [location]"
2. **Place Details Lookup**: For each result, fetches full details including the `website` field
3. **Filter**: Keeps only businesses where `website` is missing/null
4. **Sort**: Orders results by review count (descending) — higher review count + no website = better lead
5. **Export**: Saves results to a timestamped JSON or CSV file in the current directory

## Output Format

### JSON Example
```json
[
  {
    "name": "Joe's Handyman Services",
    "phone": "(757) 555-0123",
    "address": "123 Main St, Virginia Beach, VA 23456",
    "rating": 4.8,
    "reviewCount": 47,
    "mapsUrl": "https://www.google.com/maps/search/..."
  },
  ...
]
```

### CSV Example
```
name,phone,address,rating,reviewCount,mapsUrl
"Joe's Handyman Services","(757) 555-0123","123 Main St, Virginia Beach, VA 23456",4.8,47,"https://www.google.com/maps/search/..."
```

## Output File Naming

Results are saved as: `leads_[industry]_[date].json` or `.csv`

Example: `leads_handyman_2026-07-14.json`

## Limits & Notes

- **Max results per run**: 20 (to control API costs)
- **API delay**: 100ms between detail requests to avoid rate limiting
- **Review count**: Sorted descending (established businesses without sites = hottest leads)
- **Rating**: Shown as-is from Google; `N/A` if not available

## Step-by-Step Workflow

1. **Run the search**: `no-website-finder --location "City, State" --industry "niche"`
2. **Review results**: Check the generated file for prospects
3. **Outreach**: Use the phone + Maps URL to call or send introductory emails
4. **Pitch**: "I found your business on Google and built you a free starter website to showcase your work"
5. **Deploy**: Create a spec site (photo gallery + contact form) on Netlify
6. **Convert**: Send live link → $97/month pitch

## Integration with Web Agency Workflow

This skill supports the broader **web-agency-prospect** workflow:
- **Input**: location + industry
- **Output**: cold leads with no website
- **Next step**: Build spec site → deploy to Netlify → send live link as pitch

## Example Output Summary

```
Searching for "handyman" businesses in "Virginia Beach, VA"...
Found 20 total results. Checking for websites...

Results: Checked 20 businesses, found 12 without websites.

✓ Results saved to: leads_handyman_2026-07-14.json

Summary:
  Total leads: 12
  Highest rated: Joe's Handyman Services (4.8 stars)
```

---

*Skill created: 2026-07-14*
