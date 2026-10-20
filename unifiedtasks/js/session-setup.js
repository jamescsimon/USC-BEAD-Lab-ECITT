/**
 * Counterbalance, age selection, start and restart
 * (split from app.js; load order is set in index.html)
 */

// The age buttons stay locked, with a short message, while the pictures are being decoded.
function onImageDecodeProgress(done, total) {
    const status = document.getElementById('loadStatus');
    if (status) status.textContent = `Loading animations... ${Math.round((100 * done) / total)}%`;
}

function setAgeButtonsEnabled(enabled) {
    ['infantBtn', 'childBtn', 'adultBtn'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.disabled = !enabled;
    });
    const status = document.getElementById('loadStatus');
    if (status) status.textContent = enabled ? '' : 'Loading animations...';
}

function updateCbButtons() {
    if (elements.cbLeftBtn) elements.cbLeftBtn.classList.toggle('selected', appState.counterbalance === 'left');
    if (elements.cbRightBtn) elements.cbRightBtn.classList.toggle('selected', appState.counterbalance === 'right');
}

function setCounterbalance(side) {
    appState.counterbalance = side;
    activeTaskSequence = buildInitialSequence(appState.ageGroup, side);
    console.log(`[APP] Counterbalance manually set: ${side}-first`);
    updateCbButtons();
}

function selectAgeGroup(ageGroup) {
    appState.ageGroup = ageGroup;
    appState.counterbalance = Math.random() < 0.5 ? 'left' : 'right';
    activeTaskSequence = buildInitialSequence(ageGroup, appState.counterbalance);
    console.log(`[APP] ${ageGroup} counterbalance: ${appState.counterbalance}-first`);
    startRecording();
    showScreen('participantScreen');
    updateCbButtons();
}

function selectAdult() { selectAgeGroup('Adult'); }
function selectChild() { selectAgeGroup('Child'); }
// "Infant" is the merged infant/toddler bracket.
function selectInfant() { selectAgeGroup('Infant'); }

function startTest() {
    // Prevent double-start by early-returning if start is already disabled
    if (!elements.startBtn) return;
    if (elements.startBtn.disabled) {
        console.warn('[APP] startTest called but startBtn already disabled; ignoring duplicate call');
        return;
    }

    const participantId = elements.participantIdInput.value.trim();
    if (!participantId) {
        alert('Please enter a Participant ID');
        return;
    }
    
    // Disable start button to avoid double starts
    elements.startBtn.disabled = true;
    elements.startBtn.classList && elements.startBtn.classList.add('disabled');

    const recoverBtn =
    document.getElementById('recoverBackupButton');

    if (recoverBtn) {
        recoverBtn.remove();
    }

    removeCsvDownloadLinks();

    appState.participantId = participantId;
    dataManager.startSession(
        participantId,
        appState.ageGroup,
        appState.counterbalance
    );

    appState.currentTaskIndex = 0;
    appState.experimentBlockCount = 0;
    appState.inhibitoryCompleted = 0;
    appState.experimentTrialsDone = 0;
    appState.experimentFirstCorrect = 0;
    appState.directionReversed = false;
    appState.syncTrainDone = {};
    if (elements.recordingReminderContinueBtn) {
        elements.recordingReminderContinueBtn.disabled = false;
    }
    showScreen('recordingReminderScreen');
}

function restart() {
    // Reset state
    removeCsvDownloadLinks();
    
    appState.participantId = '';
    appState.currentTaskIndex = 0;
    appState.currentTask = null;
    appState.currentTrial = 0;
    appState.trialSequence = [];
    appState.totalCorrect = 0;
    appState.totalTrials = 0;
    appState.totalReactionTime = 0;
    appState.isDNF = false;
    appState.isComplete = false;
    appState.ageGroup = 'Adult';
    appState.blockReactionTime = 0;
    appState.blockTrials = 0;
    appState.experimentBlockCount = 0;
    appState.inhibitoryCompleted = 0;
    appState.experimentTrialsDone = 0;
    appState.experimentFirstCorrect = 0;
    appState.directionReversed = false;
    appState.jitterDuration = 0;
    appState.jitterPool = [];
    appState.isTransitioning = false;
    activeTaskSequence = null;
    
    dataManager.clearSession();
    cleanupRecording();

    elements.participantIdInput.value = '';
    // Re-enable start button and reminder button
    if (elements.startBtn) {
        elements.startBtn.disabled = false;
        elements.startBtn.classList && elements.startBtn.classList.remove('disabled');
    }
    if (elements.recordingReminderContinueBtn) {
        elements.recordingReminderContinueBtn.disabled = false;
    }
    showScreen('ageSelectionScreen');
}
