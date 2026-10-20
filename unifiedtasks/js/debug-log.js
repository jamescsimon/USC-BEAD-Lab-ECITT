/**
 * Debug log: records what the device and the task are doing as a CSV, with nothing drawn on screen.
 * Only active with the `debuglog` developer flag (see dev-flags.js); with the flag off this file does
 * nothing and the app is unchanged.
 *
 * It adds a third download, "Debug Log CSV", next to Events CSV and Trials CSV. It is saved with its
 * own localStorage copy, so after a freeze it can still be reached through the hidden quit button
 * (hold top-left) or "Recover CSV Backup". It is NOT part of the events CSV on purpose: the MATLAB
 * alignment expects a photocell flash for every events row.
 *
 * Kinds of rows:
 *   touch / touchstart   a finger went down: screen position and the element it landed on. Includes
 *                        touches that never reach the task code (empty background, covered buttons)
 *   pointercancel        iOS took a touch back (it decided it was a gesture, not a tap)
 *   call / tap           the blue-button tap code was entered; accepted, or ignored and why
 *   step                 the steps after a tap: lock, row, flash, trial row, animation, counter,
 *                        timer set / fired, wait screen, finishTask, prompt, buttons, taps unlocked
 *   hold                 the hidden top-left / top-right operator buttons: touch started, 3 s reached, ended early
 *   screen               the task changed screen
 *   state                screen / transitioning / taps locked / trial / which blue buttons are shown (on change)
 *   buttons              where each shown blue button is, and what element is on top at its centre
 *   stall                the page went more than 100 ms without drawing a frame
 *   error                a JavaScript error or unhandled promise rejection
 *   visibility           the page was hidden or shown
 *   viewport             the page was zoomed, panned, resized or rotated (touch rows also carry zoom/offset)
 */
const DebugLog = (function () {
    const enabled = typeof hasDevFlag === 'function' && hasDevFlag('debuglog');
    const MAX_ROWS = 25000;                 // oldest rows are dropped beyond this (keeps localStorage small)
    const STALL_MS = 100;
    const HEADER = 'Time,PerfMs,Kind,Detail,Screen,TapsLocked,Transitioning,Trial';
    const NL = String.fromCharCode(10);

    let rows = [];
    let storageKey = '';

    const csvCell = value => {
        const text = String(value === undefined || value === null ? '' : value);
        return /["\n\r,]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };

    const timeNow = () => {
        try {
            return dataManager.formatSoleScreenTimestamp(new Date());
        } catch (e) {
            return new Date().toISOString();
        }
    };

    function add(kind, detail) {
        if (!enabled) return;

        const trial = appState.currentTask ? `${appState.currentTrial}/${appState.currentTask.trials}` : '';
        rows.push([
            timeNow(),
            Math.round(performance.now() * 10) / 10,
            kind,
            detail,
            appState.currentScreenName,
            appState.trialResponded,
            appState.isTransitioning,
            trial
        ].map(csvCell).join(','));

        if (rows.length > MAX_ROWS) rows.splice(0, rows.length - MAX_ROWS);
        scheduleSave();
    }

    // ---- storage: separate from the main autosave so the log cannot slow or bloat it ----
    let saveTimer = null;
    function scheduleSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(save, 5000);
    }

    function save() {
        if (!enabled || !storageKey) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(rows));
        } catch (e) {
            console.warn('[DEBUGLOG] could not save the log:', e.name);
        }
    }

    // A session is starting: attach its storage key (rows from before it, such as touches on the first
    // screen, are kept).
    function begin(autosaveKey) {
        storageKey = autosaveKey ? `${autosaveKey}_debuglog` : '';
        add('session', 'session started');
    }

    // The session was cleared (Start New Session): start an empty log.
    function clear() {
        rows = [];
        storageKey = '';
    }

    function restore(autosaveKey) {
        if (!enabled) return false;
        try {
            const saved = JSON.parse(localStorage.getItem(`${autosaveKey}_debuglog`) || 'null');
            if (!Array.isArray(saved)) return false;
            rows = saved;
            storageKey = `${autosaveKey}_debuglog`;
            return true;
        } catch (e) {
            return false;
        }
    }

    function toCSV() {
        return [HEADER, ...rows].join(NL);
    }

    // ---- what to record ----
    const describe = el => {
        if (!el) return 'nothing';
        const cls = typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : '';
        return `${String(el.tagName || '?').toLowerCase()}${el.id ? '#' + el.id : ''}${cls}`;
    };

    const where = event => (event ? `x${Math.round(event.clientX)} y${Math.round(event.clientY)}` : 'x? y?');

    // Is the page zoomed or shifted? (iOS can zoom on rapid taps, which would move the buttons away from
    // where they were drawn.) scale 1.00 and offset 0,0 is normal.
    const viewportNote = () => {
        const vv = typeof window !== 'undefined' ? window.visualViewport : null;
        return vv
            ? `zoom=${Number(vv.scale).toFixed(2)} offset=${Math.round(vv.offsetLeft)},${Math.round(vv.offsetTop)} size=${Math.round(vv.width)}x${Math.round(vv.height)} scroll=${Math.round(window.scrollX || 0)},${Math.round(window.scrollY || 0)}`
            : `size=${window.innerWidth}x${window.innerHeight} scroll=${Math.round(window.scrollX || 0)},${Math.round(window.scrollY || 0)}`;
    };

    function visibleButtonBoxes() {
        const NLs = [];
        ['leftButton', 'mdlButton', 'rightButton', 'dotButton'].forEach(id => {
            const el = typeof elements !== 'undefined' ? elements[id] : null;
            if (!el || el.style.display === 'none' || !el.getBoundingClientRect) return;
            if (id === 'dotButton' && appState.currentScreenName !== 'readyScreen') return; // the dot lives on the ready screen
            const r = el.getBoundingClientRect();
            if (!r.width) return;
            const top = typeof document.elementFromPoint === 'function'
                ? describe(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2))
                : '?';
            NLs.push(`${id.replace('Button', '')} x${Math.round(r.left)}-${Math.round(r.right)} y${Math.round(r.top)}-${Math.round(r.bottom)} top-at-centre=${top}`);
        });
        return NLs.join(' ; ') || 'no blue button shown';
    }

    function stateSummary() {
        const shown = ['leftButton', 'mdlButton', 'rightButton']
            .filter(id => typeof elements !== 'undefined' && elements[id] && elements[id].style.display !== 'none')
            .map(id => id.replace('Button', ''));
        return `buttons shown: ${shown.join('+') || 'none'}`;
    }

    if (enabled) {
        // finger down, as the browser reports it (capture phase: sees touches before any handler)
        document.addEventListener('pointerdown', event => {
            add('touch', `${where(event)} on ${describe(event && event.target)} (${(event && event.pointerType) || '?'}) ${viewportNote()}`);
            // A touch on a task screen that did not land on a button: log where the buttons were just then,
            // so a shifted layout shows up next to the touch that missed.
            const id = event && event.target && event.target.id;
            const isButton = id === 'leftButton' || id === 'mdlButton' || id === 'rightButton' || id === 'dotButton';
            if (!isButton && (appState.currentScreenName === 'promptScreen' || appState.currentScreenName === 'readyScreen')) {
                add('buttons', 'at the missed touch: ' + visibleButtonBoxes());
            }
        }, true);
        document.addEventListener('touchstart', event => {
            const t = event && event.touches && event.touches[0];
            add('touchstart', `${t ? where(t) : 'x? y?'} on ${describe(event && event.target)}`);
        }, { capture: true, passive: true });
        document.addEventListener('pointercancel', event => {
            add('pointercancel', `${where(event)} on ${describe(event && event.target)}`);
        }, true);
        document.addEventListener('visibilitychange', () => add('visibility', document.visibilityState));

        window.addEventListener('error', event => {
            const file = String((event && event.filename) || '').split('/').pop();
            add('error', `${event && event.message} @ ${file}:${event && event.lineno}`);
        });
        window.addEventListener('unhandledrejection', event => {
            add('error', 'unhandled promise rejection: ' + String(event && event.reason));
        });
        window.addEventListener('pagehide', save);

        // the page being zoomed, panned, resized or rotated
        const logViewport = () => add('viewport', viewportNote());
        if (window.visualViewport && window.visualViewport.addEventListener) {
            window.visualViewport.addEventListener('resize', logViewport);
            window.visualViewport.addEventListener('scroll', logViewport);
        }
        window.addEventListener('resize', logViewport);
        window.addEventListener('orientationchange', logViewport);

        // the steps and taps reported by trial-flow.js through debugStep()
        onDebugStep(id => {
            if (id === 'reset') return add('tap', 'accepted: steps for this tap start');
            if (id === 'call') return add('call', 'blue-button tap code entered');
            if (id.startsWith('tap:')) return add('tap', id.slice(4));
            if (id.startsWith('hold:')) return add('hold', id.slice(5));
            add('step', id);
            if (id === 'promptRendered') add('buttons', visibleButtonBoxes());
        });

        // screen changes
        const waitForShowScreen = () => {
            if (typeof showScreen !== 'function') return setTimeout(waitForShowScreen, 50);
            const originalShowScreen = showScreen;
            showScreen = function (name) {
                add('screen', name);
                add('viewport', viewportNote());
                if (name === 'readyScreen') setTimeout(() => add('buttons', visibleButtonBoxes()), 150); // red dot position
                return originalShowScreen.apply(this, arguments);
            };
        };
        waitForShowScreen();

        // state, written only when it changes
        let lastState = '';
        setInterval(() => {
            const state = `screen=${appState.currentScreenName} transitioning=${appState.isTransitioning} locked=${appState.trialResponded} ${stateSummary()}`;
            if (state !== lastState) {
                lastState = state;
                add('state', state);
            }
        }, 250);

        // frames: a long gap means the page was too busy to draw or react
        let lastFrame = performance.now();
        const frame = now => {
            if (now - lastFrame > STALL_MS) add('stall', `${Math.round(now - lastFrame)} ms without a screen frame`);
            lastFrame = now;
            requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }

    return { enabled, add, begin, clear, restore, toCSV, save, rowCount: () => rows.length };
})();
