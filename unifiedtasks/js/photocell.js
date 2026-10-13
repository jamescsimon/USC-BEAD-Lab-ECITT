/**
 * Photocell flash and sync train
 * (split from app.js; load order is set in index.html)
 */

// ===== PHOTOCELL =====

// Single-frame photocell flash. Fires one DIN8 event per section start.
// Section identity is resolved in post-processing by aligning the CSV telemetry
// timestamps against DIN8 timestamps in the EEG recording.
// Uses requestAnimationFrame so the flash aligns to a monitor vsync boundary
// (~16ms at 60Hz) rather than the unreliable JS event-loop timer.

let flashInProgress = false;

const PHOTOCELL_FLASH_ON_MS_DEFAULT = 80;
const PHOTOCELL_FLASH_ON_MS_ANCHOR = 120;

const PHOTOCELL_FLASH_OFF_COLOR = 'black';
const PHOTOCELL_FLASH_ON_COLOR = 'white';

function isTestBlockTrialName(trialName) {
    return /_(tpl|tpr)$/.test(String(trialName || ''));
}

function isScreenOnsetSection(sectionName) {
    return [
        'ReadyScreen',
        'ControlTrialScreen',
        'LeftTrialScreen',
        'RightTrialScreen'
    ].includes(String(sectionName || ''));
}

function isSyncAnchorCandidate(pendingEvent) {
    if (!pendingEvent) return false;

    return (
        isTestBlockTrialName(pendingEvent.trialName) &&
        isScreenOnsetSection(pendingEvent.section)
    );
}

function flashButtonIndicator(pendingEvent) {
    const indicator = ensurePhotocellIndicatorVisible();

    if (!indicator) {
        if (pendingEvent) {
            dataManager.logEvent(pendingEvent);
        }
        return;
    }

    if (flashInProgress) {
        // Do NOT log the pending event as if it had a clean physical flash.
        // Log only a conflict marker so the CSV tells us this flash was not trustworthy.
        dataManager.logEvent({
            section: 'FlashConflict',
            stimuli: pendingEvent ? pendingEvent.section : 'unknown',
            invokedBy: 'System',
            accuracy: 'n/a',
            testName: pendingEvent ? pendingEvent.testName : '',
            trialsRemaining: pendingEvent ? pendingEvent.trialsRemaining : 'n/a',
            trialName: pendingEvent ? pendingEvent.trialName : ''
        });

        return;
    }

    flashInProgress = true;

    const isAnchor = isSyncAnchorCandidate(pendingEvent);

    const flashOnMs =
        isAnchor
            ? PHOTOCELL_FLASH_ON_MS_ANCHOR
            : PHOTOCELL_FLASH_ON_MS_DEFAULT;

    if (pendingEvent && isAnchor) {
        pendingEvent.stimuli =
            `${pendingEvent.stimuli || pendingEvent.section || ''}|sync_anchor_candidate`;
    }

    requestAnimationFrame(() => {
        // DIN-relevant onset
        indicator.style.backgroundColor = PHOTOCELL_FLASH_ON_COLOR;

        if (pendingEvent) {
            dataManager.logEvent(pendingEvent);
        }

        setTimeout(() => {
            requestAnimationFrame(() => {
                indicator.style.backgroundColor = PHOTOCELL_FLASH_OFF_COLOR;
                flashInProgress = false;
            });
        }, flashOnMs);
    });
}

function ensurePhotocellIndicatorVisible() {
    const indicator = elements.buttonIndicator;

    if (!indicator) {
        console.warn('[PHOTOCELL] buttonIndicator element not found.');
        return null;
    }

    // Keep the photocell square outside screen containers so it cannot be hidden
    // when readyScreen / promptScreen / waitScreen are shown or hidden.
    if (indicator.parentElement !== document.body) {
        document.body.appendChild(indicator);
    }

    indicator.style.position = 'fixed';
    indicator.style.width = '60px';
    indicator.style.height = '60px';

    // Bottom-left corner so it does not block the hidden quit button.
    indicator.style.left = '10px';
    indicator.style.bottom = '10px';
    indicator.style.top = '';
    indicator.style.right = '';

    indicator.style.zIndex = '2147483647';
    indicator.style.pointerEvents = 'none';
    indicator.style.opacity = '1';
    indicator.style.display = 'block';
    indicator.style.transition = 'none';
    indicator.style.backgroundColor = 'black';

    return indicator;
}

function isTestTaskId(taskId) {
    return /_(tpl|tpr)$/.test(String(taskId || ''));
}

function runPhotocellSyncTrain(syncName, onComplete, nPulses = 4) {
    const overlay = document.createElement('div');

    overlay.id = 'photocellSyncOverlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '2147483646';
    overlay.style.backgroundColor = 'black';
    overlay.style.color = 'white';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.fontSize = '28px';
    overlay.textContent = 'Photocell sync...';

    document.body.appendChild(overlay);

    let pulse = 0;

    const runPulse = () => {
        pulse++;

        flashButtonIndicator({
            section: 'SyncTrainFlash',
            stimuli: `${syncName}_pulse_${pulse}_of_${nPulses}`,
            invokedBy: 'System',
            accuracy: 'n/a',
            testName: appState.ageGroup,
            trialsRemaining: 'n/a',
            trialName: `${syncName}_pulse_${pulse}`
        });

        if (pulse < nPulses) {
            setTimeout(runPulse, 500);
        } else {
            setTimeout(() => {
                overlay.remove();

                setTimeout(() => {
                    if (typeof onComplete === 'function') {
                        onComplete();
                    }
                }, 1000);
            }, 700);
        }
    };

    setTimeout(runPulse, 500);
}

function loadTaskWithOptionalSync(taskId) {
    appState.syncTrainDone = appState.syncTrainDone || {};

    const syncKey =
        `pre_${appState.currentTaskIndex}_${taskId}`;

    if (
        isTestTaskId(taskId) &&
        !appState.syncTrainDone[syncKey]
    ) {
        appState.syncTrainDone[syncKey] = true;

        runPhotocellSyncTrain(syncKey, () => {
            loadTask(taskId);
        });

        return;
    }

    loadTask(taskId);
}
