// Run: ELECTRON_RUN_AS_NODE=1 "<path to Code.exe>" tests/trial-sequence.test.js   (or: node tests/trial-sequence.test.js)
const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../unifiedtasks/js/trial-sequence.js'), 'utf8') +
    '\nthis.build = buildExperimentBlock;', ctx);
const build = (...a) => Array.from(ctx.build(...a)); // copy out of the vm realm

function maxRun(seq, type) {
    let best = 0, cur = 0;
    for (const t of seq) { cur = t === type ? cur + 1 : 0; best = Math.max(best, cur); }
    return best;
}

const N = 10000;
const firstInhibitoryPositions = new Set();
for (let n = 0; n < N; n++) {
    const s = build();
    assert.strictEqual(s.length, 32, 'length');
    assert.strictEqual(s.filter(t => t === 'inhb').length, 8, 'inhibitory count');
    assert.deepStrictEqual(s.slice(0, 3), ['prpt', 'prpt', 'prpt'], 'opening');
    assert.ok(maxRun(s, 'prpt') <= 5, 'prepotent run <= 5 (opening counts): ' + s.join());
    assert.ok(maxRun(s, 'inhb') <= 2, 'inhibitory run <= 2: ' + s.join());
    firstInhibitoryPositions.add(s.indexOf('inhb'));
}
// opening counts toward the limit: first inhibitory must be at index 3, 4 or 5 (never later)
assert.ok([...firstInhibitoryPositions].every(p => p >= 3 && p <= 5), 'first inhibitory in 4th-6th slot');
assert.ok(firstInhibitoryPositions.size > 1, 'ordering is actually random');

// distribution sanity: the inhibitory trials should not clump at the start or end
let sumPos = 0;
for (let n = 0; n < 2000; n++) { const s = build(); s.forEach((t, k) => { if (t === 'inhb') sumPos += k; }); }
const meanPos = sumPos / (2000 * 8);
assert.ok(meanPos > 13 && meanPos < 20, 'mean inhibitory position ' + meanPos);

// impossible configuration is reported, not looped
assert.throws(() => build({ prepotentInPool: 40, inhibitoryInPool: 1 }));
console.log('trial-sequence: all tests passed (' + N + ' blocks, mean inhibitory position ' + meanPos.toFixed(1) + ')');
