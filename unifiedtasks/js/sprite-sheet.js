/**
 * Sprite sheets: play an animation by moving a window along ONE picture.
 * (split from app.js; load order is set in index.html)
 *
 * Each animation is a single wide PNG in graphics/sheets/<name>.png with all of its frames side by
 * side, left to right (built from the numbered frame files by tools/build_sprite_sheets.py).
 * The sheet is downloaded and decoded once at startup (see preloadAnimationFrames), so changing the
 * visible frame afterwards only moves the window: nothing is fetched or decoded, which is what
 * stops the first play of each animation from flickering on iOS.
 *
 * Works on <img> elements (object-position window) and on any other element (background window).
 * Every frame is SHEET_FRAME_PX square; the element itself must be that size.
 */
const SHEET_DIR = '../graphics/sheets';
const SHEET_FRAME_PX = 220;

function sheetUrl(name) {
    return `${SHEET_DIR}/${name}.png`;
}

function isImageElement(el) {
    return el.tagName === 'IMG';
}

/** Points `el` at the sheet for `name` and shows its first frame. */
function setupSheet(el, name, frameCount) {
    if (isImageElement(el)) {
        el.src = sheetUrl(name);
        el.style.objectFit = 'none'; // natural size, no scaling: only a 1-frame window is visible
    } else {
        el.style.backgroundImage = `url('${sheetUrl(name)}')`;
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundSize = `${frameCount * SHEET_FRAME_PX}px ${SHEET_FRAME_PX}px`;
    }
    showSheetFrame(el, 0);
}

/** Shows frame `frameIndex` (0-based). */
function showSheetFrame(el, frameIndex) {
    const offset = `${-frameIndex * SHEET_FRAME_PX}px 0px`;

    if (isImageElement(el)) {
        el.style.objectPosition = offset;
    } else {
        el.style.backgroundPosition = offset;
    }
}
