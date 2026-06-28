from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, HRFlowable,
    Table, TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT

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
    fontSize=34,
    textColor=ORANGE,
    alignment=TA_CENTER,
    spaceAfter=14,
    leading=40,
)
cover_sub_style = ParagraphStyle(
    'CoverSub',
    fontName='Helvetica',
    fontSize=15,
    textColor=WHITE,
    alignment=TA_CENTER,
    spaceAfter=8,
    leading=20,
)
cover_brand_style = ParagraphStyle(
    'CoverBrand',
    fontName='Helvetica-Bold',
    fontSize=11,
    textColor=ORANGE,
    alignment=TA_CENTER,
    spaceAfter=6,
)
section_heading_style = ParagraphStyle(
    'SectionHeading',
    fontName='Helvetica-Bold',
    fontSize=18,
    textColor=ORANGE,
    spaceBefore=14,
    spaceAfter=6,
    leading=22,
)
hustle_heading_style = ParagraphStyle(
    'HustleHeading',
    fontName='Helvetica-Bold',
    fontSize=14,
    textColor=ORANGE,
    spaceBefore=10,
    spaceAfter=4,
    leading=18,
)
body_style = ParagraphStyle(
    'Body',
    fontName='Helvetica',
    fontSize=10.5,
    textColor=WHITE,
    spaceAfter=6,
    leading=15,
)
bullet_style = ParagraphStyle(
    'Bullet',
    fontName='Helvetica',
    fontSize=10.5,
    textColor=WHITE,
    spaceAfter=3,
    leftIndent=18,
    leading=14,
)
callout_style = ParagraphStyle(
    'Callout',
    fontName='Helvetica-Bold',
    fontSize=11,
    textColor=BLACK,
    spaceAfter=4,
    leading=15,
    backColor=ORANGE,
    borderPadding=(6, 6, 6, 6),
)
cta_style = ParagraphStyle(
    'CTA',
    fontName='Helvetica-Bold',
    fontSize=14,
    textColor=ORANGE,
    alignment=TA_CENTER,
    spaceAfter=8,
)
intro_heading_style = ParagraphStyle(
    'IntroHeading',
    fontName='Helvetica-Bold',
    fontSize=20,
    textColor=ORANGE,
    spaceBefore=10,
    spaceAfter=8,
    leading=24,
)

# ── Canvas Callback ───────────────────────────────────────
def black_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BLACK)
    canvas.rect(0, 0, PAGEW, PAGEH, fill=1, stroke=0)
    if doc.page > 1:
        canvas.setFillColor(GRAY)
        canvas.setFont('Helvetica', 8)
        canvas.drawString(MARGIN, 0.4 * inch, 'trippdigital.com  |  payhip.com/Tinytripp')
        canvas.drawRightString(PAGEW - MARGIN, 0.4 * inch, f'Page {doc.page}')
    canvas.restoreState()

def divider():
    return HRFlowable(width='100%', thickness=1, color=ORANGE, spaceAfter=8, spaceBefore=2)

def mini_divider():
    return HRFlowable(width='60%', thickness=0.5, color=ORANGE, spaceAfter=6, spaceBefore=6)

# ── Document Setup ────────────────────────────────────────
OUTPUT_FILE = 'output/content/2026-06-28_vb-side-hustle-guide.pdf'

doc = SimpleDocTemplate(
    OUTPUT_FILE,
    pagesize=letter,
    leftMargin=MARGIN,
    rightMargin=MARGIN,
    topMargin=MARGIN,
    bottomMargin=MARGIN,
)

story = []

# ── COVER PAGE ────────────────────────────────────────────
story.append(Spacer(1, 1.8 * inch))
story.append(Paragraph('VIRGINIA BEACH<br/>SIDE HUSTLE GUIDE', cover_title_style))
story.append(Spacer(1, 0.25 * inch))
story.append(divider())
story.append(Spacer(1, 0.2 * inch))
story.append(Paragraph('10 Ways to Make Extra Money in Virginia Beach Right Now', cover_sub_style))
story.append(Spacer(1, 0.4 * inch))
story.append(Paragraph('By Brandon Tripp | Tripp Digital', cover_brand_style))
story.append(Paragraph('trippdigital.com  •  payhip.com/Tinytripp', cover_brand_style))
story.append(PageBreak())

# ── INTRODUCTION ──────────────────────────────────────────
story.append(Paragraph('Introduction', intro_heading_style))
story.append(divider())
story.append(Paragraph(
    'Virginia Beach is one of the most opportunity-rich cities on the East Coast — '
    'and most locals don\'t realize it. Between the military community, the tourist '
    'traffic, the outdoor lifestyle, and the growing remote-work economy, there are '
    'real ways to add $500, $1,000, or more per month without leaving the 757.',
    body_style
))
story.append(Paragraph(
    'This guide covers 10 legitimate side hustles that work specifically in Virginia '
    'Beach right now. No hype. No “passive income” promises that require $10,000 upfront. '
    'These are real moves you can start this week.',
    body_style
))
story.append(Spacer(1, 0.1 * inch))
story.append(Paragraph('What you\'ll find inside:', body_style))
for item in [
    '10 side hustles matched to the VB market and lifestyle',
    'Who each hustle works best for',
    'How to get started with little or no money',
    'Realistic income ranges for each option',
]:
    story.append(Paragraph(f'•  {item}', bullet_style))
story.append(Spacer(1, 0.15 * inch))
story.append(Paragraph(
    'PRO TIP: You don\'t need to do all 10. Pick one, start it this week, and run it for 30 days before adding a second.',
    callout_style
))
story.append(PageBreak())

# ── QUICK-START COMPARISON TABLE ─────────────────────────
story.append(Paragraph('At a Glance — Which Hustle Fits You?', section_heading_style))
story.append(divider())
story.append(Paragraph(
    'Use this table to pick your starting point. Match your current situation '
    '(what you have, how much time you can spare) to the right hustle before diving in.',
    body_style
))
story.append(Spacer(1, 0.15 * inch))

table_label_style = ParagraphStyle(
    'TableLabel', fontName='Helvetica-Bold', fontSize=9,
    textColor=BLACK, alignment=TA_CENTER, leading=11,
)
table_cell_style = ParagraphStyle(
    'TableCell', fontName='Helvetica', fontSize=8.5,
    textColor=WHITE, alignment=TA_LEFT, leading=11,
)
table_cell_center = ParagraphStyle(
    'TableCellC', fontName='Helvetica', fontSize=8.5,
    textColor=WHITE, alignment=TA_CENTER, leading=11,
)

headers = [
    Paragraph('Hustle', table_label_style),
    Paragraph('Start-Up Cost', table_label_style),
    Paragraph('Hrs/Week', table_label_style),
    Paragraph('Monthly Potential', table_label_style),
    Paragraph('Best For', table_label_style),
]
rows = [
    ['Gig Delivery', '$0', '15–20', '$600–$1,200', 'Anyone with a car'],
    ['Rideshare', '$0', '10–20', '$800–$1,500', 'Friendly, reliable drivers'],
    ['Reselling', '$50–$200', '10–15', '$300–$800', 'Thrift store shoppers'],
    ['Lawn / Pressure Wash', '$60 (rental)', '10–20', '$1,000–$2,500', 'Physically active'],
    ['Military Services', '$0', '5–15', '$400–$1,000', 'Pet lovers, parents'],
    ['Outdoor Lessons', '$0–$100', '4–12', '$400–$1,600+', 'Surfers, fitness people'],
    ['Airbnb / STR', 'Setup costs', 'Varies', '$800–$2,000+', 'Homeowners w/ space'],
    ['Digital Products', '$0', '5–10 to create', 'Passive income', 'Writers, teachers'],
    ['Local Websites', '$0', '5–15', '$970+/month (recurring)', 'Tech-comfortable'],
    ['Content Creation', '$0–$200', '5–10', '$200–$1,000+', 'Camera-comfortable'],
]

table_data = [headers]
for row in rows:
    table_data.append([
        Paragraph(row[0], table_cell_style),
        Paragraph(row[1], table_cell_center),
        Paragraph(row[2], table_cell_center),
        Paragraph(row[3], table_cell_center),
        Paragraph(row[4], table_cell_style),
    ])

col_widths = [1.35*inch, 1.0*inch, 0.8*inch, 1.45*inch, 1.5*inch]
tbl = Table(table_data, colWidths=col_widths, repeatRows=1)
tbl.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ORANGE),
    ('TEXTCOLOR', (0,0), (-1,0), BLACK),
    ('BACKGROUND', (0,1), (-1,-1), HexColor('#111111')),
    ('TEXTCOLOR', (0,1), (-1,-1), WHITE),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#111111'), HexColor('#1a1a1a')]),
    ('GRID', (0,0), (-1,-1), 0.4, ORANGE),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(tbl)
story.append(Spacer(1, 0.2 * inch))
story.append(Paragraph(
    'PRO TIP: Start with whichever hustle matches something you already have — a car, a skill, extra space, or time. The best hustle is the one you\'ll actually start.',
    callout_style
))
story.append(PageBreak())

# ── THE 10 HUSTLES ────────────────────────────────────────
story.append(Paragraph('The 10 Hustles', section_heading_style))
story.append(divider())

story.append(Paragraph('#1 — Gig Delivery (DoorDash, UberEats, Instacart)', hustle_heading_style))
story.append(Paragraph(
    'Virginia Beach has dense restaurant corridors along Virginia Beach Blvd, Laskin Road, '
    'and the Oceanfront — and tourist season floods the delivery queues. DoorDash and '
    'UberEats drivers here regularly earn $18–$25/hour during peak hours (lunch, dinner, '
    'Friday–Sunday).',
    body_style
))
story.append(Paragraph(
    'Instacart grocery delivery skews toward the Great Neck and Hilltop areas where '
    'higher household incomes = bigger order tips.',
    body_style
))
for b in [
    'Best hours: 11am–2pm and 5pm–9pm any day; Friday–Sunday all day in summer',
    'Start-up cost: $0 — just sign up and pass a background check',
    'Income potential: $600–$1,200/month working 15–20 hours/week',
]:
    story.append(Paragraph(f'•  {b}', bullet_style))
story.append(mini_divider())

story.append(Paragraph('#2 — Rideshare (Uber/Lyft)', hustle_heading_style))
story.append(Paragraph(
    'The Norfolk International Airport is 20 minutes from most of VB. Military families '
    'arriving/departing, tourists, and conference travelers create steady demand. '
    'Downtown Norfolk nightlife on weekends adds a late-night surge window.',
    body_style
))
for b in [
    'Airport runs pay flat rates — often $25–$40 per trip',
    'Military ID holders tip well; build your rating early',
    'Income potential: $800–$1,500/month part-time',
]:
    story.append(Paragraph(f'•  {b}', bullet_style))
story.append(mini_divider())

story.append(Paragraph('#3 — Sell on Facebook Marketplace (Reselling)', hustle_heading_style))
story.append(Paragraph(
    'Virginia Beach has estate sales, yard sales, and thrift stores year-round — '
    'and a massive Facebook Marketplace user base. Buy low at Goodwill, estate sales, '
    'or curbside; sell for 3–10x on Marketplace or eBay.',
    body_style
))
for b in [
    'Best finds: furniture, tools, electronics, sporting goods, baby gear',
    'Thrift store tip: GoodWill on Holland Rd stocks fast — go Tuesday mornings',
    'Income potential: $300–$800/month flipping 5–10 items per week',
]:
    story.append(Paragraph(f'•  {b}', bullet_style))
story.append(mini_divider())

story.append(Paragraph('#4 — Lawn Care & Pressure Washing', hustle_heading_style))
story.append(Paragraph(
    'Virginia Beach neighborhoods like Kempsville, Chesapeake (border), and Great Neck '
    'are packed with homeowners who don\'t want to maintain their lawns or driveways. '
    'Pressure washing driveways and siding is a gold mine here — the salt air constantly '
    'stains surfaces.',
    body_style
))
for b in [
    'Lawn mowing: $40–$80 per yard, 2–3 yards per day solo',
    'Pressure washing: $150–$300 per job, 2–3 hours work',
    'Start-up cost: rent a pressure washer for $60/day until you can buy one',
    'Income potential: $1,000–$2,500/month part-time in warm months',
]:
    story.append(Paragraph(f'•  {b}', bullet_style))
story.append(PageBreak())

story.append(Paragraph('#5 — Military Community Services', hustle_heading_style))
story.append(Paragraph(
    'Virginia Beach is home to NAS Oceana, Dam Neck, and thousands of active duty families. '
    'When service members deploy, families need help — pet sitting, childcare, moving help, '
    'handyman tasks. This community is tight-knit and word spreads fast.',
    body_style
))
for b in [
    'Pet sitting: $25–$50/night, $15–$25/day drop-in via Rover or directly',
    'Moving labor (not a truck — just muscle): $25–$35/hour, very high demand around PCS season (May–August)',
    'Connect via Facebook groups: “Military Spouses of Virginia Beach,” “757 PCS Help”',
]:
    story.append(Paragraph(f'•  {b}', bullet_style))
story.append(mini_divider())

story.append(Paragraph('#6 — Beach & Outdoor Lessons', hustle_heading_style))
story.append(Paragraph(
    'Surf lessons, paddleboard rentals, kayak tours, beach yoga — the Oceanfront is full '
    'of tourists who want guided experiences. If you have a skill, you can teach it. '
    'Even basic “learn to surf” group lessons charge $60–$80 per person.',
    body_style
))
for b in [
    'No certifications required for most beach activities (check local permits)',
    'List on Airbnb Experiences, Viator, or just promote on Instagram',
    'High season (May–September) can generate $200–$400 in a single Saturday',
]:
    story.append(Paragraph(f'•  {b}', bullet_style))
story.append(mini_divider())

story.append(Paragraph('#7 — Airbnb & Short-Term Rental', hustle_heading_style))
story.append(Paragraph(
    'If you have a spare room, guest suite, or second property near the Oceanfront or '
    'Sandbridge, short-term rental demand is massive from April through October. '
    'Even a single bedroom near the boardwalk can earn $800–$2,000/month in season.',
    body_style
))
for b in [
    'Check VB short-term rental ordinances — most residential zones allow it with registration',
    'Oceanfront and Sandbridge properties are the most valuable',
    'Off-season: target military TDY (temporary duty) guests who need weekly stays',
]:
    story.append(Paragraph(f'•  {b}', bullet_style))
story.append(PageBreak())

story.append(Paragraph('#8 — Sell Digital Products Online', hustle_heading_style))
story.append(Paragraph(
    'You don\'t need a storefront, inventory, or employees. Create a guide, template, '
    'or how-to resource once — then sell it forever on Payhip, Etsy, or Gumroad. '
    'Topics that sell: local guides, business templates, parenting resources, fitness plans.',
    body_style
))
for b in [
    'A single PDF product at $9.99–$27 can generate passive income indefinitely',
    'Best platforms: Payhip (lowest fees), Etsy (built-in traffic), Gumroad',
    'You can start with one product this week — no tech skills required',
]:
    story.append(Paragraph(f'•  {b}', bullet_style))
story.append(Paragraph(
    'PRO TIP: Tripp Digital publishes guides exactly like this one. Visit payhip.com/Tinytripp to see a real example of what\'s possible.',
    callout_style
))
story.append(mini_divider())

story.append(Paragraph('#9 — Build Websites for Local Businesses', hustle_heading_style))
story.append(Paragraph(
    'Thousands of Virginia Beach small businesses — restaurants, contractors, salons, '
    'daycares — still have no website or a terrible one from 2015. A clean, modern '
    'website is worth $97–$297/month to them if it brings in customers.',
    body_style
))
for b in [
    'Find prospects on Google Maps: search any category + “Virginia Beach” and filter by no website',
    'Build a spec site before you pitch — send the live link, not a proposal',
    'Charge $97/month recurring; 10 clients = $970/month on autopilot',
]:
    story.append(Paragraph(f'•  {b}', bullet_style))
story.append(mini_divider())

story.append(Paragraph('#10 — Content Creation (YouTube / TikTok)', hustle_heading_style))
story.append(Paragraph(
    'Virginia Beach is visually stunning — sunrises on the Chesapeake Bay, the boardwalk, '
    'Sandbridge, First Landing State Park. People from all over the country search for '
    'VB content. A YouTube channel or TikTok account about local life, food, events, or '
    'money tips can build an audience that pays through ads, sponsorships, and affiliate links.',
    body_style
))
for b in [
    'YouTube monetization kicks in at 1,000 subscribers + 4,000 watch hours',
    'TikTok Creator Fund pays small amounts but affiliate links can add $200–$800/month',
    'Niche ideas: VB restaurant reviews, military family life, beach workouts, local hidden gems',
]:
    story.append(Paragraph(f'•  {b}', bullet_style))
story.append(PageBreak())

# ── ACTION CHECKLIST ──────────────────────────────────────
story.append(Paragraph('Your Action Checklist', section_heading_style))
story.append(divider())
story.append(Paragraph(
    'Pick ONE hustle from this guide and complete these five steps before you do anything else:',
    body_style
))
story.append(Spacer(1, 0.1 * inch))
for step in [
    'Choose one hustle that matches what you already have (car, skill, space, or time)',
    'Spend 30 minutes researching what others in that hustle charge in the VB area',
    'Set up your account or listing (DoorDash, Rover, Payhip, Airbnb, etc.)',
    'Tell three people you know about your new hustle — word of mouth is how VB works',
    'Set a 30-day income goal and track every dollar you earn in a simple notes app',
]:
    story.append(Paragraph(f'☐  {step}', bullet_style))
story.append(Spacer(1, 0.25 * inch))
story.append(Paragraph(
    'REMEMBER: The goal is not to do all 10. The goal is to start one and earn your first dollar this week.',
    callout_style
))
story.append(PageBreak())

# ── CTA PAGE ─────────────────────────────────────────────
story.append(Spacer(1, 0.8 * inch))
story.append(Paragraph('Want More Guides Like This?', cta_style))
story.append(Spacer(1, 0.15 * inch))
story.append(divider())
story.append(Spacer(1, 0.2 * inch))
story.append(Paragraph(
    'Tripp Digital publishes practical guides, templates, and tools for '
    'entrepreneurs and side-hustlers — people who want to earn more without waiting '
    'on anyone else. Based in Virginia Beach. Built for real people.',
    body_style
))
story.append(Spacer(1, 0.3 * inch))
story.append(Paragraph('\U0001f6d2  Browse all digital products:', cta_style))
story.append(Paragraph('payhip.com/Tinytripp', cta_style))
story.append(Spacer(1, 0.2 * inch))
story.append(Paragraph('\U0001f310  Main site:', cta_style))
story.append(Paragraph('trippdigital.com', cta_style))
story.append(Spacer(1, 0.4 * inch))
story.append(Paragraph('\U0001f4ac  Need a website for your side hustle?', cta_style))
story.append(Paragraph(
    'Tripp Digital builds professional websites starting at $97/month. '
    'Email trippdigital1@gmail.com to get started.',
    body_style
))
story.append(Spacer(1, 0.4 * inch))
story.append(Paragraph('© 2026 Tripp Digital — All rights reserved. Virginia Beach, VA', cover_brand_style))

# ── Build ─────────────────────────────────────────────────
doc.build(story, onFirstPage=black_background, onLaterPages=black_background)
print(f'PDF saved to: {OUTPUT_FILE}')
