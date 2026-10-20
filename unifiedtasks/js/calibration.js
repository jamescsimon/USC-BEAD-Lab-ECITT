/**
 * Pre-task frog calibration and butterfly break
 * (split from app.js; load order is set in index.html)
 */

// ===== PRE-TASK CALIBRATION + BUTTERFLY SPRITES =====

// Calibration sprite frames:
// ../graphics/sprites/frog-01.png
// ../graphics/sprites/frog-02.png
// ../graphics/sprites/frog-03.png
const CALIBRATION_SPRITE_PREFIX = 'frog';
const CALIBRATION_SPRITE_FRAMES = 3;
const CALIBRATION_SPRITE_SIZE_PX = 220;
const CALIBRATION_SOUND = 'chimes.mp3';
const CALIBRATION_STEP_MS = 2600;

// Butterfly sprite frames:
// ../graphics/sprites/bfly-01.png ... bfly-08.png
const BUTTERFLY_SPRITE_PREFIX = 'bfly';
const BUTTERFLY_SPRITE_FRAMES = 8;
const BUTTERFLY_SIZE_PX = 220;
const BUTTERFLY_SOUND = 'happyTuneSh.mp3';

let butterflyPromptTimers = [];

function showVideoCalibrationTask(onComplete) {
    const existing =
        document.getElementById('videoCalibrationOverlay');

    if (existing) {
        existing.remove();
    }

    const overlay =
        document.createElement('div');

    overlay.id = 'videoCalibrationOverlay';

    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '1000000';
    overlay.style.backgroundColor = '#333';
    overlay.style.border = '8px solid white';
    overlay.style.boxSizing = 'border-box';
    overlay.style.overflow = 'hidden';
    overlay.style.color = 'white';
    overlay.style.fontFamily = 'Arial, sans-serif';

    const message = document.createElement('div');

    message.style.position = 'fixed';
    message.style.left = '50%';
    message.style.top = '24px';
    message.style.transform = 'translateX(-50%)';
    message.style.fontSize = '22px';
    message.style.textAlign = 'center';
    message.style.maxWidth = '85vw';
    message.style.zIndex = '1000002';

    const frog =
        document.createElement('img');

    frog.id = 'videoCalibrationFrog';
    frog.alt = 'Calibration frog';

    frog.style.position = 'fixed';
    frog.style.width = `${CALIBRATION_SPRITE_SIZE_PX}px`;
    frog.style.height = `${CALIBRATION_SPRITE_SIZE_PX}px`;
    frog.style.objectFit = 'contain';
    frog.style.zIndex = '1000001';
    frog.style.transition = 'left 350ms ease, top 350ms ease';
    frog.style.pointerEvents = 'none';
    frog.style.transform = 'translate(-100%, -100%)';

    frog.onerror = () => {
        console.warn('[CALIBRATION] Frog sprite frame not found:', frog.src);
    };

    const startButton =
        document.createElement('button');

    startButton.textContent = 'Tap to start calibration';

    startButton.style.position = 'fixed';
    startButton.style.left = '50%';
    startButton.style.bottom = '40px';
    startButton.style.transform = 'translateX(-50%)';
    startButton.style.zIndex = '1000003';
    startButton.style.fontSize = '24px';
    startButton.style.padding = '16px 24px';
    startButton.style.borderRadius = '12px';
    startButton.style.border = '3px solid white';
    startButton.style.backgroundColor = 'white';
    startButton.style.color = 'black';overlay.appendChild(message);

    overlay.appendChild(message);
    overlay.appendChild(frog);
    overlay.appendChild(startButton);

    document.body.appendChild(overlay);

    const stopFrogLoop =
        startSpriteLoop(
            frog,
            CALIBRATION_SPRITE_PREFIX,
            CALIBRATION_SPRITE_FRAMES,
            6
        );

    // Move to the same general locations as task buttons:
    // middle, left, right, middle.
    const sequence =
        ['mdl', 'left', 'right', 'mdl'];

    let stepIndex = 0;
    let timer = null;
    initCalibrationAudio();

    const runStep = () => {
        if (stepIndex >= sequence.length) {
            message.textContent =
                'Calibration complete.';
        
            clearTimeout(timer);
        
            setTimeout(() => {
                stopFrogLoop();
        
                if (typeof onComplete === 'function') {
                    onComplete();
                }
        
                overlay.remove();
            }, 1000);
        
            return;
        }

        const pos = sequence[stepIndex];

        message.textContent = 'Watch the moving frog.';

        positionCalibrationSprite(frog, pos);

        // The sound plays once, when calibration starts (the first tap). Later frog moves are silent.
        if (stepIndex === 0) {
            playCalibrationAudio();
        }

        stepIndex++;

        timer = setTimeout(runStep, CALIBRATION_STEP_MS);
    };

    startButton.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        event.stopPropagation();

        startButton.style.display = 'none';

        runStep();
    }, { once: true });
}

function positionCalibrationSprite(target, pos) {
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const margin = 20;

    // Get actual button dimensions if available in DOM, falling back to sprite size
    const btnWidth = elements?.leftButton?.offsetWidth || CALIBRATION_SPRITE_SIZE_PX;
    const btnHeight = elements?.leftButton?.offsetHeight || CALIBRATION_SPRITE_SIZE_PX;

    // Reset offsets and center transform
    target.style.transform = 'translate(-50%, -50%)';
    target.style.right = '';
    target.style.bottom = '';

    // Red dot / center location (identical in both orientations)
    if (pos === 'mdl') {
        target.style.left = '50%';
        target.style.top = '50%';
        return;
    }

    if (isLandscape) {
        // Landscape: Left button on left side, Right button on right side (vertically centered)
        target.style.top = '50%';

        if (pos === 'left') {
            target.style.left = `${margin + btnWidth / 2}px`;
            return;
        }

        if (pos === 'right') {
            target.style.left = `calc(100% - ${margin + btnWidth / 2}px)`;
            return;
        }
    } else {
        // Portrait: Left button at top, Right button at bottom (horizontally centered)
        target.style.left = '50%';

        if (pos === 'left') {
            target.style.top = `${margin + btnHeight / 2}px`;
            return;
        }

        if (pos === 'right') {
            target.style.top = `calc(100% - ${margin + btnHeight / 2}px)`;
            return;
        }
    }

    // Safety fallback
    target.style.left = '50%';
    target.style.top = '50%';
}

let calibrationAudioEl = null;

function initCalibrationAudio() {
    if (calibrationAudioEl) {
        return calibrationAudioEl;
    }

    const src = getAudioSrc(CALIBRATION_SOUND);

    calibrationAudioEl = new Audio(src);
    calibrationAudioEl.preload = 'auto';
    calibrationAudioEl.volume = 1;
    calibrationAudioEl.muted = false;
    calibrationAudioEl.load();

    return calibrationAudioEl;
}

function playCalibrationAudio() {
    const audio = initCalibrationAudio();

    try {
        audio.pause();
        audio.currentTime = 0;

        const playPromise = audio.play();

        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(err => {
                console.warn('[CALIBRATION AUDIO] play failed:', err.name, err.message);
            });
        }
    } catch (err) {
        console.warn('[CALIBRATION AUDIO] play error:', err);
    }
}

function showButterflyTask(onComplete) {
    const existing =
        document.getElementById('butterflyTaskOverlay');

    if (existing) {
        existing.remove();
    }

    const overlay =
        document.createElement('div');

    overlay.id = 'butterflyTaskOverlay';

    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '1000000';
    overlay.style.backgroundColor = '#333';
    overlay.style.overflow = 'hidden';
    overlay.style.fontFamily = 'Arial, sans-serif';

    const touchCounter =
        document.createElement('div');

    touchCounter.textContent =
        'Butterfly touches: 0';

    touchCounter.style.position = 'fixed';
    touchCounter.style.left = '12px';
    touchCounter.style.bottom = '12px';
    touchCounter.style.fontSize = '16px';
    touchCounter.style.color = 'white';
    touchCounter.style.zIndex = '1000002';

    const butterfly =
        document.createElement('img');

    butterfly.id = 'butterflyTarget';
    butterfly.alt = 'Butterfly';

    butterfly.style.position = 'fixed';
    butterfly.style.left = '50%';
    butterfly.style.top = `-${BUTTERFLY_SIZE_PX}px`;
    butterfly.style.width = `${BUTTERFLY_SIZE_PX}px`;
    butterfly.style.height = `${BUTTERFLY_SIZE_PX}px`;
    butterfly.style.objectFit = 'contain';
    butterfly.style.transform = 'translate(-50%, -50%)';
    butterfly.style.transition = 'left 450ms ease, top 1200ms ease';
    butterfly.style.zIndex = '1000001';
    butterfly.style.cursor = 'pointer';
    butterfly.style.touchAction = 'none';

    butterfly.onerror = () => {
        console.warn('[BUTTERFLY] Butterfly sprite frame not found:', butterfly.src);
    };

    const continueButton =
        document.createElement('button');

    continueButton.textContent =
        'Continue to main task';

    continueButton.style.position = 'fixed';
    continueButton.style.right = '16px';
    continueButton.style.bottom = '16px';
    continueButton.style.zIndex = '1000003';
    continueButton.style.fontSize = '18px';
    continueButton.style.padding = '12px 16px';
    continueButton.style.borderRadius = '10px';
    continueButton.style.border = '2px solid black';
    continueButton.style.backgroundColor = 'white';
    continueButton.style.color = 'black';
    continueButton.style.display = 'none';

    overlay.appendChild(butterfly);
    overlay.appendChild(touchCounter);
    overlay.appendChild(continueButton);

    document.body.appendChild(overlay);

    const butterflyStartTime =
        Date.now();

    dataManager.logEvent({
        section: 'ButterflyStart',
        stimuli: 'bfly_sprite',
        invokedBy: 'System',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: 'n/a',
        trialName: 'butterfly',
        RT: 0
    });

    const stopButterflyLoop =
        startSpriteLoop(
            butterfly,
            BUTTERFLY_SPRITE_PREFIX,
            BUTTERFLY_SPRITE_FRAMES,
            10
        );

    let touchCount = 0;
    let lastTouchTime = 0;

    // Fly from top to center.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            butterfly.style.top = '50%';
        });
    });

    let butterflyMoveIndex = 0;

    const butterflyTargets = [
        { xPct: 0.15, yPct: 0.20 },
        { xPct: 0.85, yPct: 0.20 },
        { xPct: 0.15, yPct: 0.80 },
        { xPct: 0.85, yPct: 0.80 },
        { xPct: 0.50, yPct: 0.18 },
        { xPct: 0.50, yPct: 0.82 }
    ];
    
    const moveButterfly = () => {
        const margin =
            BUTTERFLY_SIZE_PX / 2 + 20;
    
        const targetPoint =
            butterflyTargets[butterflyMoveIndex % butterflyTargets.length];
    
        butterflyMoveIndex++;
    
        const rawX =
            window.innerWidth * targetPoint.xPct;
    
        const rawY =
            window.innerHeight * targetPoint.yPct;
    
        const x =
            Math.max(
                margin,
                Math.min(window.innerWidth - margin, rawX)
            );
    
        const y =
            Math.max(
                margin,
                Math.min(window.innerHeight - margin, rawY)
            );
    
        butterfly.style.transition =
            'left 650ms ease, top 650ms ease';
    
        butterfly.style.left =
            `${x}px`;
    
        butterfly.style.top =
            `${y}px`;
    };

    butterfly.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const now =
            Date.now();

        if (now - lastTouchTime < 300) {
            return;
        }

        lastTouchTime = now;
        touchCount++;

        const butterflyRT =
            now - butterflyStartTime;

        touchCounter.textContent =
            `Butterfly touches: ${touchCount}`;

        dataManager.logEvent({
            section: 'ButterflyTouch',
            stimuli: `bfly_touch_${touchCount}`,
            invokedBy: 'ParticipantButterflyTouch',
            accuracy: 'n/a',
            testName: appState.ageGroup,
            trialsRemaining: 'n/a',
            trialName: 'butterfly',
            RT: butterflyRT
        });

        dataManager.logTrial({
            participantId: appState.participantId,
            ageGroup: appState.ageGroup,
            counterbalance: appState.counterbalance,

            blockNumber: 0,
            taskId: 'butterfly',
            trialNumber: touchCount,
            trialType: 'ButterflyTouch',

            rewardedSide: 'n/a',
            happyFaceSide: 'bfly',

            buttonPressed: 'butterfly',
            accuracy: 'n/a',
            reactionTime: Math.round(butterflyRT),

            jitter1: 'n/a',
            jitter2: 'n/a',

            firstIncorrectRT: '',
            pressSequence: `butterfly@${Math.round(butterflyRT)}`
        });

        // The sound plays once, on the first touch of the butterfly. Later touches only move it.
        if (touchCount === 1) {
            playOneShotAudio(BUTTERFLY_SOUND, 1);
        }
        moveButterfly();

        continueButton.style.display = 'block';
    });

    continueButton.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const totalButterflyTime =
            Date.now() - butterflyStartTime;

        dataManager.logEvent({
            section: 'ButterflyEnd',
            stimuli: `bfly_touches_${touchCount}`,
            invokedBy: 'ResearcherContinue',
            accuracy: 'n/a',
            testName: appState.ageGroup,
            trialsRemaining: 'n/a',
            trialName: 'butterfly',
            RT: totalButterflyTime
        });

        stopButterflyLoop();

        if (typeof onComplete === 'function') {
            onComplete();
        }
        
        overlay.remove();
    });
}


function continueAfterRecordingReminder() {
    if (elements.recordingReminderContinueBtn) {
        elements.recordingReminderContinueBtn.disabled = true;
    }

    const startMainTask = () => {
        loadTaskWithOptionalSync(activeTaskSequence[0]);
    };

    // Adult has video recording, so adult also gets calibration.
    if (appState.ageGroup === 'Adult') {
        showVideoCalibrationTask(startMainTask);
        return;
    }

    // Child gets calibration before the main task.
    if (appState.ageGroup === 'Child') {
        showVideoCalibrationTask(startMainTask);
        return;
    }

    // Infant/Toddler gets calibration, then butterfly, then main task.
    if (appState.ageGroup === 'Infant') {
        showVideoCalibrationTask(() => {
            showButterflyTask(startMainTask);
        });
        return;
    }

    startMainTask();
}
