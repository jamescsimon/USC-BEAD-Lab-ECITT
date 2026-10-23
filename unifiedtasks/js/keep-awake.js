/**
 * Keeps the iPad screen from dimming and locking (Auto-Lock) while a session is running, so a break
 * where nobody touches the screen does not end in a locked iPad.
 *
 * Two layers, because neither is reliable on every iOS version:
 *   1. The Screen Wake Lock API (iOS 16.4+, also in a home-screen app). It is released by the browser
 *      when the page is hidden, so it is asked for again whenever the page becomes visible.
 *   2. A tiny muted, looping, inline video that is kept playing (the "NoSleep" technique), which makes
 *      older iOS versions treat the page as playing video and not lock. It must be started from a tap.
 *
 * It cannot be tested from here. The dependable setting is on the iPad itself:
 * Settings > Display & Brightness > Auto-Lock > Never (and Guided Access if the iPad is handed around).
 *
 * Started when a session starts (session-setup.js), stopped when the session is cleared.
 */
const KeepAwake = (function () {
    const VIDEO_SRC = '../public/video/keepawake.mp4';
    let wanted = false;
    let lock = null;
    let video = null;

    function note(text) {
        if (typeof debugStep === 'function') debugStep('hold:keep-awake ' + text);
    }

    async function acquireWakeLock() {
        if (!wanted || lock || !navigator.wakeLock || !navigator.wakeLock.request) return;
        try {
            const granted = await navigator.wakeLock.request('screen');
            if (!wanted) {                       // the session was cleared while the request was in flight
                granted.release();
                return;
            }
            lock = granted;
            note('wake lock held');
            lock.addEventListener('release', () => { lock = null; note('wake lock released by the browser'); });
        } catch (error) {
            note('wake lock refused: ' + (error && error.name));
        }
    }

    function playVideo() {
        if (!wanted) return;
        try {
            if (!video) {
                video = document.createElement('video');
                video.src = VIDEO_SRC;
                video.muted = true;
                video.loop = true;
                video.setAttribute('playsinline', '');
                video.setAttribute('muted', '');
                video.style.cssText = 'position:fixed;left:0;bottom:0;width:2px;height:2px;opacity:0.01;pointer-events:none;';
                document.body.appendChild(video);
            }
            const playing = video.play();
            if (playing && typeof playing.catch === 'function') {
                playing.catch(error => note('keep-awake video could not play: ' + (error && error.name)));
            }
        } catch (error) {
            note('keep-awake video error: ' + (error && error.name));
        }
    }

    function start() {
        wanted = true;
        acquireWakeLock();
        playVideo();
    }

    function stop() {
        wanted = false;
        if (lock) {
            try { lock.release(); } catch (e) {}
            lock = null;
        }
        if (video) {
            try { video.pause(); } catch (e) {}
        }
    }

    // The browser drops the wake lock whenever the page is hidden: take it again when it is back.
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && wanted) {
            acquireWakeLock();
            playVideo();
        }
    });

    return { start, stop, isWanted: () => wanted, hasLock: () => !!lock };
})();
