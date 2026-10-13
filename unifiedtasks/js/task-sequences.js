/**
 * Task flow flags and per-age task sequences
 * (split from app.js; load order is set in index.html)
 */

// ===== FLOW CONTROL FLAGS =====
const SKIP_READY_SCREEN = {
    Adult: true,
    Infant: true,
    Child: true
};

// Task order is no longer a fixed list per age group. The initial sequence (demo + one
// practice trial) comes from buildInitialSequence() in protocol-config.js; experiment blocks
// are appended to it while the session runs (Resume on the block-end screen).

// Active sequence — set on age group selection
let activeTaskSequence = null;
