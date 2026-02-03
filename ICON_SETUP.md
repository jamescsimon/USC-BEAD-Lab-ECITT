# Icon Setup Notes

## Current Status

The PWA requires three icon sizes:
- `icon_180x180.png` - iOS home screen icon (required)
- `icon_192x192.png` - Standard PWA icon
- `icon_512x512.png` - High-resolution icon

Currently, all three icons are copies of the existing `icon_196x196.png`. This will work, but for best results, you should:

## Recommended: Resize Icons Properly

1. **Use the existing `icon_196x196.png` as source**
2. **Resize to exact dimensions:**
   - 180x180px (for iOS)
   - 192x192px (can use 196x196 as-is, close enough)
   - 512x512px (for high-resolution displays)

3. **Tools for resizing:**
   - **Online:** [Squoosh](https://squoosh.app/), [TinyPNG](https://tinypng.com/)
   - **Desktop:** Photoshop, GIMP, ImageMagick
   - **Command line (ImageMagick):**
     ```bash
     convert icon_196x196.png -resize 180x180 icon_180x180.png
     convert icon_196x196.png -resize 512x512 icon_512x512.png
     ```

4. **Save optimized icons** in `public/graphics/icons/` directory

## Current Icons

The following icons are currently placeholder copies:
- `icon_180x180.png` (copy of 196x196)
- `icon_192x192.png` (copy of 196x196)
- `icon_512x512.png` (copy of 196x196)

These will work for basic functionality, but resizing to exact dimensions will provide better visual quality, especially on high-resolution displays.

