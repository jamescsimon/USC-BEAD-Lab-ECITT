/**
 * fNIRS baseline video: constants and playback
 * (split from app.js; load order is set in index.html)
 */

// ===== HIDDEN OPERATOR BUTTONS + BASELINE VIDEO =====

const HOLD_TO_ACTIVATE_MS = 3000;
const NIRS_BASELINE_DURATION_MS = 18000;

const NIRS_BASELINE_VIDEOS = [
    '../public/video/nirs/bl1Hor.mp4',
    '../public/video/nirs/bl2Hor.mp4',
    '../public/video/nirs/bl3Hor.mp4',
    '../public/video/nirs/bl4Hor.mp4',
    '../public/video/nirs/bl5Hor.mp4',
    '../public/video/nirs/bl6Hor.mp4',
    '../public/video/nirs/bl7Hor.mp4',
    '../public/video/nirs/bl8Hor.mp4',
];

const NIRS_BASELINE_AUDIOS = [
    '../public/audio/nirs/bl1Hor.mp3',
    '../public/audio/nirs/bl2Hor.mp3',
    '../public/audio/nirs/bl3Hor.mp3',
    '../public/audio/nirs/bl4Hor.mp3',
    '../public/audio/nirs/bl5Hor.mp3',
    '../public/audio/nirs/bl6Hor.mp3',
    '../public/audio/nirs/bl7Hor.mp3',
    '../public/audio/nirs/bl8Hor.mp3',
];

let baselineVideoIndex = 0;
let baselineVideoActive = false;
let baselineAudio = null;

function startNirsBaselineFromHiddenButton() {
    if (baselineVideoActive) {
        console.warn('[BASELINE] Baseline already active');
        return;
    }

    if (appState.isDNF || appState.isComplete) {
        console.warn('[BASELINE] Cannot start baseline after DNF or completion');
        return;
    }

    if (!appState.participantId) {
        console.warn('[BASELINE] Cannot start baseline before participant ID is entered');
        return;
    }

    const allowedScreens = [
        'recordingReminderScreen',
        'readyScreen',
        'choiceScreen',
        'promptScreen'
    ];

    if (!allowedScreens.includes(appState.currentScreenName)) {
        console.warn(
            `[BASELINE] Ignored. Current screen "${appState.currentScreenName}" is not a safe baseline screen.`
        );
        return;
    }

    showNirsBaselineStartOverlay(appState.currentScreenName);
}

function showNirsBaselineStartOverlay(resumeScreenName) {
    if (baselineVideoActive) {
        return;
    }

    const existingOverlay =
        document.getElementById('nirsBaselineStartOverlay');

    if (existingOverlay) {
        existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'nirsBaselineStartOverlay';

    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'black';
    overlay.style.zIndex = '1000000';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.color = 'white';
    overlay.style.fontFamily = 'Arial, sans-serif';

    const message = document.createElement('div');
    message.textContent = 'Baseline ready';
    message.style.fontSize = '32px';
    message.style.marginBottom = '24px';

    const startButton = document.createElement('button');
    startButton.textContent = 'Tap to start baseline';

    startButton.style.fontSize = '28px';
    startButton.style.padding = '18px 28px';
    startButton.style.borderRadius = '12px';
    startButton.style.border = '3px solid white';
    startButton.style.backgroundColor = 'white';
    startButton.style.color = 'black';
    startButton.style.touchAction = 'none';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';

    cancelButton.style.fontSize = '18px';
    cancelButton.style.marginTop = '24px';
    cancelButton.style.padding = '10px 18px';
    cancelButton.style.borderRadius = '8px';
    cancelButton.style.border = '1px solid white';
    cancelButton.style.backgroundColor = 'black';
    cancelButton.style.color = 'white';

    let started = false;

    const startBaseline = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (started) return;
        started = true;

        overlay.remove();

        // This call is now inside a direct iPad user tap.
        playNirsBaselineVideo(resumeScreenName);
    };

    startButton.addEventListener('pointerdown', startBaseline, { once: true });

    cancelButton.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        overlay.remove();
    }, { once: true });

    overlay.appendChild(message);
    overlay.appendChild(startButton);
    overlay.appendChild(cancelButton);

    document.body.appendChild(overlay);
}

function playNirsBaselineVideo(resumeScreenName) {
    baselineVideoActive = true;

    clearTimeout(appState.waitTimer);
    clearTimeout(appState.nextTrialTimer);

    const baselineIndex =
    baselineVideoIndex % NIRS_BASELINE_VIDEOS.length;

    const videoPath =
        NIRS_BASELINE_VIDEOS[baselineIndex];

    const audioPath =
        NIRS_BASELINE_AUDIOS[baselineIndex] || '';

    baselineVideoIndex++;

    dataManager.logEvent({
        section: 'NIRSBaselineStart',
        stimuli: audioPath
            ? `${videoPath}|${audioPath}`
            : videoPath,
        invokedBy: 'HiddenBaselineHold',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: appState.currentTask
            ? appState.currentTask.trials - appState.currentTrial
            : 'n/a',
        trialName: appState.currentTask
            ? appState.currentTask.id
            : ''
    });

    const overlay = document.createElement('div');

    overlay.id = 'nirsBaselineOverlay';

    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = '#333';
    overlay.style.zIndex = '999999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    const video = document.createElement('video');

    video.src = videoPath;
    video.autoplay = true;
    
    // Keep the video muted because separate baseline audio is played below.
    video.muted = true;
    
    video.playsInline = true;
    video.setAttribute('playsinline', '');

    video.style.width = '100vw';
    video.style.height = '100vh';
    video.style.objectFit = 'contain';
    video.style.backgroundColor = '#333';
    if (baselineAudio) {
        try {
            baselineAudio.pause();
            baselineAudio.currentTime = 0;
        } catch (e) {}
    
        baselineAudio = null;
    }
    
    if (audioPath) {
        const audioSrc = getAudioSrc(audioPath);
    
        // Use a fresh Audio object each time, like the reward sounds.
        // This avoids iPad AbortError / silent failure from reused media elements.
        baselineAudio = new Audio(audioSrc);
    
        baselineAudio.preload = 'auto';
        baselineAudio.volume = 1;
        baselineAudio.muted = false;
        baselineAudio.currentTime = 0;
    }

    overlay.appendChild(video);
    document.body.appendChild(overlay);

    let baselineDone = false;

    const finishBaseline = () => {
        if (baselineDone) return;

        baselineDone = true;
        baselineVideoActive = false;

        if (baselineAudio) {
            try {
                baselineAudio.pause();
                baselineAudio.currentTime = 0;
            } catch (e) {}
        
            baselineAudio = null;
        }
        if (baselineAudio) {
            try {
                baselineAudio.pause();
                baselineAudio.currentTime = 0;
            } catch (e) {}
        
            baselineAudio = null;
        }

        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }

        dataManager.logEvent({
            section: 'NIRSBaselineEnd',
            stimuli: audioPath
                ? `${videoPath}|${audioPath}`
                : videoPath,
            invokedBy: 'System',
            accuracy: 'n/a',
            testName: appState.ageGroup,
            trialsRemaining: appState.currentTask
                ? appState.currentTask.trials - appState.currentTrial
                : 'n/a',
            trialName: appState.currentTask
                ? appState.currentTask.id
                : ''
        });

        resumeAfterNirsBaseline(resumeScreenName);
    };

    video.addEventListener('ended', finishBaseline, { once: true });

    setTimeout(finishBaseline, NIRS_BASELINE_DURATION_MS);

    let audioPromise = Promise.resolve();

    if (baselineAudio) {
        audioPromise = baselineAudio.play();
    
        if (audioPromise && typeof audioPromise.then === 'function') {
            audioPromise
                .then(() => {
                    showAudioDebug(`[BASELINE] Audio played OK: ${audioPath}`);
                })
                .catch(err => {
                    if (err.name === 'AbortError') {
                        showAudioDebug('[BASELINE] Audio was interrupted/stopped');
                        return;
                    }
    
                    const msg =
                        `Baseline audio failed: ${err.name}: ${err.message}`;
    
                    console.warn('[BASELINE] Audio play failed:', err.name, err.message);
                    showAudioDebug(msg);
                    alert(msg);
                });
        }
    }
    
    const videoPromise = video.play();
    
    if (videoPromise && typeof videoPromise.then === 'function') {
        videoPromise.catch(err => {
            console.warn('[BASELINE] Video play failed:', err);
            finishBaseline();
        });
    }
}

function resumeAfterNirsBaseline(resumeScreenName) {
    if (appState.isDNF || appState.isComplete) {
        return;
    }

    if (resumeScreenName === 'recordingReminderScreen') {
        continueAfterRecordingReminder();
        return;
    }

    if (resumeScreenName === 'readyScreen') {
        showScreen('readyScreen');
        return;
    }

    if (resumeScreenName && elements[resumeScreenName]) {
        showScreen(resumeScreenName);
        return;
    }

    showReadyScreen();
}
