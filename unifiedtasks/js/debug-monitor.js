/**
 * Optional on-screen performance monitor. Only active with the `debug` developer flag
 * (?debug in the URL, or set it from the first screen; see dev-flags.js). Does nothing otherwise.
 *
 * Use it on the iPad to see WHY taps or the photocell seem to stall:
 *   frame gap  - longest time between two screen frames in the last 5 s. Big numbers (hundreds
 *                of ms) mean the page is busy and cannot draw or react.
 *   handler    - how long the last / slowest tap handler took.
 *   taps       - pointer touches the page received vs. taps the task actually accepted
 *                (the difference is ignored duplicates).
 *   flash      - whether the photocell gate is closed and how many flashes were refused.
 */
(function () {
    if (typeof hasDevFlag !== 'function' || !hasDevFlag('debug')) return;

    const box = document.createElement('div');
    box.style.cssText =
        'position:fixed;top:4px;right:4px;z-index:2147483647;pointer-events:none;' +
        'background:rgba(0,0,0,0.75);color:#0f0;font:12px/1.3 monospace;padding:4px 6px;white-space:pre;';
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(box));

    let lastFrame = performance.now();
    const gaps = []; // [time, gap]
    let pointerTouches = 0;
    let acceptedTaps = 0;
    let lastHandlerMs = 0;
    let worstHandlerMs = 0;

    const frame = now => {
        gaps.push([now, now - lastFrame]);
        lastFrame = now;
        while (gaps.length && now - gaps[0][0] > 5000) gaps.shift();
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    document.addEventListener('pointerdown', () => { pointerTouches++; }, true);

    // Time every tap handler call (handleButtonPress is a plain global function).
    const wrapWhenReady = () => {
        if (typeof handleButtonPress !== 'function') return setTimeout(wrapWhenReady, 50);
        const original = handleButtonPress;
        handleButtonPress = function (button, event) {
            const before = appState.lastButtonPressTime;
            const t0 = performance.now();
            const result = original.call(this, button, event);
            lastHandlerMs = performance.now() - t0;
            worstHandlerMs = Math.max(worstHandlerMs, lastHandlerMs);
            if (appState.lastButtonPressTime !== before) acceptedTaps++;
            return result;
        };
    };
    wrapWhenReady();

    setInterval(() => {
        const worstGap = gaps.reduce((m, g) => Math.max(m, g[1]), 0);
        const gateWait = Math.max(0, Math.round(flashGateOpenAt - performance.now()));
        const refused = typeof dataManager !== 'undefined'
            ? dataManager.sessionData.filter(r => r.SectionStarted === 'FlashConflict').length
            : 0;
        box.textContent =
            `frame gap (5s max): ${Math.round(worstGap)} ms\n` +
            `handler: last ${lastHandlerMs.toFixed(1)} ms, worst ${worstHandlerMs.toFixed(1)} ms\n` +
            `taps: touches ${pointerTouches}, accepted ${acceptedTaps}\n` +
            `flash: ${flashInProgress ? 'ON' : 'off'}, gate closed for ${gateWait} ms, refused ${refused}`;
    }, 250);
})();

/**
 * Step tracker panel (`debug` flag). A large list of the steps that run after a tap ends a trial.
 * Each line is tracked on its own and appears only when ITS code has finished, in whatever order that
 * happens, with the time since the tap. A step that never appears is the one that did not run.
 *
 *   1  taps locked                   2  response row logged        3  response photocell flash on
 *   4  trial row logged              5  reward animation started   6  trial counter advanced
 *   7a next-trial timer set          7b next-trial timer fired     7c jitter wait screen shown
 *   7d task over (finishTask)        7e prompt starting            7f buttons shown
 *   7g TAPS UNLOCKED
 * The top lines show what happened to the latest tap and the live state that decides whether taps count.
 */
(function () {
    if (typeof hasDevFlag !== 'function' || !hasDevFlag('debug')) return;

    const SLOTS = [
        { labels: { lock: '1  taps locked' } },
        { labels: { rowLogged: '2  response row logged' } },
        { labels: { flash: '3  response photocell flash on' } },
        { labels: { trialLogged: '4  trial row logged' } },
        { labels: { animation: '5  reward animation started', animationSkipped: '5  reward animation skipped' } },
        { labels: { advance: '6  trial counter advanced' } },
        { labels: { timerSet: '7a next-trial timer set' } },
        { labels: { timerFired: '7b next-trial timer fired' } },
        { labels: { waitShown: '7c jitter wait screen shown' } },
        { labels: { finishEntered: '7d task over: finishTask entered' } },
        { labels: { promptStarted: '7e prompt starting' } },
        { labels: { promptRendered: '7f buttons shown' } },
        { labels: { unlocked: '7g TAPS UNLOCKED' } }
    ];

    const panel = document.createElement('div');
    panel.style.cssText =
        'position:fixed;top:4px;left:4px;z-index:2147483647;pointer-events:none;' +
        'background:rgba(0,0,0,0.8);color:#0f0;font:bold 20px/1.3 monospace;padding:6px 10px;white-space:pre;';

    const tapLine = document.createElement('div');
    tapLine.style.color = '#ff0';
    tapLine.textContent = 'last tap: none yet';
    const stateLine = document.createElement('div');
    stateLine.style.color = '#0ff';
    panel.appendChild(tapLine);
    panel.appendChild(stateLine);

    const rows = SLOTS.map(() => {
        const row = document.createElement('div');
        row.style.visibility = 'hidden';
        row.textContent = ' ';
        panel.appendChild(row);
        return row;
    });

    let resetAt = performance.now();

    const reset = () => {
        resetAt = performance.now();
        rows.forEach(row => { row.style.visibility = 'hidden'; row.textContent = ' '; });
    };

    window.__debugStepSink = id => {
        if (id === 'reset') return reset();
        if (id.startsWith('tap:')) { tapLine.textContent = 'last tap: ' + id.slice(4); return; }

        SLOTS.forEach((slot, index) => {
            if (slot.labels[id]) {
                rows[index].textContent = `${slot.labels[id]}  +${Math.round(performance.now() - resetAt)} ms`;
                rows[index].style.visibility = 'visible';
            }
        });
    };

    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(panel));

    setInterval(() => {
        stateLine.textContent =
            `screen: ${appState.currentScreenName}  transitioning: ${appState.isTransitioning}  taps locked: ${appState.trialResponded}`;
    }, 250);
})();
