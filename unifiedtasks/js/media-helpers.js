/**
 * Sprite-loop and one-shot audio helpers
 * (split from app.js; load order is set in index.html)
 */

function getSpriteFrameSrc(prefix, frameNumber) {
    return `${SPRITE_DIR}/${prefix}-${String(frameNumber).padStart(2, '0')}.png`;
}

function startSpriteLoop(imgEl, prefix, frameCount, fps = 8) {
    if (!imgEl) return () => {};

    let frame = 1;

    imgEl.src = getSpriteFrameSrc(prefix, frame);

    const intervalMs =
        Math.round(1000 / fps);

    const timer =
        setInterval(() => {
            frame =
                frame >= frameCount
                    ? 1
                    : frame + 1;

            imgEl.src =
                getSpriteFrameSrc(prefix, frame);
        }, intervalMs);

    return () => clearInterval(timer);
}

function preloadSpriteFrames(prefix, frameCount) {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = getSpriteFrameSrc(prefix, i);
        _animPreloadCache.push(img);
    }
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
