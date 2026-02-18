# Speaker Promotional Graphics - Generation Notes

## Status
Successfully generated all 15 speaker promotional graphics using Python/Pillow.

## Design Specifications
- **Format:** Square (1080x1080px) for social media
- **Color Scheme:** 
  - Navy blue (#003366) - primary brand color
  - Gold (#D4AF37) - accent color
  - White background for main content area
- **Layout:**
  - Top section: Navy blue header with gold accent line (20% height)
  - Middle section: White background with circular speaker photo (gold border) and text content
  - Bottom section: Navy blue footer with gold accent line (20% height)

## Content Elements
Each graphic includes:
1. **Speaker Photo:** Circular with gold border (280px diameter)
2. **Speaker Type Badge:** "KEYNOTE SPEAKER" or "INVITED SPEAKER" (gold text)
3. **Name:** Bold, navy blue
4. **Affiliation:** Regular weight, dark gray (wrapped to fit)
5. **Presentation Title:** Italic, medium gray (wrapped to fit)
6. **Conference Dates:** Bilingual "April 7-8, 2026 | ٧-٨ أبريل ٢٠٢٦" (white text)
7. **Venue:** Bilingual "Cairo University | جامعة القاهرة" (gold text)

## Photo Download Issues
Some speaker photos returned 403 Forbidden errors when downloading from CDN:
- Speakers with placeholder photos (8 total) used gray placeholder
- Speakers with valid photos (7 total):
  - Dr. Ayman El-Shibiny ✓
  - Dr. Ahmed Fikry El-Sayed ✓
  - Prof. Mortada Mourad El Aref ✓
  - Others used placeholders due to CDN access restrictions

## Files Generated
All 15 graphics saved to: `/home/ubuntu/sci-conference-2026/speaker_graphics/`

File naming pattern: `speaker_XX_name.png`

## Next Steps
1. Upload graphics to S3 CDN for permanent storage
2. Replace placeholder photos with actual speaker photos where missing
3. Deliver all graphics to user for social media campaign
