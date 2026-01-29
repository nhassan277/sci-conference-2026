#!/usr/bin/env python3
"""
Modify existing patronage banner to move university president to separate row
Keep all other design elements exactly the same
"""

from PIL import Image, ImageDraw, ImageFont
import subprocess

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

def modify_patronage_banner():
    # Load the original banner
    original_banner = Image.open('/home/ubuntu/upload/patronagebanner(1).png')
    WIDTH, HEIGHT = original_banner.size
    
    print(f"Original banner dimensions: {WIDTH}x{HEIGHT}")
    
    # Create a copy to work with
    img = original_banner.copy()
    draw = ImageDraw.Draw(img)
    
    # Define the light blue section coordinates (from visual inspection)
    # The blue section starts after "تحت رعاية" and contains the three names
    blue_section_top = int(HEIGHT * 0.30)  # Approximate top of blue section
    blue_section_bottom = int(HEIGHT * 0.62)  # Approximate bottom of blue section
    
    # Get the light blue color from the original (sample from blue section)
    light_blue = img.getpixel((WIDTH // 2, blue_section_top + 50))
    
    # Clear the blue section to redraw it
    draw.rectangle([(0, blue_section_top), (WIDTH, blue_section_bottom)], fill=light_blue)
    
    # Load Arabic font
    try:
        name_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstBook.ttf", int(HEIGHT * 0.028))
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstBook.ttf", int(HEIGHT * 0.020))
    except:
        name_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstFarsi.ttf", int(HEIGHT * 0.028))
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstFarsi.ttf", int(HEIGHT * 0.020))
    
    # Colors (sampled from original)
    dark_blue = (0, 51, 102)
    black = (0, 0, 0)
    
    # ROW 1: University President (centered, full width)
    row1_y = blue_section_top + int((blue_section_bottom - blue_section_top) * 0.15)
    
    president_name = reshape_arabic("أ.د/ محمد سامي")
    president_title = reshape_arabic("رئيس جامعة القاهرة")
    
    # Center president name
    name_bbox = draw.textbbox((0, 0), president_name, font=name_font)
    name_width = name_bbox[2] - name_bbox[0]
    president_x = (WIDTH - name_width) // 2
    
    draw.text((president_x, row1_y), president_name, fill=dark_blue, font=name_font)
    
    # Center president title
    title_bbox = draw.textbbox((0, 0), president_title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (WIDTH - title_width) // 2
    
    draw.text((title_x, row1_y + int(HEIGHT * 0.038)), president_title, fill=black, font=title_font)
    
    # ROW 2: Dean and Coordinator (side by side)
    row2_y = row1_y + int((blue_section_bottom - blue_section_top) * 0.50)
    
    # Dean (right side from viewer perspective, left in code due to RTL)
    dean_name = reshape_arabic("أ.د/ سهير رمضان")
    dean_title = reshape_arabic("عميد كلية العلوم")
    
    dean_name_bbox = draw.textbbox((0, 0), dean_name, font=name_font)
    dean_name_width = dean_name_bbox[2] - dean_name_bbox[0]
    dean_x = int(WIDTH * 0.67) - dean_name_width // 2
    
    draw.text((dean_x, row2_y), dean_name, fill=dark_blue, font=name_font)
    
    dean_title_bbox = draw.textbbox((0, 0), dean_title, font=title_font)
    dean_title_width = dean_title_bbox[2] - dean_title_bbox[0]
    dean_title_x = int(WIDTH * 0.67) - dean_title_width // 2
    
    draw.text((dean_title_x, row2_y + int(HEIGHT * 0.038)), dean_title, fill=black, font=title_font)
    
    # Coordinator (left side from viewer perspective, right in code due to RTL)
    coordinator_name = reshape_arabic("أ.د/ امتثال محمد عبد السميع")
    coordinator_title = reshape_arabic("المنسق العام")
    
    coord_name_bbox = draw.textbbox((0, 0), coordinator_name, font=name_font)
    coord_name_width = coord_name_bbox[2] - coord_name_bbox[0]
    coord_x = int(WIDTH * 0.25) - coord_name_width // 2
    
    draw.text((coord_x, row2_y), coordinator_name, fill=dark_blue, font=name_font)
    
    coord_title_bbox = draw.textbbox((0, 0), coordinator_title, font=title_font)
    coord_title_width = coord_title_bbox[2] - coord_title_bbox[0]
    coord_title_x = int(WIDTH * 0.25) - coord_title_width // 2
    
    draw.text((coord_title_x, row2_y + int(HEIGHT * 0.038)), coordinator_title, fill=black, font=title_font)
    
    # Save the modified banner
    output_path = '/home/ubuntu/sci-conference-2026/banners/patronage_banner_modified.png'
    img.save(output_path, 'PNG')
    print(f"✅ Modified patronage banner saved: {output_path}")
    print(f"   Dimensions: {WIDTH}x{HEIGHT} pixels")
    
    return output_path

if __name__ == "__main__":
    modify_patronage_banner()
