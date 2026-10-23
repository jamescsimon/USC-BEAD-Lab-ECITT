/**
 * Practice gate, experiment-block end screen (Resume / Break / End), session end
 * (split from app.js; load order is set in index.html)
 */

// ===== GENERIC CHOICE SCREEN =====

/**
 * @param {string} title
 * @param {string} statsHtml
 * @param {Array<{label: string, onClick: function, confirm?: boolean}>} buttons
 *   confirm: true = first tap asks for a second tap (used for End, which cannot be undone)
 */
function showChoiceScreen(title, statsHtml, buttons) {
    elements.choiceTitle.textContent = title;
    elements.choiceStats.innerHTML = statsHtml;
    elements.choiceButtons.innerHTML = '';

    buttons.forEach(def => {
        const btn = document.createElement('button');
        btn.className = 'start-button choice-button';
        btn.textContent = def.label;

        let armedTimer = null;
        btn.addEventListener('click', () => {
            if (def.confirm && !armedTimer) {
                btn.textContent = 'Tap again to confirm';
                armedTimer = setTimeout(() => {
                    armedTimer = null;
                    btn.textContent = def.label;
                }, 3000);
                return;
            }
            clearTimeout(armedTimer);
            // one tap only: block the rest while the next step starts
            elements.choiceButtons.querySelectorAll('button').forEach(b => { b.disabled = true; });
            def.onClick();
        });
        elements.choiceButtons.appendChild(btn);
    });

    showScreen('choiceScreen');
}

// ===== PRACTICE GATE =====

function showPracticeChoice() {
    showChoiceScreen('Practice Complete', '', [
        { label: 'Another Practice', onClick: startAnotherPractice },
        { label: 'Start Test', onClick: startNextExperimentBlock }
    ]);
}

function startAnotherPractice() {
    // Re-queue the same practice trial; the task index already points past the end of the list.
    activeTaskSequence.push(makePracticeTask(appState.ageGroup, appState.counterbalance));
    loadTask(activeTaskSequence[appState.currentTaskIndex]);
}

// ===== EXPERIMENT BLOCKS =====

function startNextExperimentBlock() {
    appState.experimentBlockCount++;
    activeTaskSequence.push(
        makeExperimentBlockTask(appState.ageGroup, appState.counterbalance, appState.experimentBlockCount)
    );
    // Same entry point the fixed sequence used before the first test block (runs the photocell sync train).
    loadTaskWithOptionalSync(activeTaskSequence[appState.currentTaskIndex]);
}

// Child/Adult: no animation after responses, one short animation when the 32-trial block ends.
const BLOCK_END_ANIMATION_MS = 1500;

function showBlockEndAfterAnimation() {
    if (!BRACKET_PROTOCOL[appState.ageGroup].blockEndAnimation) {
        showBlockEnd();
        return;
    }
    playBlockEndAnimation(BLOCK_END_ANIMATION_MS);
    setTimeout(showBlockEnd, BLOCK_END_ANIMATION_MS + 300);
}

// The hatching chick for the current progress toward INHIBITORY_TARGET. It only fully hatches when the first-tap
// accuracy is also at least 60% (see chickFrameFor).
function progressChickHtml() {
    const frame = chickFrameFor(appState.inhibitoryCompleted, INHIBITORY_TARGET, FRAME_ANIMATIONS.chick, firstTapAccuracyOk());
    return `<img class="progress-chick" alt="" src="../graphics/frames/chick-${String(frame).padStart(2, '0')}.png">`;
}

function showBlockEnd() {
    const proto = BRACKET_PROTOCOL[appState.ageGroup];
    let html = '';

    if (proto.showResponseTimeFeedback) {
        const avgRT = appState.blockTrials > 0
            ? Math.round(appState.blockReactionTime / appState.blockTrials)
            : 0;
        html += `
            <p>Average Response Time: ${avgRT} ms</p>
            ${proto.speedMessage.map(line => `<p>${line}</p>`).join('')}`;
    }

    if (isLowEngagement(appState.experimentTrialsDone, appState.experimentFirstCorrect)) {
        const pct = Math.round(100 * appState.experimentFirstCorrect / appState.experimentTrialsDone);
        html += `<p class="engagement-note">Low accuracy so far (${pct}% first-tap correct). Participant may not be engaging.</p>`;
    }

    // Progress cue: the chick, with the count beside it as bare numbers (done:target, no label)
    html += `
        <div class="progress-row">
            ${progressChickHtml()}
            <p class="progress-count">${appState.inhibitoryCompleted}:${INHIBITORY_TARGET}</p>
        </div>`;

    showChoiceScreen('Block Complete', html, [
        { label: 'Resume', onClick: startNextExperimentBlock },
        // Adult and Child: the plain break screen (screen kept awake). Infant/toddler: the butterfly.
        { label: 'Break', onClick: () => (appState.ageGroup === 'Infant' ? showButterflyTask(showBlockEnd) : startBreak(showBlockEnd)) },
        { label: 'End', onClick: endSession, confirm: true }
    ]);
}

function endSession() {
    const check = dataManager.getFlashCheck();
    flashButtonIndicator({
        section: 'TaskEnd',
        stimuli: `blank|flash_check rows=${check.requiredRows} flashed=${check.flashedRows} missing=${check.missing} conflicts=${check.conflicts}`,
        invokedBy: 'ParticipantBlueButton',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: 0,
        trialName: appState.currentTask ? appState.currentTask.id : ''
    });
    finishTest();
}
