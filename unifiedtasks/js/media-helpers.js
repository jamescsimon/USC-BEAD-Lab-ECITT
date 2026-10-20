/**
 * Sprite-loop and one-shot audio helpers
 * (split from app.js; load order is set in index.html)
 */

// Loops an animation sheet on an <img> (frog, butterfly). Returns a function that stops the loop.
function startSpriteLoop(imgEl, prefix, frameCount, fps = 8) {
    if (!imgEl) return () => {};

    let frame = 0;

    setupSheet(imgEl, prefix, frameCount);

    const timer =
        setInterval(() => {
            frame = (frame + 1) % frameCount;
            showSheetFrame(imgEl, frame);
        }, Math.round(1000 / fps));

    return () => clearInterval(timer);
}

function playOneShotAudio(fileOrPath, volume = 1) {
    const src = getAudioSrc(fileOrPath);

    if (!src) return;

    const audio = new Audio(src);

    audio.preload = 'auto';
    audio.volume = volume;
    audio.muted = false;
    audio.currentTime = 0;

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(err => {
            console.warn('[AUDIO] One-shot audio failed:', err.name, err.message, src);
        });
    }
}
