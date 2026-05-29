# ECITT Tasks - Progressive Web App

## Overview

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

### CSV Format

The app generates CSV files with the ECITT SoleScreen timestamp format:

```
ParticipantName,TestName,TrialName,SectionStarted,Stimuli,InvokedBy,Accuracy,TrialsRemaining,StartTimestamp,Duration
PC001,Adult,adt_tpl,LeftTrialScreen,left,Responder_left,1,31,2026-03-04@H14:M32:S15.234,0M:00S:612MS
```

### Fields

- **ParticipantName**: Participant ID entered on the setup screen
- **TestName**: Age-group label (Adult / Child / Toddler / Infant)
- **TrialName**: Task ID (e.g., `adt_tpl`, `inf_tpll`)
- **SectionStarted**: Screen type — `TaskStart`, `ReadyScreen`, `WaitScreen`, `PromptScreen`, `LeftTrialScreen`, `RightTrialScreen`, `ControlTrialScreen`, `LeftTrialResponse`, `RightTrialResponse`, `ControlTrialResponse`, `PromptResponse`, `TaskEnd`, `DNF`, `FlashConflict`
- **Stimuli**: Button position or event descriptor
- **InvokedBy**: Action source (e.g., `Responder_left`, `System`)
- **Accuracy**: `1` = correct, `0` = incorrect, `n/a` = non-trial event
- **TrialsRemaining**: Trials left in current task block
- **StartTimestamp**: Event timestamp (`YYYY-MM-DD@Hhh:Mmm:Sss.mmm`)
- **Duration**: Time until next event (`0M:00S:612MS` format); last row gets `0M:00S:001MS`

### Filename Convention

```
ECITT_{ParticipantID}_{Timestamp}.csv
```

Example: `ECITT_PC001_2026-03-04_14-32-15-123.csv`

## Changing Task Setup and Timing

All task configuration lives in **`app.js`**.

### Modifying a task (trials, button layout, instructions)

Each task is defined in `TASK_CONFIGS` (top of `app.js`). Find the task by its ID and edit directly:

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
├── app.js                  # Task logic and flow
├── data.js                 # Data management and CSV generation
├── service-worker.js       # PWA offline support
├── manifest.json           # PWA configuration
└── README.md               # This file
```

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

## License

ECITT © 2026 BEAD Lab. All rights reserved.
