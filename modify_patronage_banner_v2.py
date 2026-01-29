#!/usr/bin/env python3
"""
Modify existing patronage banner to move university president to separate row
Keep all other design elements exactly the same, with proper font sizing
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
    
    # Define the light blue section coordinates
    # Based on the original banner structure
    blue_section_top = int(HEIGHT * 0.298)  # Top of blue section
    blue_section_bottom = int(HEIGHT * 0.618)  # Bottom of blue section
    
    # Sample the light blue color from original
    light_blue = img.getpixel((WIDTH // 2, blue_section_top + 50))
    
    # Clear the blue section to redraw it
    draw.rectangle([(0, blue_section_top), (WIDTH, blue_section_bottom)], fill=light_blue)
    
    # Load Arabic fonts with appropriate sizes
    try:
        # Font sizes based on original banner proportions
        name_font_size = int(HEIGHT * 0.035)  # Larger for names
        title_font_size = int(HEIGHT * 0.025)  # Smaller for titles
        
        name_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstBook.ttf", name_font_size)
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstBook.ttf", title_font_size)
    except:
        name_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstFarsi.ttf", name_font_size)
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/kacst/KacstFarsi.ttf", title_font_size)
    
    # Colors matching original
    dark_blue = (0, 51, 102)
    black = (0, 0, 0)
    
    # Calculate section height
    section_height = blue_section_bottom - blue_section_top
    
    # ROW 1: University President (centered, takes about 40% of blue section)
    row1_start = blue_section_top + int(section_height * 0.12)
    
    president_name = reshape_arabic("أ.د/ محمد سامي")
    president_title = reshape_arabic("رئيس جامعة القاهرة")
    
    # Center president name
    name_bbox = draw.textbbox((0, 0), president_name, font=name_font)
    name_width = name_bbox[2] - name_bbox[0]
    name_height = name_bbox[3] - name_bbox[1]
    president_x = (WIDTH - name_width) // 2
    
    draw.text((president_x, row1_start), president_name, fill=dark_blue, font=name_font)
    
    # Center president title below name
    title_bbox = draw.textbbox((0, 0), president_title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (WIDTH - title_width) // 2
    
    draw.text((title_x, row1_start + name_height + int(HEIGHT * 0.015)), president_title, fill=black, font=title_font)
    
    # ROW 2: Dean and Coordinator (side by side, takes remaining 60%)
    row2_start = blue_section_top + int(section_height * 0.55)
    
    # Dean (right side in Arabic layout)
    dean_name = reshape_arabic("أ.د/ سهير رمضان")
    dean_title = reshape_arabic("عميد كلية العلوم")
    
    dean_name_bbox = draw.textbbox((0, 0), dean_name, font=name_font)
    dean_name_width = dean_name_bbox[2] - dean_name_bbox[0]
    dean_name_height = dean_name_bbox[3] - dean_name_bbox[1]
    # Position at 2/3 of width (right side)
    dean_x = int(WIDTH * 0.667) - dean_name_width // 2
    
    draw.text((dean_x, row2_start), dean_name, fill=dark_blue, font=name_font)
    
    dean_title_bbox = draw.textbbox((0, 0), dean_title, font=title_font)
    dean_title_width = dean_title_bbox[2] - dean_title_bbox[0]
    dean_title_x = int(WIDTH * 0.667) - dean_title_width // 2
    
    draw.text((dean_title_x, row2_start + dean_name_height + int(HEIGHT * 0.015)), dean_title, fill=black, font=title_font)
    
    # Coordinator (left side in Arabic layout)
    coordinator_name = reshape_arabic("أ.د/ امتثال محمد عبد السميع")
    coordinator_title = reshape_arabic("المنسق العام")
    
    coord_name_bbox = draw.textbbox((0, 0), coordinator_name, font=name_font)
    coord_name_width = coord_name_bbox[2] - coord_name_bbox[0]
    coord_name_height = coord_name_bbox[3] - coord_name_bbox[1]
    # Position at 1/3 of width (left side)
    coord_x = int(WIDTH * 0.25) - coord_name_width // 2
    
    draw.text((coord_x, row2_start), coordinator_name, fill=dark_blue, font=name_font)
    
    coord_title_bbox = draw.textbbox((0, 0), coordinator_title, font=title_font)
    coord_title_width = coord_title_bbox[2] - coord_title_bbox[0]
    coord_title_x = int(WIDTH * 0.25) - coord_title_width // 2
    
    draw.text((coord_title_x, row2_start + coord_name_height + int(HEIGHT * 0.015)), coordinator_title, fill=black, font=title_font)
    
    # Save the modified banner
    output_path = '/home/ubuntu/sci-conference-2026/banners/patronage_banner_final_modified.png'
    img.save(output_path, 'PNG')
    print(f"✅ Modified patronage banner saved: {output_path}")
    print(f"   Dimensions: {WIDTH}x{HEIGHT} pixels")
    
    return output_path

if __name__ == "__main__":
    modify_patronage_banner()
