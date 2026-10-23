/**
 * Break: the operator pauses the session at any moment and resumes it later.
 *
 * Started by holding the hidden top-right square for 3 seconds (it used to start the NIRS baseline
 * video), or from the "Break" button on the Block Complete screen.
 *
 *   Adult and Child: a plain dark "Break" screen with a Resume button. The screen is held awake
 *                    (keep-awake.js) so it does not time out and lock while the person is away.
 *   Infant/Toddler:  the butterfly break (its own Continue button ends it).
 *
 * While on break: pending trial timers are stopped and any reward animation and its sound are stopped.
 * The plain break writes nothing to the events CSV (the MATLAB alignment would see extra rows); the
 * debug log records it.
 *
 * Resume carries on from where the trial was:
 *   - on the ready screen or a choice screen: nothing was pending, so the screen is simply uncovered;
 *   - right after a response (the next trial was about to start): the next trial / end of the task goes ahead;
 *   - in the middle of a trial that was not answered yet (wait or buttons showing): that trial starts again from
 *     its random wait, with the same wait time handed back, so the trial count and jitter pool are unchanged.
 *     The events CSV then has a second stimulus row for that trial, with the pause between the two.
 */
let onBreak = false;
let breakOverlay = null;       // the plain break screen (Adult / Child); null for the butterfly break
let breakResumeAction = null;

function isOnBreak() {
    return onBreak;
}

/** @param {function} [afterResume] what to do when the break ends, instead of the default for the screen */
function startBreak(afterResume) {
    if (onBreak) return;

    const screen = appState.currentScreenName;
    const allowed = ['readyScreen', 'waitScreen', 'promptScreen', 'choiceScreen'];

    if (appState.isDNF || appState.isComplete || !appState.participantId) return;
    // (choice screens are shown while isTransitioning is true, by design)
    if (!allowed.includes(screen) || (appState.isTransitioning && screen !== 'choiceScreen')) {
        debugStep(`hold:break ignored (screen ${screen}, transitioning ${appState.isTransitioning})`);
        return;
    }

    // what to do when the break ends, decided from where the trial was
    if (screen === 'readyScreen' || screen === 'choiceScreen') {
        breakResumeAction = null;                                  // nothing was pending
    } else if (appState.trialResponded) {
        const task = appState.currentTask;
        breakResumeAction = () => (appState.currentTrial < task.trials ? showWaitScreen('System') : finishTask());
    } else {
        const usedJitter = appState.jitterDuration;
        breakResumeAction = () => {
            if (usedJitter !== undefined) appState.jitterPool.unshift(usedJitter);   // give back the wait it had used
            appState.trialRestartedAfterBreak = true;                                // recorded in the trials CSV
            showWaitScreen('System');
        };
    }

    if (afterResume) breakResumeAction = afterResume;

    // stop everything that was about to happen
    clearTimeout(appState.waitTimer);
    clearTimeout(appState.nextTrialTimer);
    stopRewardAnimation();
    if (typeof _currentAnimAudio !== 'undefined' && _currentAnimAudio) {
        try { _currentAnimAudio.pause(); } catch (e) {}
    }

    onBreak = true;
    debugStep(`hold:break started on ${screen} (${appState.ageGroup})`);

    if (appState.ageGroup === 'Infant') {
        // infant/toddler: the butterfly break; its Continue button ends the break
        showButterflyTask(endBreak);
        return;
    }

    // adult and child: plain break screen, and the screen is kept awake while nobody touches it
    KeepAwake.start();

    breakOverlay = document.createElement('div');
    breakOverlay.id = 'breakOverlay';
    breakOverlay.style.cssText =
        'position:fixed;left:0;top:0;width:100%;height:100%;z-index:2147483000;background:#222;' +
        'display:flex;flex-direction:column;align-items:center;justify-content:center;';

    const title = document.createElement('div');
    title.textContent = 'Break';
    title.style.cssText = 'color:#fff;font:bold 2.5em sans-serif;margin-bottom:0.6em;';

    const resume = document.createElement('button');
    resume.className = 'start-button';
    resume.textContent = 'Resume';
    resume.addEventListener('click', endBreak);

    breakOverlay.appendChild(title);
    breakOverlay.appendChild(resume);
    document.body.appendChild(breakOverlay);
}

function endBreak() {
    if (!onBreak) return;
    onBreak = false;

    if (breakOverlay) {
        breakOverlay.remove();
        breakOverlay = null;
    }

    const action = breakResumeAction;
    breakResumeAction = null;

    debugStep('hold:break ended');
    if (action) action();
}
