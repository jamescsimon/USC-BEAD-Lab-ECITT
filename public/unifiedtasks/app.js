/**
 * ECITT Adult Tasks - Main Application Logic
 * Single-screen PWA implementation
 */

// ===== TASK CONFIGURATIONS =====

const TASK_CONFIGS = {
    // Control: Bottom (4 trials)
    adt_cb: {
        id: 'adt_cb',
        name: 'Control Bottom',
        emp: 'btm',
        empType: 'happy',
        rew: 'btm',
        trials: 4,
        promptLayout: { top: 'empty', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Put your finger on the red dot. When you see the buttons, press the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Control: Top (4 trials)
    adt_ct: {
        id: 'adt_ct',
        name: 'Control Top',
        emp: 'top',
        empType: 'happy',
        rew: 'top',
        trials: 4,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'empty' },
        readyMsg1: 'Put your finger on the red dot. When you see the buttons, press the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Control: Middle (4 trials)
    adt_cm: {
        id: 'adt_cm',
        name: 'Control Middle',
        emp: 'mdl',
        empType: 'happy',
        rew: 'mdl',
        trials: 4,
        promptLayout: { top: 'empty', mdl: 'button', btm: 'empty' },
        readyMsg1: 'Put your finger on the red dot. When you see the buttons, press the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Practice: Top (4 trials)
    adt_ppt: {
        id: 'adt_ppt',
        name: 'Practice Top',
        emp: 'top',
        empType: 'happy',
        rew: 'top',
        trials: 4,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Great! Now we will do some practice. Press the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Practice: Bottom (4 trials)
    adt_ppb: {
        id: 'adt_ppb',
        name: 'Practice Bottom',
        emp: 'btm',
        empType: 'happy',
        rew: 'btm',
        trials: 4,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Great! Now we will do some practice. Press the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Test: Top (32 trials - 75% top, 25% bottom)
    adt_tpt: {
        id: 'adt_tpt',
        name: 'Test Top',
        varDistr: [75, 25], // [prepotent %, inhibitory %]
        varLeading: 3, // First 3 trials are prepotent
        varMaxDups: 4, // Max 4 prepotent consecutive
        trials: 32,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Excellent! Now for the real test. Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?',
        // Trial variant configs
        variants: {
            prpt: { emp: 'top', empType: 'happy', rew: 'top' },
            inhb: { emp: 'btm', empType: 'happy', rew: 'btm' }
        }
    },
    // Test: Bottom (32 trials - 75% bottom, 25% top)
    adt_tpb: {
        id: 'adt_tpb',
        name: 'Test Bottom',
        varDistr: [75, 25],
        varLeading: 3,
        varMaxDups: 4,
        trials: 32,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Excellent! Now for the real test. Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?',
        variants: {
            prpt: { emp: 'btm', empType: 'happy', rew: 'btm' },
            inhb: { emp: 'top', empType: 'happy', rew: 'top' }
        }
    }
};

// Task execution order
const TASK_SEQUENCE = ['adt_cb', 'adt_ct', 'adt_cm', 'adt_ppt', 'adt_ppb', 'adt_tpt', 'adt_tpb'];

// ===== APPLICATION STATE =====

const appState = {
    participantId: '',
    currentTaskIndex: 0,
    currentTask: null,
    currentTrial: 0,
    trialSequence: [],
    dotPressTime: 0,
    trialStartTime: 0,
    totalCorrect: 0,
    totalTrials: 0,
    totalReactionTime: 0,
    isDNF: false
};

// ===== DOM ELEMENTS =====

let elements = {};

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    console.log('[APP] Initializing ECITT Adult Tasks PWA');
    
    // Cache DOM elements
    elements = {
        ageSelectionScreen: document.getElementById('ageSelectionScreen'),
        participantScreen: document.getElementById('participantScreen'),
        readyScreen: document.getElementById('readyScreen'),
        promptScreen: document.getElementById('promptScreen'),
        endScreen: document.getElementById('endScreen'),
        dnfScreen: document.getElementById('dnfScreen'),
        
        participantIdInput: document.getElementById('participantIdInput'),
        startBtn: document.getElementById('startBtn'),
        
        readyMsg1: document.getElementById('readyMsg1'),
        readyMsg2: document.getElementById('readyMsg2'),
        readyMsg3: document.getElementById('readyMsg3'),
        dotButton: document.getElementById('dotButton'),
        
        topButton: document.getElementById('topButton'),
        mdlButton: document.getElementById('mdlButton'),
        btmButton: document.getElementById('btmButton'),
        promptDot: document.getElementById('promptDot'),
        
        buttonIndicator: document.getElementById('buttonIndicator'),
        
        endStats: document.getElementById('endStats'),
        downloadBtn: document.getElementById('downloadBtn'),
        restartBtn: document.getElementById('restartBtn'),
        
        dnfStats: document.getElementById('dnfStats'),
        dnfDownloadBtn: document.getElementById('dnfDownloadBtn'),
        dnfRestartBtn: document.getElementById('dnfRestartBtn')
    };
    
    // Event listeners
    const adultBtn = document.getElementById('adultBtn');
    if (adultBtn) adultBtn.addEventListener('click', selectAdult);
    
    if (elements.startBtn) elements.startBtn.addEventListener('click', startTest);
    if (elements.dotButton) {
        elements.dotButton.addEventListener('touchstart', handleDotPress);
        elements.dotButton.addEventListener('mousedown', handleDotPress);
    }
    if (elements.topButton) {
        elements.topButton.addEventListener('touchstart', () => handleButtonPress('top'));
        elements.topButton.addEventListener('mousedown', () => handleButtonPress('top'));
    }
    if (elements.mdlButton) {
        elements.mdlButton.addEventListener('touchstart', () => handleButtonPress('mdl'));
        elements.mdlButton.addEventListener('mousedown', () => handleButtonPress('mdl'));
    }
    if (elements.btmButton) {
        elements.btmButton.addEventListener('touchstart', () => handleButtonPress('btm'));
        elements.btmButton.addEventListener('mousedown', () => handleButtonPress('btm'));
    }
    if (elements.downloadBtn) elements.downloadBtn.addEventListener('click', () => dataManager.downloadCSV());
    if (elements.restartBtn) elements.restartBtn.addEventListener('click', restart);
    if (elements.dnfDownloadBtn) elements.dnfDownloadBtn.addEventListener('click', () => dataManager.downloadCSV());
    if (elements.dnfRestartBtn) elements.dnfRestartBtn.addEventListener('click', restart);
    
    // DNF detection - check for inactivity
    let inactivityTimer;
    const INACTIVITY_TIMEOUT = 60000; // 60 seconds
    
    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        if (appState.currentTask && !appState.isDNF) {
            inactivityTimer = setTimeout(() => {
                console.log('[APP] Inactivity detected - marking as DNF');
                handleDNF();
            }, INACTIVITY_TIMEOUT);
        }
    };
    
    document.addEventListener('touchstart', resetInactivityTimer);
    document.addEventListener('mousedown', resetInactivityTimer);
    
    console.log('[APP] Initialization complete');
});

// ===== SCREEN MANAGEMENT =====

function showScreen(screenName) {
    Object.values(elements).forEach(el => {
        if (el && el.classList && el.classList.contains('screen')) {
            el.classList.remove('active');
        }
    });
    elements[screenName].classList.add('active');
    console.log(`[APP] Showing screen: ${screenName}`);
}

function selectAdult() {
    showScreen('participantScreen');
}

function startTest() {
    const participantId = elements.participantIdInput.value.trim();
    if (!participantId) {
        alert('Please enter a Participant ID');
        return;
    }
    
    appState.participantId = participantId;
    dataManager.startSession(participantId);
    
    // Log session start
    dataManager.logEvent({
        section: 'SessionStart',
        stimuli: 'TestBattery',
        invokedBy: 'Participant',
        testName: 'AdultUnified'
    });
    
    // Start first task
    appState.currentTaskIndex = 0;
    loadTask(TASK_SEQUENCE[0]);
}

function restart() {
    // Reset state
    appState.participantId = '';
    appState.currentTaskIndex = 0;
    appState.currentTask = null;
    appState.currentTrial = 0;
    appState.trialSequence = [];
    appState.totalCorrect = 0;
    appState.totalTrials = 0;
    appState.totalReactionTime = 0;
    appState.isDNF = false;
    
    dataManager.clearSession();
    
    elements.participantIdInput.value = '';
    showScreen('ageSelectionScreen');
}

// ===== TASK MANAGEMENT =====

function loadTask(taskId) {
    const config = TASK_CONFIGS[taskId];
    appState.currentTask = config;
    appState.currentTrial = 0;
    
    console.log(`[APP] Loading task: ${config.name} (${config.id})`);
    
    // Generate trial sequence
    if (config.variants) {
        // Test tasks with prepotent/inhibitory variants
        appState.trialSequence = generateTestSequence(config);
    } else {
        // Control/practice tasks - all same
        appState.trialSequence = Array(config.trials).fill({ type: 'standard' });
    }
    
    // Log task start
    dataManager.logEvent({
        section: 'TaskStart',
        stimuli: config.name,
        invokedBy: 'System',
        testName: config.id,
        trialsRemaining: config.trials
    });
    
    // Start first trial
    showReadyScreen();
}

function generateTestSequence(config) {
    const { trials, varDistr, varLeading, varMaxDups } = config;
    const sequence = [];
    
    // Add leading prepotent trials
    for (let i = 0; i < varLeading; i++) {
        sequence.push({ type: 'prpt', ...config.variants.prpt });
    }
    
    // Calculate remaining trials
    const remaining = trials - varLeading;
    const prepotentCount = Math.round(remaining * varDistr[0] / 100);
    const inhibitoryCount = remaining - prepotentCount;
    
    // Create pool of remaining trials
    const pool = [
        ...Array(prepotentCount).fill('prpt'),
        ...Array(inhibitoryCount).fill('inhb')
    ];
    
    // Shuffle with constraints
    let attempts = 0;
    const maxAttempts = 1000;
    let validSequence = false;
    
    while (!validSequence && attempts < maxAttempts) {
        attempts++;
        const shuffled = shuffleArray([...pool]);
        
        // Check constraints
        let consecutive = 1;
        let lastType = shuffled[0];
        let valid = true;
        
        for (let i = 1; i < shuffled.length; i++) {
            if (shuffled[i] === lastType) {
                consecutive++;
                // Check max duplicates
                if ((lastType === 'prpt' && consecutive > varMaxDups) ||
                    (lastType === 'inhb' && consecutive > 1)) {
                    valid = false;
                    break;
                }
            } else {
                consecutive = 1;
                lastType = shuffled[i];
            }
        }
        
        if (valid) {
            // Add to sequence
            shuffled.forEach(type => {
                sequence.push({ type, ...config.variants[type] });
            });
            validSequence = true;
        }
    }
    
    if (!validSequence) {
        console.warn('[APP] Could not generate sequence with all constraints, using random');
        pool.forEach(type => {
            sequence.push({ type, ...config.variants[type] });
        });
    }
    
    console.log(`[APP] Generated sequence for ${config.id}:`, sequence.map(t => t.type));
    return sequence;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ===== TRIAL FLOW =====

function showReadyScreen() {
    const config = appState.currentTask;
    const trial = appState.trialSequence[appState.currentTrial] || {};
    
    // Only show messages on first trial of task, keep dot visible on subsequent trials
    if (appState.currentTrial === 0) {
        // First trial - show instructions
        elements.readyMsg1.textContent = config.readyMsg1;
        elements.readyMsg2.textContent = config.readyMsg2;
        elements.readyMsg3.textContent = config.readyMsg3;
    } else {
        // Subsequent trials - clear messages, just show dot
        elements.readyMsg1.textContent = '';
        elements.readyMsg2.textContent = '';
        elements.readyMsg3.textContent = '';
    }
    
    // Log ready screen
    dataManager.logEvent({
        section: 'ReadyScreen',
        stimuli: 'RedDot',
        invokedBy: 'System',
        testName: config.id,
        trialsRemaining: config.trials - appState.currentTrial
    });
    
    showScreen('readyScreen');
}

function handleDotPress(event) {
    event.preventDefault();
    
    appState.dotPressTime = Date.now();
    appState.trialStartTime = Date.now();
    
    // Flash photocell
    flashButtonIndicator();
    
    // Log dot press
    dataManager.logEvent({
        section: 'ReadyScreen',
        stimuli: 'RedDot',
        invokedBy: 'Responder_Dot',
        testName: appState.currentTask.id,
        trialsRemaining: appState.currentTask.trials - appState.currentTrial
    });
    
    // Show prompt screen
    showPromptScreen();
}

function showPromptScreen() {
    const config = appState.currentTask;
    const trial = appState.trialSequence[appState.currentTrial];
    
    // Determine which button gets the happy face
    const empPos = trial.emp || config.emp;
    const rewPos = trial.rew || config.rew;
    const layout = config.promptLayout;
    
    // Hide all buttons first
    if (elements.topButton) elements.topButton.style.display = 'none';
    if (elements.mdlButton) elements.mdlButton.style.display = 'none';
    if (elements.btmButton) elements.btmButton.style.display = 'none';
    
    // Show/hide dot based on layout
    if (elements.promptDot) {
        if (layout.mdl === 'dot') {
            elements.promptDot.style.display = 'inline-block';
        } else {
            elements.promptDot.style.display = 'none';
        }
    }
    
    // Show and configure buttons based on layout
    const showButton = (pos, buttonEl) => {
        if (buttonEl && layout[pos] === 'button') {
            buttonEl.style.display = 'block';
            buttonEl.style.backgroundImage = 
                empPos === pos ? `url('../graphics/buttons/button_${pos}_happy.png')` : `url('../graphics/buttons/button_${pos}.png')`;
        }
    };
    
    showButton('top', elements.topButton);
    showButton('mdl', elements.mdlButton);
    showButton('btm', elements.btmButton);
    
    // Store rewarded position for accuracy check
    appState.currentRewarded = rewPos;
    
    showScreen('promptScreen');
}

function handleButtonPress(button) {
    const reactionTime = Date.now() - appState.trialStartTime;
    const accuracy = button === appState.currentRewarded ? 1 : 0;
    
    // Flash photocell
    flashButtonIndicator();
    
    // Update stats
    appState.totalTrials++;
    if (accuracy === 1) {
        appState.totalCorrect++;
    }
    appState.totalReactionTime += reactionTime;
    
    // Log button press
    dataManager.logEvent({
        section: 'PromptScreen',
        stimuli: appState.trialSequence[appState.currentTrial].emp || appState.currentTask.emp,
        invokedBy: `Responder_${button}`,
        accuracy: accuracy,
        testName: appState.currentTask.id,
        trialsRemaining: appState.currentTask.trials - appState.currentTrial - 1,
        reactionTime: reactionTime
    });
    
    console.log(`[APP] Trial ${appState.currentTrial + 1}: button=${button}, rewarded=${appState.currentRewarded}, accuracy=${accuracy}, RT=${reactionTime}ms`);
    
    // Move to next trial or task
    appState.currentTrial++;
    
    if (appState.currentTrial < appState.currentTask.trials) {
        // More trials in current task
        setTimeout(() => showReadyScreen(), 500);
    } else {
        // Task complete
        finishTask();
    }
}

function handlePromptDotPress(event) {
    // Red dot in PromptScreen is NOT clickable
    // User MUST press a button to complete the trial
    event.preventDefault();
    console.log('[APP] Dot press ignored - must press a button instead');
}

function finishTask() {
    console.log(`[APP] Task complete: ${appState.currentTask.name}`);
    
    // Log task end
    dataManager.logEvent({
        section: 'TaskEnd',
        stimuli: appState.currentTask.name,
        invokedBy: 'System',
        testName: appState.currentTask.id,
        trialsRemaining: 0
    });
    
    // Move to next task
    appState.currentTaskIndex++;
    
    if (appState.currentTaskIndex < TASK_SEQUENCE.length) {
        // Load next task
        setTimeout(() => loadTask(TASK_SEQUENCE[appState.currentTaskIndex]), 1000);
    } else {
        // All tasks complete
        finishTest();
    }
}

function finishTest() {
    console.log('[APP] All tasks complete');
    
    // Log session end
    dataManager.logEvent({
        section: 'SessionEnd',
        stimuli: 'TestBattery',
        invokedBy: 'System',
        testName: 'AdultUnified'
    });
    
    // Calculate final stats
    const avgRT = appState.totalTrials > 0 ? Math.round(appState.totalReactionTime / appState.totalTrials) : 0;
    const accuracy = appState.totalTrials > 0 ? ((appState.totalCorrect / appState.totalTrials) * 100).toFixed(1) : 0;
    
    // Display stats
    elements.endStats.innerHTML = `
        <p>Test Battery Complete!</p>
        <p>Total Trials: ${appState.totalTrials}</p>
        <p>Correct: ${appState.totalCorrect}</p>
        <p>Accuracy: ${accuracy}%</p>
        <p>Average Reaction Time: ${avgRT} ms</p>
    `;
    
    showScreen('endScreen');
}

function handleDNF() {
    if (appState.isDNF) return;
    
    appState.isDNF = true;
    console.log('[APP] Handling DNF');
    
    // Calculate completed trials (total expected)
    const totalExpected = 4 + 4 + 4 + 4 + 4 + 32 + 32; // = 84 trials total
    
    // Mark as DNF
    dataManager.markDNF(appState.totalTrials + 1, totalExpected);
    
    // Calculate stats for completed trials
    const avgRT = appState.totalTrials > 0 ? Math.round(appState.totalReactionTime / appState.totalTrials) : 0;
    const accuracy = appState.totalTrials > 0 ? ((appState.totalCorrect / appState.totalTrials) * 100).toFixed(1) : 0;
    
    // Display stats
    elements.dnfStats.innerHTML = `
        <p>Session Did Not Finish</p>
        <p>Completed Trials: ${appState.totalTrials} / ${totalExpected}</p>
        <p>Correct: ${appState.totalCorrect}</p>
        <p>Accuracy: ${accuracy}%</p>
        <p>Average Reaction Time: ${avgRT} ms</p>
    `;
    
    showScreen('dnfScreen');
}

// ===== PHOTOCELL =====

function flashButtonIndicator() {
    console.log('[APP] Photocell flash');
    elements.buttonIndicator.style.backgroundColor = 'white';
    setTimeout(() => {
        elements.buttonIndicator.style.backgroundColor = 'black';
    }, 100);
}

// ===== UTILITY =====

console.log('[APP] Script loaded - ECITT Adult Tasks PWA ready');
