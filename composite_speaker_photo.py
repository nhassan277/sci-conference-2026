#!/usr/bin/env python3
from PIL import Image, ImageDraw
import sys

def create_circular_mask(size):
    """Create a circular mask for the photo"""
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size[0], size[1]), fill=255)
    return mask

def composite_speaker_photo(template_path, photo_path, output_path):
    """Composite speaker photo into the template"""
    # Open the template and photo
    template = Image.open(template_path).convert('RGBA')
    photo = Image.open(photo_path).convert('RGB')
    
    # Template is 1080x1080, circle center is approximately at (540, 545)
    # Circle diameter is approximately 330 pixels
    circle_diameter = 330
    circle_center = (540, 545)
    
    # Resize photo to fit the circle
    photo_resized = photo.resize((circle_diameter, circle_diameter), Image.Resampling.LANCZOS)
    
    # Create circular mask
    mask = create_circular_mask((circle_diameter, circle_diameter))
    
    # Create a new RGBA image for the circular photo
    circular_photo = Image.new('RGBA', (circle_diameter, circle_diameter), (0, 0, 0, 0))
    circular_photo.paste(photo_resized, (0, 0))
    circular_photo.putalpha(mask)
    
    # Calculate paste position (top-left corner of the circle)
    paste_x = circle_center[0] - circle_diameter // 2
    paste_y = circle_center[1] - circle_diameter // 2
    
    # Composite the circular photo onto the template
    template.paste(circular_photo, (paste_x, paste_y), circular_photo)
    
    # Save the result
    template.save(output_path, 'PNG')
    print(f"Successfully created: {output_path}")

if __name__ == "__main__":
    template_path = "/home/ubuntu/webdev-static-assets/speaker-khalid-amer.png"
    photo_path = "/home/ubuntu/upload/IMG_5659.jpeg"
    output_path = "/home/ubuntu/webdev-static-assets/speaker-khalid-amer-final.png"
    
    composite_speaker_photo(template_path, photo_path, output_path)
