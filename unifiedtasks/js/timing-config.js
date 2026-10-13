/**
 * Jitter and reward-duration constants
 * (split from app.js; load order is set in index.html)
 */

// ===== JITTER CONFIGURATION =====
// Durations (in milliseconds) randomly selected per adult/infant trial between dot press and prompt.
// Edit this list to control possible wait times (valid range: 500–5000 ms).

// Jitter 2: random wait (ms) between button response and red dot reappearing.
// Adult uses short delay.
// Child uses ~1 second reward animation.
// Toddler and Infant use ~4 second reward animation.
const CHILD_REWARD_DURATION_MS = 1500;
const INFANT_TODDLER_REWARD_DURATION_MS = 4000;

const JITTER2_RANGE = [1000, 1000]; // removed jitter for adult behavioural version
const JITTER2_CHILD_ANIM_RANGE = [
    CHILD_REWARD_DURATION_MS,
    CHILD_REWARD_DURATION_MS
];

const JITTER2_ANIM_RANGE = [
    INFANT_TODDLER_REWARD_DURATION_MS,
    INFANT_TODDLER_REWARD_DURATION_MS
];
const JITTER_DURATIONS_ADULT = [
  500, 500,
  1000, 1000, 1000,
  1500, 1500, 1500, 1500, 1500,
  2000, 2000, 2000, 2000, 2000, 2000,
  2500, 2500, 2500, 2500, 2500, 2500,
  3000, 3000, 3000, 3000, 3000,
  3500, 3500, 3500,
  4000, 4000
];

// Jitter 1 (random wait before the buttons, every trial) is drawn from the JITTER_DURATIONS_*
// pools below: adult 500-4000 ms, child 500-2000 ms, infant/toddler 500-1000 ms. Each pool is
// bell-shaped (more entries near the middle). Final min/max per bracket are still to be decided;
// to change them, edit the pools.

const JITTER_DURATIONS_CHILD = [
  500, 500,
  1000, 1000, 1000,
  1500, 1500, 1500, 1500, 1500,
  2000, 2000, 2000, 2000, 2000, 2000,
  2000, 2000, 2000, 2000, 2000, 2000,
  1500, 1500, 1500, 1500, 1500,
  1000, 1000, 1000,
  500, 500
];

const JITTER_DURATIONS_TODDLER_INFANT = [
  500, 500,
  500, 500, 500, 
  750, 750, 750, 750, 750,
  1000, 1000, 1000, 1000, 1000, 1000,
  1000, 1000, 1000, 1000, 1000, 1000,
  750, 750, 750, 750, 750, 
  500, 500, 500,
  500, 500,
];
