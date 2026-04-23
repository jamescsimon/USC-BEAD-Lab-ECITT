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
    },

    // ===== CHILD (2-17) ECITT-A TASK CONFIGURATIONS =====

    // Child Practice: Top (4 trials) - both buttons, happy face always top
    cha_ppt: {
        id: 'cha_ppt',
        name: 'Child Practice Top',
        emp: 'top',
        empType: 'happy',
        rew: 'top',
        trials: 4,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Put your finger on the red dot. When you see the buttons, press the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Child Baseline: Top (32 trials) - both buttons, happy face always top
    cha_blt: {
        id: 'cha_blt',
        name: 'Child Baseline Top',
        emp: 'top',
        empType: 'happy',
        rew: 'top',
        trials: 32,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Great! Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Child Test: Top (32 trials - 75% top, 25% bottom)
    cha_tpt: {
        id: 'cha_tpt',
        name: 'Child Test Top',
        varDistr: [75, 25],
        varLeading: 3,
        varMaxDups: 4,
        trials: 32,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Excellent! Now for the real test. Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?',
        variants: {
            prpt: { emp: 'top', empType: 'happy', rew: 'top' },
            inhb: { emp: 'btm', empType: 'happy', rew: 'btm' }
        }
    },
    // Child Practice: Bottom (4 trials) - both buttons, happy face always bottom
    cha_ppb: {
        id: 'cha_ppb',
        name: 'Child Practice Bottom',
        emp: 'btm',
        empType: 'happy',
        rew: 'btm',
        trials: 4,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Great! Now we will do some practice. Press the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Child Baseline: Bottom (32 trials) - both buttons, happy face always bottom
    cha_blb: {
        id: 'cha_blb',
        name: 'Child Baseline Bottom',
        emp: 'btm',
        empType: 'happy',
        rew: 'btm',
        trials: 32,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Great! Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Child Test: Bottom (32 trials - 75% bottom, 25% top)
    cha_tpb: {
        id: 'cha_tpb',
        name: 'Child Test Bottom',
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
    },

    // ===== TODDLER (17-23 months) ECITT TASK CONFIGURATIONS =====

    // Toddler Practice: Top (4 trials) - both buttons, happy face always top
    tod_ppt: {
        id: 'tod_ppt',
        name: 'Toddler Practice Top',
        emp: 'top',
        empType: 'happy',
        rew: 'top',
        trials: 4,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Watch the happy face and press it as fast as you can!',
        readyMsg2: 'Then come back to the dot.',
        readyMsg3: 'Ready?'
    },
    // Toddler Test: Top (32 trials - 75% top, 25% bottom)
    tod_tpt: {
        id: 'tod_tpt',
        name: 'Toddler Test Top',
        varDistr: [75, 25],
        varLeading: 3,
        varMaxDups: 4,
        trials: 32,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Great job! Keep pressing the happy face as fast as you can!',
        readyMsg2: 'Then come back to the dot.',
        readyMsg3: 'Ready?',
        variants: {
            prpt: { emp: 'top', empType: 'happy', rew: 'top' },
            inhb: { emp: 'btm', empType: 'happy', rew: 'btm' }
        }
    },
    // Toddler Practice: Bottom (4 trials) - both buttons, happy face always bottom
    tod_ppb: {
        id: 'tod_ppb',
        name: 'Toddler Practice Bottom',
        emp: 'btm',
        empType: 'happy',
        rew: 'btm',
        trials: 4,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Watch the happy face and press it as fast as you can!',
        readyMsg2: 'Then come back to the dot.',
        readyMsg3: 'Ready?'
    },
    // Toddler Test: Bottom (32 trials - 75% bottom, 25% top)
    tod_tpb: {
        id: 'tod_tpb',
        name: 'Toddler Test Bottom',
        varDistr: [75, 25],
        varLeading: 3,
        varMaxDups: 4,
        trials: 32,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Great job! Keep pressing the happy face as fast as you can!',
        readyMsg2: 'Then come back to the dot.',
        readyMsg3: 'Ready?',
        variants: {
            prpt: { emp: 'btm', empType: 'happy', rew: 'btm' },
            inhb: { emp: 'top', empType: 'happy', rew: 'top' }
        }
    },

    // ===== INFANT (10-16 months) ECITT TASK CONFIGURATIONS =====
    // Single button per phase. Control = baseline. Test = prepotent phase then inhibitory phase.
    // Sequence: Control1 Top → Control1 Bottom →
    //           Test PR Top (prepotent) → Test PR Top (inhibitory) →
    //           Control2 Top → Control2 Bottom →
    //           Test PR Bottom (prepotent) → Test PR Bottom (inhibitory)

    // Control 1: Top (4 trials — 1 demo + 3 trials, single top button)
    inf_c1t: {
        id: 'inf_c1t',
        name: 'Infant Control 1 Top',
        emp: 'top',
        empType: 'happy',
        rew: 'top',
        trials: 4,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'empty' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Control 1: Bottom (4 trials — 1 demo + 3 trials, single bottom button)
    inf_c1b: {
        id: 'inf_c1b',
        name: 'Infant Control 1 Bottom',
        emp: 'btm',
        empType: 'happy',
        rew: 'btm',
        trials: 4,
        promptLayout: { top: 'empty', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Test PR Top — prepotent phase: top (4 trials, single top button — builds habit)
    inf_tptt: {
        id: 'inf_tptt',
        name: 'Infant Test PR Top (Prepotent)',
        emp: 'top',
        empType: 'happy',
        rew: 'top',
        trials: 4,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'empty' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Test PR Top — inhibitory phase: bottom (4 trials, single bottom button — requires switching)
    inf_tptb: {
        id: 'inf_tptb',
        name: 'Infant Test PR Top (Inhibitory)',
        emp: 'btm',
        empType: 'happy',
        rew: 'btm',
        trials: 4,
        promptLayout: { top: 'empty', mdl: 'dot', btm: 'button' },
        readyMsg1: '',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Control 2: Top (4 trials, single top button)
    inf_c2t: {
        id: 'inf_c2t',
        name: 'Infant Control 2 Top',
        emp: 'top',
        empType: 'happy',
        rew: 'top',
        trials: 4,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'empty' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Control 2: Bottom (4 trials, single bottom button)
    inf_c2b: {
        id: 'inf_c2b',
        name: 'Infant Control 2 Bottom',
        emp: 'btm',
        empType: 'happy',
        rew: 'btm',
        trials: 4,
        promptLayout: { top: 'empty', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Test PR Bottom — prepotent phase: bottom (4 trials, single bottom button — builds habit)
    inf_tpbt: {
        id: 'inf_tpbt',
        name: 'Infant Test PR Bottom (Prepotent)',
        emp: 'btm',
        empType: 'happy',
        rew: 'btm',
        trials: 4,
        promptLayout: { top: 'empty', mdl: 'dot', btm: 'button' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Test PR Bottom — inhibitory phase: top (4 trials, single top button — requires switching)
    inf_tpbb: {
        id: 'inf_tpbb',
        name: 'Infant Test PR Bottom (Inhibitory)',
        emp: 'top',
        empType: 'happy',
        rew: 'top',
        trials: 4,
        promptLayout: { top: 'button', mdl: 'dot', btm: 'empty' },
        readyMsg1: '',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    }
};

// Task execution order — full 18+ adult protocol (legacy study version)
const TASK_SEQUENCE = ['adt_ct', 'adt_cb', 'adt_ppt', 'adt_tpt', 'adt_ppb', 'adt_tpb'];

// Task execution order — full 18+ adult protocol (james' version)
// const TASK_SEQUENCE = ['adt_cm', 'adt_ct', 'adt_ppt', 'adt_tpt', 'adt_cb', 'adt_ppb', 'adt_tpb'];

// Task execution order — 2-17 year ECITT-A protocol
// Sequence: Practice Top → Baseline Top → Test Top → Practice Bottom → Baseline Bottom → Test Bottom
const CHILD_TASK_SEQUENCE = ['cha_ppt', 'cha_blt', 'cha_tpt', 'cha_ppb', 'cha_blb', 'cha_tpb'];

// Task execution order — 17-23 month toddler ECITT protocol
// Sequence: Practice Top → Test Top → Practice Bottom → Test Bottom
const TODDLER_TASK_SEQUENCE = ['tod_ppt', 'tod_tpt', 'tod_ppb', 'tod_tpb'];

// Task execution order — 10-16 month infant ECITT protocol
// Sequence: Ctrl1 Top → Ctrl1 Bottom → Test PR Top (prpt) → Test PR Top (inhb) →
//           Ctrl2 Top → Ctrl2 Bottom → Test PR Bottom (prpt) → Test PR Bottom (inhb)
const INFANT_TASK_SEQUENCE = ['inf_c1t', 'inf_c1b', 'inf_tptt', 'inf_tptb', 'inf_c2t', 'inf_c2b', 'inf_tpbt', 'inf_tpbb'];

// Active sequence — set on age group selection
let activeTaskSequence = null;


// ===== APPLICATION STATE =====

const appState = {
    participantId: '',
    ageGroup: 'Adult',
    currentTaskIndex: 0,
    currentTask: null,
    currentTrial: 0,
    trialSequence: [],
    dotPressTime: 0,
    trialStartTime: 0,
    totalCorrect: 0,
    totalTrials: 0,
    totalReactionTime: 0,
    isDNF: false,
    blockReactionTime: 0,
    blockTrials: 0,
    isTransitioning: false
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
        downloadCsvBtn: document.getElementById('downloadCsvBtn'),
        downloadVideoBtn: document.getElementById('downloadVideoBtn'),
        restartBtn: document.getElementById('restartBtn'),

        dnfStats: document.getElementById('dnfStats'),
        dnfDownloadCsvBtn: document.getElementById('dnfDownloadCsvBtn'),
        dnfDownloadVideoBtn: document.getElementById('dnfDownloadVideoBtn'),
        dnfRestartBtn: document.getElementById('dnfRestartBtn'),

        interBlockScreen: document.getElementById('interBlockScreen'),
        interBlockStats: document.getElementById('interBlockStats'),
        interBlockContinueBtn: document.getElementById('interBlockContinueBtn')
    };
    
    // Event listeners
    const adultBtn = document.getElementById('adultBtn');
    if (adultBtn) adultBtn.addEventListener('click', selectAdult);
    const childBtn = document.getElementById('childBtn');
    if (childBtn) childBtn.addEventListener('click', selectChild);
    const toddlerBtn = document.getElementById('toddlerBtn');
    if (toddlerBtn) toddlerBtn.addEventListener('click', selectToddler);
    const infantBtn = document.getElementById('infantBtn');
    if (infantBtn) infantBtn.addEventListener('click', selectInfant);
    
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
    if (elements.downloadCsvBtn) elements.downloadCsvBtn.addEventListener('click', downloadCSVOnly);
    if (elements.downloadVideoBtn) elements.downloadVideoBtn.addEventListener('click', downloadVideoOnly);
    if (elements.restartBtn) elements.restartBtn.addEventListener('click', restart);
    if (elements.dnfDownloadCsvBtn) elements.dnfDownloadCsvBtn.addEventListener('click', downloadCSVOnly);
    if (elements.dnfDownloadVideoBtn) elements.dnfDownloadVideoBtn.addEventListener('click', downloadVideoOnly);
    if (elements.dnfRestartBtn) elements.dnfRestartBtn.addEventListener('click', restart);
    if (elements.interBlockContinueBtn) elements.interBlockContinueBtn.addEventListener('click', continueAfterInterBlock);
    
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
    appState.ageGroup = 'Adult';
    activeTaskSequence = TASK_SEQUENCE;
    startRecording();
    showScreen('participantScreen');
}

function selectChild() {
    appState.ageGroup = 'Child';
    activeTaskSequence = CHILD_TASK_SEQUENCE;
    startRecording();
    showScreen('participantScreen');
}

function selectToddler() {
    appState.ageGroup = 'Toddler';
    activeTaskSequence = TODDLER_TASK_SEQUENCE;
    startRecording();
    showScreen('participantScreen');
}

function selectInfant() {
    appState.ageGroup = 'Infant';
    activeTaskSequence = INFANT_TASK_SEQUENCE;
    startRecording();
    showScreen('participantScreen');
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

    appState.participantId = participantId;
    dataManager.startSession(participantId);

    // Start first task
    appState.currentTaskIndex = 0;
    loadTask(activeTaskSequence[0]);
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
    appState.ageGroup = 'Adult';
    appState.blockReactionTime = 0;
    appState.blockTrials = 0;
    appState.isTransitioning = false;
    activeTaskSequence = null;
    
    dataManager.clearSession();
    cleanupRecording();

    elements.participantIdInput.value = '';
    // Re-enable start button
    if (elements.startBtn) {
        elements.startBtn.disabled = false;
        elements.startBtn.classList && elements.startBtn.classList.remove('disabled');
    }
    showScreen('ageSelectionScreen');
}

// ===== TASK MANAGEMENT =====

function loadTask(taskId) {
    const config = TASK_CONFIGS[taskId];
    appState.currentTask = config;
    appState.currentTrial = 0;
    appState.isTransitioning = false;

    // Reset block-level RT counters at the start of each test block
    if (config.id === 'adt_tpt' || config.id === 'adt_tpb' ||
        config.id === 'cha_tpt' || config.id === 'cha_tpb' ||
        config.id === 'tod_tpt' || config.id === 'tod_tpb') {
        appState.blockReactionTime = 0;
        appState.blockTrials = 0;
    }

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
        stimuli: 'blank',
        invokedBy: 'TestSelection',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: config.trials,
        trialName: config.id || 'adt_ppt'
    });
    // Start first trial — ReadyScreen fires the flash, no separate TaskStart flash
    showReadyScreen();
}

function generateTestSequence(config) {
    const { trials, varDistr, varLeading, varMaxDups } = config;
    const sequence = [];

    // Add leading prepotent trials
    for (let i = 0; i < varLeading; i++) {
        sequence.push({ type: 'prpt', ...config.variants['prpt'] });
    }

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
    
    // Log ready screen only when screen is shown
    dataManager.logEvent({
        section: 'ReadyScreen',
        stimuli: 'red dot',
        invokedBy: 'ParticipantBlueButton',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: appState.currentTask.trials - appState.currentTrial,
        trialName: appState.currentTask.id || 'adt_ppt'
    });
    showScreen('readyScreen');
    flashButtonIndicator();
}

function handleDotPress(event) {
    event.preventDefault();
    if (appState.isTransitioning) return;

    appState.dotPressTime = Date.now();
    appState.trialStartTime = Date.now();
    // Do not log dot press (not a screen transition)
    // Show prompt screen
    showPromptScreen();
}

function showPromptScreen() {
    const config = appState.currentTask;
    const trial = appState.trialSequence[appState.currentTrial];
    
    // Determine which button gets the happy face
    const empPos = trial && trial.emp ? trial.emp : (config && config.emp ? config.emp : 'mdl');
    const rewPos = trial && trial.rew ? trial.rew : (config && config.rew ? config.rew : 'mdl');
    const layout = config && config.promptLayout ? config.promptLayout : { top: 'empty', mdl: 'dot', btm: 'empty' };
    
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

    // Determine section label for this trial
    let trialSection = 'PromptScreen';
    if (trial && trial.type === 'prpt') {
        trialSection = 'TopTrialScreen';
    } else if (trial && trial.type === 'inhb') {
        trialSection = 'BottomTrialScreen';
    } else if (trial && trial.type === 'standard') {
        trialSection = 'ControlTrialScreen';
    }

    // Log at screen onset — timestamp matches flash, accuracy not yet known
    dataManager.logEvent({
        section: trialSection,
        stimuli: 'red dot, blue buttons',
        invokedBy: 'ParticipantRedDot',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: appState.currentTask.trials - appState.currentTrial,
        trialName: appState.currentTask.id || 'adt_ppt'
    });

    showScreen('promptScreen');
    flashButtonIndicator();
}

function handleButtonPress(button) {
    if (appState.isTransitioning) return;
    const reactionTime = Date.now() - appState.trialStartTime;
    const accuracy = button === appState.currentRewarded ? 1 : 0;
    
    
    // Update stats
    appState.totalTrials++;
    if (accuracy === 1) {
        appState.totalCorrect++;
    }
    appState.totalReactionTime += reactionTime;
    if (appState.currentTask.id === 'adt_tpt' || appState.currentTask.id === 'adt_tpb' ||
        appState.currentTask.id === 'cha_tpt' || appState.currentTask.id === 'cha_tpb' ||
        appState.currentTask.id === 'tod_tpt' || appState.currentTask.id === 'tod_tpb') {
        appState.blockReactionTime += reactionTime;
        appState.blockTrials++;
    }
    
    // Log response — timestamp is button press, accuracy now known
    const completedIndex = appState.currentTrial;
    const completedTrial = appState.trialSequence[completedIndex];
    let responseSection = 'PromptResponse';
    if (completedTrial && completedTrial.type === 'prpt') {
        responseSection = 'TopTrialResponse';
    } else if (completedTrial && completedTrial.type === 'inhb') {
        responseSection = 'BottomTrialResponse';
    } else if (completedTrial && completedTrial.type === 'standard') {
        responseSection = 'ControlTrialResponse';
    }

    dataManager.logEvent({
        section: responseSection,
        stimuli: 'red dot, blue buttons',
        invokedBy: 'ParticipantRedDot',
        accuracy: accuracy,
        testName: appState.ageGroup,
        trialsRemaining: appState.currentTask.trials - (completedIndex + 1),
        trialName: appState.currentTask.id || 'adt_ppt'
    });

    console.log(`[APP] Trial ${completedIndex + 1}: button=${button}, rewarded=${appState.currentRewarded}, accuracy=${accuracy}, RT=${reactionTime}ms`);

    // Move to next trial or task
    appState.currentTrial++;
    
    if (appState.currentTrial < appState.currentTask.trials) {
        // More trials in current task
        setTimeout(() => showReadyScreen(), 100);
    } else {
        // Task complete
        finishTask();
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
    console.log(`[APP] Task complete: ${appState.currentTask.name}`);
    
    // Log task end only for last task
    if (appState.currentTaskIndex === activeTaskSequence.length - 1) {
        dataManager.logEvent({
            section: 'TaskEnd',
            stimuli: 'blank',
            invokedBy: 'ParticipantBlueButton',
            accuracy: 'n/a',
            testName: appState.ageGroup,
            trialsRemaining: 0,
            trialName: appState.currentTask.id || 'adt_ppt'
        });
        flashButtonIndicator();
    }
    
    // Move to next task
    appState.currentTaskIndex++;
    
    if (appState.currentTaskIndex < activeTaskSequence.length) {
        appState.isTransitioning = true;
        // Show inter-block speed feedback after first test block (not for infant — no RT measure)
        if (appState.currentTask.id === 'adt_tpt' || appState.currentTask.id === 'cha_tpt' ||
            appState.currentTask.id === 'tod_tpt') {
            setTimeout(() => showInterBlockFeedback(), 500);
        } else {
            setTimeout(() => loadTask(activeTaskSequence[appState.currentTaskIndex]), 1000);
        }
    } else {
        // All tasks complete
        finishTest();
    }
}

function finishTest() {
    console.log('[APP] All tasks complete');
    
    // No session end event
    
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

    stopRecording();
    showScreen('endScreen');
}

function handleDNF() {
    if (appState.isDNF) return;
    
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
        <p>Session Did Not Finish</p>
        <p>Completed Trials: ${appState.totalTrials} / ${totalExpected}</p>
        <p>Correct: ${appState.totalCorrect}</p>
        <p>Accuracy: ${accuracy}%</p>
        <p>Average Reaction Time: ${avgRT} ms</p>
    `;
    
    showScreen('dnfScreen');
    stopAndAutoDownload();
}

// ===== INTER-BLOCK FEEDBACK =====

function showInterBlockFeedback() {
    const avgRT = appState.blockTrials > 0 ? Math.round(appState.blockReactionTime / appState.blockTrials) : 0;
    elements.interBlockStats.innerHTML = `
        <p>Average Response Time: ${avgRT} ms</p>
        <p>Try to respond as fast as you can in the next block.</p>
    `;
    showScreen('interBlockScreen');
}

function continueAfterInterBlock() {
    loadTask(activeTaskSequence[appState.currentTaskIndex]);
}

// ===== PHOTOCELL =====

// Single-frame photocell flash. Fires one DIN8 event per section start.
// Section identity is resolved in post-processing by aligning the CSV telemetry
// timestamps against DIN8 timestamps in the EEG recording.
// Uses requestAnimationFrame so the flash aligns to a monitor vsync boundary
// (~16ms at 60Hz) rather than the unreliable JS event-loop timer.
let flashInProgress = false;
function flashButtonIndicator() {
    if (flashInProgress) return;
    flashInProgress = true;
    const indicator = elements.buttonIndicator;

    requestAnimationFrame(() => {         // frame N: ON  → triggers DIN8
        indicator.style.backgroundColor = 'white';
        requestAnimationFrame(() => {     // frame N+1: OFF
            indicator.style.backgroundColor = 'black';
            flashInProgress = false;
        });
    });
}

// ===== RECORDING =====

let mediaRecorder = null;
let recordedChunks = [];
let mediaStream = null;
let recordedMimeType = '';

function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('[REC] getUserMedia not supported on this device/context');
        return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then(stream => {
            mediaStream = stream;
            const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')
                ? 'video/mp4;codecs=avc1'
                : MediaRecorder.isTypeSupported('video/mp4')
                    ? 'video/mp4'
                    : 'video/webm';
            recordedMimeType = mimeType;
            mediaRecorder = new MediaRecorder(stream, { mimeType });
            recordedChunks = [];
            mediaRecorder.ondataavailable = e => {
                if (e.data && e.data.size > 0) recordedChunks.push(e.data);
            };
            mediaRecorder.start();
            console.log('[REC] Recording started, mimeType:', mimeType);
        })
        .catch(err => {
            console.warn('[REC] Camera access denied or unavailable:', err.name, err.message);
        });
}

function downloadCSVOnly() {
    dataManager.downloadCSV();
}

function downloadVideoOnly() {
    if (!recordedChunks || recordedChunks.length === 0) {
        console.warn('[REC] No video data available');
        return;
    }
    const mimeType = recordedMimeType || 'video/webm';
    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const blob = new Blob(recordedChunks, { type: mimeType });
    const filename = `ECITT_${dataManager.participantId}_${dataManager.formatFilestamp(dataManager.sessionStart)}.${ext}`;
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('[REC] Video downloaded:', filename);
}

// Stops the recorder and auto-downloads both files (used on DNF)
function stopAndAutoDownload() {
    downloadCSVOnly();
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        downloadVideoOnly();
        return;
    }
    mediaRecorder.addEventListener('stop', () => {
        if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
        mediaRecorder = null;
        downloadVideoOnly();
    }, { once: true });
    mediaRecorder.stop();
}

// Stops the recorder without downloading (used on normal end — user presses buttons)
function stopRecording() {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') return;
    mediaRecorder.addEventListener('stop', () => {
        if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
        mediaRecorder = null;
    }, { once: true });
    mediaRecorder.stop();
}

function cleanupRecording() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
        mediaStream = null;
    }
    mediaRecorder = null;
    recordedChunks = [];
    recordedMimeType = '';
}

// ===== UTILITY =====

console.log('[APP] Script loaded - ECITT Adult Tasks PWA ready');