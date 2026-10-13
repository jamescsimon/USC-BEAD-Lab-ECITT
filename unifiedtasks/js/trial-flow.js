/**
 * Ready/wait/prompt screens, response handling, finish, DNF
 * (split from app.js; load order is set in index.html)
 */

// ===== TRIAL FLOW =====

/**
 * Shows the ready screen for the current trial and fires its photocell flash.
 * With { deferFlash: true } the screen is drawn but the flash is NOT fired; the function that
 * fires it is returned instead (used to load a task behind the photocell sync overlay).
 */
function showReadyScreen(options) {
    const config = appState.currentTask;
    const trial = appState.trialSequence[appState.currentTrial] || {};

    // Only show messages on first trial of each task/block.
    if (appState.currentTrial === 0) {
        elements.readyMsg1.textContent =
            config.readyMsg1 || '';

        elements.readyMsg2.textContent =
            config.readyMsg2 || '';

        elements.readyMsg3.textContent =
            config.readyMsg3 || '';
    } else {
        elements.readyMsg1.textContent = '';
        elements.readyMsg2.textContent = '';
        elements.readyMsg3.textContent = '';
    }

    showScreen('readyScreen');

    const fireFlash = () => flashButtonIndicator({
        section: 'ReadyScreen',
        stimuli: 'red dot',
        invokedBy: 'ParticipantBlueButton',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: appState.currentTask.trials - appState.currentTrial,
        trialName: appState.currentTask.id || 'adt_ppl'
    });

    if (options && options.deferFlash) return fireFlash;
    fireFlash();
}

function handleDotPress(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (appState.isTransitioning) return;

    appState.dotPressTime = Date.now();

    // Temporarily remove random adult Jitter 1.
    // Adult button screen appears immediately after red-dot press.
    if (
        appState.ageGroup === 'Adult' &&
        USE_RANDOM_ADULT_JITTER1 === false
    ) {
        appState.jitterDuration =
            ADULT_FIXED_JITTER1_MS;
    
        dataManager.logEvent({
            section: 'WaitScreen',
            stimuli: `adult_jitter1_disabled_${ADULT_FIXED_JITTER1_MS}ms`,
            invokedBy: 'ParticipantRedDot',
            accuracy: 'n/a',
            testName: appState.ageGroup,
            trialsRemaining: appState.currentTask.trials - appState.currentTrial,
            trialName: appState.currentTask.id || 'adt_ppl',
            trialNumber: appState.currentTrial + 1
        });
    
        showPromptScreen();
        return;
    }
    
    // Non-adult versions keep the regular jitter/wait screen.
    showWaitScreen();
}

function showWaitScreen() {
    const duration = appState.jitterPool.shift();
    appState.jitterDuration = duration;
    dataManager.logEvent({
        section: 'WaitScreen',
        stimuli: `jitter_${duration}ms`,
        invokedBy: 'ParticipantRedDot',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: appState.currentTask.trials - appState.currentTrial,
        trialName: appState.currentTask.id || 'adt_ppl',
        trialNumber: appState.currentTrial + 1
    });
    showScreen('waitScreen');
    clearTimeout(appState.waitTimer);

    appState.waitTimer = setTimeout(() => {
        showPromptScreen();
    }, duration);
}

function showPromptScreen() {
    stopRewardAnimation();
    appState.trialStartTime = Date.now();
    const config = appState.currentTask;
    const trial = appState.trialSequence[appState.currentTrial];
    
    // Determine which button gets the happy face
    const empPos = trial && trial.emp ? trial.emp : (config && config.emp ? config.emp : 'mdl');
    const rewPos = trial && trial.rew ? trial.rew : (config && config.rew ? config.rew : 'mdl');
    const layout = config && config.promptLayout ? config.promptLayout : { left: 'empty', mdl: 'dot', right: 'empty' };
    
    // Hide all buttons first
    if (elements.leftButton) elements.leftButton.style.display = 'none';
    if (elements.mdlButton) elements.mdlButton.style.display = 'none';
    if (elements.rightButton) elements.rightButton.style.display = 'none';
    
    // Adult ECITT-A: red dot remains visible at the center at all times.
    // Child/infant/toddler keep the dot hidden during prompt as before.
    if (elements.promptDot) {
        elements.promptDot.style.display =
            appState.ageGroup === 'Adult'
                ? 'inline-block'
                : 'none';
    }
    
    // Show and configure buttons based on layout
    const showButton = (pos, buttonEl) => {
        if (buttonEl && layout[pos] === 'button') {
            buttonEl.style.display = 'block';
            buttonEl.style.backgroundImage = 
                empPos === pos ? `url('../graphics/buttons/button_${pos}_happy.png')` : `url('../graphics/buttons/button_${pos}.png')`;
        }
    };
    
    showButton('left', elements.leftButton);
    showButton('mdl', elements.mdlButton);
    showButton('right', elements.rightButton);
    
    // Store rewarded position for accuracy check
    appState.currentRewarded = rewPos;
    appState.currentEmpPos = empPos;
    appState.currentTrialNumber = appState.currentTrial + 1;
    appState.trialTaps = []; // every tap of this trial, for first-response accuracy and incorrect-tap counts

    // Determine section label from actual face position, not trial type
    let trialSection = 'PromptScreen';
    if (trial && trial.type === 'standard') {
        trialSection = 'ControlTrialScreen';
    } else if (empPos === 'left') {
        trialSection = 'LeftTrialScreen';
    } else if (empPos === 'right') {
        trialSection = 'RightTrialScreen';
    }

    showScreen('promptScreen');
    flashButtonIndicator({
        section: trialSection,
        stimuli: 'red dot, blue buttons',
        invokedBy: 'ParticipantRedDot',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: appState.currentTask.trials - appState.currentTrial,
        trialName: appState.currentTask.id || 'adt_ppl'
    });
}

function handleButtonPress(button, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (appState.isTransitioning) return;

    const nowPressTime = Date.now();

    const isDuplicatePress =
        appState.lastButtonPressKey === button &&
        nowPressTime - appState.lastButtonPressTime < 400;

    if (isDuplicatePress) {
        showAudioDebug(`[APP] Ignored duplicate button press: ${button}`);
        return;
    }

    appState.lastButtonPressKey = button;
    appState.lastButtonPressTime = nowPressTime;

    const reactionTime = Date.now() - appState.trialStartTime;
    const pressTimestamp = new Date();

    const accuracy = button === appState.currentRewarded ? 1 : 0;
    appState.trialTaps.push({ button, correct: accuracy === 1, rt: Math.round(reactionTime) });
    const j2Range =
    appState.ageGroup === 'Child'
        ? JITTER2_CHILD_ANIM_RANGE
        : appState.ageGroup === 'Infant'
            ? JITTER2_ANIM_RANGE
            : JITTER2_RANGE;
    const j2Delay = Math.round(Math.random() * (j2Range[1] - j2Range[0]) + j2Range[0]);

    const completedIndex = appState.currentTrial;
    const completedTrial = appState.trialSequence[completedIndex];
    const completedBlock = appState.currentTaskIndex + 1;
    const trialTypeLabel =
    completedTrial?.type === 'prpt'
        ? 'Prepotent'
        : completedTrial?.type === 'inhb'
            ? 'Inhibitory'
            : 'Control';

    // ===============================
    // INFANT CORRECTION LOGIC
    // ===============================
    if (
        appState.currentTask.allowCorrection &&
        button !== appState.currentRewarded
    ) {
        flashButtonIndicator({
            section: 'RawResponse',
            stimuli: `button_${button}`,
            invokedBy: 'IncorrectPress',
            rewardedSide: appState.currentRewarded,
            happyFaceSide: appState.currentEmpPos,  
            jitter1: appState.jitterDuration,
            accuracy: 0,
            testName: appState.ageGroup,
            trialsRemaining: appState.currentTask.trials - appState.currentTrial,
            trialName: appState.currentTask.id,
            RT: reactionTime,
            trialType: trialTypeLabel,
            buttonPressed: button,
            EventType: 'Incorrect'
        });
        console.log('[APP] Infant incorrect press - no trial advance');

        // DO NOT advance trial
        return;
    }
    
    
    // Update stats
    appState.totalTrials++;
    if (accuracy === 1) {
        appState.totalCorrect++;
    }
    appState.totalReactionTime += reactionTime;
    if (appState.currentTask.isExperimentBlock) {
        // Block mean RT (shown to Child/Adult at block end) uses correct responses only
        if (accuracy === 1) {
            appState.blockReactionTime += reactionTime;
            appState.blockTrials++;
        }
    }
    
    // Log response — section label from actual face position, not trial type

    const trialCondition =
        completedTrial?.type === 'prpt'
            ? 'prepotent'
            : completedTrial?.type === 'inhb'
                ? 'inhibitory'
                : 'standard';
    
    const completedEmpPos = completedTrial && completedTrial.emp
        ? completedTrial.emp
        : (appState.currentTask.emp || 'mdl');
    let responseSection = 'PromptResponse';
    if (completedTrial && completedTrial.type === 'standard') {
        responseSection = 'ControlTrialResponse';
    } else if (completedEmpPos === 'left') {
        responseSection = 'LeftTrialResponse';
    } else if (completedEmpPos === 'right') {
        responseSection = 'RightTrialResponse';
    }
    if (
        appState.currentTask.allowCorrection &&
        accuracy === 1
    ) {
        dataManager.logEvent({
            section: 'RawResponse',
            stimuli: `button_${button}`,
            invokedBy: 'CorrectPress',
            rewardedSide: appState.currentRewarded,
            happyFaceSide: appState.currentEmpPos,
            jitter1: appState.jitterDuration,
            accuracy: accuracy,
            testName: appState.ageGroup,
            trialsRemaining: appState.currentTask.trials - appState.currentTrial,
            trialName: appState.currentTask.id,
            RT: reactionTime,
            trialType: trialTypeLabel,
            buttonPressed: button,
            EventType: 'Correct'
        });
    }
    const firstIncorrectRTForTrial =
    dataManager.currentTrial?.firstIncorrectRT || '';

    const pressSequenceForTrial =
    dataManager.currentTrial?.pressSequence?.join('|') ||
    `${button}@${Math.round(reactionTime)}`;

    // The response row is locked to a photocell flash so its EEG time is exact, not interpolated.
    flashButtonIndicator({
        section: responseSection,
        blockNumber: completedBlock,
        trialNumber: completedIndex + 1,
    
        stimuli: 'red dot, blue buttons',
        invokedBy: 'ParticipantRedDot',
    
        testName: appState.ageGroup,
        taskId: appState.currentTask.id,
        trialName: appState.currentTask.id,
        trialType: trialTypeLabel,
    
        rewardedSide: appState.currentRewarded,
        happyFaceSide: appState.currentEmpPos,
        buttonPressed: button,
    
        jitter1: appState.jitterDuration,
        jitter2: j2Delay,
    
        accuracy: accuracy,
        RT: reactionTime,
    
        trialsRemaining: appState.currentTask.trials - (completedIndex + 1),
    });
    // Per-trial summary from every tap of this trial (wrong taps included)
    const taps = appState.trialTaps;
    const firstResponseCorrect = taps.length > 0 && taps[0].correct ? 1 : 0;
    const incorrectTaps = taps.filter(t => !t.correct).length;
    const isExperiment = !!appState.currentTask.isExperimentBlock;
    const phase = isExperiment ? 'experiment' : appState.currentTask.isPractice ? 'practice' : 'demo';

    if (isExperiment) {
        appState.experimentTrialsDone++;
        appState.experimentFirstCorrect += firstResponseCorrect;
        // Progress toward the 32-trial inhibitory target. A first tap on the wrong side does not count.
        // This is only a proxy: true validity is decided later from the EEG.
        if (completedTrial?.type === 'inhb' && firstResponseCorrect === 1) {
            appState.inhibitoryCompleted++;
        }
    }

    dataManager.logTrial({
        participantId: appState.participantId,
        ageGroup: appState.ageGroup,
        counterbalance: appState.counterbalance,
    
        blockNumber: completedBlock,
        taskId: appState.currentTask.id,
        trialNumber: completedIndex + 1,
        trialType: trialTypeLabel,
    
        rewardedSide: appState.currentRewarded,
        happyFaceSide: appState.currentEmpPos,
    
        buttonPressed: button,
        firstResponseCorrect,
        incorrectTaps,
        reactionTime: Math.round(reactionTime),
    
        phase,
        direction: appState.counterbalance,
    
        jitter1: appState.jitterDuration,
        jitter2: j2Delay,
    
        firstIncorrectRT: firstIncorrectRTForTrial,
        pressSequence: pressSequenceForTrial,

        inhibitoryCompletedSoFar: appState.inhibitoryCompleted,
        lowEngagement: isExperiment
            ? (isLowEngagement(appState.experimentTrialsDone, appState.experimentFirstCorrect) ? 1 : 0)
            : ''
    });

    console.log(`[APP] Trial ${completedIndex + 1}: button=${button}, rewarded=${appState.currentRewarded}, accuracy=${accuracy}, RT=${reactionTime}ms`);

    // Adult ECITT-A: after any response, blue buttons disappear immediately,
    // but the red dot stays visible so the participant can re-center.
    if (appState.ageGroup === 'Adult') {
        if (elements.leftButton) elements.leftButton.style.display = 'none';
        if (elements.mdlButton) elements.mdlButton.style.display = 'none';
        if (elements.rightButton) elements.rightButton.style.display = 'none';

        if (elements.promptDot) {
            elements.promptDot.style.display = 'inline-block';
        }
    }

    // Reward animation after correct responses: Infant only. Child and Adult get one short
    // animation at the end of each block instead (see showBlockEndAfterAnimation).
    if (accuracy === 1 && appState.ageGroup === 'Infant') {
        const pressedEl = button === 'left' ? elements.leftButton :
                          button === 'right' ? elements.rightButton :
                          button === 'mdl' ? elements.mdlButton : null;
        playRewardAnimation(pressedEl);
    }

    // Move to next trial or task
    if (!appState.currentTask.allowCorrection || accuracy === 1) {
        appState.currentTrial++;
    }

    const skipReadyBetweenTrials =
    SKIP_READY_SCREEN[appState.ageGroup] === true;

    if (appState.currentTrial < appState.currentTask.trials) {

        const nextScreen =
            skipReadyBetweenTrials
                ? showPromptScreen
                : showReadyScreen;

        clearTimeout(appState.nextTrialTimer);

        appState.nextTrialTimer = setTimeout(() => {
            nextScreen();
        }, j2Delay);

    } else {
        clearTimeout(appState.nextTrialTimer);

        appState.nextTrialTimer = setTimeout(() => {
            finishTask();
        }, j2Delay);
    }
        // Removed extra logging for PromptScreen
        // console.log(`[APP] Trial ${completedIndex + 1}: button=${button}, rewarded=${appState.currentRewarded}, accuracy=${accuracy}, RT=${reactionTime}ms`);
}

function handlePromptDotPress(event) {
    // Red dot in PromptScreen is NOT clickable
    // User MUST press a button to complete the trial
    event.preventDefault();
    console.log('[APP] Dot press ignored - must press a button instead');
}

function finishTask() {
    const finished = appState.currentTask;
    console.log(`[APP] Task complete: ${finished.name}`);

    appState.currentTaskIndex++;
    appState.isTransitioning = true;

    if (appState.currentTaskIndex < activeTaskSequence.length) {
        // Demo -> practice and other fixed pre-test steps
        setTimeout(() => loadTask(activeTaskSequence[appState.currentTaskIndex]), 100);
    } else if (finished.isPractice) {
        setTimeout(() => showPracticeChoice(), 500);
    } else if (finished.isExperimentBlock) {
        setTimeout(() => showBlockEndAfterAnimation(), 500);
    } else {
        finishTest();
    }
}

function photocellCheckHtml() {
    const c = dataManager.getFlashCheck();
    return c.missing === 0
        ? `<p>Photocell check: OK (${c.flashedRows} flashes for ${c.requiredRows} rows)</p>`
        : `<p><strong>Photocell check: ${c.missing} of ${c.requiredRows} rows had no flash (${c.conflicts} flash conflicts).</strong></p>`;
}

function finishTest() {
    console.log('[APP] All tasks complete');
    appState.isComplete = true;

    // No session end event
    
    // Calculate final stats
    const avgRT = appState.totalTrials > 0 ? Math.round(appState.totalReactionTime / appState.totalTrials) : 0;
    const accuracy = appState.totalTrials > 0 ? ((appState.totalCorrect / appState.totalTrials) * 100).toFixed(1) : 0;
    
    // Display stats
    elements.endStats.innerHTML = `
        ${photocellCheckHtml()}
        <p>Test Battery Complete!</p>
        <p>Total Trials: ${appState.totalTrials}</p>
        <p>Correct: ${appState.totalCorrect}</p>
        <p>Accuracy: ${accuracy}%</p>
        <p>Average Reaction Time: ${avgRT} ms</p>
    `;

    stopRecording();
    showScreen('endScreen');

    // iPad-safe CSV links appear immediately at the end.
    showCsvDownloadLinks();
}

function handleDNF() {
    if (appState.isDNF || appState.isComplete) return;
    
    appState.isDNF = true;
    console.log('[APP] Handling DNF');
    
    // Calculate total expected trials from the active sequence
    const totalExpected = activeTaskSequence.reduce((sum, id) => sum + TASK_CONFIGS[id].trials, 0);
    
    // Mark as DNF
    dataManager.markDNF(appState.totalTrials + 1, totalExpected);
    
    // Calculate stats for completed trials
    const avgRT = appState.totalTrials > 0 ? Math.round(appState.totalReactionTime / appState.totalTrials) : 0;
    const accuracy = appState.totalTrials > 0 ? ((appState.totalCorrect / appState.totalTrials) * 100).toFixed(1) : 0;
    
    // Display stats
    elements.dnfStats.innerHTML = `
        ${photocellCheckHtml()}
        <p>Session Did Not Finish</p>
        <p>Completed Trials: ${appState.totalTrials} / ${totalExpected}</p>
        <p>Correct: ${appState.totalCorrect}</p>
        <p>Accuracy: ${accuracy}%</p>
        <p>Average Reaction Time: ${avgRT} ms</p>
    `;
    
    showScreen('dnfScreen');
    // Show CSV links immediately on DNF.
    showCsvDownloadLinks();
    
    stopAndAutoDownload();
}

// Top-left tiny hidden button:
    //hold 3 sec → DNF / quit early

    //Top-right tiny hidden button:
        //hold 3 sec → play NIRS baseline video
               //→ log NIRSBaselineStart
               //→ log NIRSBaselineEnd
               //→ resume sequence
        //Baseline video cannot corrupt a trial by starting a video during promptScreen or waitScreen
