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
let flashGateOpenAt = 0; // performance.now() time before which a new flash is refused

const PHOTOCELL_FLASH_ON_MS_DEFAULT = 80;
const PHOTOCELL_FLASH_ON_MS_ANCHOR = 120;
// Dark time required between flashes (about 3 frames at 60 Hz). Placeholder: measure on the real
// iPad + GitHub Pages build; the PWA cannot repaint reliably much faster than ~20 ms.
const PHOTOCELL_MIN_OFF_MS = 50;
// If the frame callbacks stop arriving, end the flash this long after it should have ended.
const PHOTOCELL_WATCHDOG_MS = 300;

const PHOTOCELL_FLASH_OFF_COLOR = 'black';
const PHOTOCELL_FLASH_ON_COLOR = 'white';

function isTestBlockTrialName(trialName) {
    return /_(tpl|tpr)$|_exp\d+_(left|right)$/.test(String(trialName || ''));
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

/**
 * Fires one photocell flash and logs `pendingEvent` at the moment it is painted.
 * Returns true if the flash fired.
 *
 * Flash gate: a flash is refused while the previous one is still on, or during the dark period
 * after it (PHOTOCELL_MIN_OFF_MS). A refused request logs a FlashConflict marker (which the
 * MATLAB step skips) and still logs the real row, flagged PhotocellFlash=0, so no data is lost.
 * The row's time is then only interpolated by MATLAB, not locked to a DIN mark.
 */
function flashButtonIndicator(pendingEvent) {
    const indicator = ensurePhotocellIndicatorVisible();

    if (!indicator) {
        if (pendingEvent) {
            dataManager.logEvent(pendingEvent);
        }
        return false;
    }

    if (flashInProgress || performance.now() < flashGateOpenAt) {
        dataManager.logEvent({
            section: 'FlashConflict',
            stimuli: `no_flash_for:${pendingEvent ? pendingEvent.section : 'unknown'}`,
            invokedBy: 'System',
            accuracy: 'n/a',
            testName: pendingEvent ? pendingEvent.testName : '',
            trialsRemaining: pendingEvent ? pendingEvent.trialsRemaining : 'n/a',
            trialName: pendingEvent ? pendingEvent.trialName : ''
        });

        if (pendingEvent) {
            dataManager.logEvent(pendingEvent);
        }

        return false;
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

    // End the flash exactly once. A watchdog also ends it if a frame callback never arrives
    // (busy or throttled page), so one stuck flash can never silence the photocell for good.
    let finished = false;
    const finishFlash = () => {
        if (finished) return;
        finished = true;
        clearTimeout(watchdog);
        indicator.style.backgroundColor = PHOTOCELL_FLASH_OFF_COLOR;
        // Stay dark for a minimum period before the next flash is allowed.
        flashGateOpenAt = performance.now() + PHOTOCELL_MIN_OFF_MS;
        flashInProgress = false;
    };
    const watchdog = setTimeout(finishFlash, flashOnMs + PHOTOCELL_WATCHDOG_MS);

    requestAnimationFrame(() => {
        // DIN-relevant onset
        indicator.style.backgroundColor = PHOTOCELL_FLASH_ON_COLOR;
        if (pendingEvent && /TrialResponse$/.test(pendingEvent.section)) debugStep('flash');

        try {
            if (pendingEvent) {
                dataManager.logEvent({ ...pendingEvent, photocellFlash: true });
            }
        } catch (err) {
            // a logging error must not leave the square stuck white
            console.error('[PHOTOCELL] logging failed during flash:', err);
        }

        setTimeout(() => requestAnimationFrame(finishFlash), flashOnMs);
    });

    return true;
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
    // Do not cut a flash short: only reset the colour when no flash is running
    if (!flashInProgress) {
        indicator.style.backgroundColor = PHOTOCELL_FLASH_OFF_COLOR;
    }

    return indicator;
}

function isTestTaskId(taskId) {
    return /_(tpl|tpr)$|_exp\d+_(left|right)$/.test(String(taskId || ''));
}

/**
 * @param {function} [onBeforeReveal] runs while the black overlay still covers the screen, so the
 *   next screen can be set up underneath and appear the moment the overlay is removed.
 */
function runPhotocellSyncTrain(syncName, onComplete, nPulses = 4, onBeforeReveal) {
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
                if (typeof onBeforeReveal === 'function') {
                    onBeforeReveal();
                }

                overlay.remove();

                // Keep this gap: the first task flash must stay clearly separate from the last sync pulse
                // so the DIN events pair up with the right CSV rows.
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

    // One sync train per session, before the first experiment block (MATLAB fits a single clock
    // offset per session, and fewer interruptions between blocks is better for the task).
    const syncKey = 'before_first_experiment_block';

    if (
        isTestTaskId(taskId) &&
        !appState.syncTrainDone[syncKey]
    ) {
        appState.syncTrainDone[syncKey] = true;

        // Load the task behind the overlay (screen drawn, first flash held back), reveal it,
        // then fire the first flash after the usual gap.
        let fireFirstFlash = null;

        runPhotocellSyncTrain(
            syncKey,
            () => { if (fireFirstFlash) fireFirstFlash(); },
            4,
            () => { fireFirstFlash = loadTask(taskId, { deferFlash: true }); }
        );

        return;
    }

    loadTask(taskId);
}
