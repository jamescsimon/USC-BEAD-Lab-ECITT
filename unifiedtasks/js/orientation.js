/**
 * Orientation layout
 * (split from app.js; load order is set in index.html)
 */

// ===== ORIENTATION HANDLING =====

function applyOrientationLayout() {
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const leftBtn = elements.leftButton;
    const rightBtn = elements.rightButton;
    if (!leftBtn || !rightBtn) return;

    if (isLandscape) {
        // Left button → left side, vertically centered
        leftBtn.style.top = '50%';
        leftBtn.style.left = '20px';
        leftBtn.style.right = '';
        leftBtn.style.bottom = '';
        leftBtn.style.transform = 'translateY(-50%)';

        // Right button → right side, vertically centered
        rightBtn.style.top = '50%';
        rightBtn.style.right = '20px';
        rightBtn.style.left = '';
        rightBtn.style.bottom = '';
        rightBtn.style.transform = 'translateY(-50%)';
    } else {
        // Portrait: restore vertical stacked layout (left=top, right=bottom)
        leftBtn.style.top = '20px';
        leftBtn.style.left = '50%';
        leftBtn.style.right = '';
        leftBtn.style.bottom = '';
        leftBtn.style.transform = 'translateX(-50%)';

        rightBtn.style.top = '';
        rightBtn.style.bottom = '20px';
        rightBtn.style.left = '50%';
        rightBtn.style.right = '';
        rightBtn.style.transform = 'translateX(-50%)';
    }
}

// ===== UTILITY =====
