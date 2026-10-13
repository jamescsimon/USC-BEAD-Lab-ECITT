/**
 * Shared application state and DOM element cache
 * (split from app.js; load order is set in index.html)
 */

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
    isTransitioning: false,
    waitTimer: null,
    nextTrialTimer: null,
    currentScreenName: '',
    lastButtonPressTime: 0,
    lastButtonPressKey: ''
};

// ===== DOM ELEMENTS =====

let elements = {};
