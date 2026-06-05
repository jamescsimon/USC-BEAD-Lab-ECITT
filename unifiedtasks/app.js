/**
 * ECITT Adult Tasks - Main Application Logic
 * Single-screen PWA implementation
 */

// ===== TASK CONFIGURATIONS =====

const TASK_CONFIGS = {
    // Control: Right (4 trials)
    adt_cr: {
        id: 'adt_cr',
        name: 'Control Right',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        trials: 4,
        promptLayout: { left: 'empty', mdl: 'dot', right: 'button' },
        readyMsg1: 'When you see the blue buttons, press the one with the happy face as fast as you can when they appear.',
        readyMsg2: 'When ready, press the red dot.',
        readyMsg3: 'Ready? Let\'s practice!'
    },
    // Control: Left (4 trials)
    adt_cl: {
        id: 'adt_cl',
        name: 'Control Left',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        trials: 4,
        promptLayout: { left: 'button', mdl: 'dot', right: 'empty' },
        readyMsg1: 'Great job!',
        readyMsg2: 'When ready to start the next practice, press the red dot.',
        readyMsg3: 'Ready? Let\'s practice the other side!'
    },
    // Control: Middle (4 trials)
    adt_cm: {
        id: 'adt_cm',
        name: 'Control Middle',
        emp: 'mdl',
        empType: 'happy',
        rew: 'mdl',
        trials: 4,
        promptLayout: { left: 'empty', mdl: 'button', right: 'empty' },
        readyMsg1: 'When you see the blue buttons, press the one with the happy face as fast as you can when they appear.',
        readyMsg2: 'When ready, press the red dot.',
        readyMsg3: 'Ready? Let\'s practice!'
    }, 
    // Practice: Left (4 trials)
    adt_ppl: {
        id: 'adt_ppl',
        name: 'Practice Left',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        trials: 4,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great! Now we will do some practice with both sides. Press the happy face one as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready to practice?'
    },
    // Practice: Right (4 trials)
    adt_ppr: {
        id: 'adt_ppr',
        name: 'Practice Right',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        trials: 4,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great! Now we will do some practice with both sides. Press the happy face one as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready to practice?'
    },
    // Test: Left (32 trials - 75% left, 25% right)
    adt_tpl: {
        id: 'adt_tpl',
        name: 'Test Left', 
        varDistr: [75, 25], // [prepotent %, inhibitory %]
        varLeading: 3, // First 3 trials are prepotent
        varMaxDups: 4, // Max 4 prepotent consecutive
        trials: 32,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Excellent! Now for the real test. Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready? Let\'s start the real test!',
        // Trial variant configs
        variants: {
            prpt: { emp: 'left', empType: 'happy', rew: 'left' },
            inhb: { emp: 'right', empType: 'happy', rew: 'right' }
        }
    },
    // Test: Right (32 trials - 75% right, 25% left)
    adt_tpr: {
        id: 'adt_tpr',
        name: 'Test Right',
        varDistr: [75, 25],
        varLeading: 3,
        varMaxDups: 4,
        trials: 32,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Excellent! Now for the real test. Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready? Let\'s start the real test!',
        variants: {
            prpt: { emp: 'right', empType: 'happy', rew: 'right' },
            inhb: { emp: 'left', empType: 'happy', rew: 'left' }
        }
    },

    // ===== CHILD (2-17) ECITT-A TASK CONFIGURATIONS =====

    // Child Practice: Left (4 trials) - both buttons, happy face always left
    cha_ppl: {
        id: 'cha_ppl',
        name: 'Child Practice Left',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        trials: 4,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Put your finger on the red dot. When you see the buttons, press the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Child Baseline: Left (32 trials) - both buttons, happy face always left
    cha_bll: {
        id: 'cha_bll',
        name: 'Child Baseline Left',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        trials: 32,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great! Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Child Test: Left (32 trials - 75% left, 25% right)
    cha_tpl: {
        id: 'cha_tpl',
        name: 'Child Test Left',
        varDistr: [75, 25],
        varLeading: 3,
        varMaxDups: 4,
        trials: 32,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Excellent! Now for the real test. Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready? Let\'s start the real test!',
        variants: {
            prpt: { emp: 'left', empType: 'happy', rew: 'left' },
            inhb: { emp: 'right', empType: 'happy', rew: 'right' }
        }
    },
    // Child Practice: Right (4 trials) - both buttons, happy face always right
    cha_ppr: {
        id: 'cha_ppr',
        name: 'Child Practice Right',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        trials: 4,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great! Now we will do some practice. Press the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Child Baseline: Right (32 trials) - both buttons, happy face always right
    cha_blr: {
        id: 'cha_blr',
        name: 'Child Baseline Right',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        trials: 32,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great! Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready?'
    },
    // Child Test: Right (32 trials - 75% right, 25% left)
    cha_tpr: {
        id: 'cha_tpr',
        name: 'Child Test Right',
        varDistr: [75, 25],
        varLeading: 3,
        varMaxDups: 4,
        trials: 32,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Excellent! Now for the real test. Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Ready? Let\'s start the real test!',
        variants: {
            prpt: { emp: 'right', empType: 'happy', rew: 'right' },
            inhb: { emp: 'left', empType: 'happy', rew: 'left' }
        }
    },

    // ===== TODDLER (17-23 months) ECITT TASK CONFIGURATIONS =====

    // Toddler Practice: Left (4 trials) - both buttons, happy face always left
    tod_ppl: {
        id: 'tod_ppl',
        name: 'Toddler Practice Left',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        trials: 4,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Watch the happy face and press it as fast as you can!',
        readyMsg2: 'Then come back to the dot.',
        readyMsg3: 'Ready?'
    },
    // Toddler Test: Left (32 trials - 75% left, 25% right)
    tod_tpl: {
        id: 'tod_tpl',
        name: 'Toddler Test Left',
        varDistr: [75, 25],
        varLeading: 3,
        varMaxDups: 4,
        trials: 32,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great job! Keep pressing the happy face as fast as you can!',
        readyMsg2: 'Then come back to the dot.',
        readyMsg3: 'Ready?',
        variants: {
            prpt: { emp: 'left', empType: 'happy', rew: 'left' },
            inhb: { emp: 'right', empType: 'happy', rew: 'right' }
        }
    },
    // Toddler Practice: Right (4 trials) - both buttons, happy face always right
    tod_ppr: {
        id: 'tod_ppr',
        name: 'Toddler Practice Right',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        trials: 4,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Watch the happy face and press it as fast as you can!',
        readyMsg2: 'Then come back to the dot.',
        readyMsg3: 'Ready?'
    },
    // Toddler Test: Right (32 trials - 75% right, 25% left)
    tod_tpr: {
        id: 'tod_tpr',
        name: 'Toddler Test Right',
        varDistr: [75, 25],
        varLeading: 3,
        varMaxDups: 4,
        trials: 32,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great job! Keep pressing the happy face as fast as you can!',
        readyMsg2: 'Then come back to the dot.',
        readyMsg3: 'Ready?',
        variants: {
            prpt: { emp: 'right', empType: 'happy', rew: 'right' },
            inhb: { emp: 'left', empType: 'happy', rew: 'left' }
        }
    },

    // ===== INFANT (10-16 months) ECITT TASK CONFIGURATIONS =====
    // Single button per phase. Control = baseline. Test = prepotent phase then inhibitory phase.
    // Sequence: Control1 Left → Control1 Right →
    //           Test PR Left (prepotent) → Test PR Left (inhibitory) →
    //           Control2 Left → Control2 Right →
    //           Test PR Right (prepotent) → Test PR Right (inhibitory)

    // Demo: Middle Button 
    inf_demo: {
        id: 'inf_demo',
        name: 'Infant Demo Middle',
        trialType: 'standard',
        emp: 'mdl',
        empType: 'happy',
        rew: 'mdl',
        trials: 1,
        promptLayout: { left: 'empty', mdl: 'button', right: 'empty' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Practice 1: Left (1 trials — single left button)
    inf_plp: {
        id: 'inf_plp',
        name: 'Infant Practice Left',
        trialType: 'standard',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        trials: 1,
        promptLayout: { left: 'button', mdl: 'dot', right: 'empty' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Practice 2: Right (1 trials — single right button)
    inf_prp: {
        id: 'inf_prp',
        name: 'Infant Practice Right',
        trialType: 'standard',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        trials: 1,
        promptLayout: { left: 'empty', mdl: 'dot', right: 'button' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Control: Left (6 trials — 1 demo + 3 trials, both buttons but left is happy)
    inf_c1l: {
        id: 'inf_c1l',
        name: 'Infant Control Left',
        trialType: 'standard',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        allowCorrection: true,
        trials: 6,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great job! Now find the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Control: Right (6 trials — 1 demo + 3 trials, both buttons but right is happy)
    inf_c1r: {
        id: 'inf_c1r',
        name: 'Infant Control Right',
        trialType: 'standard',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        allowCorrection: true,
        trials: 6,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great job! Now find the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Test PR Left — prepotent phase: left (6 trials, both buttons but left is preponent)
    inf_tpl: {
        id: 'inf_tpl',
        name: 'Infant Test Left',
    
        varDistr: [50,50],
        varLeading: 1,
        maxSameSide: 2,
        allowCorrection: true,
    
        trials: 6,
    
        promptLayout: {
            left: 'button',
            mdl: 'dot',
            right: 'button'
        },
        readyMsg1: 'Great job! Now continue finding the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?',
    
        variants: {
            prpt: {
                emp: 'left',
                empType: 'happy',
                rew: 'left'
            },
            inhb: {
                emp: 'right',
                empType: 'happy',
                rew: 'right'
            }
        }
    },
    // Test PR Right — prepotent phase: right (6 trials, both buttons but right is preponent)
    inf_tpr: {
        id: 'inf_tpr',
        name: 'Infant Test Right',
    
        varDistr: [50,50],
        varLeading: 1,
        maxSameSide: 2,
        allowCorrection: true,
    
        trials: 6,
    
        promptLayout: {
            left: 'button',
            mdl: 'dot',
            right: 'button'
        },
        readyMsg1: 'Great job! Now continue finding the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?',
    
        variants: {
            prpt: {
                emp: 'right',
                empType: 'happy',
                rew: 'right'
            },
            inhb: {
                emp: 'left',
                empType: 'happy',
                rew: 'left'
            }
        }
    }
};

// ===== FLOW CONTROL FLAGS =====
const SKIP_READY_SCREEN = {
    Infant: true
};

// Infant/Toddler Execution Order
// Butterfly
// Control Middle
// Sides(?) 
// Preponent trials x3 ?
//mostly the same as infant version

// -------------------------------

// Child Test Execution Order
// demo
// practice
// baseline 1 (nirs audio & videos)
// control 1
// baseline 2
// test 1 <- large
// baseline 3 (nirs audio & videos)
// control 2
// baseline 4
// test 2 <- large
// baseline 5 (nirs audio & videos)
// control 3
// baseline 6
// test 3 <- large
// baseline 7 (nirs audio & videos)
// control 4
// baseline 8
// test 4 <- large
// baseline 9 (nirs audio & videos)
// control 5
// baseline 10
// test 5 <- large
// baseline 11

//const TASK_SEQUENCE = ['adt_cl', 'adt_cr', 'adt_ppl', 'adt_tpl', 'adt_ppr', 'adt_tpr'];
// Left-first: Control Left → Control Right → Practice Left → Test Left → Test Right
const TASK_SEQUENCE_LEFT    = ['adt_cl', 'adt_cr', 'adt_ppl', 'adt_tpl', 'adt_tpr'];
// Right-first: Control Right → Control Left → Practice Right → Test Right → Test Left
const TASK_SEQUENCE_RIGHT    = ['adt_cr', 'adt_cl', 'adt_ppr', 'adt_tpr', 'adt_tpl'];

// Task execution order — full 18+ adult protocol (james' version)
// const TASK_SEQUENCE = ['adt_cm', 'adt_cl', 'adt_ppl', 'adt_tpl', 'adt_cr', 'adt_ppr', 'adt_tpr'];

// Task execution order — 2-17 year ECITT-A protocol
const CHILD_TASK_SEQUENCE_LEFT = ['cha_ppl', 'cha_bll', 'cha_tpl', 'cha_ppr', 'cha_blr', 'cha_tpr'];
const CHILD_TASK_SEQUENCE_RIGHT = ['cha_ppr', 'cha_blr', 'cha_tpr', 'cha_ppl', 'cha_bll', 'cha_tpl'];

// Task execution order — 17-23 month toddler ECITT protocol
const TODDLER_TASK_SEQUENCE_LEFT = ['tod_ppl', 'tod_tpl', 'tod_ppr', 'tod_tpr'];
const TODDLER_TASK_SEQUENCE_RIGHT = ['tod_ppr', 'tod_tpr', 'tod_ppl', 'tod_tpl'];

// Task execution order — 10-16 month infant ECITT protocol
const INFANT_TASK_SEQUENCE_LEFT = ['inf_demo','inf_plp', 'inf_prp', 'inf_c1l', 'inf_tpl', 'inf_c1r', 'inf_tpr', 'inf_c1l', 'inf_tpl', 'inf_c1r', 'inf_tpr', 'inf_tpl', 'inf_c1r','inf_c1r', 'inf_tpr'];
const INFANT_TASK_SEQUENCE_RIGHT = ['inf_demo','inf_prp', 'inf_plp', 'inf_c1r', 'inf_tpr', 'inf_c1l', 'inf_tpl', 'inf_c1l', 'inf_tpl', 'inf_c1r', 'inf_tpr', 'inf_c1l', 'inf_tpl', 'inf_c1r', 'inf_tpr'];

// Active sequence — set on age group selection
let activeTaskSequence = null;

// ===== JITTER CONFIGURATION =====
// Durations (in milliseconds) randomly selected per adult/infant trial between dot press and prompt.
// Edit this list to control possible wait times (valid range: 500–5000 ms).

// Jitter 2: random wait (ms) between button response and red dot reappearing.
// Adult uses JITTER2_RANGE; Infant, Child, and Toddler (have animations) use JITTER2_ANIM_RANGE.
const JITTER2_RANGE = [500, 1000]; 
const JITTER2_ANIM_RANGE = [3500, 4000]; // todder animations must last 3.75 to 4 seconds 
const JITTER_DURATIONS_ADULT = [
  500, 500,
  1000, 1000, 1000,
  1500, 1500, 1500, 1500, 1500,
  2000, 2000, 2000, 2000, 2000, 2000,
  2500, 2500, 2500, 2500, 2500, 2500,
  3000, 3000, 3000, 3000, 3000,
  3500, 3500, 3500,
  4000, 4000
];

const JITTER_DURATIONS_CHILD = [
  500, 500,
  1000, 1000, 1000,
  1500, 1500, 1500, 1500, 1500,
  2000, 2000, 2000, 2000, 2000, 2000,
  2000, 2000, 2000, 2000, 2000, 2000,
  2500, 2500, 2500, 2500, 2500,
  3000, 3000, 3000,
  3000, 3000
];

const JITTER_DURATIONS_TODDLER_INFANT = [
  500, 500,
  500, 500, 500, 
  750, 750, 750, 750, 750,
  1000, 1000, 1000, 1000, 1000, 1000,
  1000, 1000, 1000, 1000, 1000, 1000,
  750, 750, 750, 750, 750, 
  500, 500, 500,
  500, 500,
];

// ===== APPLICATION STATE =====
const appState = {
    participantId: '',
    ageGroup: 'Adult',
    counterbalance: 'left',
    currentTaskIndex: 0,
    currentTask: null,
    currentTrial: 0,
    trialSequence: [],
    dotPressTime: 0,
    trialStartTime: 0,
    jitterDuration: 0,
    jitterPool: [],
    totalCorrect: 0,
    totalTrials: 0,
    totalReactionTime: 0,
    isDNF: false,
    isComplete: false,
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
        cbLeftBtn: document.getElementById('cbLeftBtn'),
        cbRightBtn: document.getElementById('cbRightBtn'),
        
        readyMsg1: document.getElementById('readyMsg1'),
        readyMsg2: document.getElementById('readyMsg2'),
        readyMsg3: document.getElementById('readyMsg3'),
        dotButton: document.getElementById('dotButton'),
        
        leftButton: document.getElementById('leftButton'),
        mdlButton: document.getElementById('mdlButton'),
        rightButton: document.getElementById('rightButton'),
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
        interBlockContinueBtn: document.getElementById('interBlockContinueBtn'),

        recordingReminderScreen: document.getElementById('recordingReminderScreen'),
        recordingReminderContinueBtn: document.getElementById('recordingReminderContinueBtn'),

        waitScreen: document.getElementById('waitScreen')
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
    if (elements.cbLeftBtn) elements.cbLeftBtn.addEventListener('click', () => setCounterbalance('left'));
    if (elements.cbRightBtn) elements.cbRightBtn.addEventListener('click', () => setCounterbalance('right'));
    if (elements.dotButton) {
        elements.dotButton.addEventListener('touchstart', handleDotPress);
        elements.dotButton.addEventListener('mousedown', handleDotPress);
    }
    if (elements.leftButton) {
        elements.leftButton.addEventListener('touchstart', () => handleButtonPress('left'));
        elements.leftButton.addEventListener('mousedown', () => handleButtonPress('left'));
    }
    if (elements.mdlButton) {
        elements.mdlButton.addEventListener('touchstart', () => handleButtonPress('mdl'));
        elements.mdlButton.addEventListener('mousedown', () => handleButtonPress('mdl'));
    }
    if (elements.rightButton) {
        elements.rightButton.addEventListener('touchstart', () => handleButtonPress('right'));
        elements.rightButton.addEventListener('mousedown', () => handleButtonPress('right'));
    }
    if (elements.downloadCsvBtn) elements.downloadCsvBtn.addEventListener('click', downloadCSVOnly);
    if (elements.downloadVideoBtn) elements.downloadVideoBtn.addEventListener('click', downloadVideoOnly);
    if (elements.restartBtn) elements.restartBtn.addEventListener('click', restart);
    if (elements.dnfDownloadCsvBtn) elements.dnfDownloadCsvBtn.addEventListener('click', downloadCSVOnly);
    if (elements.dnfDownloadVideoBtn) elements.dnfDownloadVideoBtn.addEventListener('click', downloadVideoOnly);
    if (elements.dnfRestartBtn) elements.dnfRestartBtn.addEventListener('click', restart);
    if (elements.interBlockContinueBtn) elements.interBlockContinueBtn.addEventListener('click', continueAfterInterBlock);
    if (elements.recordingReminderContinueBtn) elements.recordingReminderContinueBtn.addEventListener('click', continueAfterRecordingReminder);
    
    // Orientation-aware button positioning
    applyOrientationLayout();
    window.matchMedia('(orientation: landscape)').addEventListener('change', applyOrientationLayout);

    // DNF detection - hold photocell for 3 seconds to trigger manually
    let dnfHoldTimer = null;
    const DNF_HOLD_MS = 3000;

    const startDnfHold = (e) => {
        if (!appState.currentTask || appState.isDNF || appState.isComplete) return;
        e.stopPropagation();
        dnfHoldTimer = setTimeout(() => {
            console.log('[APP] Photocell hold — triggering DNF');
            handleDNF();
        }, DNF_HOLD_MS);
    };
    const cancelDnfHold = () => {
        clearTimeout(dnfHoldTimer);
        dnfHoldTimer = null;
    };

    const indicator = elements.buttonIndicator;
    if (indicator) {
        indicator.addEventListener('touchstart',  startDnfHold,  { passive: true });
        indicator.addEventListener('touchend',    cancelDnfHold);
        indicator.addEventListener('touchcancel', cancelDnfHold);
        indicator.addEventListener('mousedown',   startDnfHold);
        indicator.addEventListener('mouseup',     cancelDnfHold);
        indicator.addEventListener('mouseleave',  cancelDnfHold);
    }
    
    preloadAnimationFrames();
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

    appState.participantId = participantId;
    dataManager.startSession(participantId);

    appState.currentTaskIndex = 0;
    showScreen('recordingReminderScreen');
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

// ===== TASK MANAGEMENT =====

function loadTask(taskId) {
    const config = TASK_CONFIGS[taskId];
    appState.currentTask = config;
    appState.currentTrial = 0;
    appState.isTransitioning = false;

    // Pre-fill the jitter pool: shuffle the age-appropriate list repeatedly
    // until we have one entry per trial, then draw in order (no repeats until pool exhausted)
    const jitterSource = appState.ageGroup === 'Adult' ? JITTER_DURATIONS_ADULT
                       : appState.ageGroup === 'Child'  ? JITTER_DURATIONS_CHILD
                       : JITTER_DURATIONS_TODDLER_INFANT; // Toddler and Infant
    const pool = [];
    while (pool.length < config.trials) {
        const needed = config.trials - pool.length;
        const slice = shuffleArray([...jitterSource]).slice(0, needed);
        pool.push(...slice);
    }
    appState.jitterPool = pool;

    // Reset block-level RT counters at the start of each test block
    if (config.id === 'adt_tpl' || config.id === 'adt_tpr' ||
        config.id === 'cha_tpl' || config.id === 'cha_tpr' ||
        config.id === 'tod_tpl' || config.id === 'tod_tpr') {
        appState.blockReactionTime = 0;
        appState.blockTrials = 0;
    }

    // Generate trial sequence
    if (config.variants) {
        // Test tasks with prepotent/inhibitory variants
        appState.trialSequence = generateTestSequence(config);
    } else {
        // Single-type tasks — use trialType if set (e.g. infant prepotent/inhibitory phases),
        // otherwise default to 'standard' (control/practice tasks)
        const type = config.trialType || 'standard';
        appState.trialSequence = Array(config.trials).fill({ type });
    }
    
    // Log task start
    dataManager.logEvent({
        section: 'TaskStart',
        stimuli: 'blank',
        invokedBy: 'TestSelection',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: config.trials,
        trialName: config.id || 'adt_ppl'
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

    let prepotentCount;
    let inhibitoryCount;

    if (config.maxSameSide !== undefined) {

        // INFANT MODE
        const totalPrepotent = Math.floor(trials * varDistr[0] / 100);

        prepotentCount = Math.max(0, totalPrepotent - varLeading);
        inhibitoryCount = Math.max(0, trials - varLeading - prepotentCount);

    } else {

        // ALL OTHER AGE GROUPS (UNCHANGED LOGIC)
        const remaining = trials - varLeading;

        prepotentCount = Math.round(remaining * varDistr[0] / 100);
        inhibitoryCount = remaining - prepotentCount;
    }

    // Create pool of remaining trials
    const pool = [
        ...Array(prepotentCount).fill('prpt'),
        ...Array(inhibitoryCount).fill('inhb')
    ];
    
    // ======================================================
    // CONSTRAINED BUILDER (NO BRUTE FORCE SHUFFLE)
    // ======================================================

    const maxSameSide = config.maxSameSide ?? null;

    // Track output sequence types only
    let sequenceTypes = [];

    let lastType = null;
    let consecutive = 0;

    // Copy pool so we don't mutate original reference
    let workingPool = [...pool];

    while (workingPool.length > 0) {

        // filter valid candidates based on constraint
        let candidates = workingPool.filter(t => {
            if (maxSameSide !== null) {
                return !(t === lastType && consecutive >= maxSameSide);
            } else {
                // original adult/toddler logic preserved
                if (t === 'prpt' && consecutive >= varMaxDups) return false;
                if (t === 'inhb' && consecutive >= 1 && lastType === 'inhb') return false;
                return true;
            }
        });

        // fallback if constraint is too strict
        if (candidates.length === 0) {
            candidates = workingPool;
        }

        const pick = candidates[Math.floor(Math.random() * candidates.length)];

        sequenceTypes.push(pick);

        // remove from pool
        workingPool.splice(workingPool.indexOf(pick), 1);

        // update run tracking
        if (pick === lastType) {
            consecutive++;
        } else {
            lastType = pick;
            consecutive = 1;
        }
    }

    // convert to full trial objects
    sequenceTypes.forEach(type => {
        sequence.push({ type, ...config.variants[type] });
    });

    console.log(`[APP] Generated sequence (builder) for ${config.id}:`, sequence.map(t => t.type));
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
    
    showScreen('readyScreen');
    flashButtonIndicator({
        section: 'ReadyScreen',
        stimuli: 'red dot',
        invokedBy: 'ParticipantBlueButton',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: appState.currentTask.trials - appState.currentTrial,
        trialName: appState.currentTask.id || 'adt_ppl'
    });
}

function handleDotPress(event) {
    event.preventDefault();
    if (appState.isTransitioning) return;

    appState.dotPressTime = Date.now();
    // trialStartTime is set in showPromptScreen() so RT excludes jitter wait
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
        trialName: appState.currentTask.id || 'adt_ppl'
    });
    showScreen('waitScreen');
    setTimeout(() => showPromptScreen(), duration);
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
    
    // Dot stays hidden until participant presses a button
    if (elements.promptDot) {
        elements.promptDot.style.display = 'none';
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

function handleButtonPress(button) {
    if (appState.isTransitioning) return;
    const reactionTime = Date.now() - appState.trialStartTime;
    const pressTimestamp = new Date();
    const accuracy = button === appState.currentRewarded ? 1 : 0;
    // ===============================
    // INFANT CORRECTION LOGIC
    // ===============================
    if (
        appState.currentTask.allowCorrection &&
        button !== appState.currentRewarded
    ) {
        dataManager.logEvent({
            section: 'RawResponse',
            stimuli: `button_${button}`,
            invokedBy: 'InfantIncorrectPress',
            accuracy: 0,
            testName: appState.ageGroup,
            trialsRemaining: appState.currentTask.trials - appState.currentTrial,
            trialName: appState.currentTask.id,
            RT: reactionTime,
            ButtonPressed: button,
            EventType: 'Incorrect'
        });
        if (appState.ageGroup === 'Infant') {
            dataManager.logEvent({
                section: 'RawResponse',
                stimuli: `button_${button}`,
                invokedBy: 'InfantCorrectPress',
                accuracy: accuracy,
                testName: appState.ageGroup,
                trialsRemaining: appState.currentTask.trials - appState.currentTrial,
                trialName: appState.currentTask.id,
                RT: reactionTime,
                ButtonPressed: button,
                EventType: 'CorrectOrAttempt'
            });
        }

        console.log('[APP] Infant incorrect press - no trial advance');

        // ❗ DO NOT advance trial
        return;
    }
    
    
    // Update stats
    appState.totalTrials++;
    if (accuracy === 1) {
        appState.totalCorrect++;
    }
    appState.totalReactionTime += reactionTime;
    if (appState.currentTask.id === 'adt_tpl' || appState.currentTask.id === 'adt_tpr' ||
        appState.currentTask.id === 'cha_tpl' || appState.currentTask.id === 'cha_tpr' ||
        appState.currentTask.id === 'tod_tpl' || appState.currentTask.id === 'tod_tpr') {
        appState.blockReactionTime += reactionTime;
        appState.blockTrials++;
    }
    
    // Log response — section label from actual face position, not trial type
    const completedIndex = appState.currentTrial;
    const completedTrial = appState.trialSequence[completedIndex];
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

    dataManager.logEvent({
        section: responseSection,
        stimuli: 'red dot, blue buttons',
        invokedBy: 'ParticipantRedDot',
        accuracy: accuracy,
        testName: appState.ageGroup,
        trialsRemaining: appState.currentTask.trials - (completedIndex + 1),
        trialName: appState.currentTask.id || 'adt_ppl'
    });

    console.log(`[APP] Trial ${completedIndex + 1}: button=${button}, rewarded=${appState.currentRewarded}, accuracy=${accuracy}, RT=${reactionTime}ms`);

    // Reveal the red dot as a "return here" cue after button press.
    // Infant and Toddler suppress it here — dot appears via showReadyScreen() after jitter 2 delay.
    if (elements.promptDot && appState.ageGroup !== 'Infant' && appState.ageGroup !== 'Toddler') elements.promptDot.style.display = 'inline-block';

    // Reward animation for non-adult correct trials
    if (accuracy === 1 && appState.ageGroup !== 'Adult') {
        const pressedEl = button === 'left' ? elements.leftButton :
                          button === 'right' ? elements.rightButton :
                          button === 'mdl' ? elements.mdlButton : null;
        playRewardAnimation(pressedEl);
    }

    // Move to next trial or task
    if (!appState.currentTask.allowCorrection || accuracy === 1) {
        appState.currentTrial++;
    }
    
    const j2Range = (appState.ageGroup === 'Child' || appState.ageGroup === 'Toddler' || appState.ageGroup === 'Infant')
        ? JITTER2_ANIM_RANGE
        : JITTER2_RANGE;
    const j2Delay = Math.round(Math.random() * (j2Range[1] - j2Range[0]) + j2Range[0]);

    const isInfant = appState.ageGroup === 'Infant';

    if (appState.currentTrial < appState.currentTask.trials) {

        const nextScreen = isInfant ? showPromptScreen : showReadyScreen;

        setTimeout(() => nextScreen(), j2Delay);

    } else {
        setTimeout(() => finishTask(), j2Delay);
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
        flashButtonIndicator({
            section: 'TaskEnd',
            stimuli: 'blank',
            invokedBy: 'ParticipantBlueButton',
            accuracy: 'n/a',
            testName: appState.ageGroup,
            trialsRemaining: 0,
            trialName: appState.currentTask.id || 'adt_ppl'
        });
    }
    
    // Move to next task
    appState.currentTaskIndex++;
    
    if (appState.currentTaskIndex < activeTaskSequence.length) {
        appState.isTransitioning = true;
        // Show inter-block speed feedback after first test block (not for infant — no RT measure)
        if (appState.currentTask.id === 'adt_tpl' || appState.currentTask.id === 'cha_tpl' ||
            appState.currentTask.id === 'tod_tpl') {
            setTimeout(() => showInterBlockFeedback(), 500);
        } else {
            setTimeout(() => loadTask(activeTaskSequence[appState.currentTaskIndex]), 100);
        }
    } else {
        // All tasks complete
        finishTest();
    }
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

function continueAfterRecordingReminder() {
    if (elements.recordingReminderContinueBtn) {
        elements.recordingReminderContinueBtn.disabled = true;
    }
    setTimeout(() => loadTask(activeTaskSequence[0]), 1000);
}

// ===== PHOTOCELL =====

// Single-frame photocell flash. Fires one DIN8 event per section start.
// Section identity is resolved in post-processing by aligning the CSV telemetry
// timestamps against DIN8 timestamps in the EEG recording.
// Uses requestAnimationFrame so the flash aligns to a monitor vsync boundary
// (~16ms at 60Hz) rather than the unreliable JS event-loop timer.
let flashInProgress = false;
function flashButtonIndicator(pendingEvent) {
    if (flashInProgress) {
        // Shouldn't happen in normal flow. Log a FlashConflict row so the CSV flags
        // this trial, then log the event immediately (timestamp will not be vsync-aligned).
        dataManager.logEvent({
            section: 'FlashConflict',
            stimuli: pendingEvent ? pendingEvent.section : 'unknown',
            invokedBy: 'System',
            accuracy: 'n/a',
            testName: pendingEvent ? pendingEvent.testName : '',
            trialsRemaining: pendingEvent ? pendingEvent.trialsRemaining : 'n/a',
            trialName: pendingEvent ? pendingEvent.trialName : ''
        });
        if (pendingEvent) dataManager.logEvent(pendingEvent);
        return;
    }
    flashInProgress = true;
    const indicator = elements.buttonIndicator;

    requestAnimationFrame(() => {         // frame N: ON  → triggers DIN8
        indicator.style.backgroundColor = 'white';
        if (pendingEvent) dataManager.logEvent(pendingEvent);  // timestamp = flash moment
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

// ===== REWARD ANIMATION =====

const FRAME_ANIMATIONS = {
    apple:      11,
    bus:        13,
    cat:         7,
    chick:       9,
    dog:         4,
    elephant:    9,
    elephant2:   9,
    elephant4:  12,
    flower:      9,
    ghost:       4,
    happy:       3,
    mole:        6,
    monster:     9,
    owl:         9,
    penguin:     4,
    robot:       5,
    snail:       4,
    whale:       4
};

// Pair a sound file from ../public/audio/ with each animation, or null for no sound.
const ANIMATION_SOUNDS = {
    apple:      'pop.mp3',
    bus:        'happyTune.mp3',
    cat:        'happyCat.mp3',
    chick:      'quack.mp3',
    dog:        'salsa.mp3',
    elephant:   'chimes.mp3',
    elephant2:  'weee.mp3',
    elephant4:  'water.mp3',
    flower:     'happyTune.mp3',
    ghost:      'chimes.mp3',
    happy:      'happyTune.mp3',
    mole:       'pop.mp3',
    monster:    'success.mp3',
    owl:        'wakingUp.mp3',
    penguin:    'quack.mp3',
    robot:      'happyGroove.mp3',
    snail:      'wetClick.mp3',
    whale:      'water.mp3'
};
// Available files: chimes.mp3, happyCat.mp3, happyCatSh.mp3, happyGroove.mp3, happyGrooveSh.mp3,
//   happyTune.mp3, happyTuneSh.mp3, pop.mp3, quack.mp3, salsa.mp3, salsaSh.mp3, success.mp3,
//   wakingUp.mp3, wakingUpSh.mp3, water.mp3, waterSh.mp3, weee.mp3, weeeSh.mp3, wetClick.mp3

const ANIMATION_NAMES = Object.keys(FRAME_ANIMATIONS);
let rewardAnimTimer = null;
let _currentAnimAudio = null;

// Preload all animation frames and sounds at startup
const _animPreloadCache = [];
const _audioCache = {};
function preloadAnimationFrames() {
    Object.entries(FRAME_ANIMATIONS).forEach(([name, count]) => {
        for (let i = 1; i <= count; i++) {
            const img = new Image();
            img.src = `../graphics/frames/${name}-${String(i).padStart(2, '0')}.png`;
            _animPreloadCache.push(img);
        }
    });
    Object.values(ANIMATION_SOUNDS).forEach(file => {
        if (file && !_audioCache[file]) {
            const audio = new Audio(`../public/audio/${file}`);
            audio.preload = 'auto';
            _audioCache[file] = audio;
        }
    });
}

function playRewardAnimation(buttonEl) {
    if (rewardAnimTimer) {
        cancelAnimationFrame(rewardAnimTimer);
        rewardAnimTimer = null;
    }

    const animEl = document.getElementById('rewardAnimation');
    if (!animEl || !buttonEl) return;

    const rect = buttonEl.getBoundingClientRect();
    animEl.style.left = rect.left + 'px';
    animEl.style.top = rect.top + 'px';
    animEl.style.display = 'block';

    // Hide buttons during animation
    if (elements.leftButton) elements.leftButton.style.display = 'none';
    if (elements.mdlButton) elements.mdlButton.style.display = 'none';
    if (elements.rightButton) elements.rightButton.style.display = 'none';

    const name = ANIMATION_NAMES[Math.floor(Math.random() * ANIMATION_NAMES.length)];
    const frameCount = FRAME_ANIMATIONS[name];

    // --- SOUND ---
    if (_currentAnimAudio) {
        _currentAnimAudio.pause();
        _currentAnimAudio.currentTime = 0;
    }

    const soundFile = ANIMATION_SOUNDS[name];
    if (soundFile && _audioCache[soundFile]) {
        _currentAnimAudio = _audioCache[soundFile];
        _currentAnimAudio.currentTime = 0;
        _currentAnimAudio.play().catch(() => {});
    } else {
        _currentAnimAudio = null;
    }

    // --- TIMING ---
    const startTime = performance.now();
    const LOOP_DURATION = 2000; // 2s per loop
    const LOOPS = 2;
    const totalDuration = LOOP_DURATION * LOOPS;

    const animate = (now) => {
        const elapsed = now - startTime;
    
        if (elapsed >= totalDuration) {
            animEl.style.display = 'none';
            rewardAnimTimer = null;
            return;
        }
    
        const loopTime = elapsed % LOOP_DURATION;
        const loopProgress = loopTime / LOOP_DURATION;
    
        const eased =
            loopProgress < 0.5
                ? 2 * loopProgress * loopProgress
                : 1 - Math.pow(-2 * loopProgress + 2, 2) / 2;
    
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(eased * frameCount)
        );
    
        animEl.style.backgroundImage =
            `url('../graphics/frames/${name}-${String(frameIndex + 1).padStart(2, '0')}.png')`;
    
        rewardAnimTimer = requestAnimationFrame(animate);
    };
    rewardAnimTimer = requestAnimationFrame(animate);
}

function stopRewardAnimation() {
    if (rewardAnimTimer) { cancelAnimationFrame(rewardAnimTimer); }
    rewardAnimTimer = null;
    const animEl = document.getElementById('rewardAnimation');
    if (animEl) animEl.style.display = 'none';
}

// ===== ORIENTATION HANDLING =====

function applyOrientationLayout() {
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const leftBtn = elements.leftButton;
    const rightBtn = elements.rightButton;
    if (!leftBtn || !rightBtn) return;

    if (isLandscape) {
        // Left button → left side, vertically centered
        leftBtn.style.top = '50%';
        leftBtn.style.left = '20px';
        leftBtn.style.right = '';
        leftBtn.style.bottom = '';
        leftBtn.style.transform = 'translateY(-50%)';

        // Right button → right side, vertically centered
        rightBtn.style.top = '50%';
        rightBtn.style.right = '20px';
        rightBtn.style.left = '';
        rightBtn.style.bottom = '';
        rightBtn.style.transform = 'translateY(-50%)';
    } else {
        // Portrait: restore vertical stacked layout (left=top, right=bottom)
        leftBtn.style.top = '20px';
        leftBtn.style.left = '50%';
        leftBtn.style.right = '';
        leftBtn.style.bottom = '';
        leftBtn.style.transform = 'translateX(-50%)';

        rightBtn.style.top = '';
        rightBtn.style.bottom = '20px';
        rightBtn.style.left = '50%';
        rightBtn.style.right = '';
        rightBtn.style.transform = 'translateX(-50%)';
    }
}

// ===== UTILITY =====

console.log('[APP] Script loaded - ECITT Adult Tasks PWA ready');