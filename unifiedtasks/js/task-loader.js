/**
 * Task loading and trial sequence generation
 * (split from app.js; load order is set in index.html)
 */

// ===== TASK MANAGEMENT =====

function loadTask(taskId) {
    const config = TASK_CONFIGS[taskId];
    appState.currentTask = config;
    appState.currentBlockNumber = appState.currentTaskIndex + 1;
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
        config.id === 'tod_tpl' || config.id === 'tod_tpr' || 
        config.id === 'inf_tpl' || config.id === 'inf_tpr') {
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
