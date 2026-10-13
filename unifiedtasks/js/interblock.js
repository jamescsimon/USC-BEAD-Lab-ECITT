/**
 * Progress tracking and inter-block feedback
 * (split from app.js; load order is set in index.html)
 */

const PRACTICE_OR_DEMO_TASK_IDS = [
    // Adult practice / unused warm-up controls
    'adt_ppl',
    'adt_ppr',
    'adt_cl',
    'adt_cr',
    'adt_cm',

    // Child demo/practice
    'cha_demo',
    'cha_ppl',
    'cha_ppr',

    // Toddler practice
    'tod_ppl',
    'tod_ppr',

    // Infant demo/practice
    'inf_demo',
    'inf_plp',
    'inf_prp'
];

function isPracticeOrDemoTask(taskId) {
    return PRACTICE_OR_DEMO_TASK_IDS.includes(taskId);
}

function getNonPracticeProgress() {
    const sequence =
        activeTaskSequence || [];

    const nonPracticeTaskIds =
        sequence.filter(taskId => !isPracticeOrDemoTask(taskId));

    // appState.currentTaskIndex has already been advanced when the inter-block screen appears.
    const completedTaskIds =
        sequence
            .slice(0, appState.currentTaskIndex)
            .filter(taskId => !isPracticeOrDemoTask(taskId));

    const totalBlocks =
        nonPracticeTaskIds.length;

    const completedBlocks =
        completedTaskIds.length;

    const totalTrials =
        nonPracticeTaskIds.reduce((sum, taskId) => {
            return sum + (TASK_CONFIGS[taskId]?.trials || 0);
        }, 0);

    const completedTrials =
        completedTaskIds.reduce((sum, taskId) => {
            return sum + (TASK_CONFIGS[taskId]?.trials || 0);
        }, 0);

    return {
        completedBlocks,
        totalBlocks,
        completedTrials,
        totalTrials
    };
}

// ===== INTER-BLOCK FEEDBACK =====

function showInterBlockFeedback() {
    const avgRT =
        appState.blockTrials > 0
            ? Math.round(appState.blockReactionTime / appState.blockTrials)
            : 0;

    const progress =
        getNonPracticeProgress();

    elements.interBlockStats.innerHTML = `
        <p>Average Response Time: ${avgRT} ms</p>
        <p>Please try to respond faster in the next block.</p>
        <p>But also remember to respond as accurately as possible.</p>

        <hr>

        <p><strong>Blocks completed:</strong> ${progress.completedBlocks} / ${progress.totalBlocks}</p>
        <p><strong>Trials completed:</strong> ${progress.completedTrials} / ${progress.totalTrials}</p>
    `;

    showScreen('interBlockScreen');
}

function showAdultBlockEndAnimationThenFeedback() { // jumpscare
    const overlay =
        document.createElement('div');

    overlay.id = 'adultBlockEndAnimation';

    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '1000000';
    overlay.style.backgroundColor = 'white';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.fontSize = '64px';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.color = '#333';

    overlay.textContent = '★';

    document.body.appendChild(overlay);

    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }

        showInterBlockFeedback();
    }, 1000);
}

function continueAfterInterBlock() {
    loadTaskWithOptionalSync(activeTaskSequence[appState.currentTaskIndex]);
}
