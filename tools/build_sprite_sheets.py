"""
Builds one sprite sheet per animation from the numbered frame files.

    graphics/frames/<name>-01.png, -02.png, ...   (reward animations)
    graphics/sprites/<name>-01.png, -02.png, ...  (frog, butterfly, ...)
        ->  graphics/sheets/<name>.png            (all frames side by side, left to right)

Why: the app shows an animation by moving a window along ONE picture instead of swapping between
many files. One picture is decoded once at startup, so frames never flicker while decoding.

Every frame must be the same size. The sheet is (frame width x frame count) wide and one frame tall.
Run from anywhere:   python tools/build_sprite_sheets.py
Needs Pillow:        pip install pillow
"""
import glob
import os
import re
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SOURCES = [os.path.join(ROOT, 'graphics', 'frames'), os.path.join(ROOT, 'graphics', 'sprites')]
OUT_DIR = os.path.join(ROOT, 'graphics', 'sheets')
FRAME_RE = re.compile(r'^(?P<name>.+)-(?P<num>\d+)\.png$')


def collect():
    animations = {}
    for folder in SOURCES:
        for path in glob.glob(os.path.join(folder, '*.png')):
            match = FRAME_RE.match(os.path.basename(path))
            if not match:
                continue
            animations.setdefault(match.group('name'), {})[int(match.group('num'))] = path
    return animations


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    animations = collect()
    if not animations:
        sys.exit('no numbered frame files found')

    for name in sorted(animations):
        frames = animations[name]
        numbers = sorted(frames)
        if numbers != list(range(1, len(numbers) + 1)):
            sys.exit(f'{name}: frame numbers are not 1..N without gaps: {numbers}')

        images = [Image.open(frames[n]).convert('RGBA') for n in numbers]
        size = images[0].size
        if any(image.size != size for image in images):
            sys.exit(f'{name}: frames are not all the same size')

        sheet = Image.new('RGBA', (size[0] * len(images), size[1]), (0, 0, 0, 0))
        for index, image in enumerate(images):
            sheet.paste(image, (index * size[0], 0))

        out_path = os.path.join(OUT_DIR, f'{name}.png')
        sheet.save(out_path, optimize=True)
        print(f'{name:12s} {len(images):2d} frames of {size[0]}x{size[1]} -> {os.path.relpath(out_path, ROOT)} '
              f'({os.path.getsize(out_path) // 1024} KB)')


if __name__ == '__main__':
    main()
