/**
 * Optional on-screen performance monitor. Only active when the page URL has ?debug
 * (e.g. .../unifiedtasks/?debug). Does nothing otherwise.
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
    if (typeof location === 'undefined' || !/[?&]debug\b/.test(location.search)) return;

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
