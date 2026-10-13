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

function showBlockEnd() {
    const proto = BRACKET_PROTOCOL[appState.ageGroup];
    let html = '';

    if (proto.showResponseTimeFeedback) {
        const avgRT = appState.blockTrials > 0
            ? Math.round(appState.blockReactionTime / appState.blockTrials)
            : 0;
        html += `
            <p>Average Response Time: ${avgRT} ms</p>
            <p>Please respond faster in the next block.</p>
            <p>But also remember to respond as accurately as possible.</p>
            <hr>`;
    }

    // Progress cue: one static chick-hatching frame, no number or bar. Hatched = target reached.
    const chickFrames = FRAME_ANIMATIONS.chick;
    const frame = chickFrameFor(appState.inhibitoryCompleted, INHIBITORY_TARGET, chickFrames);
    html += `
        <img class="progress-chick" alt="" src="../graphics/frames/chick-${String(frame).padStart(2, '0')}.png">`;

    showChoiceScreen('Block Complete', html, [
        { label: 'Resume', onClick: startNextExperimentBlock },
        { label: 'Break', onClick: () => showButterflyTask(showBlockEnd) },
        { label: 'End', onClick: endSession, confirm: true }
    ]);
}

function endSession() {
    flashButtonIndicator({
        section: 'TaskEnd',
        stimuli: 'blank',
        invokedBy: 'ParticipantBlueButton',
        accuracy: 'n/a',
        testName: appState.ageGroup,
        trialsRemaining: 0,
        trialName: appState.currentTask ? appState.currentTask.id : ''
    });
    finishTest();
}
