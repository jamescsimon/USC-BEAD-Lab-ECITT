# ECITT Tasks - Progressive Web App

## Overview

> **Note (Iteration 2):** the "Task Batteries" tables below describe the old fixed block lists. The app now runs one practice trial (with an Another Practice / Start Test gate), then 32-trial experiment blocks on demand (Resume / Break / End) until 32 inhibitory trials are completed. Brackets are Infant (infant/toddler merged), Child and Adult. The prepotent side is the counterbalance side for the whole visit. Tests: `tests/` at the repo root.

This is a single-screen Progressive Web App (PWA) implementation of the ECITT (Early Childhood Inhibitory Touchscreen Tasks) battery. The app supports four age groups (Adult, Child, Toddler, Infant) and runs all task variations for the selected group as one combined session without requiring a separate controller device.

## Features

- **Multi-Age-Group**: Adult (18+), Child (2–17 yr), Toddler (17–23 mo), Infant (10–16 mo)
- **Self-Contained**: No external controller needed — everything runs in one screen
- **Counterbalance**: Coin-flip randomization of left/right order; manual override on the participant screen
- **Offline Support**: Works offline once installed using service worker
- **Local Data Storage**: CSV data saved locally with localStorage backup
- **DNF Handling**: Automatically saves partial data if session is incomplete
- **Mobile-First**: Optimized for touchscreen devices (tablets, smartphones)
- **PWA Installable**: Can be installed as a standalone app on devices

## Task Batteries

### Adult (18+)

Sequence is counterbalanced (left-first or right-first):

| Left-first order | Right-first order | Trials |
|---|---|---|
| Control Left (`adt_cl`) | Control Right (`adt_cr`) | 4 |
| Control Right (`adt_cr`) | Control Left (`adt_cl`) | 4 |
| Practice Left (`adt_ppl`) | Practice Right (`adt_ppr`) | 4 |
| Test Left (`adt_tpl`) | Test Right (`adt_tpr`) | 32 |
| Test Right (`adt_tpr`) | Test Left (`adt_tpl`) | 32 |

**Total: 76 trials**

### Child (2–17 yr)

| Left-first order | Right-first order | Trials |
|---|---|---|
| Practice Left (`cha_ppl`) | Practice Right (`cha_ppr`) | 4 |
| Baseline Left (`cha_bll`) | Baseline Right (`cha_blr`) | 32 |
| Test Left (`cha_tpl`) | Test Right (`cha_tpr`) | 32 |
| Practice Right (`cha_ppr`) | Practice Left (`cha_ppl`) | 4 |
| Baseline Right (`cha_blr`) | Baseline Left (`cha_bll`) | 32 |
| Test Right (`cha_tpr`) | Test Left (`cha_tpl`) | 32 |

**Total: 136 trials**

### Toddler (17–23 mo)

| Left-first order | Right-first order | Trials |
|---|---|---|
| Practice Left (`tod_ppl`) | Practice Right (`tod_ppr`) | 4 |
| Test Left (`tod_tpl`) | Test Right (`tod_tpr`) | 32 |
| Practice Right (`tod_ppr`) | Practice Left (`tod_ppl`) | 4 |
| Test Right (`tod_tpr`) | Test Left (`tod_tpl`) | 32 |

**Total: 72 trials**

### Infant (10–16 mo)

| Left-first order | Right-first order | Trials |
|---|---|---|
| Control 1 Left (`inf_c1l`) | Control 1 Right (`inf_c1r`) | 4 |
| Control 1 Right (`inf_c1r`) | Control 1 Left (`inf_c1l`) | 4 |
| Test PR Left — Prepotent (`inf_tpll`) | Test PR Right — Prepotent (`inf_tprl`) | 4 |
| Test PR Left — Inhibitory (`inf_tplr`) | Test PR Right — Inhibitory (`inf_tprr`) | 4 |
| Control 2 Left (`inf_c2l`) | Control 2 Right (`inf_c2r`) | 4 |
| Control 2 Right (`inf_c2r`) | Control 2 Left (`inf_c2l`) | 4 |
| Test PR Right — Prepotent (`inf_tprl`) | Test PR Left — Prepotent (`inf_tpll`) | 4 |
| Test PR Right — Inhibitory (`inf_tprr`) | Test PR Left — Inhibitory (`inf_tplr`) | 4 |

**Total: 32 trials**

## Trial Name Acronyms

Task IDs follow the pattern `[age]_[phase][position]`. For variant-level suffixes inside test tasks, `prpt` = prepotent trial and `inhb` = inhibitory trial.

### Age group prefixes

| Prefix | Age group |
|--------|-----------|
| `adt`  | Adult (18+) |
| `cha`  | Child ECITT-A (2–17 yr) |
| `tod`  | Toddler (17–23 mo) |
| `inf`  | Infant (10–16 mo) |

### Phase/position suffixes

| Suffix | Meaning |
|--------|---------|
| `_cl` | Control Left — baseline, single left button |
| `_cr` | Control Right — baseline, single right button |
| `_cm` | Control Middle — baseline, single middle button (adult only) |
| `_ppl` | Practice Prepotent Left — 4-trial practice, happy face always left |
| `_ppr` | Practice Prepotent Right — 4-trial practice, happy face always right |
| `_bll` | Baseline Left — 32-trial baseline, happy face always left (child only) |
| `_blr` | Baseline Right — 32-trial baseline, happy face always right (child only) |
| `_tpl` | Test Prepotent Left — 32 trials, 75% left / 25% right |
| `_tpr` | Test Prepotent Right — 32 trials, 75% right / 25% left |
| `_c1l` / `_c1r` | Infant Control 1 Left / Right — single-button baseline before test |
| `_c2l` / `_c2r` | Infant Control 2 Left / Right — single-button baseline after test |
| `_tpll` | Infant Test PR Left Left — prepotent phase (left button, builds habit) |
| `_tplr` | Infant Test PR Left Right — inhibitory phase (right button, requires switch) |
| `_tprl` | Infant Test PR Right Left — inhibitory phase (left button, requires switch) |
| `_tprr` | Infant Test PR Right Right — prepotent phase (right button, builds habit) |

## Usage

### Starting the App

1. Open `index.html` in a web browser (preferably Chrome/Edge)
2. Select the participant's age group on the selection screen
3. Enter a Participant ID (e.g., PC001, P123)
4. Optionally override counterbalance with **Left First** / **Right First** buttons (otherwise randomized)
5. Click **Start Task** to begin

### Counterbalancing

On the Participant screen, below the Start button:

- **Left First** / **Right First** buttons let the researcher manually set the side order
- If neither is pressed, a coin flip is made automatically when the age group is selected
- The active selection is highlighted in blue
- The chosen order is applied to the full task sequence for that session

### During Testing

- **Ready Screen**: Place finger on red dot
  - Displays instructions at top and bottom
  - Press red dot when ready to start trial

- **Prompt Screen**: Respond to buttons
  - Buttons appear left and/or right of the red dot (layout varies by task)
  - Press the happy face button as quickly as possible
  - Return to red dot for next trial

### Completing the Test

- **Normal Completion**: After all trials
  - Shows final statistics (accuracy, reaction time)
  - Download CSV results
  - Option to start new session

- **Did Not Finish (DNF)**: If session interrupted
  - Triggered by 60 seconds of inactivity
  - Shows partial statistics
  - CSV includes completed trials with DNF marker

## Data Output

A session produces two CSV files (and a third, only for debugging). They are offered as one-tap links on the Task Complete / Session Incomplete screens, with the video:

| File | One row per | Used for |
|---|---|---|
| `ECITT_<id>_<date-time>_events.csv` | screen change or tap (stimulus onset, each response, each wrong tap, wait screens, sync flashes, task end) | aligning with the EEG: the MATLAB step in `shifts/10-13/delivery/` reads it. Keep the column names `TrialName`, `SectionStarted`, `StartTimestamp` and the `YYYY-MM-DD@Hhh:Mmm:Sss.mmm` timestamp format. |
| `ECITT_<id>_<date-time>_trials.csv` | trial | analysis: accuracy, reaction time, jitter, progress. Not read by MATLAB. |
| `ECITT_<id>_<date-time>_debug.csv` | touch, tap, step, error... | only with the `debuglog` flag (see Debug overlay) |

On the lab server keep them in separate `events/` and `trials/` folders inside the participant folder.

### Joining the two files

`TrialName` + `TrialNumber` in the events file is the same trial as `TaskID` + `TrialNumber` in the trials file (for example `cha_exp2_left`, trial 7). `StartTimestamp` in the trials file is when that trial's buttons appeared, in the same format as the events file. `tools/check_session_csv.py <trials.csv> <events.csv>` checks the join and the design (see below).

### Trials CSV columns

| Column | Meaning |
|---|---|
| `ParticipantID`, `AgeGroup`, `Counterbalance` | who, bracket (Infant = infant/toddler), the side assigned at the start |
| `Phase` | `demo`, `practice`, `experiment` (or `butterfly` for a butterfly touch) |
| `ExperimentBlock` | 1, 2, 3... counting only experiment blocks; blank for demo and practice |
| `BlockNumber` | position of the task in the session, counting demo and practice too |
| `TaskID`, `TrialNumber` | the task (`cha_exp2_left` = experiment block 2) and the trial within it |
| `StartTimestamp` | when the buttons appeared. A repeated practice trial has the same `TaskID`, so tell the attempts apart by this |
| `TrialType` | `Prepotent`, `Inhibitory` or `Control` (demo / practice) |
| `Direction`, `DirectionReversed` | the prepotent side actually in use, and 1 once an infant's first tap swapped the sides. `TaskID` keeps the assigned side in its name; `Direction` is the truth |
| `RewardedSide`, `HappyFaceSide`, `ButtonPressed` | the correct side, where the happy face was, and the button that ended the trial |
| `FirstResponseCorrect` | 1 if the very first tap was right: the participant's accuracy |
| `IncorrectTaps` | wrong taps before the trial ended (Infant waits for the correct button, so it can be more than 0) |
| `ReactionTime` | ms from the buttons appearing to the tap that ended the trial |
| `Jitter1`, `Jitter2` | random wait before the buttons, and the pause after the response (ms) |
| `FirstIncorrectRT`, `PressSequence` | time of the first wrong tap, and every tap as `button@ms` |
| `InhibitoryCompletedSoFar` | the count behind the chick (see the minimum-trials section) |
| `LowEngagement` | 1 once first-tap accuracy is below 60% (from 10 trials) |
| `RestartedAfterBreak` | 1 if a Break interrupted this trial: the buttons were shown again afterwards, so `StartTimestamp` and `ReactionTime` count from the second showing |

### Events CSV: what the extra columns are

`TrialNumber` (which trial a row belongs to), `ButtonPressed`, and `PhotocellFlash` (1 when the row was locked to a photocell flash, 0 when not; see the photocell section of the notes). `SectionStarted` values: `TaskStart`, `ReadyScreen`, `WaitScreen`, `LeftTrialScreen` / `RightTrialScreen` / `ControlTrialScreen` (stimulus onset), `LeftTrialResponse` / `RightTrialResponse` / `ControlTrialResponse` (the response), `IncorrectResponse` (a wrong tap), `SyncTrainFlash`, `Butterfly*`, `TaskEnd`, `DNF`, `FlashConflict`. `StartTimestamp` format: `YYYY-MM-DD@Hhh:Mmm:Sss.mmm`.

### Checking a session

`python tools/check_session_csv.py <file.csv> [more files]` prints "ok" / "CHECK" lines for 32-trial blocks, the 75% / 25% split, the 3 opening prepotent trials, the run limits, direction changes, jitter range, reaction times, photocell coverage and the events-to-trials join. It also reads the old (summer) formats.


## Changing Task Setup and Timing

Task configuration lives in **`js/task-configs.js`** (tasks), **`js/task-sequences.js`** (task order per age group) and **`js/timing-config.js`** (jitter and reward durations).

### Modifying a task (trials, button layout, instructions)

Each task is defined in `TASK_CONFIGS` (`js/task-configs.js`). Find the task by its ID and edit directly:

```js
adt_tpl: {
    trials: 32,              // number of trials
    varDistr: [75, 25],      // [prepotent %, inhibitory %]
    varLeading: 3,           // leading prepotent trials (always first)
    varMaxDups: 4,           // max consecutive prepotent trials
    promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
    readyMsg1: '...',        // instruction line 1
    readyMsg2: '...',        // instruction line 2
    readyMsg3: 'Ready?'      // instruction line 3
}
```

### Changing the active task sequence

Each age group has two sequence arrays (left-first and right-first counterbalance):

| Variables | Age group |
|---|---|
| `TASK_SEQUENCE_LEFT` / `TASK_SEQUENCE_RIGHT` | Adult (18+) |
| `CHILD_TASK_SEQUENCE_LEFT` / `CHILD_TASK_SEQUENCE_RIGHT` | Child (2–17 yr) |
| `TODDLER_TASK_SEQUENCE_LEFT` / `TODDLER_TASK_SEQUENCE_RIGHT` | Toddler (17–23 mo) |
| `INFANT_TASK_SEQUENCE_LEFT` / `INFANT_TASK_SEQUENCE_RIGHT` | Infant (10–16 mo) |

Edit these arrays to add, remove, or reorder tasks.

### Jitter configuration

Two sets of jitter arrays control blank-screen delays between dot press and button appearance (Jitter 1) and between button response and dot reappearance (Jitter 2):

| Constant | Used by | What it controls |
|---|---|---|
| `JITTER_DURATIONS_ADULT` | Adult | Pool of Jitter 1 durations (ms); drawn as deck of cards |
| `JITTER_DURATIONS_CHILD` | Child | Same |
| `JITTER_DURATIONS_TODDLER_INFANT` | Toddler, Infant | Same |
| `JITTER2_RANGE` | Adult | `[min, max]` ms for Jitter 2 uniform random draw |
| `JITTER2_ANIM_RANGE` | Child, Toddler, Infant | `[min, max]` ms for Jitter 2 (longer, covers reward animation) |

### Timing constants

| Constant / location | Default | What it controls |
|---|---|---|
| `INACTIVITY_TIMEOUT` | `60000` ms | Inactivity before auto-DNF |
| `JITTER2_RANGE` | `[500, 1000]` ms | Adult Jitter 2 range |
| `JITTER2_ANIM_RANGE` | `[2000, 2500]` ms | Child/Toddler/Infant Jitter 2 range |

## Installation Options

### Option 1: Run from File System

Simply open `index.html` in a browser. No server required for basic functionality.

### Option 2: Install as PWA

1. Serve from a web server (required for PWA features)
2. Open in Chrome/Edge
3. Look for "Install" prompt in address bar
4. Click to install as standalone app

### Option 3: Local Development Server

```powershell
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Then navigate to: http://localhost:8000/unifiedtasks/
```

## File Structure

```
unifiedtasks/
├── index.html              # Main HTML structure
├── styles.css              # Visual styling
├── app.js                  # Entry point: DOM setup and event wiring
├── js/                     # Split task logic (loaded in order by index.html)
│   ├── task-configs.js     # TASK_CONFIGS
│   ├── task-sequences.js   # Flow flags and per-age task sequences
│   ├── timing-config.js    # Jitter and reward durations
│   ├── app-state.js        # Shared state
│   ├── media-helpers.js    # Sprite loops, one-shot audio
│   ├── screens.js          # Screen switching
│   ├── operator-controls.js# Hidden operator buttons
│   ├── session-setup.js    # Age select, counterbalance, start/restart
│   ├── task-loader.js      # Task loading, trial sequence generation
│   ├── trial-flow.js       # Trials, responses, finish, DNF
│   ├── nirs-baseline.js    # fNIRS baseline video
│   ├── trial-sequence.js   # Experiment-block trial order generator (pure, unit-tested)
│   ├── protocol-config.js  # Per-bracket practice + on-demand experiment blocks
│   ├── block-flow.js       # Practice gate, Resume/Break/End screen
│   ├── calibration.js      # Frog calibration, butterfly break
│   ├── photocell.js        # Photocell flash and sync
│   ├── recording.js        # Video recording, CSV/video download
│   ├── reward-animation.js # Reward animation, audio preload
│   └── orientation.js      # Orientation layout
├── data.js                 # Data management and CSV generation
├── service-worker.js       # PWA offline support
├── manifest.json           # PWA configuration
└── README.md               # This file
```

## Breaks and keeping the screen awake

- **Take a break at any moment:** hold the hidden square in the **top-right** corner for 3 seconds (it used to start the NIRS baseline video). The Block Complete screen's **Break** button does the same.
  - **Adult and Child:** a plain dark "Break" screen with a **Resume** button. The trial is paused wherever it was, and Resume carries on from there (a trial that had not been answered starts again from its random wait). The screen is kept awake so it does not lock while the person is away. Nothing is written to the events CSV.
  - **Infant/toddler:** the butterfly break instead (its Continue button ends it).
- **Screen timeout (`js/keep-awake.js`):** Adult and Child sessions ask for the Screen Wake Lock (iOS 16.4+) and play a tiny muted looping video (`public/video/keepawake.mp4`) to stop Auto-Lock on older iOS. This cannot be tested without the iPad, so the dependable fix is on the iPad itself: **Settings > Display & Brightness > Auto-Lock > Never** (and Guided Access if the iPad is handed around).

## Minimum trials and the chick (where the thresholds are, and what was decided)

| What | Where | Value | Why |
|---|---|---|---|
| **Inhibitory-trial minimum (the chick's "full")** | `INHIBITORY_TARGET` in `js/protocol-config.js` | **32** | 30 are needed for the EEG analysis, plus 2 spare. One value for every bracket. |
| What counts toward it | `inhibitoryCompleted` in `js/trial-flow.js` | an **inhibitory** trial in an **experiment** block whose **first tap was correct** | Practice and demo trials never count. A trial answered wrongly first and then corrected does not count. |
| **Accuracy needed for the full chick** | `ENGAGEMENT_MIN_ACCURACY` (**60%**) and `firstTapAccuracyOk()` in `js/protocol-config.js` | first-tap accuracy over **all** experiment trials so far | The chick only fully hatches when BOTH hold: 32 inhibitory trials AND at least 60% accuracy. Below 60% it stops one frame short (frame 8 of 9), even at 32. |
| Chick picture | `chickFrameFor()` in `js/protocol-config.js` | frame 1 (egg) at 0 up to frame 9 (hatched) | One static frame, no animation. |
| Low-engagement note | `ENGAGEMENT_MIN_ACCURACY` and `ENGAGEMENT_MIN_TRIALS` in `js/protocol-config.js` | below **60%** first-tap accuracy, checked from **10** trials | A note on the Block Complete screen; it never stops or changes the task. |

The target is only a display: nothing ends the session or locks Resume when it is reached; the experimenter reads the chick. The app cannot know which trials are valid (the EEG decides that afterwards), so the count is a proxy and the 2 spare trials are the only buffer. To change the minimum, change `INHIBITORY_TARGET` (one place); to change the accuracy needed, change `ENGAGEMENT_MIN_ACCURACY`.

**What each screen shows of this**
- **Block Complete (experimenter's Resume / Break / End screen):** the chick, with the count beside it as bare numbers, `done:target`, for example `16:32`. It is deliberately not labelled.
- **Task Complete and Session Incomplete:** only the chick. No numbers and no performance stats (those are in the CSV files).


## Animations (sprite sheets)

Each animation is ONE wide picture in `graphics/sheets/<name>.png` with its frames side by side, built from the numbered frames in `graphics/frames/` and `graphics/sprites/`. The app downloads and decodes every sheet when it opens (the age buttons stay locked until that finishes), then plays an animation by moving a window along the sheet (`js/sprite-sheet.js`). Nothing is fetched or decoded during play, which is what stops the first play of each animation from flickering.

**To add or change an animation:** put the numbered frames (`name-01.png`, `name-02.png`, ...; all 220x220) in `graphics/frames/`, run `python tools/build_sprite_sheets.py` (needs `pip install pillow`), and add the name and frame count to `FRAME_ANIMATIONS` in `js/reward-animation.js`. The tests check that every sheet's size matches its frame count.

## Debug overlay

Turn on the `debug` flag to show a small black box in the top-right corner. In a browser add `?debug` to the address (e.g. `.../unifiedtasks/?debug`). On a home-screen app, which ignores the address, tap the "ECITT Task" title on the first screen 5 times quickly, type `debug`, press OK, and the app reloads. The box shows: longest screen-frame gap, tap-handler time, touches vs. accepted taps, and photocell gate state. Use it to see whether the page is busy when taps or the photocell seem to stall. For a freeze, use the `debuglog` flag instead (or as well): it draws nothing on screen and records a log of every touch, tap, step, screen change, error and stall. It adds a "Debug Log CSV" download next to Events CSV and Trials CSV on the end / incomplete screen. After a freeze, reach that screen with the hidden quit button (hold the top-left corner for 3 seconds) or "Recover CSV Backup" on the first screen. The log is kept out of the events CSV on purpose, because the MATLAB alignment expects a photocell flash for every events row.



Other flags for finding slowdowns: `norec` (no camera/video recording) and `nopreload` (no animation preloading); combine with spaces, e.g. `debug norec`. Clear them by opening the same prompt and leaving it empty. With no flags the app is normal.

## Experimenter procedure notes

- **Infant/toddler:** hold or move the iPad out of the child's reach between trials, and hand it back when the next trial is ready. All the toddler studies did this to stop the child pressing buttons without looking at which one is correct. Give no time pressure. Repeat "press the happy face" as needed and keep reactions to wrong taps neutral.
- **Wrong taps:** infants may tap the blank button repeatedly. The app shows nothing on a wrong tap. Do not react to it and point back to the happy face.
- **First tap on the wrong side:** for infant/toddler, if the first tap of the visit is on the non-happy side, the app swaps the prepotent and inhibitory sides for the whole visit (see `DirectionReversed` in the trials CSV).
- **Progress:** the hatching chick on the block-end screen shows progress toward 32 inhibitory trials. Resume until it is fully hatched. An orange note on that screen means first-tap accuracy is below 60%.

## Dependencies

### Required Graphics

The app requires these button images (relative to unifiedtasks/):

```
../graphics/buttons/
├── button_dot.png          # Red dot (70x70px)
├── button_left.png         # Left button plain (220x220px)
├── button_left_happy.png   # Left button with smiley (220x220px)
├── button_mdl.png          # Middle button plain (220x220px)
├── button_mdl_happy.png    # Middle button with smiley (220x220px)
├── button_right.png        # Right button plain (220x220px)
└── button_right_happy.png  # Right button with smiley (220x220px)

../graphics/icons/
├── icon-192.png            # PWA icon 192x192
└── icon-512.png            # PWA icon 512x512
```

## Browser Compatibility

**Recommended:**
- Chrome 90+
- Edge 90+
- Safari 14+ (iOS/iPadOS)

**Required Features:**
- ES6+ JavaScript
- CSS Grid/Flexbox
- Touch Events API
- LocalStorage API
- Service Workers (for offline mode)

## Technical Specifications

### Screen Flow

```
Age Selection → Participant ID → Recording Reminder → [Task Loop] → End/DNF
                                                            ↓
                                                      Ready Screen
                                                            ↓
                                                      Wait Screen (Jitter 1)
                                                            ↓
                                                      Prompt Screen
                                                            ↓
                                                   (Jitter 2 after response)
                                                            ↓
                                                    (repeat for all trials)
```

### Timing

- **Photocell Flash**: 10ms white flash on dot press and button press
- **Jitter 1**: Blank wait screen between dot press and button appearance (duration drawn from age-specific pool)
- **Jitter 2**: Delay between button response and red dot reappearing (uniform random within age-specific range)
- **Inactivity Timeout**: 60 seconds triggers DNF

### Task Constraints (Test Tasks)

- First 3 trials: Always prepotent (establish pattern)
- Trial distribution: 75% prepotent, 25% inhibitory
- Max consecutive prepotent: 4 trials
- Max consecutive inhibitory: 1 trial (never adjacent)

## Troubleshooting

### App Not Loading

- Check that all files are in correct locations
- Verify `graphics/buttons/` and `graphics/icons/` folders exist with correct filenames
- Check browser console for errors (F12)

### Service Worker Issues

- Service workers require HTTPS or localhost
- Clear cache: Chrome DevTools → Application → Clear Storage
- Unregister old workers: Application → Service Workers → Unregister

### Data Not Downloading

- Check browser popup blocker settings
- Ensure localStorage is enabled
- Try different browser if issues persist

### Photocell Not Visible

- Check `#buttonIndicator` CSS in styles.css
- Indicator is 2cm square in bottom-left corner
- Should be black with white 10ms flashes

## Related Documentation

- **[adult-task-specs.md](../../2-25/adult-task-specs.md)** - Detailed task specifications
- **[current-workflow.md](../../2-25/current-workflow.md)** - Complete workflow documentation
- **[system-architecture.md](../../2-25/system-architecture.md)** - Technical architecture details

## Version History

### v2.0 (2026-05-29)
- Added Child, Toddler, and Infant age groups
- Left/right counterbalancing with manual override
- Age-specific jitter pools (Jitter 1) and jitter ranges (Jitter 2)
- Reward animations for Child, Toddler, and Infant
- Renamed all top/bottom references to left/right (task IDs, CSV sections, image files)
- EEG recording reminder screen

### v1.0 (2026-03-04)
- Initial PWA implementation
- Adult task battery
- CSV export functionality
- DNF handling
- Offline support via service worker