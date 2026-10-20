// Tests the debug log (unifiedtasks/js/debug-log.js) in isolation, with and without the `debuglog` flag.
// Run: ELECTRON_RUN_AS_NODE=1 "<Code.exe>" tests/debug-log.test.js   (or: node tests/debug-log.test.js)
const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');
const js = name => fs.readFileSync(path.join(__dirname, '../unifiedtasks/js', name), 'utf8');

function makeContext(flags) {
    const docListeners = {}, winListeners = {}, timeouts = [], intervals = [], frames = [], store = {};
    const ctx = {
        console: { log() {}, warn() {}, error() {} },
        localStorage: {
            getItem: k => (k === 'ecittDevFlags' ? flags : (k in store ? store[k] : null)),
            setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; }
        },
        location: { search: '' },
        document: {
            addEventListener: (type, fn) => { (docListeners[type] = docListeners[type] || []).push(fn); },
            querySelector: () => null, visibilityState: 'visible',
            elementFromPoint: () => ({ tagName: 'DIV', id: 'rightButton', className: 'ecittButton' })
        },
        window: { addEventListener: (type, fn) => { (winListeners[type] = winListeners[type] || []).push(fn); } },
        performance: { now: () => ctx._now },
        _now: 1000,
        setTimeout: fn => { timeouts.push(fn); return timeouts.length; },
        clearTimeout: () => {},
        setInterval: fn => { intervals.push(fn); return intervals.length; },
        requestAnimationFrame: fn => { frames.push(fn); },
        Date, Math, JSON, String, Array, Object, Promise, RegExp, Set,
        appState: { currentTask: { trials: 32 }, currentTrial: 3, currentScreenName: 'promptScreen', trialResponded: false, isTransitioning: false },
        dataManager: { formatSoleScreenTimestamp: () => '2026-10-20@H12:M00:S00.000' },
        elements: {
            leftButton: { style: { display: 'none' } },
            rightButton: { style: { display: 'block' }, getBoundingClientRect: () => ({ left: 100, right: 320, top: 200, bottom: 420, width: 220 }) }
        },
        _docListeners: docListeners, _winListeners: winListeners, _timeouts: timeouts, _intervals: intervals, _frames: frames, _store: store
    };
    ctx.window.document = ctx.document;
    vm.createContext(ctx);
    vm.runInContext('function showScreen(name) { appState.currentScreenName = name; }', ctx);
    vm.runInContext(js('dev-flags.js'), ctx);
    vm.runInContext(js('debug-log.js'), ctx);
    return ctx;
}
const fire = (list, ...args) => (list || []).forEach(fn => fn(...args));
const rowsOf = ctx => vm.runInContext('DebugLog.toCSV()', ctx).split(String.fromCharCode(10)).slice(1);
const kinds = ctx => rowsOf(ctx).map(r => r.split(',')[2]);

// ---- flag off: does nothing ----
{
    const off = makeContext('');
    assert.strictEqual(vm.runInContext('DebugLog.enabled', off), false);
    vm.runInContext("DebugLog.add('touch', 'x')", off);
    vm.runInContext("debugStep('lock')", off);
    assert.strictEqual(rowsOf(off).length, 0, 'no rows without the flag');
    assert.strictEqual((off._docListeners.pointerdown || []).length, 0, 'no listeners without the flag');
    assert.strictEqual(off._intervals.length + off._frames.length, 0, 'no timers or frame loop without the flag');
    console.log('ok debug log is inert without the flag');
}

// ---- flag on ----
const on = makeContext('debuglog');
assert.strictEqual(vm.runInContext('DebugLog.enabled', on), true);
const csvHeader = vm.runInContext('DebugLog.toCSV()', on).split(String.fromCharCode(10))[0];
assert.strictEqual(csvHeader, 'Time,PerfMs,Kind,Detail,Screen,TapsLocked,Transitioning,Trial');

// touches, including one on empty background, and a cancelled one
fire(on._docListeners.pointerdown, { clientX: 850.4, clientY: 420.2, pointerType: 'touch', target: { tagName: 'DIV', id: 'promptScreen', className: 'screen' } });
fire(on._docListeners.touchstart, { touches: [{ clientX: 851, clientY: 421 }], target: { tagName: 'DIV', id: 'promptScreen', className: 'screen' } });
fire(on._docListeners.pointercancel, { clientX: 5, clientY: 6, target: { tagName: 'DIV', id: 'rightButton', className: 'ecittButton' } });
let rows = rowsOf(on);
assert.ok(rows.some(r => /,touch,x850 y420 on div#promptScreen.screen \(touch\),promptScreen,false,false,3\/32$/.test(r)), 'touch row: ' + rows[0]);
assert.ok(kinds(on).includes('touchstart') && kinds(on).includes('pointercancel'), 'touchstart and pointercancel are logged');

// the steps and taps from trial-flow.js
vm.runInContext("debugStep('call'); debugStep('reset'); debugStep('tap:accepted (right)'); debugStep('lock'); debugStep('tap:ignored - taps are locked (trial already answered)')", on);
vm.runInContext("debugStep('promptRendered')", on);
rows = rowsOf(on);
assert.ok(kinds(on).includes('call'), 'call');
assert.ok(rows.some(r => /,tap,ignored - taps are locked \(trial already answered\),/.test(r)), 'ignored taps say why');
assert.ok(rows.some(r => /,step,lock,/.test(r)), 'steps are logged');
assert.ok(rows.some(r => /,buttons,right x100-320 y200-420 top-at-centre=div#rightButton.ecittButton,/.test(r)), 'button boxes logged when the prompt is shown: ' + rows.filter(r => /,buttons,/.test(r)));

// errors
fire(on._winListeners.error, { message: 'boom', filename: 'http://x/js/trial-flow.js', lineno: 77 });
fire(on._winListeners.unhandledrejection, { reason: 'nope' });
assert.ok(rowsOf(on).some(r => /,error,boom @ trial-flow.js:77,/.test(r)), 'errors are logged');
assert.ok(rowsOf(on).some(r => /unhandled promise rejection: nope/.test(r)));

// screen changes (showScreen is wrapped, and still works)
vm.runInContext("showScreen('waitScreen')", on);
assert.ok(rowsOf(on).some(r => /,screen,waitScreen,/.test(r)), 'screen change logged');
assert.strictEqual(vm.runInContext('appState.currentScreenName', on), 'waitScreen', 'the real showScreen still runs');

// stalls: only gaps over 100 ms
on._frames.shift()(1100);                // first frame: gap from 1000 = 100, not a stall
let again = on._frames.shift(); again(1150);   // 50 ms
let third = on._frames.shift(); third(1500);   // 350 ms
assert.deepStrictEqual(rowsOf(on).filter(r => /,stall,/.test(r)).map(r => r.split(',')[3]), ['350 ms without a screen frame'], 'only the long gap is a stall');

// state is logged when it changes, not every tick
const tick = on._intervals[0];
const stateRows = () => rowsOf(on).filter(r => /,state,/.test(r)).length;
tick(); const first = stateRows(); tick(); assert.strictEqual(stateRows(), first, 'unchanged state is not repeated');
vm.runInContext('appState.trialResponded = true', on); tick();
assert.strictEqual(stateRows(), first + 1, 'a change is logged');
assert.ok(rowsOf(on).some(r => /,state,screen=waitScreen transitioning=false locked=true buttons shown: right,/.test(r)), 'state names the shown buttons');

// CSV quoting
vm.runInContext("DebugLog.add('error', 'has, comma and \"quote\"')", on);
assert.ok(rowsOf(on).some(r => r.includes('"has, comma and ""quote"""')), 'cells with commas and quotes are escaped');

// own storage copy: saved under the session's key, restorable, cleared with the session
vm.runInContext("DebugLog.begin('ecitt_autosave_P1_123')", on);
on._timeouts.splice(0).forEach(fn => fn());              // the debounced save fires
const saved = JSON.parse(on._store.ecitt_autosave_P1_123_debuglog);
assert.ok(Array.isArray(saved) && saved.length > 5, 'log saved separately from the main autosave');
vm.runInContext('DebugLog.clear()', on);
assert.strictEqual(rowsOf(on).length, 0, 'cleared');
assert.strictEqual(vm.runInContext("DebugLog.restore('ecitt_autosave_P1_123')", on), true);
assert.strictEqual(rowsOf(on).length, saved.length, 'restored after a reload');

// size cap
vm.runInContext("for (let i = 0; i < 26000; i++) DebugLog.add('step', 'n' + i)", on);
assert.ok(vm.runInContext('DebugLog.rowCount()', on) <= 25000, 'the log is capped');
assert.ok(rowsOf(on).some(r => /,step,n25999,/.test(r)), 'newest rows are kept');

console.log('ok debug log records touches, taps, steps, errors, stalls, screens and state');
console.log('debug-log: all tests passed');
