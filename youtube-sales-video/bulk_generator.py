#!/usr/bin/env python3
"""
Bulk YouTube Sales Video Generator
Reads products.csv and generates a separate video for every row.

CSV columns (all optional except product_name):
    product_name, price, original_price, description,
    script_file, slides_folder, cta_text, cta_link,
    color_theme, sale_end_date

Usage:
    python bulk_generator.py                 # uses products.csv
    python bulk_generator.py my_catalog.csv
"""

import csv
import os
import sys

# ----------------------------------------------------------------
# Default CSV if none found
# ----------------------------------------------------------------
_SAMPLE_CSV = """product_name,price,original_price,description,script_file,slides_folder,cta_link
Digital Product Pro,$47,$97,The ultimate productivity tool,sales_script.txt,product_images,yourproduct.com
AI Writing Toolkit,$37,$77,Write faster with AI assistance,scripts/ai_writer.txt,slides/ai_writer,aiwriter.com
SEO Mastery Course,$67,$197,Rank #1 on Google in 30 days,scripts/seo.txt,slides/seo,seomastery.com
"""

def _create_sample_csv(path: str):
    with open(path, "w", encoding="utf-8") as f:
        f.write(_SAMPLE_CSV)
    print(f"Sample CSV created: {path}")
    print("Edit it with your product details, then re-run.")


def generate_bulk_videos(csv_file: str = "products.csv"):
    if not os.path.exists(csv_file):
        _create_sample_csv(csv_file)
        return

    with open(csv_file, newline="", encoding="utf-8") as f:
        products = list(csv.DictReader(f))

    if not products:
        print("CSV is empty -- nothing to generate.")
        return

    print(f"Found {len(products)} product(s) in {csv_file}")

    # Import after potential auto-install by avatar_video
    from avatar_video import CONFIG, generate_video

    results = []
    for i, row in enumerate(products, 1):
        name = row.get("product_name", f"product_{i}").strip()
        print(f"\n{'='*60}")
        print(f"  [{i}/{len(products)}]  {name}")
        print("="*60)

        # Overwrite only the keys present in the CSV row
        field_map = {
            "product_name":    "PRODUCT_NAME",
            "price":           "PRODUCT_PRICE",
            "original_price":  "ORIGINAL_PRICE",
            "description":     "PRODUCT_DESCRIPTION",
            "script_file":     "SALES_SCRIPT_FILE",
            "slides_folder":   "SLIDES_FOLDER",
            "cta_text":        "CTA_TEXT",
            "cta_link":        "CTA_LINK",
            "color_theme":     "COLOR_THEME",
            "sale_end_date":   "SALE_END_DATE",
        }
        for csv_col, cfg_key in field_map.items():
            val = row.get(csv_col, "").strip()
            if val:
                CONFIG[cfg_key] = val

        # Unique output filename per product
        safe = "".join(c if c.isalnum() or c in "-_" else "_" for c in name)
        CONFIG["OUTPUT_FILE"] = f"output/{safe}_sales_video.mp4"

        try:
            out = generate_video()
            results.append((name, out, "OK"))
        except Exception as e:
            print(f"  ERROR: {e}")
            results.append((name, "", f"FAILED: {e}"))

    print("\n" + "="*60)
    print("  Bulk generation summary")
    print("="*60)
    for name, path, status in results:
        icon = "OK " if status == "OK" else "ERR"
        print(f"  [{icon}]  {name:30s}  {path or status}")
    print()


if __name__ == "__main__":
    csv_path = sys.argv[1] if len(sys.argv) > 1 else "products.csv"
    generate_bulk_videos(csv_path)
