// Tests the hidden hold button (operator-controls.js) and the iOS zoom guard (zoom-guard.js).
// Run: ELECTRON_RUN_AS_NODE=1 "<Code.exe>" tests/hold-and-zoom.test.js   (or: node tests/hold-and-zoom.test.js)
const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');
const js = name => fs.readFileSync(path.join(__dirname, '../unifiedtasks/js', name), 'utf8');

// ---------------- hold button ----------------
{
    const timers = [];
    const ctx = {
        console: { log() {}, warn() {}, error() {} },
        localStorage: { getItem: () => null },
        document: { addEventListener() {}, querySelector: () => null, createElement: () => ({ style: {}, setAttribute() {} }), body: { appendChild() {} } },
        window: {},
        setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
        clearTimeout: id => { if (id && timers[id - 1]) timers[id - 1].cancelled = true; },
        Date, Math, JSON, String, Array, Object, Promise, RegExp, Set, location: { search: '' }, _steps: []
    };
    vm.createContext(ctx);
    vm.runInContext('const HOLD_TO_ACTIVATE_MS = 3000;', ctx);
    vm.runInContext(js('dev-flags.js'), ctx);
    vm.runInContext(js('operator-controls.js'), ctx);
    vm.runInContext('onDebugStep(id => _steps.push(id));', ctx);

    const makeButton = () => {
        const listeners = {};
        return { id: 'hiddenQuitEarlyButton', style: {}, listeners, addEventListener: (t, f) => { listeners[t] = f; } };
    };
    const ev = type => ({ type, preventDefault() {}, stopPropagation() {} });
    const pending = () => timers.filter(t => !t.cancelled && !t.fired);
    const fireTimer = () => { const t = pending()[0]; t.fired = true; t.fn(); };

    // 1) holding for 3 s activates WITHOUT lifting the finger, and lifting afterwards does not fire it again
    {
        let activated = 0;
        const button = makeButton();
        ctx._button = button; ctx._cb = () => { activated++; };
        vm.runInContext('setupHoldToActivate(_button, _cb)', ctx);
        button.listeners.pointerdown(ev('pointerdown'));
        assert.strictEqual(pending().length, 1, 'a 3 s timer is running');
        assert.strictEqual(pending()[0].ms, 3000);
        fireTimer();
        assert.strictEqual(activated, 1, 'activated when 3 s was reached, finger still down');
        button.listeners.pointerup(ev('pointerup'));
        assert.strictEqual(activated, 1, 'lifting the finger afterwards does not activate again');
        assert.strictEqual(button.style.opacity, '0.04', 'the button is hidden again after release');
    }

    // 2) letting go early, or iOS cancelling the touch / the finger sliding off, does nothing
    for (const type of ['pointerup', 'pointercancel', 'pointerleave']) {
        let activated = 0;
        const button = makeButton();
        ctx._button = button; ctx._cb = () => { activated++; };
        vm.runInContext('setupHoldToActivate(_button, _cb)', ctx);
        button.listeners.pointerdown(ev('pointerdown'));
        button.listeners[type](ev(type));
        assert.strictEqual(pending().length, 0, type + ': the timer is cancelled');
        assert.strictEqual(activated, 0, type + ': no activation before 3 s');
    }

    // 3) it can be held again after an earlier hold
    {
        let activated = 0;
        const button = makeButton();
        ctx._button = button; ctx._cb = () => { activated++; };
        vm.runInContext('setupHoldToActivate(_button, _cb)', ctx);
        button.listeners.pointerdown(ev('pointerdown')); fireTimer(); button.listeners.pointerup(ev('pointerup'));
        button.listeners.pointerdown(ev('pointerdown')); fireTimer();
        assert.strictEqual(activated, 2, 'second hold also works');
    }

    // 4) what the debug log gets to see
    const steps = Array.from(ctx._steps);
    assert.ok(steps.some(s => /^hold:hiddenQuitEarlyButton touch started$/.test(s)), 'start is reported');
    assert.ok(steps.some(s => /3 s reached - activating/.test(s)), 'activation is reported');
    assert.ok(steps.some(s => /ended before 3 s \(pointerup\)/.test(s)) && steps.some(s => /ended before 3 s \(pointercancel\)/.test(s)), 'early ends say how they ended');

    // 5) a bigger target than before
    const sized = { style: {} };
    ctx._sized = sized;
    vm.runInContext("styleHiddenOperatorButton(_sized, 'left')", ctx);
    assert.strictEqual(sized.style.width, '56px');
    assert.strictEqual(sized.style.height, '56px');
    assert.strictEqual(sized.style.left, '0px');
    console.log('ok hold button activates at 3 s, cancels cleanly, and is bigger');
}

// ---------------- zoom guard ----------------
{
    const listeners = {};
    let now = 5000;
    const ctx = {
        document: { addEventListener: (type, fn) => { (listeners[type] = listeners[type] || []).push(fn); } },
        Date: { now: () => now }
    };
    vm.createContext(ctx);
    vm.runInContext(js('zoom-guard.js'), ctx);
    const event = () => { const e = { prevented: false, preventDefault() { e.prevented = true; } }; return e; };
    const fire = (type) => { const e = event(); (listeners[type] || []).forEach(fn => fn(e)); return e; };

    assert.ok(fire('gesturestart').prevented && fire('gesturechange').prevented && fire('gestureend').prevented, 'pinch gestures are blocked');
    now = 10000; assert.strictEqual(fire('touchend').prevented, false, 'a single tap is left alone');
    now = 10200; assert.strictEqual(fire('touchend').prevented, true, 'a second tap within 350 ms (double-tap zoom) is cancelled');
    now = 10700; assert.strictEqual(fire('touchend').prevented, false, 'a tap well after the last one is left alone');
    console.log('ok zoom guard blocks pinch and double-tap zoom');
}

console.log('hold-and-zoom: all tests passed');
