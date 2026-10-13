/**
 * Counterbalance, age selection, start and restart
 * (split from app.js; load order is set in index.html)
 */

function updateCbButtons() {
    if (elements.cbLeftBtn) elements.cbLeftBtn.classList.toggle('selected', appState.counterbalance === 'left');
    if (elements.cbRightBtn) elements.cbRightBtn.classList.toggle('selected', appState.counterbalance === 'right');
}

function setCounterbalance(side) {
    appState.counterbalance = side;
    const seqs = {
        Adult:   { left: TASK_SEQUENCE_LEFT,        right: TASK_SEQUENCE_RIGHT },
        Child:   { left: CHILD_TASK_SEQUENCE_LEFT,   right: CHILD_TASK_SEQUENCE_RIGHT },
        Toddler: { left: TODDLER_TASK_SEQUENCE_LEFT, right: TODDLER_TASK_SEQUENCE_RIGHT },
        Infant:  { left: INFANT_TASK_SEQUENCE_LEFT,  right: INFANT_TASK_SEQUENCE_RIGHT },
    };
    const pair = seqs[appState.ageGroup];
    if (pair) activeTaskSequence = pair[side];
    console.log(`[APP] Counterbalance manually set: ${side}-first`);
    updateCbButtons();
}

function selectAdult() {
    appState.ageGroup = 'Adult';
    appState.counterbalance = Math.random() < 0.5 ? 'left' : 'right';
    activeTaskSequence = appState.counterbalance === 'left' ? TASK_SEQUENCE_LEFT : TASK_SEQUENCE_RIGHT;
    console.log(`[APP] Adult counterbalance: ${appState.counterbalance}-first`);
    startRecording();
    showScreen('participantScreen');
    updateCbButtons();
}

function selectChild() {
    appState.ageGroup = 'Child';
    appState.counterbalance = Math.random() < 0.5 ? 'left' : 'right';
    activeTaskSequence = appState.counterbalance === 'left' ? CHILD_TASK_SEQUENCE_LEFT : CHILD_TASK_SEQUENCE_RIGHT;
    console.log(`[APP] Child counterbalance: ${appState.counterbalance}-first`);
    startRecording();
    showScreen('participantScreen');
    updateCbButtons();
}

function selectToddler() {
    appState.ageGroup = 'Toddler';
    appState.counterbalance = Math.random() < 0.5 ? 'left' : 'right';
    activeTaskSequence = appState.counterbalance === 'left' ? TODDLER_TASK_SEQUENCE_LEFT : TODDLER_TASK_SEQUENCE_RIGHT;
    console.log(`[APP] Toddler counterbalance: ${appState.counterbalance}-first`);
    startRecording();
    showScreen('participantScreen');
    updateCbButtons();
}

function selectInfant() {
    appState.ageGroup = 'Infant';
    appState.counterbalance = Math.random() < 0.5 ? 'left' : 'right';
    activeTaskSequence = appState.counterbalance === 'left' ? INFANT_TASK_SEQUENCE_LEFT : INFANT_TASK_SEQUENCE_RIGHT;
    console.log(`[APP] Infant counterbalance: ${appState.counterbalance}-first`);
    startRecording();
    showScreen('participantScreen');
    updateCbButtons();
}

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
