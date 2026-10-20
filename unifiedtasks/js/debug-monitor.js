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
        'background:rgba(0,0,0,0.45);color:#0f0;font:bold 17px/1.25 monospace;padding:4px 8px;white-space:pre;';

    const tapLine = document.createElement('div');
    tapLine.style.color = '#ff0';
    tapLine.textContent = 'last tap: none yet';
    const touchLine = document.createElement('div');
    touchLine.style.color = '#f9f';
    const hitLine = document.createElement('div');
    hitLine.style.color = '#f9f';
    const stateLine = document.createElement('div');
    stateLine.style.color = '#0ff';
    const buttonLine = document.createElement('div');
    buttonLine.style.color = '#fa0';
    panel.appendChild(tapLine);
    panel.appendChild(touchLine);
    panel.appendChild(hitLine);
    panel.appendChild(stateLine);
    panel.appendChild(buttonLine);

    // What the browser does with touches, independent of the task code:
    //   touches   every finger-down the page received
    //   on blue   how many of those landed on a blue button
    //   calls     how many times the blue-button tap code was actually entered
    //   cancelled touches iOS took back (it decided the touch was a gesture, not a tap)
    // and what element the latest touch landed on (an invisible layer over the buttons would show up here).
    let touches = 0, blueTouches = 0, handlerCalls = 0, cancelled = 0;
    let lastHit = 'nothing yet';
    let lastXY = '-';
    let acceptedTaps = 0;
    let lastTapText = 'none yet';
    let lastTapAt = 0;
    const describe = el => {
        if (!el) return 'nothing';
        const cls = typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : '';
        return `${String(el.tagName || '?').toLowerCase()}${el.id ? '#' + el.id : ''}${cls}`;
    };
    document.addEventListener('pointerdown', event => {
        touches++;
        const id = event && event.target && event.target.id;
        if (id === 'leftButton' || id === 'mdlButton' || id === 'rightButton') blueTouches++;
        lastHit = describe(event && event.target);
        lastXY = event ? `x${Math.round(event.clientX)} y${Math.round(event.clientY)}` : '-';
    }, true);
    document.addEventListener('pointercancel', () => { cancelled++; }, true);

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
        if (id === 'call') { handlerCalls++; return; }
        if (id === 'reset') { acceptedTaps++; return reset(); }
        if (id.startsWith('tap:')) { lastTapText = id.slice(4); lastTapAt = performance.now(); return; }

        SLOTS.forEach((slot, index) => {
            if (slot.labels[id]) {
                rows[index].textContent = `${slot.labels[id]}  +${Math.round(performance.now() - resetAt)} ms`;
                rows[index].style.visibility = 'visible';
            }
        });
    };

    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(panel));

    setInterval(() => {
        const ago = lastTapAt ? ((performance.now() - lastTapAt) / 1000).toFixed(1) + ' s ago' : '';
        tapLine.textContent = `tap #${acceptedTaps} (steps below are from it): ${lastTapText}  ${ago}`;
        touchLine.textContent = `touches ${touches} | on blue ${blueTouches} | calls ${handlerCalls} | cancelled ${cancelled}`;
        hitLine.textContent = `last touch at ${lastXY} landed on: ${lastHit}`;

        // Where each visible blue button really is, and what is on top at its centre. If a touch inside
        // a button's box lands on something else, that something covers the button.
        const NL = String.fromCharCode(10);
        buttonLine.textContent = ['leftButton', 'mdlButton', 'rightButton'].map(id => {
            const el = elements[id];
            if (!el || el.style.display === 'none' || !el.getBoundingClientRect) return null;
            const r = el.getBoundingClientRect();
            if (!r.width) return null;
            const top = typeof document.elementFromPoint === 'function'
                ? describe(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2))
                : '?';
            return `${id.replace('Button', '')}: x${Math.round(r.left)}-${Math.round(r.right)} y${Math.round(r.top)}-${Math.round(r.bottom)} top at centre: ${top}`;
        }).filter(Boolean).join(NL);

        const display = id => (appState.currentScreenName === 'promptScreen' && elements[id] ? elements[id].style.display || 'default' : '-');
        stateLine.textContent =
            `screen: ${appState.currentScreenName}  transitioning: ${appState.isTransitioning}  taps locked: ${appState.trialResponded}\n` +
            `trial ${appState.currentTrial}/${appState.currentTask ? appState.currentTask.trials : '?'}  buttons: left ${display('leftButton')} mdl ${display('mdlButton')} right ${display('rightButton')}`;
    }, 200);
})();
