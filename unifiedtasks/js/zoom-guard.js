/**
 * Stops iOS from zooming or panning the page on quick or repeated taps.
 *
 * Why: the blue buttons are position:fixed. When iOS zooms the page (double-tap zoom on a quick second
 * tap on the empty background, or a pinch), fixed elements are drawn in one place but touches are
 * matched to another, so taps stop reaching the buttons and the screen seems frozen. The viewport
 * meta tag's user-scalable=no is ignored by iOS 10+, and touch-action is only honoured on iOS 13+, so
 * this guard also blocks the gestures directly.
 */
(function () {
    // pinch zoom (Safari-only gesture events)
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(type => {
        document.addEventListener(type, event => event.preventDefault());
    });

    // double-tap zoom: a second touch ending within 350 ms of the last one is cancelled
    let lastTouchEnd = 0;
    document.addEventListener('touchend', event => {
        const now = Date.now();
        if (now - lastTouchEnd <= 350) event.preventDefault();
        lastTouchEnd = now;
    }, { passive: false });
})();
