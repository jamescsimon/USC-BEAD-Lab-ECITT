/**
 * Per-bracket protocol: practice trial, on-demand experiment blocks, target counts.
 *
 * Brackets: Infant (covers infant and toddler), Child, Adult.
 * The prepotent side is fixed per participant and equals appState.counterbalance
 * ('left' = left side is prepotent for the whole visit).
 *
 * Blocks are not listed up front. After the practice gate the experimenter starts
 * block 1, and the block-end screen offers Resume / Break / End until enough
 * inhibitory trials have been completed.
 */

// Target for the whole visit (30 needed for analysis + 2 spare).
const INHIBITORY_TARGET = 32;

// Compliance check: accuracy of each trial's FIRST response across experiment trials.
// Below 60% flags a participant who is probably not engaging (it does not change the task).
// Not evaluated until 10 trials so a couple of early misses don't trigger it.
const ENGAGEMENT_MIN_ACCURACY = 0.6;
const ENGAGEMENT_MIN_TRIALS = 10;

function isLowEngagement(trialsDone, firstResponsesCorrect) {
    return trialsDone >= ENGAGEMENT_MIN_TRIALS &&
        firstResponsesCorrect / trialsDone < ENGAGEMENT_MIN_ACCURACY;
}

// Existing per-direction configs in TASK_CONFIGS are reused as templates so the on-screen
// messages and button layouts stay exactly as they were.
const BRACKET_PROTOCOL = {
    Infant: {
        prefix: 'inf',
        preTestTasks: ['inf_demo'],
        practiceTemplate: { left: 'inf_plp', right: 'inf_prp' },
        testTemplate: { left: 'inf_tpl', right: 'inf_tpr' },
        waitForCorrectResponse: true,
        showResponseTimeFeedback: false
    },
    Child: {
        prefix: 'cha',
        preTestTasks: ['cha_demo'],
        practiceTemplate: { left: 'cha_ppl', right: 'cha_ppr' },
        testTemplate: { left: 'cha_tpl', right: 'cha_tpr' },
        waitForCorrectResponse: false,
        showResponseTimeFeedback: true,
        blockEndAnimation: true
    },
    Adult: {
        prefix: 'adt',
        preTestTasks: [],
        practiceTemplate: { left: 'adt_ppl', right: 'adt_ppr' },
        testTemplate: { left: 'adt_tpl', right: 'adt_tpr' },
        waitForCorrectResponse: false,
        showResponseTimeFeedback: true,
        blockEndAnimation: true
    }
};

/**
 * Which chick-hatching frame (1..frameCount) to show for progress toward the inhibitory target.
 * Frame 1 = egg at 0; the last frame (hatched) appears only once the target is reached.
 */
function chickFrameFor(count, target, frameCount) {
    const fraction = Math.max(0, Math.min(1, count / target));
    if (fraction >= 1) return frameCount;
    return 1 + Math.floor(fraction * (frameCount - 1));
}

/** Registers (idempotently) a one-trial practice task for this bracket and side; returns its id. */
function makePracticeTask(ageGroup, side) {
    const proto = BRACKET_PROTOCOL[ageGroup];
    const template = TASK_CONFIGS[proto.practiceTemplate[side]];
    const id = `${proto.prefix}_practice1_${side}`;
    TASK_CONFIGS[id] = Object.assign({}, template, {
        id,
        name: `${ageGroup} Practice Trial (${side})`,
        trials: 1,
        allowCorrection: proto.waitForCorrectResponse,
        isPractice: true
    });
    return id;
}

/**
 * Registers a freshly randomised 32-trial experiment block and returns its id.
 * @param {number} blockNumber 1-based experiment block count for this visit
 */
function makeExperimentBlockTask(ageGroup, side, blockNumber) {
    const proto = BRACKET_PROTOCOL[ageGroup];
    const template = TASK_CONFIGS[proto.testTemplate[side]];
    const types = buildExperimentBlock();
    const id = `${proto.prefix}_exp${blockNumber}_${side}`;
    TASK_CONFIGS[id] = Object.assign({}, template, {
        id,
        name: `${ageGroup} Experiment Block ${blockNumber} (${side})`,
        trials: types.length,
        // Infant: a wrong tap leaves the trial open until the correct button is hit.
        // Child/Adult: the first response ends the trial (as in the papers). The old child
        // test configs had this set to true, so it must be overridden here.
        allowCorrection: proto.waitForCorrectResponse,
        isExperimentBlock: true,
        presetTypes: types
    });
    return id;
}

/** Tasks that run before the experimenter-controlled blocks: demo (if any), then one practice trial. */
function buildInitialSequence(ageGroup, side) {
    const proto = BRACKET_PROTOCOL[ageGroup];
    return [...proto.preTestTasks, makePracticeTask(ageGroup, side)];
}
