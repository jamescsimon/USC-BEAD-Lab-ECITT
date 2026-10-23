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
    getBoundingClientRect() { return { left: 100, top: 100, width: 220, height: 220 }; }
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
// run only the timers due within `ms` of now (leaves later ones such as the 2 s autosave pending)
function drainFor(ms) {
    const limit = clock + ms;
    while (true) {
        timers.sort((a, b) => a.at - b.at || a.seq - b.seq);
        if (!timers.length || timers[0].at > limit) break;
        const t = timers.shift(); clock = Math.max(clock, t.at); t.fn();
    }
    clock = Math.max(clock, limit - ms + 1);
}
class FakeDate extends Date { static now() { return clock; } }
const noop = () => {};
const ctx = {
    console: { log: noop, warn: noop, error: (...a) => console.error(...a) },
    document: {
        getElementById: getEl,
        createElement: tag => {
            const e = new FakeEl(null); e.tag = tag; e.tagName = String(tag).toUpperCase(); (ctx._created = ctx._created || []).push(e);
            if (tag === 'video') e.play = () => { ctx._videoPlays = (ctx._videoPlays || 0) + 1; return Promise.resolve(); };
            e.remove = function () {
                this.removed = true;
                if (this.id === 'photocellSyncOverlay') {
                    ctx._syncCount = (ctx._syncCount || 0) + 1;
                ctx._atReveal = { screen: get('appState.currentScreenName'), block: get('appState.currentTask.isExperimentBlock') };
                }
            };
            return e;
        },
        addEventListener: (e, f) => { (ctx._docL = ctx._docL || {})[e] = (ctx._docL[e] || []).concat(f); if (e === 'DOMContentLoaded') ctx._domReady = f; },
        visibilityState: 'visible',
        body: new FakeEl('body'), documentElement: new FakeEl('html'),
        querySelectorAll: () => [], querySelector: () => null
    },
    window: { matchMedia: () => ({ matches: false, addEventListener: noop }), addEventListener: noop, localStorage: null },
    localStorage: { getItem: k => (k === 'ecittDevFlags' ? (process.env.ECITT_FLAGS || null) : null), setItem: k => { if (!/_debuglog$/.test(k)) ctx._saves = (ctx._saves || 0) + 1; }, removeItem: noop },
    navigator: {
        mediaDevices: undefined,
        wakeLock: { request: async () => { ctx._wakeRequests = (ctx._wakeRequests || 0) + 1; return { release() { ctx._wakeReleases = (ctx._wakeReleases || 0) + 1; }, addEventListener() {} }; } }
    }, alert: noop,
    setTimeout: (fn, ms) => { const id = ++timerSeq; timers.push({ at: clock + (ms || 0), seq: id, fn, id }); return id; },
    clearTimeout: id => { const i = timers.findIndex(t => t.id === id); if (i >= 0) timers.splice(i, 1); },
    setInterval: () => 0, clearInterval: noop,
    requestAnimationFrame: fn => ctx.setTimeout(() => fn(clock), 16), cancelAnimationFrame: noop,
    Audio: function () { return { play: () => Promise.resolve(), pause: noop, load: noop, addEventListener: noop }; },
    Blob: class { constructor(parts) { this.parts = parts; } }, URL: { createObjectURL: () => 'blob:test', revokeObjectURL() {} },
    Image: function () { this.decode = () => { ctx._decoded = (ctx._decoded || 0) + 1; return Promise.resolve(); }; }, performance: { now: () => clock }, Date: FakeDate, Math, JSON, Object, Array, Promise, Map, Set, String, Number, Error, RegExp, parseInt, parseFloat, isNaN
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
ctx.__anim = []; ctx.__animEl = []; vm.runInContext('globalThis.__realReward = playRewardAnimation; globalThis.__realButterfly = showButterflyTask; globalThis.__realCalibration = showVideoCalibrationTask; startRecording = () => {}; stopRecording = () => {};  playRewardAnimation = (el, opts) => { __anim.push(opts || {}); __animEl.push(el && el.style ? el.style.display : 0); }; stopRewardAnimation = () => {}; showButterflyTask = cb => cb();', ctx);

function playTrial(wrongFirst) {
    // Trial 1 of a task waits for the dot; trials 2+ start by themselves after jitter
    if (get('appState.currentScreenName') === 'readyScreen') {
        clock += 400; get('handleDotPress')();                // a person takes a moment to press the dot
    }
    drain();
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
// minimal CSV line parser (handles quoted fields with commas)
function csvLine(line) {
    const out = []; let cur = ''; let q = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
        else if (c === '"') q = true; else if (c === ',') { out.push(cur); cur = ''; } else cur += c;
    }
    out.push(cur); return out;
}

const choice = () => Array.from(els.choiceButtons.children.map(b => b.textContent));
const press = label => els.choiceButtons.children.find(b => b.textContent === label).click();

const chick = get('chickFrameFor');
assert.deepStrictEqual([chick(0, 32, 9), chick(16, 32, 9), chick(31, 32, 9), chick(32, 32, 9), chick(40, 32, 9)], [1, 5, 8, 9, 9]);
// below 60% accuracy the chick never fully hatches, even at (or past) 32; earlier frames are unaffected
assert.deepStrictEqual([chick(0, 32, 9, false), chick(16, 32, 9, false), chick(31, 32, 9, false), chick(32, 32, 9, false), chick(40, 32, 9, false)], [1, 5, 8, 8, 8]);
assert.strictEqual(chick(32, 32, 9, true), 9, 'with enough accuracy it still hatches');

for (const [bracket, side] of [['Infant', 'left'], ['Infant', 'right'], ['Child', 'left'], ['Adult', 'right']]) {
    const tag = `${bracket}/${side}`;
    get('restart')();
    ctx._syncCount = 0; ctx.__anim.length = 0;
    ctx._saves = 0;
    clock += 5000; drain();                                 // real sessions start minutes after the last flash
    els.participantIdInput.value = 'T001';
    get(`select${bracket}`)();
    get('setCounterbalance')(side);
    get('startTest')();
    // calibration/butterfly screens are DOM-only; start the first task directly
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

    // First trial of the block: wrong tap first.
    // Infant keeps the trial open until the correct button; Child/Adult end it on the first response.
    {
        clock += 400; get('handleDotPress')(); drain();   // a person takes a moment to press the dot
        const rewarded = get('appState.currentRewarded');
        clock += 600; get('handleButtonPress')(rewarded === 'left' ? 'right' : 'left'); drain();
        const events = () => String(get('dataManager.generateCSV()')).split('\n');
        const header = csvLine(events()[0]);
        const col = name => header.indexOf(name);
        if (bracket === 'Infant') {
            assert.strictEqual(get('appState.currentTrial'), 0, 'infant wrong tap keeps the trial open');
            const wrongRows = events().filter(r => csvLine(r)[col('SectionStarted')] === 'IncorrectResponse');
            assert.strictEqual(wrongRows.length, 1, tag + ' the wrong tap has its own Events CSV row');
            const cells = csvLine(wrongRows[0]);
            assert.strictEqual(cells[col('Accuracy')], '0');
            assert.strictEqual(cells[col('PhotocellFlash')], '1', tag + ' wrong tap is locked to a flash');
            assert.ok(['left', 'right'].includes(cells[col('ButtonPressed')]));
            // first tap of the visit was on the wrong side: the sides swap and the face moves to the tapped side
            assert.strictEqual(get('appState.directionReversed'), true, tag + ' direction reversed');
            assert.strictEqual(get('appState.counterbalance'), side === 'left' ? 'right' : 'left');
            assert.notStrictEqual(get('appState.currentRewarded'), rewarded, tag + ' face moved');
            assert.strictEqual(get('appState.trialSequence')[0].emp, get('appState.counterbalance'));
            ctx._expectedSide = get('appState.counterbalance');
            clock += 600; get('handleButtonPress')(get('appState.currentRewarded')); drain();
        } else {
            ctx._expectedSide = side;
            assert.strictEqual(get('appState.directionReversed'), false, tag + ' no reversal for child/adult');
            assert.strictEqual(get('appState.currentTrial'), 1, tag + ' child/adult: first response ends the trial');
            assert.ok(events().some(r => /Response/.test(csvLine(r)[col('SectionStarted')]) && csvLine(r)[col('Accuracy')] === '0'),
                tag + ' a response row with Accuracy 0 exists');
        }
        assert.strictEqual(get('appState.currentTrial'), 1);
        // trials CSV: first response wrong; infant had 1 incorrect tap
        const t = String(get('dataManager.generateTrialCSV()')).split('\n');
        const th = csvLine(t[0]);
        const last = csvLine(t[t.length - 1]);
        assert.strictEqual(last[th.indexOf('Phase')], 'experiment');
        assert.strictEqual(last[th.indexOf('FirstResponseCorrect')], '0');
        assert.strictEqual(last[th.indexOf('IncorrectTaps')], bracket === 'Infant' ? '1' : '1');
        assert.strictEqual(last[th.indexOf('Direction')], ctx._expectedSide);
        assert.strictEqual(last[th.indexOf('DirectionReversed')], bracket === 'Infant' ? '1' : '0');
    }
    ctx.__anim.length = 0;
    playUntilScreenChange();
    assert.strictEqual(els.choiceTitle.textContent, 'Block Complete', tag);
    if (bracket === 'Adult') {
        assert.strictEqual(ctx.__anim.length, 1, tag + ' adult: only the block-end animation');
        assert.strictEqual(ctx.__anim[0].durationMs, 1500);
        assert.strictEqual(ctx.__anim[0].silent, true);
    } else {
        // Infant and Child: a reward animation after each correct trial, and nothing extra at the block end
        assert.strictEqual(ctx.__anim.length, 31, tag + ' reward animation after each of the 31 remaining correct trials, got ' + ctx.__anim.length);
        assert.ok(ctx.__anim.every(o => o.durationMs === undefined), tag + ' no block-end animation');
        // the animation is placed at the tapped button, so that button must still be on screen when it is asked for
        // its position (a hidden button reports 0,0 and the animation lands in the top-left corner)
        assert.ok(ctx.__animEl.slice(-31).every(d => d !== 'none'), tag + ' tapped button still displayed when the animation is positioned');
    }
    assert.deepStrictEqual(choice(), ['Resume', 'Break', 'End']);
    assert.strictEqual(get('appState.inhibitoryCompleted'), 8, tag + ' inhibitory completed after block 1');
    const rt = /Average Response Time/.test(els.choiceStats.innerHTML);
    assert.strictEqual(rt, bracket !== 'Infant', tag + ' RT feedback only for child/adult');
    assert.ok(/chick-03\.png/.test(els.choiceStats.innerHTML), tag + ' 8/32 -> frame 3');
    assert.ok(/progress-count">8:32</.test(els.choiceStats.innerHTML), tag + ' the count is shown as bare #:## next to the chick');
    assert.ok(!/inhibitory/i.test(els.choiceStats.innerHTML), tag + ' the count is not named');
    if (bracket === 'Adult') assert.ok(/Go a little faster/.test(els.choiceStats.innerHTML) && !/Please respond faster/.test(els.choiceStats.innerHTML), 'adult report does not keep saying go faster');
    if (bracket === 'Child') assert.ok(/Please respond faster in the next block/.test(els.choiceStats.innerHTML), 'child report keeps the papers wording');

    // Resume x3 -> 32 inhibitory
    for (let b = 2; b <= 4; b++) {
        press('Resume'); drain();
        assert.strictEqual(get('appState.currentTask.isExperimentBlock'), true);
        assert.strictEqual(get('appState.experimentBlockCount'), b);
        assert.strictEqual(get('appState.currentTask.trials'), 32);
        assert.strictEqual(get('appState.trialSequence')[0].emp, ctx._expectedSide, 'direction stays fixed (after any reversal)');
        playUntilScreenChange();
    }
    assert.strictEqual(get('appState.inhibitoryCompleted'), 32);
    assert.ok(/chick-09\.png/.test(els.choiceStats.innerHTML), tag + ' 32/32 -> hatched');
    assert.ok(/progress-count">32:32</.test(els.choiceStats.innerHTML), tag + ' 32:32 at the target');
    {   // same 32 inhibitory trials, but mostly wrong first taps: not fully hatched. Exactly 60% is enough.
        const saved = [get('appState.experimentTrialsDone'), get('appState.experimentFirstCorrect')];
        get('appState').experimentTrialsDone = 100; get('appState').experimentFirstCorrect = 59;
        get('showBlockEnd')();
        assert.ok(/chick-08\.png/.test(els.choiceStats.innerHTML) && /progress-count">32:32</.test(els.choiceStats.innerHTML), tag + ' 59% accuracy: 32:32 but the chick stops at frame 8');
        get('appState').experimentFirstCorrect = 60;
        get('showBlockEnd')();
        assert.ok(/chick-09\.png/.test(els.choiceStats.innerHTML), tag + ' exactly 60% accuracy: fully hatched');
        get('appState').experimentTrialsDone = saved[0]; get('appState').experimentFirstCorrect = saved[1];
        get('showBlockEnd')();
    }

    // End needs a second tap
    // trials CSV: one row per experiment trial, one accuracy column, phases labelled
    {
        const t = String(get('dataManager.generateTrialCSV()')).split('\n');
        const th = csvLine(t[0]);
        assert.ok(!th.includes('Accuracy'), 'old Accuracy column replaced');
        assert.ok(['Phase', 'FirstResponseCorrect', 'IncorrectTaps', 'Direction', 'InhibitoryCompletedSoFar', 'LowEngagement'].every(h => th.includes(h)));
        const rows = t.slice(1).map(csvLine);
        const ph = th.indexOf('Phase');
        assert.strictEqual(rows.filter(r => r[ph] === 'experiment').length, 128, tag + ' 4 blocks x 32 experiment trials');
        assert.ok(rows.filter(r => r[ph] === 'practice').length >= 2, tag + ' practice trials labelled');
        assert.strictEqual(rows[rows.length - 1][th.indexOf('InhibitoryCompletedSoFar')], '32');
        // ExperimentBlock numbers only the experiment blocks; StartTimestamp lines a row up with the events file
        const eb = th.indexOf('ExperimentBlock'), st = th.indexOf('StartTimestamp');
        assert.ok(eb >= 0 && st >= 0 && th.includes('RestartedAfterBreak'), 'new trial columns are present');
        const expRows = rows.filter(r => r[ph] === 'experiment');
        assert.deepStrictEqual(Array.from(new Set(expRows.map(r => r[eb]))), ['1', '2', '3', '4'], tag + ' ExperimentBlock is 1..4');
        assert.ok(rows.filter(r => r[ph] !== 'experiment').every(r => r[eb] === ''), tag + ' demo and practice rows have no ExperimentBlock');
        assert.ok(rows.every(r => /^\d{4}-\d{2}-\d{2}@H\d+:M\d+:S[\d.]+$/.test(r[st])), tag + ' StartTimestamp is in the events format');
        assert.ok(expRows.every(r => r[th.indexOf('RestartedAfterBreak')] === '0'), tag + ' no trial was restarted after a break');
        // each experiment trial can be found in the events file by (TrialName, TrialNumber)
        const NLs = String.fromCharCode(10);
        const evTable = String(get('dataManager.generateCSV()')).split(NLs).map(csvLine);
        const eh = evTable[0], eTN = eh.indexOf('TrialName'), eNo = eh.indexOf('TrialNumber'), eSec = eh.indexOf('SectionStarted');
        assert.ok(eNo >= 0, 'events file has TrialNumber');
        const responses = new Set(evTable.filter(r => /TrialResponse$/.test(r[eSec])).map(r => r[eTN] + '#' + r[eNo]));
        const unmatched = expRows.filter(r => !responses.has(r[th.indexOf('TaskID')] + '#' + r[th.indexOf('TrialNumber')]));
        assert.strictEqual(unmatched.length, 0, tag + ' every trials row has a response row in the events file: ' + unmatched.length + ' do not');
        const stimuli = new Set(evTable.filter(r => /TrialScreen$/.test(r[eSec])).map(r => r[eTN] + '#' + r[eNo]));
        assert.ok(expRows.every(r => stimuli.has(r[th.indexOf('TaskID')] + '#' + r[th.indexOf('TrialNumber')])), tag + ' every trial has its stimulus row too');
        // Jitter 1 on EVERY experiment trial, inside this bracket's pool range, and actually random
        const poolName = { Infant: 'JITTER_DURATIONS_TODDLER_INFANT', Child: 'JITTER_DURATIONS_CHILD', Adult: 'JITTER_DURATIONS_ADULT' }[bracket];
        const pool = Array.from(get(poolName));
        const lo = Math.min(...pool), hi = Math.max(...pool);
        const j1 = rows.filter(r => r[ph] === 'experiment').map(r => Number(r[th.indexOf('Jitter1')]));
        assert.ok(j1.every(v => v >= lo && v <= hi), tag + ' every Jitter1 within ' + lo + '-' + hi);
        assert.ok(new Set(j1).size >= 3, tag + ' Jitter1 varies from trial to trial');
        const waitRows = String(get('dataManager.generateCSV()')).split('\n').filter(r => /WaitScreen/.test(r)).length;
        assert.ok(waitRows >= 128, tag + ' a jitter wait before every trial (' + waitRows + ' wait rows)');
    }
    press('End');
    assert.strictEqual(get('appState.currentScreenName'), 'choiceScreen', tag + ' End first tap only arms');
    els.choiceButtons.children[2].click(); drain();   // label now reads 'Tap again to confirm'
    assert.strictEqual(get('appState.currentScreenName'), 'endScreen', tag + ' ended');
    assert.strictEqual(get('appState.isComplete'), true);
    if (process.env.ECITT_DUMP_DIR) {   // optional: write this session's CSVs out, e.g. to try tools/check_session_csv.py on them
        fs.mkdirSync(process.env.ECITT_DUMP_DIR, { recursive: true });
        const stem = path.join(process.env.ECITT_DUMP_DIR, tag.replace('/', '_'));
        fs.writeFileSync(stem + '_trials.csv', String(get('dataManager.generateTrialCSV()')));
        fs.writeFileSync(stem + '_events.csv', String(get('dataManager.generateCSV()')));
    }
    assert.strictEqual(ctx._syncCount, 1, tag + ' sync train runs once per session');
    // every flash-required row got a flash at normal pacing, and the screen says so
    const fc = get('dataManager.getFlashCheck()');
    if (fc.missing !== 0) {
        const lines = String(get('dataManager.generateCSV()')).split('\n').map(csvLine);
        const h = lines[0]; const sI = h.indexOf('SectionStarted'), pI = h.indexOf('PhotocellFlash'), tI = h.indexOf('StartTimestamp'), nI = h.indexOf('TrialName');
        lines.forEach((r, i) => { if (i > 0 && r[pI] === '0') console.log('NO FLASH:', r[sI], r[nI], r[tI], '| prev:', lines[i - 1][sI], lines[i - 1][tI]); });
    }
    assert.strictEqual(fc.missing, 0, tag + ' no row without a flash');
    assert.strictEqual(fc.conflicts, 0, tag + ' no flash conflicts at normal pacing');
    assert.ok(fc.requiredRows > 128, tag + ' flash rows counted');
    assert.ok(!/Photocell/.test(els.endStats.innerHTML), tag + ' end screen says nothing about the photocell when all is well');
    assert.ok(/chick-09\.png/.test(els.endStats.innerHTML), tag + ' end screen shows only the (hatched) chick');
    assert.ok(!/\d/.test(els.endStats.innerHTML.replace(/chick-\d+\.png/, '')), tag + ' end screen has no numbers or stats');
    const links = els.endCsvDownloads.children.map(a => a.textContent);
    const debugOn = get('DebugLog.enabled');   // run with ECITT_FLAGS=debuglog to test the flag on
    assert.strictEqual(links.join('|'), 'Events CSV|Trials CSV' + (debugOn ? '|Debug Log CSV' : ''), tag + ' end screen has one link per CSV (+ the debug log only with its flag)');
    const names = els.endCsvDownloads.children.map(a => a.download);
    assert.ok(/^ECITT_T001_\d{4}-\d{2}-\d{2}_[\d-]+_events\.csv$/.test(names[0]), 'events file name: ' + names[0]);
    assert.ok(/^ECITT_T001_\d{4}-\d{2}-\d{2}_[\d-]+_trials\.csv$/.test(names[1]), 'trials file name: ' + names[1]);
    console.log('ok', tag);
}
// ---- flash gate: a second flash requested while the first is on is refused, but its row is kept ----
{
    get('restart')();
    clock += 5000; drain();
    get('dataManager').startSession('GATE', 'Adult', 'left');
    const flash = get('flashButtonIndicator');
    const ev = section => ({ section, stimuli: 'x', invokedBy: 'test', accuracy: 'n/a', testName: 'Adult', trialsRemaining: 1, trialName: 'adt_exp1_left' });
    const first = flash(ev('ReadyScreen'));
    const second = flash(ev('LeftTrialScreen'));       // same instant -> gate closed
    assert.strictEqual(first, true); assert.strictEqual(second, false);
    drainFor(115);                                      // flash on and off, still inside the dark period
    clock += 5;
    const tooSoon = flash(ev('LeftTrialScreen'));       // inside the dark period after the first flash
    drain();
    const rows = String(get('dataManager.generateCSV()')).split('\n').slice(1).map(csvLine);
    const hdr = csvLine(String(get('dataManager.generateCSV()')).split('\n')[0]);
    const sec = rows.map(r => r[hdr.indexOf('SectionStarted')]);
    const pf = rows.map(r => r[hdr.indexOf('PhotocellFlash')]);
    assert.ok(sec.includes('FlashConflict'), 'refused flash leaves a FlashConflict marker');
    const refusedIdx = sec.indexOf('LeftTrialScreen');
    assert.strictEqual(pf[refusedIdx], '0', 'refused row is kept, flagged as not flashed');
    assert.strictEqual(pf[sec.indexOf('ReadyScreen')], '1');
    const chk = get('dataManager.getFlashCheck()');
    assert.strictEqual(tooSoon, false, 'a flash inside the dark period after the previous one is refused');
    assert.ok(chk.missing >= 1 && chk.conflicts === 2, 'check reports the unflashed rows: ' + JSON.stringify(chk));
    // after the dark period the gate reopens
    clock += 500; drain();
    assert.strictEqual(flash(ev('ReadyScreen')), true, 'gate reopens after the dark period');
    drain();
    console.log('ok flash gate');
}
// ---- autosave debounce: rapid rows do not each serialise the whole session ----
{
    get('restart')();
    clock += 5000; drain();
    get('dataManager').startSession('SAVE', 'Adult', 'left');   // one immediate save
    ctx._saves = 0;
    const log = () => get('dataManager').logTrial({ participantId: 'SAVE', trialNumber: 1 });
    // 40 rows, 100 ms apart (rapid tapping): nothing is saved while activity continues
    for (let i = 0; i < 40; i++) { clock += 100; log(); drainFor(100); }
    assert.strictEqual(ctx._saves, 0, 'no save while rows keep arriving, got ' + ctx._saves);
    // a quiet period flushes exactly once (two setItem calls per save)
    clock += 3500; drain();
    assert.strictEqual(ctx._saves, 2, 'one save after the quiet period');
    // continuous activity for 35 s still saves once at the 30 s cap
    ctx._saves = 0;
    for (let i = 0; i < 350; i++) { clock += 100; log(); drainFor(100); }
    assert.ok(ctx._saves >= 2 && ctx._saves <= 4, 'capped save during long activity, got ' + ctx._saves);
    console.log('ok autosave debounce');
}
// ---- calibration and break sounds play once, not on every move/tap ----
{
    clock += 5000; drain();
    ctx.__sounds = [];
    vm.runInContext("playOneShotAudio = (file) => { __sounds.push(file); }; playCalibrationAudio = () => { __sounds.push('frog-sound'); };", ctx);
    const fire = (el, type) => (el.listeners[type] || []).forEach(f => f({ preventDefault() {}, stopPropagation() {} }));

    // Break butterfly: four touches, one sound (on the first)
    ctx._created.length = 0;
    ctx.__realButterfly(() => {});
    const butterfly = ctx._created.find(e => e.id === 'butterflyTarget');
    assert.ok(butterfly, 'butterfly screen built');
    for (let i = 0; i < 4; i++) { clock += 400; fire(butterfly, 'pointerdown'); }
    assert.strictEqual(ctx.__sounds.filter(f => /happyTune/.test(f)).length, 1, 'butterfly sound plays once: ' + ctx.__sounds);
    // a fresh Break plays it once again on its first touch
    ctx._created.length = 0;
    ctx.__realButterfly(() => {});
    const butterfly2 = ctx._created.find(e => e.id === 'butterflyTarget');
    clock += 400; fire(butterfly2, 'pointerdown'); clock += 400; fire(butterfly2, 'pointerdown');
    assert.strictEqual(ctx.__sounds.filter(f => /happyTune/.test(f)).length, 2, 'a second Break plays it once more');

    // Frog calibration: four frog moves, one sound (when calibration starts)
    ctx.__sounds.length = 0; ctx._created.length = 0;
    ctx.__realCalibration(() => {});
    const start = ctx._created.find(e => e.tag === 'button' && /Tap to start/.test(e.textContent));
    assert.ok(start, 'calibration start button built');
    fire(start, 'pointerdown'); drain();
    assert.strictEqual(ctx.__sounds.filter(f => f === 'frog-sound').length, 1, 'frog sound plays once for Child/Adult, not on each of the 4 moves: ' + ctx.__sounds);
    // Infant/toddler: the frog sound at every position
    get('appState').ageGroup = 'Infant';
    ctx.__sounds.length = 0; ctx._created.length = 0;
    ctx.__realCalibration(() => {});
    fire(ctx._created.find(e => e.tag === 'button' && /Tap to start/.test(e.textContent)), 'pointerdown'); drain();
    assert.strictEqual(ctx.__sounds.filter(f => f === 'frog-sound').length, 4, 'infant frog sound at all 4 positions: ' + ctx.__sounds);
    get('appState').ageGroup = 'Adult';
    console.log('ok break/calibration sounds');
}

// ---- sprite sheets: the files on disk match the frame counts the app expects ----
{
    const pngSize = file => { const b = fs.readFileSync(file); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
    const expectedFrames = Object.assign({}, get('FRAME_ANIMATIONS'), { frog: get('CALIBRATION_SPRITE_FRAMES'), bfly: get('BUTTERFLY_SPRITE_FRAMES') });
    for (const [name, frames] of Object.entries(expectedFrames)) {
        const [w, h] = pngSize(path.join(root, '../graphics/sheets', name + '.png'));
        assert.strictEqual(h, get('SHEET_FRAME_PX'), name + ' sheet height');
        assert.strictEqual(w, frames * get('SHEET_FRAME_PX'), name + ' sheet is ' + frames + ' frames wide, got ' + w / get('SHEET_FRAME_PX'));
    }
    console.log('ok sprite sheets match the app (' + Object.keys(expectedFrames).length + ' sheets)');
}

// ---- a reward animation loads its sheet ONCE and then only moves the window ----
{
    clock += 5000; drain();
    const writes = [];
    const animEl = getEl('rewardAnimation');
    animEl.style = new Proxy({}, { set(t, prop, value) { writes.push([prop, value]); t[prop] = value; return true; } });
    get('appState').ageGroup = 'Child';
    const button = getEl('leftButton'); button.style.display = 'block';
    ctx.__realReward(button);
    drainFor(1700);
    const sheetWrites = writes.filter(w => w[0] === 'backgroundImage');
    assert.strictEqual(sheetWrites.length, 1, 'the sheet is set once per play, not once per frame: ' + sheetWrites.length);
    assert.ok(/graphics\/sheets\/[a-z0-9]+\.png/.test(sheetWrites[0][1]), 'it is a sheet: ' + sheetWrites[0][1]);
    assert.ok(writes.findIndex(w => w[0] === 'backgroundImage') < writes.findIndex(w => w[0] === 'display' && w[1] === 'block'),
        'the sheet and first frame are in place before the animation becomes visible');
    const positions = writes.filter(w => w[0] === 'backgroundPosition').map(w => parseInt(w[1], 10));
    assert.ok(positions.every(x => x <= 0 && x % get('SHEET_FRAME_PX') === 0), 'positions are whole frames: ' + positions.slice(0, 6));
    assert.ok(new Set(positions).size >= 3, 'the window actually moves through several frames');
    assert.strictEqual(animEl.style.display, 'none', 'the animation hides itself when done');
    get('appState').ageGroup = 'Adult';
    console.log('ok reward animation plays from one sheet');
}

// ---- debug step tracker: every step reports itself, independently, from the code that runs it ----
{
    get('restart')(); els.participantIdInput.value = 'STEPS'; get('selectChild')(); get('setCounterbalance')('left'); get('startTest')();
    clock += 5000; drain();
    const seen = [];
    ctx.window.__debugStepSink = id => seen.push(id);
    const blockId = get("makeExperimentBlockTask('Child','left',1)");
    get('appState').experimentBlockCount = 1;
    get('activeTaskSequence').push(blockId); get('appState').currentTaskIndex = get('activeTaskSequence').length - 1;
    get('loadTask')(blockId); drain();
    clock += 400; get('handleDotPress')(); drain(); clock += 400;
    seen.length = 0;

    const rewarded = get('appState.currentRewarded');
    get('handleButtonPress')(rewarded);
    // straight away (synchronous steps)
    for (const id of ['reset', 'lock', 'trialLogged', 'animation', 'advance', 'timerSet']) assert.ok(seen.includes(id), 'step reported at once: ' + id + ' in ' + seen);
    assert.ok(seen.some(id => /^tap:accepted/.test(id)), 'the tap is reported as accepted');
    assert.ok(seen.includes('call'), 'entering the tap code is reported even before any guard');
    // a second tap while locked is reported with its reason
    get('handleButtonPress')(rewarded === 'left' ? 'right' : 'left');
    assert.ok(seen.some(id => /^tap:ignored - taps are locked/.test(id)), 'ignored tap says why: ' + seen.filter(id => id.startsWith('tap:')));
    // later steps, each from its own code path
    drainFor(100);
    for (const id of ['rowLogged', 'flash']) assert.ok(seen.includes(id), 'step reported after the frame: ' + id);
    drain();
    for (const id of ['timerFired', 'waitShown', 'promptStarted', 'promptRendered', 'unlocked']) assert.ok(seen.includes(id), 'step reported later: ' + id + ' in ' + seen);
    assert.strictEqual(get('appState.trialResponded'), false, 'taps really are unlocked when step 7g is reported');

    // end of a task (practice trial): the finish path reports itself instead of the next-trial steps
    get('activeTaskSequence').push(get("makePracticeTask('Child','left')")); get('appState').currentTaskIndex = get('activeTaskSequence').length - 1;
    get('loadTask')(get('activeTaskSequence')[get('appState').currentTaskIndex]); drain();
    clock += 400; get('handleDotPress')(); drain(); clock += 400;
    seen.length = 0;
    get('handleButtonPress')(get('appState.currentRewarded')); drain();
    assert.ok(seen.includes('finishEntered'), 'finishTask reports itself: ' + seen);
    assert.ok(!seen.includes('waitShown'), 'no next-trial wait after the last trial');

    // the panel: a line appears only when its own step ran, in any order
    vm.runInContext("DEV_FLAGS.add('debug')", ctx);
    ctx._created.length = 0;
    vm.runInContext(fs.readFileSync(path.join(root, 'js/debug-monitor.js'), 'utf8'), ctx);
    const rowByText = text => ctx._created.find(e => typeof e.textContent === 'string' && e.textContent.startsWith(text));
    const sink = ctx.window.__debugStepSink;
    assert.strictEqual(typeof sink, 'function', 'panel installs its sink');
    sink('unlocked');                                      // a LATE step first: nothing forces the order
    sink('lock');
    const shown = ctx._created.filter(e => e.style && e.style.visibility === 'visible').map(e => e.textContent.split('  +')[0]);
    assert.deepStrictEqual(Array.from(shown).sort(), ['1  taps locked', '7g TAPS UNLOCKED'].sort(), 'only the steps that ran are shown');
    sink('reset');
    assert.strictEqual(ctx._created.filter(e => e.style && e.style.visibility === 'visible').length, 0, 'a new tap clears the list');
    ctx.window.__debugStepSink = undefined;
    vm.runInContext("DEV_FLAGS.delete('debug')", ctx);
    console.log('ok debug step tracker');
}

// ---- Break: Adult/Child plain break (screen kept awake), Infant butterfly; pause anywhere, resume where it was ----
{
    const hasOverlay = () => ctx._created.some(e => e.id === 'breakOverlay' && !e.removed);
    const startSession = bracket => {
        get('restart')(); els.participantIdInput.value = 'BRK'; get('select' + bracket)(); get('setCounterbalance')('left');
        ctx._wakeRequests = 0; ctx._wakeReleases = 0; ctx._videoPlays = 0;
        get('startTest')();
        clock += 5000; drain();
    };
    const loadBlock = bracket => {
        const id = get(`makeExperimentBlockTask('${bracket}','left',1)`);
        get('appState').experimentBlockCount = 1;
        get('activeTaskSequence').push(id); get('appState').currentTaskIndex = get('activeTaskSequence').length - 1;
        get('loadTask')(id); drain();
        clock += 400; get('handleDotPress')(); drain(); clock += 400;        // first trial's buttons are up
    };

    // keep-awake: Adult and Child hold the screen awake for the whole session (wake lock + looping video); Infant does not
    startSession('Child');
    assert.strictEqual(ctx._wakeRequests, 1, 'child: a wake lock is requested when the session starts');
    assert.ok(ctx._videoPlays >= 1, 'child: the keep-awake video is playing');
    ctx._docL.visibilitychange.forEach(f => f());            // the page came back to the foreground
    assert.ok(ctx._wakeRequests >= 2, 'the wake lock is asked for again when the page is visible again');

    // 1) break in the middle of a trial that has not been answered
    loadBlock('Child');
    assert.strictEqual(get('appState.currentScreenName'), 'promptScreen');
    const poolBefore = get('appState.jitterPool.length'), trialBefore = get('appState.currentTrial');
    get('startBreak')();
    assert.ok(hasOverlay(), 'the break screen is up');
    drain();                                              // lots of time passes
    assert.strictEqual(get('appState.currentScreenName'), 'promptScreen', 'nothing moved on during the break');
    assert.strictEqual(get('appState.currentTrial'), trialBefore);
    get('endBreak')(); drain();
    assert.ok(!hasOverlay(), 'the break screen is gone after Resume');
    assert.strictEqual(get('appState.currentScreenName'), 'promptScreen', 'the same trial is shown again');
    assert.strictEqual(get('appState.currentTrial'), trialBefore, 'same trial number');
    assert.strictEqual(get('appState.jitterPool.length'), poolBefore, 'the random wait it used was handed back');
    clock += 600; get('handleButtonPress')(get('appState.currentRewarded')); drain();
    assert.strictEqual(get('appState.currentTrial'), trialBefore + 1, 'the trial can be answered after the break');
    {
        const NLb = String.fromCharCode(10);
        const lastTrialRow = () => { const t = String(get('dataManager.generateTrialCSV()')).split(NLb); const h = csvLine(t[0]); const r = csvLine(t[t.length - 1]); return r[h.indexOf('RestartedAfterBreak')]; };
        assert.strictEqual(lastTrialRow(), '1', 'the trial interrupted by a break is marked RestartedAfterBreak');
        ctx._lastTrialRow = lastTrialRow;
    }

    // 2) break right after an answer: the next trial waits for Resume
    clock += 600; get('handleButtonPress')(get('appState.currentRewarded'));     // answer the next trial ...
    assert.strictEqual(ctx._lastTrialRow(), '0', 'the next trial is not marked: the flag does not carry over');
    get('startBreak')();                                                           // ... and pause before the one after starts
    const trialAtBreak = get('appState.currentTrial');
    drain();
    assert.notStrictEqual(get('appState.currentScreenName'), 'waitScreen', 'the next trial did not start during the break');
    assert.strictEqual(get('appState.currentTrial'), trialAtBreak);
    get('endBreak')(); drain();
    assert.strictEqual(get('appState.currentScreenName'), 'promptScreen', 'after Resume the next trial starts');
    assert.strictEqual(get('appState.trialResponded'), false);

    // 3) break after the LAST trial of a task: the task still finishes after Resume
    get('activeTaskSequence').push(get("makePracticeTask('Child','left')")); get('appState').currentTaskIndex = get('activeTaskSequence').length - 1;
    get('loadTask')(get('activeTaskSequence')[get('appState').currentTaskIndex]); drain();
    clock += 400; get('handleDotPress')(); drain(); clock += 400;
    get('handleButtonPress')(get('appState.currentRewarded'));
    get('startBreak')(); drain();
    assert.notStrictEqual(get('appState.currentScreenName'), 'choiceScreen', 'practice gate waits for the end of the break');
    get('endBreak')(); drain();
    assert.strictEqual(els.choiceTitle.textContent, 'Practice Complete', 'the task finishes after Resume');

    // 4) holding the hidden top-right square for 3 seconds starts a break
    const hidden = ctx.document.body.children.find(e => e.id === 'hiddenBreakButton');
    assert.ok(hidden, 'the top-right square is now the break button');
    get('startAnotherPractice')(); drain();
    clock += 400; get('handleDotPress')(); drain(); clock += 400;
    hidden.listeners.pointerdown.forEach(f => f({ type: 'pointerdown', preventDefault() {}, stopPropagation() {} }));
    drainFor(3100);
    assert.ok(hasOverlay(), 'a 3 s hold on the top-right square starts a break');
    get('endBreak')(); drain();

    // 5) Child and Adult: Break on the block-end screen is the plain break screen, and the screen comes back usable
    for (const bracket of ['Child', 'Adult']) {
        startSession(bracket);
        get('appState').inhibitoryCompleted = 8;
        get('showBlockEnd')();
        els.choiceButtons.children.find(b => b.textContent === 'Break').click();
        assert.ok(hasOverlay(), bracket + ': Break shows the plain break screen');
        assert.strictEqual(ctx._wakeRequests, 2, bracket + ': the screen is held awake (session start + break)');
        get('endBreak')(); drain();
        assert.strictEqual(els.choiceTitle.textContent, 'Block Complete');
        assert.ok(els.choiceButtons.children.every(b => !b.disabled), bracket + ': Resume / Break / End work again after the break');
    }

    // 6) Infant/toddler: the butterfly break, no plain break screen, no keep-awake
    startSession('Infant');
    assert.strictEqual(ctx._wakeRequests, 0, 'infant: the screen is not held awake');
    vm.runInContext('showButterflyTask = cb => { globalThis.__butterflyEnds = cb; };', ctx);
    get('appState').inhibitoryCompleted = 8;
    get('showBlockEnd')();
    els.choiceButtons.children.find(b => b.textContent === 'Break').click();
    assert.ok(typeof ctx.__butterflyEnds === 'function' && !hasOverlay(), 'infant: Break from the block-end screen is the butterfly');
    ctx.__butterflyEnds = null;
    loadBlock('Infant');
    hidden.listeners.pointerdown.forEach(f => f({ type: 'pointerdown', preventDefault() {}, stopPropagation() {} }));
    drainFor(3100);
    assert.ok(typeof ctx.__butterflyEnds === 'function' && !hasOverlay(), 'infant: the top-right hold starts the butterfly break');
    const infantTrial = get('appState.currentTrial');
    drain();
    assert.strictEqual(get('appState.currentTrial'), infantTrial, 'the trial is paused during the butterfly');
    ctx.__butterflyEnds();                                // the researcher presses Continue on the butterfly
    drain();
    assert.strictEqual(get('appState.currentScreenName'), 'promptScreen', 'the trial comes back after the butterfly');
    vm.runInContext('showButterflyTask = cb => cb();', ctx);

    // leaving the session lets go of the screen
    startSession('Adult');
    get('restart')();
    // the lock arrives a moment after it was requested: it must be let go of, not kept, once the session is cleared
    Promise.resolve().then(() => Promise.resolve()).then(() => {
        assert.ok(ctx._wakeReleases >= 1, 'the wake lock is released when the session is cleared');
        console.log('ok wake lock is let go of after the session is cleared');
    }).catch(err => { console.error(err); process.exit(1); });
    console.log('ok break and keep-awake');
}

// ---- session incomplete (DNF) screen: chick + count, and no extra white video popup ----
{
    get('restart')();
    els.participantIdInput.value = 'DNF1'; get('selectInfant')(); get('setCounterbalance')('left'); get('startTest')();
    clock += 5000; drain();
    get('loadTask')(get('activeTaskSequence')[0]); drain();
    get('appState').inhibitoryCompleted = 16;
    get('handleDNF')(); drain();
    assert.strictEqual(get('appState.currentScreenName'), 'dnfScreen');
    const dnf = els.dnfStats.innerHTML;
    assert.ok(/chick-05\.png/.test(dnf), 'DNF screen shows the chick frame for 16/32');
    assert.ok(!/\d/.test(dnf.replace(/chick-\d+\.png/, '')), 'DNF screen shows the chick only: no counts or stats');
    // downloading the video must not put a visible link on screen
    vm.runInContext("recordedChunks = [{ size: 1 }]; recordedMimeType = 'video/webm'; mediaRecorder = null;", ctx);
    ctx._created.length = 0;
    get('downloadVideoOnly')();
    const links = ctx._created.filter(e => e.tag === 'a');
    assert.strictEqual(links.length, 1);
    assert.strictEqual(links[0].style.display, 'none', 'video link is invisible');
    assert.ok(!links[0].textContent, 'video link has no visible text');
    assert.ok(!/Photocell/.test(dnf), 'incomplete screen says nothing about the photocell when all is well');
    // a row that should have had a flash but did not: now it is reported
    get('dataManager').logEvent({ section: 'ReadyScreen', stimuli: 'x', invokedBy: 'test', accuracy: 'n/a', testName: 'Infant', trialsRemaining: 1, trialName: 'x' });
    const problem = get('photocellCheckHtml')();
    assert.ok(/check-problem/.test(problem) && /Photocell check: 1 of \d+ rows had no flash/.test(problem), 'a problem is shown: ' + problem);
    console.log('ok DNF screen');
}
// ---- every picture is decoded when the app opens, and the age buttons wait for it ----
(async () => {
    ctx._decoded = 0;
    const expected = get('allVisualAssetUrls()').length;
    const sheetCount = Object.keys(get('FRAME_ANIMATIONS')).length + 2;           // reward animations + frog + butterfly
    assert.strictEqual(expected, sheetCount + get('FRAME_ANIMATIONS.chick') + 7, 'sheets, chick progress frames and button faces are listed: ' + expected);
    ['infantBtn', 'childBtn', 'adultBtn'].forEach(id => { getEl(id).disabled = false; });
    get('setAgeButtonsEnabled')(false);
    assert.ok(['infantBtn', 'childBtn', 'adultBtn'].every(id => getEl(id).disabled === true), 'age buttons locked while loading');
    await get('preloadAnimationFrames')();
    assert.strictEqual(ctx._decoded, expected, 'decode() was called for every picture: ' + ctx._decoded + ' of ' + expected);
    get('setAgeButtonsEnabled')(true);
    assert.ok(['infantBtn', 'childBtn', 'adultBtn'].every(id => getEl(id).disabled === false), 'age buttons unlocked afterwards');
    console.log('ok image decoding (' + expected + ' pictures)');
    console.log('flow: all tests passed');
})();
