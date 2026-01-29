#!/usr/bin/env python3
"""
Generate Patronage Banner (3m x 1m) for SCI 2026 Conference
Updated layout: University President in separate top row
With proper Arabic text rendering
"""

from PIL import Image, ImageDraw, ImageFont
import subprocess
import os

# Banner dimensions (3m x 1m at 300 DPI)
WIDTH = 11811  # 3m at 300 DPI
HEIGHT = 3937  # 1m at 300 DPI

# Colors
CREAM_BG = (245, 245, 235)
LIGHT_BLUE = (200, 220, 235)
DARK_BLUE = (0, 51, 102)
GOLD = (218, 165, 32)
BLACK = (0, 0, 0)

# Install required packages for Arabic text
try:
    import arabic_reshaper
    from bidi.algorithm import get_display
except ImportError:
    print("Installing Arabic text support packages...")
    subprocess.run(["sudo", "pip3", "install", "arabic-reshaper", "python-bidi"], check=True)
    import arabic_reshaper
    from bidi.algorithm import get_display

def reshape_arabic(text):
    """Reshape Arabic text for proper display"""
    reshaped_text = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped_text)
    return bidi_text

def create_patronage_banner():
    # Create image
    img = Image.new('RGB', (WIDTH, HEIGHT), CREAM_BG)
    draw = ImageDraw.Draw(img)
    
    # Load logos
    logo_cu = Image.open('/home/ubuntu/sci-conference-2026/client/public/images/logo_cu_new.png')
    logo_pioneers = Image.open('/home/ubuntu/sci-conference-2026/client/public/images/logo_pioneers.png')
    logo_sci = Image.open('/home/ubuntu/sci-conference-2026/client/public/images/sci2026-logo.png')
    logo_faculty = Image.open('/home/ubuntu/sci-conference-2026/client/public/images/logo_cu.png')
    
    # Resize logos (larger for better visibility)
    logo_size = 450
    logo_cu = logo_cu.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    logo_pioneers = logo_pioneers.resize((int(logo_size * 1.5), logo_size), Image.Resampling.LANCZOS)
    logo_sci = logo_sci.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    logo_faculty = logo_faculty.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Position logos in header
    header_y = 80
    img.paste(logo_faculty, (200, header_y), logo_faculty if logo_faculty.mode == 'RGBA' else None)
    
    # Center pioneers logo
    pioneers_x = (WIDTH - int(logo_size * 1.5)) // 2
    img.paste(logo_pioneers, (pioneers_x, header_y), logo_pioneers if logo_pioneers.mode == 'RGBA' else None)
    
    img.paste(logo_sci, (WIDTH // 2 + 800, header_y), logo_sci if logo_sci.mode == 'RGBA' else None)
    img.paste(logo_cu, (WIDTH - logo_size - 200, header_y), logo_cu if logo_cu.mode == 'RGBA' else None)
    
    # Patronage section header
    patronage_y = header_y + logo_size + 120
    
    # Draw "تحت رعاية" title with Arabic font
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstBook.ttf", 140)
    except:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstFarsi.ttf", 140)
    
    title_text = reshape_arabic("تحت رعاية")
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (WIDTH - title_width) // 2
    
    draw.text((title_x, patronage_y), title_text, fill=GOLD, font=title_font)
    
    # Blue background for patronage info
    patronage_bg_y = patronage_y + 200
    patronage_bg_height = 1200
    draw.rectangle([(0, patronage_bg_y), (WIDTH, patronage_bg_y + patronage_bg_height)], fill=LIGHT_BLUE)
    
    # Fonts for names and titles
    try:
        name_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstBook.ttf", 110)
        title_font_small = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstBook.ttf", 80)
    except:
        name_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstFarsi.ttf", 110)
        title_font_small = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstFarsi.ttf", 80)
    
    # ROW 1: University President (centered, full width)
    row1_y = patronage_bg_y + 150
    
    president_name = reshape_arabic("أ.د/ محمد سامي عبد الصادق")
    president_title = reshape_arabic("رئيس جامعة القاهرة")
    
    # Center president name
    name_bbox = draw.textbbox((0, 0), president_name, font=name_font)
    name_width = name_bbox[2] - name_bbox[0]
    president_x = (WIDTH - name_width) // 2
    
    draw.text((president_x, row1_y), president_name, fill=DARK_BLUE, font=name_font)
    
    # Center president title
    title_bbox = draw.textbbox((0, 0), president_title, font=title_font_small)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (WIDTH - title_width) // 2
    
    draw.text((title_x, row1_y + 150), president_title, fill=BLACK, font=title_font_small)
    
    # ROW 2: Dean and Coordinator (side by side)
    row2_y = row1_y + 450
    
    # Coordinator (right side)
    coordinator_name = reshape_arabic("أ.د/ امتثال محمد عبد السميع")
    coordinator_title = reshape_arabic("المنسق العام")
    
    coord_name_bbox = draw.textbbox((0, 0), coordinator_name, font=name_font)
    coord_name_width = coord_name_bbox[2] - coord_name_bbox[0]
    coord_x = WIDTH // 4 - coord_name_width // 2
    
    draw.text((coord_x, row2_y), coordinator_name, fill=DARK_BLUE, font=name_font)
    
    coord_title_bbox = draw.textbbox((0, 0), coordinator_title, font=title_font_small)
    coord_title_width = coord_title_bbox[2] - coord_title_bbox[0]
    coord_title_x = WIDTH // 4 - coord_title_width // 2
    
    draw.text((coord_title_x, row2_y + 150), coordinator_title, fill=BLACK, font=title_font_small)
    
    # Dean (left side)
    dean_name = reshape_arabic("أ.د/ سهير رمضان فهمي")
    dean_title = reshape_arabic("عميد كلية العلوم")
    
    dean_name_bbox = draw.textbbox((0, 0), dean_name, font=name_font)
    dean_name_width = dean_name_bbox[2] - dean_name_bbox[0]
    dean_x = 3 * WIDTH // 4 - dean_name_width // 2
    
    draw.text((dean_x, row2_y), dean_name, fill=DARK_BLUE, font=name_font)
    
    dean_title_bbox = draw.textbbox((0, 0), dean_title, font=title_font_small)
    dean_title_width = dean_title_bbox[2] - dean_title_bbox[0]
    dean_title_x = 3 * WIDTH // 4 - dean_title_width // 2
    
    draw.text((dean_title_x, row2_y + 150), dean_title, fill=BLACK, font=title_font_small)
    
    # Conference title section
    conf_title_y = patronage_bg_y + patronage_bg_height + 150
    
    try:
        conf_font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 180)
        conf_font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 140)
        conf_font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 90)
        conf_font_arabic = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstBook.ttf", 140)
    except:
        conf_font_large = ImageFont.load_default()
        conf_font_medium = ImageFont.load_default()
        conf_font_small = ImageFont.load_default()
        conf_font_arabic = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstFarsi.ttf", 140)
    
    # SCI 2026
    sci_text = "SCI 2026"
    sci_bbox = draw.textbbox((0, 0), sci_text, font=conf_font_large)
    sci_width = sci_bbox[2] - sci_bbox[0]
    sci_x = (WIDTH - sci_width) // 2
    draw.text((sci_x, conf_title_y), sci_text, fill=DARK_BLUE, font=conf_font_large)
    
    # English title
    eng_title = "Science at the Core of Innovation"
    eng_bbox = draw.textbbox((0, 0), eng_title, font=conf_font_medium)
    eng_width = eng_bbox[2] - eng_bbox[0]
    eng_x = (WIDTH - eng_width) // 2
    draw.text((eng_x, conf_title_y + 220), eng_title, fill=DARK_BLUE, font=conf_font_medium)
    
    # Arabic title
    ar_title = reshape_arabic("العلوم في قلب الابتكار")
    ar_bbox = draw.textbbox((0, 0), ar_title, font=conf_font_arabic)
    ar_width = ar_bbox[2] - ar_bbox[0]
    ar_x = WIDTH - eng_x - ar_width
    draw.text((ar_x, conf_title_y + 220), ar_title, fill=DARK_BLUE, font=conf_font_arabic)
    
    # Subtitle
    subtitle_en = "Building Effective Partnerships between Universities and Industry"
    subtitle_bbox = draw.textbbox((0, 0), subtitle_en, font=conf_font_small)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (WIDTH - subtitle_width) // 2
    draw.text((subtitle_x, conf_title_y + 410), subtitle_en, fill=BLACK, font=conf_font_small)
    
    subtitle_ar = reshape_arabic("بناء شراكات فاعلة بين الجامعات والصناعة")
    subtitle_ar_bbox = draw.textbbox((0, 0), subtitle_ar, font=conf_font_arabic)
    subtitle_ar_width = subtitle_ar_bbox[2] - subtitle_ar_bbox[0]
    subtitle_ar_x = (WIDTH - subtitle_ar_width) // 2
    draw.text((subtitle_ar_x, conf_title_y + 520), subtitle_ar, fill=BLACK, font=conf_font_arabic)
    
    # Date and location
    date_y = conf_title_y + 720
    date_text = reshape_arabic("April 7-8, 2026 | ٧-٨ أبريل ٢٠٢٦")
    date_bbox = draw.textbbox((0, 0), date_text, font=conf_font_small)
    date_width = date_bbox[2] - date_bbox[0]
    date_x = (WIDTH - date_width) // 2
    draw.text((date_x, date_y), date_text, fill=GOLD, font=conf_font_small)
    
    location_text = reshape_arabic("Conference Hall - University Hostel | قاعة المؤتمرات - المدينة الجامعية")
    location_bbox = draw.textbbox((0, 0), location_text, font=conf_font_small)
    location_width = location_bbox[2] - location_bbox[0]
    location_x = (WIDTH - location_width) // 2
    draw.text((location_x, date_y + 110), location_text, fill=BLACK, font=conf_font_small)
    
    time_text = reshape_arabic("الساعة ٩ صباحاً")
    time_bbox = draw.textbbox((0, 0), time_text, font=conf_font_arabic)
    time_width = time_bbox[2] - time_bbox[0]
    time_x = (WIDTH - time_width) // 2
    draw.text((time_x, date_y + 220), time_text, fill=BLACK, font=conf_font_arabic)
    
    # Draw gold border
    border_width = 30
    draw.rectangle([(border_width, border_width), (WIDTH - border_width, HEIGHT - border_width)], 
                   outline=GOLD, width=border_width)
    
    # Save
    output_path = '/home/ubuntu/sci-conference-2026/banners/patronage_banner_final_v2.png'
    img.save(output_path, 'PNG', dpi=(300, 300))
    print(f"✅ Patronage banner saved: {output_path}")
    print(f"   Dimensions: {WIDTH}x{HEIGHT} pixels (3m x 1m at 300 DPI)")
    
    return output_path

if __name__ == "__main__":
    create_patronage_banner()
