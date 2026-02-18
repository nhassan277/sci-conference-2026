#!/usr/bin/env python3
"""
Generate speaker promotional graphics for SCI 2026 conference
"""

from PIL import Image, ImageDraw, ImageFont, ImageOps
import requests
from io import BytesIO
import json
import os

# Configuration
OUTPUT_DIR = "/home/ubuntu/sci-conference-2026/speaker_graphics"
SIZE = (1080, 1080)
NAVY = "#003366"
GOLD = "#D4AF37"
WHITE = "#FFFFFF"
DARK_GRAY = "#333333"
MEDIUM_GRAY = "#666666"

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

def download_image(url):
    """Download image from URL"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return Image.open(BytesIO(response.content))
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        # Return placeholder
        img = Image.new('RGB', (300, 300), color='gray')
        return img

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_speaker_graphic(speaker_data, index):
    """Create promotional graphic for a speaker"""
    
    # Create base image
    img = Image.new('RGB', SIZE, color=hex_to_rgb(WHITE))
    draw = ImageDraw.Draw(img)
    
    # Top section - Navy background with gold accent
    top_height = int(SIZE[1] * 0.20)
    draw.rectangle([(0, 0), (SIZE[0], top_height)], fill=hex_to_rgb(NAVY))
    
    # Gold decorative line
    draw.rectangle([(0, top_height - 10), (SIZE[0], top_height)], fill=hex_to_rgb(GOLD))
    
    # Bottom section - Gradient effect (simplified as solid for now)
    bottom_start = int(SIZE[1] * 0.80)
    draw.rectangle([(0, bottom_start), (SIZE[0], SIZE[1])], fill=hex_to_rgb(NAVY))
    draw.rectangle([(0, bottom_start), (SIZE[0], bottom_start + 10)], fill=hex_to_rgb(GOLD))
    
    # Download and process speaker photo
    photo = download_image(speaker_data['photo_url'])
    
    # Make circular
    photo_size = 280
    photo = photo.resize((photo_size, photo_size), Image.Resampling.LANCZOS)
    
    # Create circular mask
    mask = Image.new('L', (photo_size, photo_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, photo_size, photo_size), fill=255)
    
    # Apply mask
    output_photo = ImageOps.fit(photo, (photo_size, photo_size), centering=(0.5, 0.5))
    output_photo.putalpha(mask)
    
    # Create gold border
    border_size = photo_size + 20
    border = Image.new('RGBA', (border_size, border_size), (0, 0, 0, 0))
    border_draw = ImageDraw.Draw(border)
    border_draw.ellipse((0, 0, border_size, border_size), fill=hex_to_rgb(GOLD))
    
    # Paste photo with border
    photo_x = 80
    photo_y = top_height + 60
    img.paste(border, (photo_x - 10, photo_y - 10), border)
    img.paste(output_photo, (photo_x, photo_y), output_photo)
    
    # Add text
    try:
        # Try to load fonts
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        name_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 42)
        affil_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
        pres_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf", 26)
        bottom_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    except:
        # Fallback to default
        title_font = ImageFont.load_default()
        name_font = ImageFont.load_default()
        affil_font = ImageFont.load_default()
        pres_font = ImageFont.load_default()
        bottom_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Text area (right side)
    text_x = photo_x + photo_size + 60
    text_y = photo_y + 20
    text_width = SIZE[0] - text_x - 40
    
    # Speaker type badge
    badge_text = "KEYNOTE SPEAKER" if speaker_data['speaker_type'] == 'keynote' else "INVITED SPEAKER"
    draw.text((text_x, text_y), badge_text, fill=hex_to_rgb(GOLD), font=affil_font)
    text_y += 50
    
    # Name
    name = speaker_data['full_name']
    draw.text((text_x, text_y), name, fill=hex_to_rgb(NAVY), font=name_font)
    text_y += 60
    
    # Affiliation (wrapped)
    affiliation = speaker_data['affiliation']
    words = affiliation.split()
    lines = []
    current_line = []
    
    for word in words:
        current_line.append(word)
        test_line = ' '.join(current_line)
        bbox = draw.textbbox((0, 0), test_line, font=affil_font)
        if bbox[2] - bbox[0] > text_width:
            if len(current_line) > 1:
                current_line.pop()
                lines.append(' '.join(current_line))
                current_line = [word]
            else:
                lines.append(test_line)
                current_line = []
    
    if current_line:
        lines.append(' '.join(current_line))
    
    for line in lines[:3]:  # Max 3 lines
        draw.text((text_x, text_y), line, fill=hex_to_rgb(DARK_GRAY), font=affil_font)
        text_y += 36
    
    text_y += 20
    
    # Presentation title (wrapped)
    pres_title = speaker_data['presentation_title']
    words = pres_title.split()
    lines = []
    current_line = []
    
    for word in words:
        current_line.append(word)
        test_line = ' '.join(current_line)
        bbox = draw.textbbox((0, 0), test_line, font=pres_font)
        if bbox[2] - bbox[0] > text_width:
            if len(current_line) > 1:
                current_line.pop()
                lines.append(' '.join(current_line))
                current_line = [word]
            else:
                lines.append(test_line)
                current_line = []
    
    if current_line:
        lines.append(' '.join(current_line))
    
    for line in lines[:4]:  # Max 4 lines
        draw.text((text_x, text_y), line, fill=hex_to_rgb(MEDIUM_GRAY), font=pres_font)
        text_y += 34
    
    # Bottom text
    date_text = "April 7-8, 2026 | ٧-٨ أبريل ٢٠٢٦"
    bbox = draw.textbbox((0, 0), date_text, font=bottom_font)
    date_x = (SIZE[0] - (bbox[2] - bbox[0])) // 2
    draw.text((date_x, bottom_start + 50), date_text, fill=hex_to_rgb(WHITE), font=bottom_font)
    
    venue_text = "Cairo University | جامعة القاهرة"
    bbox = draw.textbbox((0, 0), venue_text, font=small_font)
    venue_x = (SIZE[0] - (bbox[2] - bbox[0])) // 2
    draw.text((venue_x, bottom_start + 110), venue_text, fill=hex_to_rgb(GOLD), font=small_font)
    
    # Save
    filename = f"speaker_{index+1:02d}_{speaker_data['full_name'].replace(' ', '_').replace('.', '').lower()}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    img.save(filepath, 'PNG', quality=95)
    print(f"Generated: {filename}")
    
    return filepath

def main():
    # Load speaker data
    with open('/home/ubuntu/sci-conference-2026/speakers_data.json', 'r') as f:
        speakers = json.load(f)
    
    print(f"Generating graphics for {len(speakers)} speakers...")
    
    for i, speaker in enumerate(speakers):
        try:
            create_speaker_graphic(speaker, i)
        except Exception as e:
            print(f"Error generating graphic for {speaker['full_name']}: {e}")
    
    print(f"\nAll graphics saved to: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
