/**
 * Hidden operator buttons and hold-to-activate
 * (split from app.js; load order is set in index.html)
 */

function createHiddenOperatorButtons() {
    const quitBtn = document.createElement('button');
    quitBtn.id = 'hiddenQuitEarlyButton';
    quitBtn.setAttribute('aria-label', 'Hold to quit early');
    quitBtn.title = 'Hold 3 seconds to quit early';

    const baselineBtn = document.createElement('button');
    baselineBtn.id = 'hiddenBreakButton';
    baselineBtn.setAttribute('aria-label', 'Hold to take a break');
    baselineBtn.title = 'Hold 3 seconds to take a break';

    styleHiddenOperatorButton(quitBtn, 'left');
    styleHiddenOperatorButton(baselineBtn, 'right');

    setupHoldToActivate(
        quitBtn,
        () => {
            console.log('[APP] Hidden quit button held — triggering DNF');
            handleDNF();
        }
    );

    setupHoldToActivate(
        baselineBtn,
        () => {
            console.log('[APP] Hidden top-right button held — starting a break');
            startBreak();
        }
    );


    document.body.appendChild(quitBtn);
    document.body.appendChild(baselineBtn);
}

function updateBackupRecoveryButton() {
    const existing =
        document.getElementById('recoverBackupButton');

    if (existing) {
        existing.remove();
    }

    // Only show recovery on the home / age-selection page.
    if (appState.currentScreenName !== 'ageSelectionScreen') {
        return;
    }

    if (
        !dataManager ||
        typeof dataManager.getLatestAutosaveKey !== 'function' ||
        !dataManager.getLatestAutosaveKey()
    ) {
        return;
    }

    const btn = document.createElement('button');

    btn.id = 'recoverBackupButton';
    btn.textContent = 'Recover CSV Backup';

    btn.style.position = 'fixed';
    btn.style.left = '50%';
    btn.style.top = '10px';
    btn.style.transform = 'translateX(-50%)';
    btn.style.zIndex = '1000001';
    btn.style.fontSize = '18px';
    btn.style.padding = '12px 18px';
    btn.style.backgroundColor = 'orange';
    btn.style.color = 'black';
    btn.style.border = '2px solid black';
    btn.style.borderRadius = '8px';

    btn.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const restored =
            dataManager.restoreLatestAutosave();

        if (!restored) {
            return;
        }

        elements.endStats.innerHTML = `
            <p>Recovered saved ECITT backup.</p>
            <p>Participant: ${dataManager.participantId}</p>
            <p>Event rows: ${dataManager.sessionData.length}</p>
            <p>Trial rows: ${dataManager.trialData.length}</p>
            <p>Use the CSV links below to save the files.</p>
        `;

        showScreen('endScreen');
        showCsvDownloadLinks('endScreen');
    });

    document.body.appendChild(btn);
}

function styleHiddenOperatorButton(button, side) {
    button.textContent = '';

    button.style.position = 'fixed';
    button.style.top = '0px';

    if (side === 'left') {
        button.style.left = '0px';
    } else {
        button.style.right = '0px';
    }

    button.style.width = '56px';
    button.style.height = '56px';
    button.style.zIndex = '999998';

    button.style.opacity = '0.04';
    button.style.backgroundColor = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '0px';

    button.style.padding = '0';
    button.style.margin = '0';

    button.style.touchAction = 'none';
    button.style.userSelect = 'none';
    button.style.webkitUserSelect = 'none';
}

function setupHoldToActivate(button, onActivate) {
    let holdTimer = null;
    const name = button.id || 'hold';

    const resetHold = () => {
        clearTimeout(holdTimer);
        holdTimer = null;
        button.style.opacity = '0.04';
    };

    const startHold = (event) => {
        event.preventDefault();
        event.stopPropagation();

        clearTimeout(holdTimer);
        button.style.opacity = '0.25';
        debugStep(`hold:${name} touch started`);

        // Activate the moment 3 seconds have passed, while the finger is still down. It used to wait for
        // the finger to lift, but iOS can take a long touch back (pointercancel) and then it never fired,
        // and holding with no visible result looked like nothing happened.
        holdTimer = setTimeout(() => {
            holdTimer = null;
            button.style.opacity = '0.45';
            debugStep(`hold:${name} 3 s reached - activating`);
            onActivate();
        }, HOLD_TO_ACTIVATE_MS);
    };

    const stopHold = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (holdTimer) {
            debugStep(`hold:${name} ended before 3 s (${event ? event.type : 'reset'})`);
        }
        resetHold();
    };

    button.addEventListener('pointerdown', startHold);
    button.addEventListener('pointerup', stopHold);
    button.addEventListener('pointercancel', stopHold);
    button.addEventListener('pointerleave', stopHold);
}

function showAudioDebug(message) {
    console.log(message);

    const box = document.getElementById('audioDebugBox');
    if (box) {
        box.remove();
    }
}
