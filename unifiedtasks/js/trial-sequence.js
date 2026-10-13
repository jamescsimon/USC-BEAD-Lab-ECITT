/**
 * Experiment-block trial order generator (pure; no DOM or app state).
 *
 * One block = `leading` opening prepotent trials, then a random draw from a pool of
 * prepotent + inhibitory trials. Run-length limits count the opening trials, so with
 * leading=3 and maxPrepotentRun=5 the opening can be extended by at most 2 prepotent trials.
 *
 * Defaults match the ECITT papers: 32 trials, 3 opening prepotent, 21 prepotent + 8 inhibitory
 * in the pool (75% / 25%), at most 5 prepotent or 2 inhibitory trials in a row.
 */

const EXPERIMENT_BLOCK_DEFAULTS = {
    leading: 3,
    prepotentInPool: 21,
    inhibitoryInPool: 8,
    maxPrepotentRun: 5,
    maxInhibitoryRun: 2
};

/**
 * @param {Object} [options] overrides for EXPERIMENT_BLOCK_DEFAULTS
 * @param {function(): number} [rng] returns a float in [0, 1); defaults to Math.random
 * @returns {Array<'prpt'|'inhb'>} trial types in presentation order
 */
function buildExperimentBlock(options, rng) {
    const opts = Object.assign({}, EXPERIMENT_BLOCK_DEFAULTS, options);
    const random = rng || Math.random;
    const { leading, maxPrepotentRun, maxInhibitoryRun } = opts;

    if (leading > maxPrepotentRun) {
        throw new Error('leading prepotent trials exceed maxPrepotentRun');
    }

    // Can the remaining trials be ordered without breaking a run limit?
    // State: prepotent left, inhibitory left, type of the last trial, length of the current run.
    const memo = new Map();
    function feasible(p, i, last, run) {
        if (p === 0 && i === 0) return true;
        const key = `${p}|${i}|${last}|${run}`;
        if (memo.has(key)) return memo.get(key);
        let ok = false;
        if (p > 0) {
            const nextRun = last === 'prpt' ? run + 1 : 1;
            if (nextRun <= maxPrepotentRun) ok = feasible(p - 1, i, 'prpt', nextRun);
        }
        if (!ok && i > 0) {
            const nextRun = last === 'inhb' ? run + 1 : 1;
            if (nextRun <= maxInhibitoryRun) ok = feasible(p, i - 1, 'inhb', nextRun);
        }
        memo.set(key, ok);
        return ok;
    }

    const sequence = [];
    for (let k = 0; k < leading; k++) sequence.push('prpt');

    let p = opts.prepotentInPool;
    let i = opts.inhibitoryInPool;
    let last = leading > 0 ? 'prpt' : null;
    let run = leading;

    if (!feasible(p, i, last, run)) {
        throw new Error('no ordering satisfies the run limits for these counts');
    }

    while (p > 0 || i > 0) {
        const canPrepotent = p > 0 &&
            (last === 'prpt' ? run + 1 : 1) <= maxPrepotentRun &&
            feasible(p - 1, i, 'prpt', last === 'prpt' ? run + 1 : 1);
        const canInhibitory = i > 0 &&
            (last === 'inhb' ? run + 1 : 1) <= maxInhibitoryRun &&
            feasible(p, i - 1, 'inhb', last === 'inhb' ? run + 1 : 1);

        // Pick in proportion to what is left in the pool, among the moves that stay solvable.
        let pick;
        if (canPrepotent && canInhibitory) {
            pick = random() < p / (p + i) ? 'prpt' : 'inhb';
        } else {
            pick = canPrepotent ? 'prpt' : 'inhb';
        }

        if (pick === last) run++; else { last = pick; run = 1; }
        if (pick === 'prpt') p--; else i--;
        sequence.push(pick);
    }

    return sequence;
}
