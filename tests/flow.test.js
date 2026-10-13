// Drives a whole simulated session through the real scripts with a fake DOM and a manual clock.
// Run: ELECTRON_RUN_AS_NODE=1 "<Code.exe>" tests/flow.test.js   (or: node tests/flow.test.js)
const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');
const root = path.join(__dirname, '../unifiedtasks');

class FakeEl {
    constructor(id) {
        this.id = id; this.children = []; this.listeners = {}; this.disabled = false;
        this._classes = new Set(); this.style = {}; this.textContent = ''; this._html = ''; this.dataset = {};
        const self = this;
        this.classList = {
            add: c => self._classes.add(c), remove: c => self._classes.delete(c),
            contains: c => self._classes.has(c), toggle: (c, on) => (on ? self._classes.add(c) : self._classes.delete(c))
        };
        if (/Screen$/.test(id || '')) this._classes.add('screen');
    }
    get innerHTML() { return this._html; }
    set innerHTML(v) { this._html = v; this.children = []; }
    set className(v) { this._classes = new Set(String(v).split(/\s+/)); }
    addEventListener(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); }
    removeEventListener() {}
    click() { if (!this.disabled) (this.listeners.click || []).forEach(f => f({ preventDefault() {}, stopPropagation() {} })); }
    appendChild(c) { this.children.push(c); return c; }
    removeChild() {}
    remove() {}
    querySelectorAll(sel) { return sel === 'button' ? this.children.filter(c => c.tag === 'button') : []; }
    querySelector() { return null; }
    setAttribute() {} getAttribute() { return null; }
    get parentNode() { return null; }
    set innerHTMLReset(_) {}
}
const els = {};
const getEl = id => (els[id] = els[id] || new FakeEl(id));

const timers = []; let clock = 1000000; let timerSeq = 0;
function drain(limit = 100000) {
    // run due timers in order of time, advancing the fake clock
    let n = 0;
    while (timers.length && n++ < limit) {
        timers.sort((a, b) => a.at - b.at || a.seq - b.seq);
        const t = timers.shift();
        clock = Math.max(clock, t.at);
        t.fn();
    }
}
class FakeDate extends Date { static now() { return clock; } }
const noop = () => {};
const ctx = {
    console: { log: noop, warn: noop, error: (...a) => console.error(...a) },
    document: {
        getElementById: getEl,
        createElement: tag => {
            const e = new FakeEl(null); e.tag = tag;
            e.remove = function () {
                if (this.id === 'photocellSyncOverlay') {
                    ctx._syncCount = (ctx._syncCount || 0) + 1;
                ctx._atReveal = { screen: get('appState.currentScreenName'), block: get('appState.currentTask.isExperimentBlock') };
                }
            };
            return e;
        },
        addEventListener: (e, f) => { ctx._domReady = f; },
        body: new FakeEl('body'), documentElement: new FakeEl('html'),
        querySelectorAll: () => [], querySelector: () => null
    },
    window: { matchMedia: () => ({ matches: false, addEventListener: noop }), addEventListener: noop, localStorage: null },
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    navigator: { mediaDevices: undefined }, alert: noop,
    setTimeout: (fn, ms) => { const id = ++timerSeq; timers.push({ at: clock + (ms || 0), seq: id, fn, id }); return id; },
    clearTimeout: id => { const i = timers.findIndex(t => t.id === id); if (i >= 0) timers.splice(i, 1); },
    setInterval: () => 0, clearInterval: noop,
    requestAnimationFrame: fn => ctx.setTimeout(fn, 16), cancelAnimationFrame: noop,
    Audio: function () { return { play: () => Promise.resolve(), pause: noop, load: noop, addEventListener: noop }; },
    Image: function () { return {}; }, performance: { now: () => clock }, Date: FakeDate, Math, JSON, Object, Array, Promise, Map, Set, String, Number, Error, RegExp, parseInt, parseFloat, isNaN
};
ctx.window.document = ctx.document;
vm.createContext(ctx);
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const m of html.matchAll(/<script src="([^"]+)"><\/script>/g)) {
    vm.runInContext(fs.readFileSync(path.join(root, m[1]), 'utf8'), ctx, { filename: m[1] });
}
// let/const declarations are script-scoped in the context: expose them
const get = expr => vm.runInContext(expr, ctx);
ctx._domReady();

// recording / download side effects are not under test
ctx.__anim = []; vm.runInContext('startRecording = () => {}; stopRecording = () => {};  showCsvDownloadLinks = () => {}; stopAndAutoDownload = () => {}; playRewardAnimation = (el, opts) => { __anim.push(opts || {}); }; stopRewardAnimation = () => {}; showButterflyTask = cb => cb();', ctx);

function playTrial(wrongFirst) {
    get('handleDotPress')(); drain();                       // dot -> (wait) -> prompt
    assert.strictEqual(get('appState.currentScreenName'), 'promptScreen');
    const rewarded = get('appState.currentRewarded');
    if (wrongFirst) {
        clock += 600;
        get('handleButtonPress')(rewarded === 'left' ? 'right' : 'left'); drain();
    }
    clock += 600;
    get('handleButtonPress')(rewarded); drain();
}
function playUntilScreenChange(maxTrials = 200) {
    for (let i = 0; i < maxTrials; i++) {
        if (get('appState.currentScreenName') === 'choiceScreen') return;
        playTrial(false);
    }
    throw new Error('never reached the choice screen');
}
const choice = () => Array.from(els.choiceButtons.children.map(b => b.textContent));
const press = label => els.choiceButtons.children.find(b => b.textContent === label).click();

const chick = get('chickFrameFor');
assert.deepStrictEqual([chick(0, 32, 9), chick(16, 32, 9), chick(31, 32, 9), chick(32, 32, 9), chick(40, 32, 9)], [1, 5, 8, 9, 9]);

for (const [bracket, side] of [['Infant', 'left'], ['Infant', 'right'], ['Child', 'left'], ['Adult', 'right']]) {
    const tag = `${bracket}/${side}`;
    get('restart')();
    ctx._syncCount = 0; ctx.__anim.length = 0;
    els.participantIdInput.value = 'T001';
    get(`select${bracket}`)();
    get('setCounterbalance')(side);
    get('startTest')();
    get('continueAfterRecordingReminder')();                // would start calibration/butterfly: skip straight to the task
    drain();
    // calibration overlays are DOM-only in the real app; jump to the first task directly
    get('loadTask')(get('activeTaskSequence')[0]); drain();
    assert.ok(get('activeTaskSequence').length <= 2, tag + ': initial sequence is demo + practice');

    playUntilScreenChange();                                // demo (if any) + 1 practice trial
    assert.deepStrictEqual(choice(), ['Another Practice', 'Start Test'], tag + ' practice gate');
    assert.strictEqual(els.choiceTitle.textContent, 'Practice Complete');

    press('Another Practice'); drain();
    assert.strictEqual(get('appState.currentTask.isPractice'), true, tag + ' second practice loaded');
    assert.strictEqual(get('appState.currentTask.trials'), 1);
    playUntilScreenChange();
    assert.deepStrictEqual(choice(), ['Another Practice', 'Start Test']);

    press('Start Test'); drain();
    assert.strictEqual(get('appState.currentTask.isExperimentBlock'), true, tag + ' block 1 loaded');
    assert.deepStrictEqual({ ...ctx._atReveal }, { screen: 'readyScreen', block: true }, tag + ' task is already on screen when the sync overlay comes off');
    assert.strictEqual(get('appState.currentTask.trials'), 32);
    const types = get('appState.trialSequence').map(t => t.type);
    assert.strictEqual(types.filter(t => t === 'inhb').length, 8);
    assert.strictEqual(types.slice(0, 3).join(), 'prpt,prpt,prpt');
    // prepotent side follows the counterbalance for the whole visit
    const first = get('appState.trialSequence')[0];
    assert.strictEqual(first.emp, side, tag + ' prepotent side');

    // Infant: a wrong tap must not end the trial; others advance on the first response
    if (bracket === 'Infant') {
        get('handleDotPress')(); drain();
        const rewarded = get('appState.currentRewarded');
        clock += 600; get('handleButtonPress')(rewarded === 'left' ? 'right' : 'left'); drain();
        assert.strictEqual(get('appState.currentTrial'), 0, 'infant wrong tap keeps the trial open');
        clock += 600; get('handleButtonPress')(rewarded); drain();
        assert.strictEqual(get('appState.currentTrial'), 1);
    }
    ctx.__anim.length = 0;
    playUntilScreenChange();
    assert.strictEqual(els.choiceTitle.textContent, 'Block Complete', tag);
    if (bracket === 'Infant') {
        assert.ok(ctx.__anim.length >= 31, tag + ' infant: reward animation after correct responses');
    } else {
        assert.strictEqual(ctx.__anim.length, 1, tag + ' child/adult: only the block-end animation');
        assert.strictEqual(ctx.__anim[0].durationMs, 1500);
        assert.strictEqual(ctx.__anim[0].silent, bracket === 'Adult');
    }
    assert.deepStrictEqual(choice(), ['Resume', 'Break', 'End']);
    assert.strictEqual(get('appState.inhibitoryCompleted'), 8, tag + ' inhibitory completed after block 1');
    const rt = /Average Response Time/.test(els.choiceStats.innerHTML);
    assert.strictEqual(rt, bracket !== 'Infant', tag + ' RT feedback only for child/adult');
    assert.ok(/chick-03\.png/.test(els.choiceStats.innerHTML), tag + ' 8/32 -> frame 3');

    // Resume x3 -> 32 inhibitory
    for (let b = 2; b <= 4; b++) {
        press('Resume'); drain();
        assert.strictEqual(get('appState.currentTask.isExperimentBlock'), true);
        assert.strictEqual(get('appState.experimentBlockCount'), b);
        assert.strictEqual(get('appState.currentTask.trials'), 32);
        assert.strictEqual(get('appState.trialSequence')[0].emp, side, 'direction stays fixed');
        playUntilScreenChange();
    }
    assert.strictEqual(get('appState.inhibitoryCompleted'), 32);
    assert.ok(/chick-09\.png/.test(els.choiceStats.innerHTML), tag + ' 32/32 -> hatched');
    assert.ok(!/\d+ \/ 32/.test(els.choiceStats.innerHTML), 'no number shown');

    // End needs a second tap
    press('End');
    assert.strictEqual(get('appState.currentScreenName'), 'choiceScreen', tag + ' End first tap only arms');
    els.choiceButtons.children[2].click(); drain();   // label now reads 'Tap again to confirm'
    assert.strictEqual(get('appState.currentScreenName'), 'endScreen', tag + ' ended');
    assert.strictEqual(get('appState.isComplete'), true);
    assert.strictEqual(ctx._syncCount, 1, tag + ' sync train runs once per session');
    console.log('ok', tag);
}
console.log('flow: all tests passed');
