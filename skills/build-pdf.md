# Skill: Build PDF

## Purpose
Build a digital product PDF using Python ReportLab with official Tripp Digital branding: black background, orange `#FF6B00` accents, white text. Output a ready-to-upload file for Payhip.

---

## Inputs needed
- **Title** of the PDF product
- **Subtitle** (optional tagline shown on cover)
- **Content** — outline, raw notes, or topic description (can be a brain dump; this skill structures it)
- **Target price point** (guides the depth: $7–$12 = 10–20 pages, $17–$27 = 20–40 pages, $37+ = 40+ pages)
- **Output filename** (snake_case, no spaces, e.g. `grant_writing_guide.pdf`)

---

## Brand Constants (never change these)

```python
BLACK   = '#000000'   # page background
ORANGE  = '#FF6B00'   # headings, accents, dividers, cover title
WHITE   = '#FFFFFF'   # body text
GRAY    = '#AAAAAA'   # secondary text, captions
```

---

## Steps

### Step 1 — Plan the content structure

Before writing any code, outline the PDF in this format:

```
Cover page
Table of Contents (if 15+ pages)
Introduction (1 page) — what they'll learn and why it matters
Section 1: [Title]
  - Key point
  - Key point
Section 2: [Title]
  ...
Section N: [Title]
Bonus / Action checklist (1 page)
CTA page — drives to payhip.com/Tinytripp and trippdigital.com
```

For income/side-hustle guides: 5–8 numbered sections work best.
For templates: fewer sections, more visual examples or fillable structure.
For how-to guides: step-by-step numbered format, one step per section.

---

### Step 2 — Create the Python script

Create a file at `process/build_[filename].py`. Use this template:

```python
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

# ── Brand Colors ──────────────────────────────────────────
ORANGE = HexColor('#FF6B00')
WHITE  = HexColor('#FFFFFF')
GRAY   = HexColor('#AAAAAA')
BLACK  = HexColor('#000000')

PAGEW, PAGEH = letter
MARGIN = 0.75 * inch

# ── Styles ────────────────────────────────────────────────
styles = getSampleStyleSheet()

cover_title_style = ParagraphStyle(
    'CoverTitle',
    fontName='Helvetica-Bold',
    fontSize=36,
    textColor=ORANGE,
    alignment=TA_CENTER,
    spaceAfter=12,
    leading=42,
)
cover_sub_style = ParagraphStyle(
    'CoverSub',
    fontName='Helvetica',
    fontSize=16,
    textColor=WHITE,
    alignment=TA_CENTER,
    spaceAfter=8,
)
cover_brand_style = ParagraphStyle(
    'CoverBrand',
    fontName='Helvetica-Bold',
    fontSize=12,
    textColor=ORANGE,
    alignment=TA_CENTER,
)
section_heading_style = ParagraphStyle(
    'SectionHeading',
    fontName='Helvetica-Bold',
    fontSize=22,
    textColor=ORANGE,
    spaceBefore=18,
    spaceAfter=8,
    leading=26,
)
body_style = ParagraphStyle(
    'Body',
    fontName='Helvetica',
    fontSize=11,
    textColor=WHITE,
    spaceAfter=8,
    leading=16,
)
bullet_style = ParagraphStyle(
    'Bullet',
    fontName='Helvetica',
    fontSize=11,
    textColor=WHITE,
    spaceAfter=4,
    leftIndent=20,
    leading=15,
    bulletIndent=8,
)
callout_style = ParagraphStyle(
    'Callout',
    fontName='Helvetica-Bold',
    fontSize=12,
    textColor=BLACK,
    spaceAfter=4,
    leading=16,
    backColor=ORANGE,
    borderPadding=(8, 8, 8, 8),
)
cta_style = ParagraphStyle(
    'CTA',
    fontName='Helvetica-Bold',
    fontSize=14,
    textColor=ORANGE,
    alignment=TA_CENTER,
    spaceAfter=8,
)

# ── Black background canvas callback ─────────────────────
def black_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BLACK)
    canvas.rect(0, 0, PAGEW, PAGEH, fill=1, stroke=0)
    # Footer on non-cover pages
    if doc.page > 1:
        canvas.setFillColor(GRAY)
        canvas.setFont('Helvetica', 8)
        canvas.drawString(MARGIN, 0.4 * inch, 'trippdigital.com  |  payhip.com/Tinytripp')
        canvas.drawRightString(PAGEW - MARGIN, 0.4 * inch, f'Page {doc.page}')
    canvas.restoreState()

def divider():
    return HRFlowable(width='100%', thickness=1, color=ORANGE, spaceAfter=12, spaceBefore=4)

# ── Document Setup ────────────────────────────────────────
OUTPUT_FILE = 'output/[FILENAME].pdf'   # <-- update this

doc = SimpleDocTemplate(
    OUTPUT_FILE,
    pagesize=letter,
    leftMargin=MARGIN,
    rightMargin=MARGIN,
    topMargin=MARGIN,
    bottomMargin=MARGIN,
)

# ── Content ───────────────────────────────────────────────
story = []

# COVER PAGE
story.append(Spacer(1, 1.5 * inch))
story.append(Paragraph('[PRODUCT TITLE]', cover_title_style))
story.append(Spacer(1, 0.2 * inch))
story.append(Paragraph('[Subtitle or tagline]', cover_sub_style))
story.append(Spacer(1, 0.1 * inch))
story.append(divider())
story.append(Spacer(1, 0.3 * inch))
story.append(Paragraph('By Brandon Tripp | Tripp Digital', cover_brand_style))
story.append(Paragraph('trippdigital.com  •  payhip.com/Tinytripp', cover_brand_style))
story.append(PageBreak())

# INTRODUCTION
story.append(Paragraph('Introduction', section_heading_style))
story.append(divider())
story.append(Paragraph(
    '[Opening paragraph — what this guide covers and why it matters to the reader.]',
    body_style
))
story.append(Spacer(1, 0.2 * inch))
story.append(Paragraph('What you will learn:', body_style))
for item in ['[Benefit 1]', '[Benefit 2]', '[Benefit 3]']:
    story.append(Paragraph(f'•  {item}', bullet_style))
story.append(PageBreak())

# SECTION TEMPLATE (repeat for each section)
def add_section(title, body_paragraphs, bullets=None, callout=None):
    story.append(Paragraph(title, section_heading_style))
    story.append(divider())
    for para in body_paragraphs:
        story.append(Paragraph(para, body_style))
        story.append(Spacer(1, 0.1 * inch))
    if bullets:
        for b in bullets:
            story.append(Paragraph(f'•  {b}', bullet_style))
        story.append(Spacer(1, 0.15 * inch))
    if callout:
        story.append(Paragraph(callout, callout_style))
        story.append(Spacer(1, 0.15 * inch))
    story.append(PageBreak())

# Add sections here:
add_section(
    'Section 1: [Title]',
    [
        '[Body paragraph explaining the concept.]',
        '[Second paragraph with more detail or examples.]',
    ],
    bullets=['[Key point 1]', '[Key point 2]', '[Key point 3]'],
    callout='💡 PRO TIP: [One actionable insight in an orange box]'
)

# ... add more sections with add_section() calls ...

# ACTION CHECKLIST PAGE
story.append(Paragraph('Your Action Checklist', section_heading_style))
story.append(divider())
story.append(Paragraph('Complete these steps to get started:', body_style))
for step in [
    '[Action step 1]',
    '[Action step 2]',
    '[Action step 3]',
    '[Action step 4]',
    '[Action step 5]',
]:
    story.append(Paragraph(f'☐  {step}', bullet_style))
story.append(PageBreak())

# CTA PAGE
story.append(Spacer(1, 1 * inch))
story.append(Paragraph('Want More Resources Like This?', cta_style))
story.append(Spacer(1, 0.2 * inch))
story.append(divider())
story.append(Spacer(1, 0.2 * inch))
story.append(Paragraph(
    'Visit the Tripp Digital store for more guides, templates, and tools '
    'to help you earn more from home.',
    body_style
))
story.append(Spacer(1, 0.3 * inch))
story.append(Paragraph('🛒  payhip.com/Tinytripp', cta_style))
story.append(Paragraph('🌐  trippdigital.com', cta_style))
story.append(Spacer(1, 0.5 * inch))
story.append(Paragraph('© Tripp Digital — All rights reserved.', cover_brand_style))

# ── Build ─────────────────────────────────────────────────
doc.build(story, onFirstPage=black_background, onLaterPages=black_background)
print(f'PDF saved to: {OUTPUT_FILE}')
```

---

### Step 3 — Fill in the content

Replace all `[PLACEHOLDER]` values with real content:
- `[PRODUCT TITLE]` — match the exact title that will be listed on Payhip
- `[Subtitle or tagline]` — one line that reinforces the benefit
- `add_section()` calls — one per major topic, 3–8 sections total
- Bullets: 3–5 per section, kept short and scannable
- Callout boxes: one per section maximum, contains the single most actionable tip

---

### Step 4 — Run the script

```bash
pip install reportlab
python process/build_[filename].py
```

The PDF lands at `output/[FILENAME].pdf`.

If any section runs too long (check by opening the PDF), split it into two sections or trim bullets.

---

### Step 5 — Quality check

Open the PDF and verify:
- [ ] Cover: black background, orange title, white subtitle, brand line at bottom
- [ ] Every page: black background, footer shows `trippdigital.com | payhip.com/Tinytripp` + page number
- [ ] Headings: orange, sections clearly separated by orange divider line
- [ ] Body text: white, readable at 11pt
- [ ] Callout boxes: orange background, black text
- [ ] CTA page: last page, both URLs visible
- [ ] No placeholder text remaining
- [ ] Page count matches price point (see Step 1 guidelines)

---

### Step 6 — Name and file the output

Final filename convention: `PRODUCT-TITLE-Tripp-Digital.pdf` (title case, hyphens)

Examples:
- `Grant-Writing-Business-Guide-Tripp-Digital.pdf`
- `AI-Prompt-Vault-Tripp-Digital.pdf`
- `Daycare-Parent-Handbook-Tripp-Digital.pdf`

Move to `output/content/` once quality-checked:
```
output/content/YYYY-MM-DD_[product-slug].pdf
```

The Python script in `process/` can be deleted once the PDF is confirmed.

---

### Step 7 — Report back

```
PDF built: output/content/2026-06-28_grant-writing-guide.pdf
Pages: 28
Sections: 6 + intro + checklist + CTA
Ready to upload to Payhip.

Next step: Run skills/update-product-catalog.md once the Payhip listing is live.
```

---

## Notes

- ReportLab does not support Google Fonts. Helvetica (built-in) is the closest clean match to Inter. For Bebas Neue style headings, use `Helvetica-Bold` at large sizes.
- If a section has a table, use `Table()` with a `TableStyle` that sets `BACKGROUND` to `ORANGE` for header rows and `TEXTCOLOR` to `BLACK` for header text, `WHITE` for body rows.
- PDFs with more than 40 pages should include a Table of Contents page after the cover. Generate it manually as a bulleted list of section titles with page estimates.
- Always use `PageBreak()` after each section to keep layout clean and pages skimmable.

---

## Example output
*(Paste a real run here after first use)*
