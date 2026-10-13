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

// Infant/Toddler Execution Order
// Butterfly
// Control Middle
// Sides(?) 
// Preponent trials x3 ?
//mostly the same as infant version

// -------------------------------

// Child Test Execution Order
// demo
// practice
// baseline 1 (nirs audio & videos)
// control 1
// baseline 2
// test 1 <- large
// baseline 3 (nirs audio & videos)
// control 2
// baseline 4
// test 2 <- large
// baseline 5 (nirs audio & videos)
// control 3
// baseline 6
// test 3 <- large
// baseline 7 (nirs audio & videos)
// control 4
// baseline 8
// test 4 <- large
// baseline 9 (nirs audio & videos)
// control 5
// baseline 10
// test 5 <- large
// baseline 11

//const TASK_SEQUENCE = ['adt_cl', 'adt_cr', 'adt_ppl', 'adt_tpl', 'adt_ppr', 'adt_tpr'];
// Left-first: Control Left → Control Right → Practice Left → Test Left → Test Right
const TASK_SEQUENCE_LEFT = ['adt_ppl', 'adt_ppr', 'adt_tpl', 'adt_tpr', 'adt_tpl', 'adt_tpr'];
// Right-first: Control Right → Control Left → Practice Right → Test Right → Test Left
const TASK_SEQUENCE_RIGHT = ['adt_ppr', 'adt_ppl', 'adt_tpr', 'adt_tpl', 'adt_tpr', 'adt_tpl'];

// Task execution order — full 18+ adult protocol (james' version)
// const TASK_SEQUENCE = ['adt_cm', 'adt_cl', 'adt_ppl', 'adt_tpl', 'adt_cr', 'adt_ppr', 'adt_tpr'];

// Task execution order — 2-17 year ECITT-A protocol
const CHILD_TASK_SEQUENCE_LEFT = ['cha_demo','cha_ppl','cha_ppr', 'cha_cll', 'cha_tpl', 'cha_clr', 'cha_tpr', 'cha_cll', 'cha_tpl', 'cha_clr', 'cha_tpr', 'cha_cll', 'cha_tpl', 'cha_clr', 'cha_tpr', 'cha_cll', 'cha_tpl', 'cha_clr', 'cha_tpr', 'cha_cll', 'cha_tpl', 'cha_clr', 'cha_tpr'];
const CHILD_TASK_SEQUENCE_RIGHT = ['cha_demo','cha_ppr','cha_ppl', 'cha_clr', 'cha_tpr', 'cha_cll', 'cha_tpl', 'cha_clr', 'cha_tpr', 'cha_cll', 'cha_tpl', 'cha_clr', 'cha_tpr', 'cha_cll', 'cha_tpl', 'cha_clr', 'cha_tpr', 'cha_cll', 'cha_tpl', 'cha_clr', 'cha_tpr', 'cha_cll', 'cha_tpl'];

/*
CHILD_TASK_SEQUENCE_LEFT(80Left/80Right) = 5xcha_cll(8Left/0Right), 5xcha_tpl(4Left/4Right), 5xcha_clr(0Left/8Right), 5xcha_tpr(4Left/4Right)
CHILD_TASK_SEQUENCE_RIGHT(48Left/112Right) = 1xcha_cll(8Left/0Right), 1xcha_tpl(4Left/4Right), 9xcha_clr(0Left/8Right), 9xcha_tpr(4Left/4Right)
*/

// Task execution order — 17-23 month toddler ECITT protocol
const TODDLER_TASK_SEQUENCE_LEFT = ['tod_ppl', 'tod_tpl', 'tod_ppr', 'tod_tpr'];
const TODDLER_TASK_SEQUENCE_RIGHT = ['tod_ppr', 'tod_tpr', 'tod_ppl', 'tod_tpl'];

// Task execution order — 10-16 month infant ECITT protocol
const INFANT_TASK_SEQUENCE_LEFT = ['inf_demo','inf_plp', 'inf_prp', 'inf_c1l', 'inf_tpl', 'inf_c1r', 'inf_tpr', 'inf_c1l', 'inf_tpl', 'inf_c1r', 'inf_tpr', 'inf_tpl', 'inf_c1r','inf_c1r', 'inf_tpr'];
const INFANT_TASK_SEQUENCE_RIGHT = ['inf_demo','inf_prp', 'inf_plp', 'inf_c1r', 'inf_tpr', 'inf_c1l', 'inf_tpl', 'inf_c1l', 'inf_tpl', 'inf_c1r', 'inf_tpr', 'inf_c1l', 'inf_tpl', 'inf_c1r', 'inf_tpr'];

/*
INFANT_TASK_SEQUENCE_LEFT =
INFANT_TASK_SEQUENCE_RIGHT =
*/


// Active sequence — set on age group selection
let activeTaskSequence = null;
