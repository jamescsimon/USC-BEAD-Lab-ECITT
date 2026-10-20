/**
 * Reward animation, audio unlock and preloading
 * (split from app.js; load order is set in index.html)
 */

// ===== REWARD ANIMATION =====

const FRAME_ANIMATIONS = {
    apple:      11,
    bus:        13,
    cat:         7,
    chick:       9,
    dog:         4,
    elephant:    9,
    elephant2:   9,
    elephant4:  12,
    flower:      9,
    ghost:       4,
    happy:       3,
    mole:        6,
    monster:     9,
    owl:         9,
    penguin:     4,
    robot:       5,
    snail:       4,
    whale:       4
};

// Pair a sound file from ../public/audio/ with each animation, or null for no sound.
const ANIMATION_SOUNDS_INFANT_TODDLER = {
    apple:      'pop.mp3',
    bus:        'weee.mp3',
    cat:        'happyCat.mp3',
    chick:      'quack.mp3',
    dog:        'salsa.mp3',
    elephant:   'chimes.mp3',
    elephant2:  'weee.mp3',
    elephant4:  'water.mp3',
    flower:     'happyTune.mp3',
    ghost:      'chimes.mp3',
    happy:      'happyTune.mp3',
    mole:       'pop.mp3',
    monster:    'success.mp3',
    owl:        'wakingUp.mp3',
    penguin:    'quack.mp3',
    robot:      'happyGroove.mp3',
    snail:      'wetClick.mp3',
    whale:      'water.mp3'
};

const ANIMATION_SOUNDS_CHILD = {
    apple:      'pop.mp3',
    bus:        'weeeSh.mp3',
    cat:        'happyCatSh.mp3',
    chick:      'quack.mp3',
    dog:        'salsaSh.mp3',
    elephant:   'chimes.mp3',
    elephant2:  'weeeSh.mp3',
    elephant4:  'waterSh.mp3',
    flower:     'happyTuneSh.mp3',
    ghost:      'chimes.mp3',
    happy:      'happyTuneSh.mp3',
    mole:       'pop.mp3',
    monster:    'success.mp3',
    owl:        'wakingUpSh.mp3',
    penguin:    'quack.mp3',
    robot:      'happyGrooveSh.mp3',
    snail:      'wetClick.mp3',
    whale:      'waterSh.mp3'
};
// Available files: chimes.mp3, happyCat.mp3, happyCatSh.mp3, happyGroove.mp3, happyGrooveSh.mp3,
//   happyTune.mp3, happyTuneSh.mp3, pop.mp3, quack.mp3, salsa.mp3, salsaSh.mp3, success.mp3,
//   wakingUp.mp3, wakingUpSh.mp3, water.mp3, waterSh.mp3, weee.mp3, weeeSh.mp3, wetClick.mp3

const ANIMATION_NAMES = Object.keys(FRAME_ANIMATIONS);
let rewardAnimTimer = null;
let _currentAnimAudio = null;

// Preload all animation frames and sounds at startup
const _animPreloadCache = [];
const _audioCache = {};
let _audioUnlockedForIOS = false;

function unlockAllAudioForIOS() {
    if (_audioUnlockedForIOS) return;

    const unlockSrc = getAudioSrc('pop.mp3');

    let audio = _audioCache[unlockSrc];

    if (!audio) {
        audio = new Audio(unlockSrc);
        audio.preload = 'auto';
        _audioCache[unlockSrc] = audio;
    }

    audio.volume = 0.01;
    audio.muted = false;
    audio.currentTime = 0;

    showAudioDebug(`[AUDIO] Trying iOS unlock with: ${unlockSrc}`);

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.then === 'function') {
        playPromise
            .then(() => {
                audio.pause();
                audio.currentTime = 0;
                audio.volume = 1;

                _audioUnlockedForIOS = true;

                showAudioDebug('[AUDIO] iOS audio unlocked OK');
            })
            .catch(err => {
                const msg = `[AUDIO] iOS unlock failed: ${err.name}: ${err.message}`;
                showAudioDebug(msg);
            });
    }
}

function getAudioSrc(fileOrPath) {
    if (!fileOrPath) return '';

    if (fileOrPath.includes('/')) {
        return fileOrPath;
    }

    return `../public/audio/${fileOrPath}`;
}

function preloadAudioFile(fileOrPath) {
    const src = getAudioSrc(fileOrPath);

    if (!src || _audioCache[src]) return;

    const audio = new Audio(src);
    audio.preload = 'auto';
    _audioCache[src] = audio;
}

function preloadAnimationFrames() {
    if (hasDevFlag('nopreload')) {
        console.warn('[APP] Preloading skipped (nopreload developer flag)');
        return;
    }
    Object.entries(FRAME_ANIMATIONS).forEach(([name, count]) => {
        for (let i = 1; i <= count; i++) {
            const img = new Image();
            img.src = `../graphics/frames/${name}-${String(i).padStart(2, '0')}.png`;
            _animPreloadCache.push(img);
        }
    });

    // Preload pre-task sprite animations.
    preloadSpriteFrames(CALIBRATION_SPRITE_PREFIX, CALIBRATION_SPRITE_FRAMES);
    preloadSpriteFrames(BUTTERFLY_SPRITE_PREFIX, BUTTERFLY_SPRITE_FRAMES);

    [
        ...Object.values(ANIMATION_SOUNDS_INFANT_TODDLER),
        ...Object.values(ANIMATION_SOUNDS_CHILD),
        ...NIRS_BASELINE_AUDIOS,
        CALIBRATION_SOUND,
        BUTTERFLY_SOUND
    ].forEach(preloadAudioFile);
}

/**
 * @param {Element} buttonEl animation appears at this element's position
 * @param {{durationMs?: number, loops?: number, silent?: boolean}} [options]
 */
function playRewardAnimation(buttonEl, options) {
    options = options || {};
    if (rewardAnimTimer) {
        cancelAnimationFrame(rewardAnimTimer);
        rewardAnimTimer = null;
    }

    const animEl = document.getElementById('rewardAnimation');
    if (!animEl || !buttonEl) return;

    const rect = buttonEl.getBoundingClientRect();
    animEl.style.left = rect.left + 'px';
    animEl.style.top = rect.top + 'px';
    animEl.style.display = 'block';

    // Hide buttons during animation
    if (elements.leftButton) elements.leftButton.style.display = 'none';
    if (elements.mdlButton) elements.mdlButton.style.display = 'none';
    if (elements.rightButton) elements.rightButton.style.display = 'none';

    const name = ANIMATION_NAMES[Math.floor(Math.random() * ANIMATION_NAMES.length)];
    const frameCount = FRAME_ANIMATIONS[name];

// --- SOUND ---
    if (_currentAnimAudio) {
        try {
            _currentAnimAudio.pause();
            _currentAnimAudio.currentTime = 0;
        } catch (e) {}

        _currentAnimAudio = null;
    }

    const soundMap =
        appState.ageGroup === 'Child'
            ? ANIMATION_SOUNDS_CHILD
            : ANIMATION_SOUNDS_INFANT_TODDLER;

    const soundFile =
        soundMap[name];

    const soundSrc =
        getAudioSrc(soundFile);

    showAudioDebug(
        `[AUDIO] Reward requested: ${soundSrc || 'NO_SOUND_SRC'}`
    );

    if (options.silent) {
        // no sound for this animation
    } else if (soundSrc) {
        // Use a fresh Audio object for each reward on iPad.
        // Do not reuse the cached element, because reused media elements can get AbortError.
        const rewardAudio = new Audio(soundSrc);

        rewardAudio.preload = 'auto';
        rewardAudio.volume = 1;
        rewardAudio.muted = false;
        rewardAudio.currentTime = 0;

        _currentAnimAudio = rewardAudio;

        const rewardPromise = rewardAudio.play();

        if (rewardPromise && typeof rewardPromise.then === 'function') {
            rewardPromise
                .then(() => {
                    showAudioDebug(`[AUDIO] Reward audio played OK: ${soundSrc}`);
                })
                .catch(err => {
                    // AbortError usually means we intentionally interrupted the audio
                    // with a new trial, new sound, or duplicate event. Do not alert for it.
                    if (err.name === 'AbortError') {
                        showAudioDebug(`[AUDIO] Reward audio interrupted: ${soundSrc}`);
                        return;
                    }

                    const msg =
                        `[AUDIO] Reward audio failed: ${err.name}: ${err.message} | ${soundSrc}`;

                    showAudioDebug(msg);
                });
        }
    } else {
        const msg =
            `[AUDIO] No reward audio source found for animation "${name}"`;

        showAudioDebug(msg);
    }

    // --- TIMING ---
    const startTime = performance.now();

    const isChildReward =
        appState.ageGroup === 'Child';
    
    const totalDuration =
        options.durationMs !== undefined
            ? options.durationMs
            : isChildReward
                ? CHILD_REWARD_DURATION_MS
                : INFANT_TODDLER_REWARD_DURATION_MS;
    
    const LOOPS =
        options.loops !== undefined
            ? options.loops
            : isChildReward ? 1 : 2;
    
    const LOOP_DURATION =
        totalDuration / LOOPS;

    const animate = (now) => {
        const elapsed = now - startTime;
    
        if (elapsed >= totalDuration) {
            animEl.style.display = 'none';
            rewardAnimTimer = null;
        
            if (_currentAnimAudio) {
                try {
                    _currentAnimAudio.pause();
                    _currentAnimAudio.currentTime = 0;
                } catch (e) {}
        
                _currentAnimAudio = null;
            }
        
            return;
        }
    
        const loopTime = elapsed % LOOP_DURATION;
        const loopProgress = loopTime / LOOP_DURATION;
    
        const eased =
            loopProgress < 0.5
                ? 2 * loopProgress * loopProgress
                : 1 - Math.pow(-2 * loopProgress + 2, 2) / 2;
    
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(eased * frameCount)
        );
    
        animEl.style.backgroundImage =
            `url('../graphics/frames/${name}-${String(frameIndex + 1).padStart(2, '0')}.png')`;
    
        rewardAnimTimer = requestAnimationFrame(animate);
    };
    rewardAnimTimer = requestAnimationFrame(animate);
}

/** One short animation in the middle of the screen (end of a Child/Adult block). Silent for adults. */
function playBlockEndAnimation(durationMs) {
    const size = 220; // matches the #rewardAnimation box
    const centre = {
        getBoundingClientRect: () => ({
            left: (window.innerWidth - size) / 2,
            top: (window.innerHeight - size) / 2
        })
    };
    playRewardAnimation(centre, {
        durationMs,
        loops: 1,
        silent: appState.ageGroup === 'Adult'
    });
}

function stopRewardAnimation() {
    if (rewardAnimTimer) { cancelAnimationFrame(rewardAnimTimer); }
    rewardAnimTimer = null;
    const animEl = document.getElementById('rewardAnimation');
    if (animEl) animEl.style.display = 'none';
}
