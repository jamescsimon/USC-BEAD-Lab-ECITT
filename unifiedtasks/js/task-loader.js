/**
 * Task loading and trial sequence generation
 * (split from app.js; load order is set in index.html)
 */

// ===== TASK MANAGEMENT =====

/** With { deferFlash: true } returns the function that fires the first photocell flash (see showReadyScreen). */
function loadTask(taskId, options) {
    const config = TASK_CONFIGS[taskId];
    appState.currentTask = config;
    appState.currentBlockNumber = appState.currentTaskIndex + 1;
    appState.currentTrial = 0;
    appState.isTransitioning = false;
    appState.trialResponded = false;
    appState.trialRestartedAfterBreak = false;
    debugStep('unlocked');

    // Pre-fill the jitter pool: shuffle the age-appropriate list repeatedly
    // until we have one entry per trial, then draw in order (no repeats until pool exhausted)
    const jitterSource = appState.ageGroup === 'Adult' ? JITTER_DURATIONS_ADULT
                       : appState.ageGroup === 'Child'  ? JITTER_DURATIONS_CHILD
                       : JITTER_DURATIONS_TODDLER_INFANT; // merged infant/toddler bracket
    const pool = [];
    while (pool.length < config.trials) {
        const needed = config.trials - pool.length;
        const slice = shuffleArray([...jitterSource]).slice(0, needed);
        pool.push(...slice);
    }
    appState.jitterPool = pool;

    // Reset block-level RT counters at the start of each experiment block
    if (config.isExperimentBlock) {
        appState.blockReactionTime = 0;
        appState.blockTrials = 0;
    }

    // Generate trial sequence
    if (config.presetTypes) {
        // Experiment block: order was drawn by buildExperimentBlock() when the block was created
        appState.trialSequence = config.presetTypes.map(type => ({ type, ...config.variants[type] }));
    } else {
        // Single-type tasks (demo / practice) — use trialType if set, otherwise 'standard'
        const type = config.trialType || 'standard';
        appState.trialSequence = Array(config.trials).fill({ type });
    }
    
    // Log task start
    dataManager.logEvent({
        blockNumber: appState.currentTaskIndex + 1,
        trialNumber: appState.currentTrial + 1,
        section: 'TaskStart',
        stimuli: 'blank',
        invokedBy: 'TestSelection',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: config.trials,
        trialName: config.id || 'adt_ppl'
    });
    // Start first trial — ReadyScreen fires the flash, no separate TaskStart flash
    return showReadyScreen(options);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
