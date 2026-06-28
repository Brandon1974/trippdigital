# Skill: Update Product Catalog

## Purpose
After a new digital product has been created and uploaded to Payhip, update every place the product catalog lives: `index.html` (the public storefront), `wiki/offers.md` (the knowledge base), and `netlify/functions/chat.js` (the chatbot). Log the addition.

This skill runs **after** the product is live on Payhip and you have the Payhip product URL.

---

## Inputs needed
- **Product name** (exact title as listed on Payhip)
- **Price** (e.g. `$17.00`, `FREE`)
- **Payhip product URL** (e.g. `payhip.com/b/XXXXX`)
- **Product image filename** (e.g. `my-new-product.jpg`) — must already be saved to `images/products/`
- **Product category** for placement in `index.html` (see categories below)
- **One-line description** for the chatbot system prompt (optional, only if it’s a flagship product)

### index.html product categories (in order on the page)
1. Business & Entrepreneurship (business plans, agency guides, work-from-home)
2. AI & Digital Skills (AI tools, prompt packs, tech how-tos)
3. Niche / Side Hustle (dispatcher, caregiver, puzzle books, daycare, seasonal)
4. Newsletter
5. Free Lead Magnets

If the product doesn’t fit an existing category cleanly, place it in the closest one.

---

## Steps

### Step 1 — Confirm the product image is in place

Verify the product image exists at:
```
images/products/[image-filename].jpg
```

If it’s not there yet, stop and ask Brandon to add the image before continuing. Product cards without images will break the layout.

Image guidelines:
- Format: JPG or PNG
- Recommended size: 600×600px or 800×600px (landscape or square both work)
- Filename: lowercase, hyphens, descriptive (e.g. `ai-prompt-vault.jpg`)

---

### Step 2 — Add the product card to index.html

Open `index.html`. Find the `<div class="payhip-grid">` section (around line 189).

Locate the correct category position (cards are not currently labeled by category in the HTML — use the product order in `wiki/offers.md` as the reference for where to insert).

Insert a new `<article>` block:

```html
<article class="payhip-card">
    <a href="https://[PAYHIP-URL]" target="_blank" rel="noopener noreferrer" class="cover-link">
        <img src="images/products/[IMAGE-FILENAME]" alt="[PRODUCT NAME]" class="product-img">
    </a>
    <div class="payhip-info">
        <h3>[PRODUCT NAME]</h3>
        <div class="payhip-price">$[PRICE]</div>
        <a href="https://[PAYHIP-URL]" class="btn btn-primary payhip-btn" target="_blank" rel="noopener noreferrer">BUY NOW →</a>
    </div>
</article>
```

For **free** products, change the button:
```html
<div class="payhip-price">FREE</div>
<a href="https://[PAYHIP-URL]" class="btn btn-primary payhip-btn" target="_blank" rel="noopener noreferrer">GET FREE →</a>
```

Double-check:
- [ ] Payhip URL is complete: `https://payhip.com/b/XXXXX`
- [ ] Image `alt` text matches the product name exactly
- [ ] Price format matches existing cards (`$12.00`, not `$12` or `12.00`)
- [ ] No unclosed tags — each `<article>` must have a closing `</article>`

---

### Step 3 — Update wiki/offers.md

Open `wiki/offers.md`. Add the new product to the correct table under the matching category header.

Format:
```markdown
| [Product Name] | $[Price] | payhip.com/b/XXXXX |
```

Also update the `Last updated:` date in the front-matter:
```
Last updated: YYYY-MM-DD
```

If this is the first product in a new price tier, update the **PRICE RANGE SUMMARY** section at the bottom if the new product sets a new high or low.

---

### Step 4 — Update the chatbot system prompt (conditional)

Open `netlify/functions/chat.js`.

Add the product to the chatbot’s Digital Products list **only if** any of these are true:
- It’s priced at $27 or higher
- It’s a flagship / featured product
- It directly answers a question the chatbot is likely to receive

Format to add in the system prompt:
```
- [Product Name] ($[price])
```

Insert it in the correct price-descending order within the Digital Products list.

If the product doesn’t meet the threshold, skip this step.

---

### Step 5 — Update wiki/master-index.md (if a new category was created)

If this product required creating a **new category** in `wiki/offers.md`, update `wiki/master-index.md` to reflect the new category in the `wiki/offers.md` description block.

If it fit into an existing category, no change needed.

---

### Step 6 — Log the addition

Append to `output/changelogs/YYYY-MM-DD_changelog.md` (create today’s file if it doesn’t exist):

```markdown
## AUTO APPROVED — New product added to catalog

- **Product:** [Product Name]
- **Price:** $[price]
- **Payhip:** payhip.com/b/XXXXX
- **index.html:** Card added to [Category] section
- **wiki/offers.md:** Row added to [Category] table
- **chat.js:** [Updated / Not updated — below $27 threshold]
- **Date:** YYYY-MM-DD
```

---

### Step 7 — Verify

Mental walkthrough:
- [ ] `index.html`: product card exists, image loads, Payhip link is correct, price is correct
- [ ] `wiki/offers.md`: product appears in the right category table with correct price and link
- [ ] `chat.js`: updated if product meets threshold, skipped with note if it doesn’t
- [ ] Changelog updated
- [ ] No broken HTML tags introduced in index.html

---

### Step 8 — Report back

```
Product catalog updated: [Product Name] ($[price])

Changes made:
- index.html: card added to [Category] section (position [N] in grid)
- wiki/offers.md: row added to [Category] table
- chat.js: [updated with one-liner / not updated - below threshold]
- Changelog: output/changelogs/YYYY-MM-DD_changelog.md

Payhip URL: payhip.com/b/XXXXX
Total products now in catalog: [N]
```

---

## Quick reference — current catalog counts

As of 2026-06-28, the catalog has **18 products** on the site:
- 8 Business & Entrepreneurship
- 3 AI & Digital Skills
- 4 Niche / Side Hustle
- 1 Newsletter
- 3 Free Lead Magnets

Update this count in the report-back each time a product is added.

---

## Notes

- **Never remove a product** from index.html without explicit instruction from Brandon. Products may still be discoverable via direct Payhip links even if they’re delisted.
- **Payhip vs. site:** The Payhip store (payhip.com/Tinytripp) is the primary storefront. index.html is a curated showcase — not every Payhip product needs to be on the site, but every site product must have a working Payhip link.
- **Free products:** Always appear at the bottom of the grid (lead magnets section) regardless of category topic.
- **Seasonal products** (like the 4th of July guide): add normally, but note in the changelog that it is seasonal and may need to be hidden off-season.

---

## Example output
*(Paste a real run here after first use)*
