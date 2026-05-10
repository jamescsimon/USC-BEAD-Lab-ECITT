# ECITT Adult Tasks - Progressive Web App

## Overview

This is a single-screen Progressive Web App (PWA) implementation of the ECITT (Early Childhood Inhibitory Touchscreen Tasks) Adult Task Battery. The app runs all 7 adult task variations as one combined test without requiring a separate controller device.

## Features

- **Self-Contained**: No external controller needed - everything runs in one screen
- **Offline Support**: Works offline once installed using service worker
- **Local Data Storage**: CSV data saved locally with localStorage backup
- **DNF Handling**: Automatically saves partial data if session is incomplete
- **Mobile-First**: Optimized for touchscreen devices (tablets, smartphones)
- **PWA Installable**: Can be installed as a standalone app on devices

## Task Battery

The app executes 7 adult task variations in sequence:

1. **Control Bottom** (adt_cb) - 4 trials
2. **Control Top** (adt_ct) - 4 trials
3. **Control Middle** (adt_cm) - 4 trials
4. **Practice Top** (adt_ppt) - 4 trials
5. **Practice Bottom** (adt_ppb) - 4 trials
6. **Test Top** (adt_tpt) - 32 trials (75% prepotent, 25% inhibitory)
7. **Test Bottom** (adt_tpb) - 32 trials (75% prepotent, 25% inhibitory)

**Total: 84 trials**

### Task-Specific Layouts

Each task has a specific button/dot layout for the PromptScreen:
- **Control & Practice**: 2 buttons + 1 red dot (always middle)
- **Test**: 2 buttons + 1 red dot (varies by trial variant)

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
| `_cb` | Control Bottom — baseline, single bottom button |
| `_ct` | Control Top — baseline, single top button |
| `_cm` | Control Middle — baseline, single middle button (adult only) |
| `_ppt` | Practice Prepotent Top — 4-trial practice, happy face always top |
| `_ppb` | Practice Prepotent Bottom — 4-trial practice, happy face always bottom |
| `_blt` | Baseline Top — 32-trial baseline, happy face always top (child only) |
| `_blb` | Baseline Bottom — 32-trial baseline, happy face always bottom (child only) |
| `_tpt` | Test Prepotent Top — 32 trials, 75% top / 25% bottom |
| `_tpb` | Test Prepotent Bottom — 32 trials, 75% bottom / 25% top |
| `_c1t` / `_c1b` | Infant Control 1 Top / Bottom — single-button baseline before test (infant only) |
| `_c2t` / `_c2b` | Infant Control 2 Top / Bottom — single-button baseline after test (infant only) |
| `_tptt` | Infant Test PR Top — prepotent phase (top button, builds habit) |
| `_tptb` | Infant Test PR Top — inhibitory phase (bottom button, requires switch) |
| `_tpbt` | Infant Test PR Bottom — prepotent phase (bottom button, builds habit) |
| `_tpbb` | Infant Test PR Bottom — inhibitory phase (top button, requires switch) |

## Usage

### Starting the App

1. Open `index.html` in a web browser (preferably Chrome/Edge)
2. Click "Adult" on the age selection screen
3. Enter a Participant ID (e.g., PC001, P123)
4. Click "Start Task" to begin

### During Testing

- **Ready Screen**: Place finger on red dot
  - Displays instructions at top and bottom
  - Press red dot when ready to start trial
  
- **Prompt Screen**: Respond to buttons
  - Three buttons appear (top/middle/bottom)
  - Press the happy face button as quickly as possible
  - Return to red dot for next trial

### Completing the Test

- **Normal Completion**: After all 56 trials
  - Shows final statistics (accuracy, reaction time)
  - Download CSV results
  - Option to start new session

- **Did Not Finish (DNF)**: If session interrupted
  - Triggered by 60 seconds of inactivity
  - Shows partial statistics
  - CSV includes completed trials with DNF marker

## Data Output

### CSV Format

The app generates CSV files matching the ECITT Telemetry Tracker format:

```
TestDate,StartTimestamp,ResponserName,ControllerName,Section,Stimuli,InvokedBy,Accuracy,ProjectName,TestSetName,TestName,TrialsRemaining,ReactionTime,Timestamp
2026-03-04,H14:M32:S15.1234,PC001,Self_Administered,PromptScreen,top,Responder_top,1,ECITT_PWA,AdultTasks,adt_cb,3,456,2026-03-04T14:32:15.789Z
```

### Fields

- **TestDate**: Date of test (YYYY-MM-DD)
- **StartTimestamp**: Session start time (H:M:S.ms format)
- **ResponserName**: Participant ID
- **ControllerName**: Always "Self_Administered"
- **Section**: Screen type (ReadyScreen, PromptScreen, TaskStart, etc.)
- **Stimuli**: Button position or event type
- **InvokedBy**: Action source (Responder_top, System, etc.)
- **Accuracy**: 1 = correct, 0 = incorrect, n/a = non-trial event
- **ProjectName**: "ECITT_PWA"
- **TestSetName**: "AdultTasks"
- **TestName**: Task ID (adt_cb, adt_tpt, etc.)
- **TrialsRemaining**: Trials left in current task
- **ReactionTime**: Time from dot press to button press (milliseconds)
- **Timestamp**: Event timestamp (ISO 8601)

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
adt_tpt: {
    trials: 32,              // number of trials
    varDistr: [75, 25],      // [prepotent %, inhibitory %]
    varLeading: 3,           // leading prepotent trials (always first)
    varMaxDups: 4,           // max consecutive prepotent trials
    promptLayout: { top: 'button', mdl: 'dot', btm: 'button' },
    readyMsg1: '...',        // instruction line 1
    readyMsg2: '...',        // instruction line 2
    readyMsg3: 'Ready?'      // instruction line 3
}
```

### Changing the active task sequence

Four sequence arrays control which tasks run and in what order:

| Variable | Age group |
|---|---|
| `TASK_SEQUENCE` | Adult (18+) |
| `CHILD_TASK_SEQUENCE` | Child (2–17 yr) |
| `TODDLER_TASK_SEQUENCE` | Toddler (17–23 mo) |
| `INFANT_TASK_SEQUENCE` | Infant (10–16 mo) |

Edit these arrays to add, remove, or reorder tasks.

### Timing constants

| Constant / location | Default | What it controls |
|---|---|---|
| `INACTIVITY_TIMEOUT` (~line 504) | `60000` ms | Seconds of no input before auto-DNF |
| `setTimeout(..., 100)` in `handleButtonPress` (~line 884) | `100` ms | Delay from button press to next ready screen |
| `setTimeout(..., 500)` in `finishTask` (~line 927) | `500` ms | Delay before inter-block feedback screen |
| `setTimeout(..., 1000)` in `finishTask` (~line 927) | `1000` ms | Delay before loading next task block |
| `setTimeout(..., 1000)` in `continueAfterRecordingReminder` | `1000` ms | Delay after researcher presses Continue on the EEG reminder screen |

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
└── README.md              # This file
```

## Dependencies

### Required Graphics

The app requires these button images (relative to unifiedtasks/):

```
../graphics/buttons/
├── button_dot.png          # Red dot (70x70px)
├── button_top.png          # Top button plain (220x220px)
├── button_top_happy.png    # Top button with smiley (220x220px)
├── button_mdl.png          # Middle button plain (220x220px)
├── button_mdl_happy.png    # Middle button with smiley (220x220px)
├── button_btm.png          # Bottom button plain (220x220px)
└── button_btm_happy.png    # Bottom button with smiley (220x220px)

../graphics/icons/
├── icon-192.png           # PWA icon 192x192
└── icon-512.png           # PWA icon 512x512
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
Age Selection → Participant ID → [Task Loop] → End/DNF
                                      ↓
                                Ready Screen
                                      ↓
                                Prompt Screen
                                      ↓
                            (repeat for all trials)
```

### Timing

- **Photocell Flash**: 10ms white flash on dot press and button press
- **Reaction Time**: Measured from dot press to button press
- **Inter-trial Interval**: 500ms after button press before next ready screen
- **Inactivity Timeout**: 60 seconds triggers DNF

### Task Constraints (Test Tasks)

- First 3 trials: Always prepotent (establish pattern)
- Trial distribution: 75% prepotent, 25% inhibitory
- Max consecutive prepotent: 4 trials
- Max consecutive inhibitory: 1 trial (never adjacent)

## Troubleshooting

### App Not Loading

- Check that all files are in correct locations
- Verify graphics/buttons/ and graphics/icons/ folders exist
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

### v1.0 (2026-03-04)
- Initial PWA implementation
- All 7 adult tasks integrated
- CSV export functionality
- DNF handling
- Offline support via service worker

## License

ECITT © 2026 BEAD Lab. All rights reserved.
