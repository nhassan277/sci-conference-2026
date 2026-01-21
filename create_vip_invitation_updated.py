#!/usr/bin/env python3
"""
Generate VIP Invitation Card for SCI 2026 Conference
A4 size (210mm x 297mm = 2480 x 3508 pixels at 300 DPI)
"""

from PIL import Image, ImageDraw, ImageFont
import os

# A4 dimensions at 300 DPI
WIDTH = 2480
HEIGHT = 3508
DPI = 300

# Colors
CREAM = (245, 240, 230)
GOLD = (184, 134, 11)
DARK_GOLD = (139, 101, 8)
BLACK = (0, 0, 0)
DARK_GREEN = (20, 60, 40)

def create_vip_invitation():
    """Create the VIP invitation card"""
    
    # Create image with cream background
    img = Image.new('RGB', (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img)
    
    # Draw decorative border
    border_width = 60
    corner_size = 200
    
    # Outer border
    draw.rectangle([border_width, border_width, WIDTH-border_width, HEIGHT-border_width], 
                   outline=DARK_GREEN, width=25)
    
    # Inner border
    inner_border = border_width + 40
    draw.rectangle([inner_border, inner_border, WIDTH-inner_border, HEIGHT-inner_border], 
                   outline=GOLD, width=15)
    
    # Draw decorative corners
    for x, y in [(border_width, border_width), 
                 (WIDTH-border_width-corner_size, border_width),
                 (border_width, HEIGHT-border_width-corner_size),
                 (WIDTH-border_width-corner_size, HEIGHT-border_width-corner_size)]:
        draw.rectangle([x+30, y+30, x+corner_size-30, y+corner_size-30], 
                      outline=GOLD, width=8)
    
    # Load and place the new logo at the top
    try:
        logo = Image.open('/home/ubuntu/sci-conference-2026/faculty-logo-new.jpeg')
        # Resize logo to fit nicely at top
        logo_size = 450
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        logo_x = (WIDTH - logo_size) // 2
        logo_y = 280
        img.paste(logo, (logo_x, logo_y), logo if logo.mode == 'RGBA' else None)
    except Exception as e:
        print(f"Warning: Could not load logo: {e}")
    
    # Try to load Arabic fonts
    try:
        # Try different Arabic font paths
        font_paths = [
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
            '/System/Library/Fonts/Supplemental/Arial.ttf'
        ]
        
        font_path = None
        for path in font_paths:
            if os.path.exists(path):
                font_path = path
                break
        
        if font_path:
            title_font = ImageFont.truetype(font_path, 90)
            subtitle_font = ImageFont.truetype(font_path, 65)
            body_font = ImageFont.truetype(font_path, 55)
            small_font = ImageFont.truetype(font_path, 48)
        else:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
            body_font = ImageFont.load_default()
            small_font = ImageFont.load_default()
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        body_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Current Y position
    y = 800
    
    # "دعوة خاصة" - Special Invitation
    text = "دعوة خاصة"
    bbox = draw.textbbox((0, 0), text, font=title_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=title_font, fill=DARK_GOLD)
    
    y += 150
    
    # Decorative line
    line_y = y
    line_length = 600
    line_x = (WIDTH - line_length) // 2
    draw.line([(line_x, line_y), (line_x + line_length, line_y)], fill=GOLD, width=3)
    
    y += 80
    
    # "بتشرف" - We have the honor
    text = "بتشرف"
    bbox = draw.textbbox((0, 0), text, font=subtitle_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=subtitle_font, fill=BLACK)
    
    y += 100
    
    # President
    text = "الأستاذ الدكتور/ محمد سامي عبد الصادق"
    bbox = draw.textbbox((0, 0), text, font=body_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=body_font, fill=BLACK)
    
    y += 85
    
    text = "رئيس جامعة القاهرة"
    bbox = draw.textbbox((0, 0), text, font=small_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=small_font, fill=BLACK)
    
    y += 100
    
    # Dean
    text = "والأستاذ الدكتور/ سهير رمضان فهمي"
    bbox = draw.textbbox((0, 0), text, font=body_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=body_font, fill=BLACK)
    
    y += 85
    
    text = "عميد كلية العلوم - جامعة القاهرة"
    bbox = draw.textbbox((0, 0), text, font=small_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=small_font, fill=BLACK)
    
    y += 100
    
    # Coordinator
    text = "والأستاذ الدكتور/ امتثال محمد عبد السميع"
    bbox = draw.textbbox((0, 0), text, font=body_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=body_font, fill=BLACK)
    
    y += 85
    
    text = "المنسق العام للمؤتمر"
    bbox = draw.textbbox((0, 0), text, font=small_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=small_font, fill=BLACK)
    
    y += 100
    
    # Invitation text
    text = "بدعوة سيادتكم لحضور"
    bbox = draw.textbbox((0, 0), text, font=subtitle_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=subtitle_font, fill=BLACK)
    
    y += 120
    
    # Decorative line
    line_y = y
    draw.line([(line_x, line_y), (line_x + line_length, line_y)], fill=GOLD, width=3)
    
    y += 50
    
    # Guest name placeholder (dotted line)
    dots_y = y
    dots_length = 1200
    dots_x = (WIDTH - dots_length) // 2
    for i in range(0, dots_length, 20):
        draw.ellipse([dots_x + i, dots_y, dots_x + i + 8, dots_y + 8], fill=BLACK)
    
    y += 80
    
    # Decorative line
    line_y = y
    draw.line([(line_x, line_y), (line_x + line_length, line_y)], fill=GOLD, width=3)
    
    y += 100
    
    # Conference title - "مؤتمر"
    text = "مؤتمر"
    bbox = draw.textbbox((0, 0), text, font=subtitle_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=subtitle_font, fill=BLACK)
    
    y += 100
    
    # Main conference title in Arabic
    text = "العلوم في قلب الإبتكار"
    bbox = draw.textbbox((0, 0), text, font=title_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=title_font, fill=DARK_GOLD)
    
    y += 120
    
    # English title
    text = "Science at the Core of Innovation"
    bbox = draw.textbbox((0, 0), text, font=body_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=body_font, fill=BLACK)
    
    y += 100
    
    # Subtitle in Arabic
    text = "بناء شراكات فاعلة بين الجامعات والصناعة"
    bbox = draw.textbbox((0, 0), text, font=small_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=small_font, fill=BLACK)
    
    y += 120
    
    # Date in Arabic
    text = "٧-٨ أبريل ٢٠٢٦"
    bbox = draw.textbbox((0, 0), text, font=body_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=body_font, fill=DARK_GOLD)
    
    y += 90
    
    # Date in English
    text = "April 7-8, 2026"
    bbox = draw.textbbox((0, 0), text, font=body_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=body_font, fill=BLACK)
    
    y += 120
    
    # Venue in Arabic
    text = "مركز المؤتمرات، المدينة الجامعية"
    bbox = draw.textbbox((0, 0), text, font=small_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=small_font, fill=BLACK)
    
    y += 75
    
    text = "جامعة القاهرة"
    bbox = draw.textbbox((0, 0), text, font=small_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=small_font, fill=BLACK)
    
    # Email at bottom
    y = HEIGHT - 250
    text = "science.faculty.conference2026@gmail.com"
    bbox = draw.textbbox((0, 0), text, font=small_font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=small_font, fill=BLACK)
    
    return img

if __name__ == "__main__":
    print("Creating VIP invitation card with new logo...")
    invitation = create_vip_invitation()
    output_path = "/home/ubuntu/sci-conference-2026/vip-invitation-a4-updated.png"
    invitation.save(output_path, dpi=(DPI, DPI))
    print(f"VIP invitation saved to: {output_path}")
    print(f"Size: {WIDTH}x{HEIGHT} pixels (A4 at 300 DPI)")
