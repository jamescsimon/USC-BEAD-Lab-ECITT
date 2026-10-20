/**
 * Developer flags for finding performance problems on a device.
 *
 * Flags come from the URL (?debug&norec) and from a saved list, so they also work in an app added to
 * the iPad home screen (which ignores the URL query). To set them there: on the first screen, tap the
 * "ECITT Task" title 5 times quickly, type the flags separated by spaces or commas, and press OK.
 * Leave it empty to clear them. The page reloads to apply.
 *
 *   debug      show the performance overlay (see debug-monitor.js)
 *   norec      do not start the camera / video recording
 *   nopreload  do not preload the reward animation frames and sounds
 *
 * With no flags set the app behaves normally.
 */
const DEV_FLAGS_STORAGE_KEY = 'ecittDevFlags';

function readDevFlags() {
    const flags = new Set();
    try {
        const query = (typeof location !== 'undefined' ? location.search : '').replace(/^\?/, '');
        query.split('&').filter(Boolean).forEach(part => flags.add(part.split('=')[0].toLowerCase()));
    } catch (e) {}
    try {
        const saved = (typeof localStorage !== 'undefined' && localStorage.getItem(DEV_FLAGS_STORAGE_KEY)) || '';
        saved.split(/[\s,]+/).filter(Boolean).forEach(flag => flags.add(flag.toLowerCase()));
    } catch (e) {}
    return flags;
}

const DEV_FLAGS = readDevFlags();

// Reports that a named step of the task has just finished running. The debug panel (debug-monitor.js,
// `debug` flag) lights the matching line. Does nothing, and costs nothing, when the panel is off.
function debugStep(id) {
    if (typeof window !== 'undefined' && typeof window.__debugStepSink === 'function') {
        window.__debugStepSink(id);
    }
}

function hasDevFlag(name) {
    return DEV_FLAGS.has(name);
}

// Hidden way to set the flags on a home-screen app: tap the first-screen title 5 times within 3 seconds.
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('#ageSelectionScreen .title');
    if (!title) return;

    let taps = [];
    title.addEventListener('pointerdown', () => {
        const now = Date.now();
        taps = taps.filter(t => now - t < 3000);
        taps.push(now);
        if (taps.length < 5) return;
        taps = [];

        const current = (localStorage.getItem(DEV_FLAGS_STORAGE_KEY) || '');
        const answer = window.prompt('Developer flags (debug, norec, nopreload). Empty = none.', current);
        if (answer === null) return;
        try {
            if (answer.trim()) {
                localStorage.setItem(DEV_FLAGS_STORAGE_KEY, answer.trim());
            } else {
                localStorage.removeItem(DEV_FLAGS_STORAGE_KEY);
            }
        } catch (e) {}
        location.reload();
    });
});
