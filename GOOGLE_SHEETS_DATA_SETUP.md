# Google Sheets Data Setup Guide

## Overview

This guide shows you how to populate your Google Sheets with the required data structure so tests (like "Adult Touch Task ECITT") appear in the ECITT app.

## Required Sheets

Your Google Sheet needs these 7 tabs (case-sensitive):

1. **Users** - Authentication
2. **Projects** - Top-level containers
3. **TestSets** - Test collections within projects
4. **Tests** - Available test definitions
5. **Participants** - Subject information
6. **SyncPoints** - Test progress markers
7. **Responses** - Trial data (already documented in GOOGLE_SHEETS_SETUP.md)
8. **Events** - App events (already documented in GOOGLE_SHEETS_SETUP.md)

---

## 1. Users Sheet

**Purpose**: Store user authentication credentials

**Columns**: `username | password | userType | globalPerm`

**Sample Data**:
```
username    password    userType    globalPerm
admin       admin       admin       adm
testuser    test123     user        view
```

**Field Definitions**:
- `username`: Login username
- `password`: Plain text password (for testing only - NOT production secure)
- `userType`: `admin` or `user`
- `globalPerm`: `adm`, `edit`, `view`, or blank

---

## 2. Projects Sheet

**Purpose**: Top-level organizational containers for studies

**Columns**: `no | name | userName`

**Sample Data**:
```
no    name                userName
1     ECITT Study 2024    admin
2     Pilot Study         admin
```

**Field Definitions**:
- `no`: Unique project ID (integer, auto-increment when creating new)
- `name`: Project display name
- `userName`: Project owner

**How to add**: 
1. Copy headers to row 1
2. Add your project in row 2 (use `no=1` for first project)

---

## 3. TestSets Sheet

**Purpose**: Collections of tests within a project

**Columns**: `no | projectNo | name`

**Sample Data**:
```
no    projectNo    name
1     1            Main Test Battery
2     1            Pilot Tests
```

**Field Definitions**:
- `no`: Unique test set ID (integer)
- `projectNo`: Parent project ID (from Projects sheet)
- `name`: Test set display name

**How to add**:
1. Copy headers to row 1
2. Add test set with `projectNo=1` to link to your project

---

## 4. Tests Sheet

**Purpose**: Define available tests that can be run

**Columns**: `name | specName | description | created`

**Sample Data for Adult Touch Task**:
```
name                        specName    description                                     created
Adult                       adt         Touch-based inhibitory control task (vertical)  2024-01-20
Adult Hor                   adth        Touch-based inhibitory control task (horizontal) 2024-01-20
9 Months                    9m          Touch task for 9-month-olds                     2024-01-20
24 Months 1                 24m1        Touch task for 24-month-olds (version 1)        2024-01-20
24 Months 2                 24m2        Touch task for 24-month-olds (version 2)        2024-01-20
48 Months                   48m         Touch task for 48-month-olds                    2024-01-20
```

**Field Definitions**:
- `name`: Display name shown in UI (this appears in the Tests dropdown)
- `specName`: Internal identifier (no spaces, camelCase) - used by test logic
- `description`: Brief description
- `created`: Creation date (YYYY-MM-DD format)

**Critical Notes**: 
- The `name` field must match exactly what you expect to see in the Controller UI.
- Both `name` and `specName` columns are required (cannot be empty).
- Sheet tab must be named exactly `Tests` (case-sensitive).

---

## 5. Participants Sheet

**Purpose**: Store subject demographics

**Columns**: `userName | no | projectNo | ref | birthYear | birthMonth | birthDay | gender`

**Sample Data**:
```
userName    no    projectNo    ref         birthYear    birthMonth    birthDay    gender
admin       1     1            TEST_001    1990         5             15          M
admin       2     1            TEST_002    1995         8             22          F
```

**Field Definitions**:
- `userName`: Owner/researcher
- `no`: Unique participant ID
- `projectNo`: Parent project ID
- `ref`: Participant reference code
- `birthYear`, `birthMonth`, `birthDay`: Date of birth components
- `gender`: `M`, `F`, or other

---

## 6. SyncPoints Sheet

**Purpose**: Track test progress and synchronization markers

**Columns**: `userName | projectNo | testSetNo | partNo | timestamp`

**Sample Data** (usually starts empty):
```
userName    projectNo    testSetNo    partNo    timestamp
admin       1            1            1         1705756800000
```

**Field Definitions**:
- `userName`: User who ran the test
- `projectNo`: Project ID
- `testSetNo`: Test set ID
- `partNo`: Participant ID
- `timestamp`: Unix timestamp in milliseconds

**Note**: This sheet is typically populated automatically during test runs.

---

## Quick Setup: Copy-Paste Template

### Minimal Working Setup

Here's a complete minimal setup to get "Adult Touch Task ECITT" working:

#### 1. Create these tabs in your Google Sheet:
- Users
- Projects  
- TestSets
- Tests
- Participants
- SyncPoints
- Responses (from GOOGLE_SHEETS_SETUP.md)
- Events (from GOOGLE_SHEETS_SETUP.md)

#### 2. Paste this data:

**Users tab (row 1 = headers, row 2 = data)**:
```
username	password	userType	globalPerm
admin	admin	admin	adm
```

**Projects tab**:
```
no	name	userName
1	ECITT Study	admin
```

**TestSets tab**:
```
no	projectNo	name
1	1	Main Battery
```

**Tests tab**:
```
name	specName	description	created
Adult	adt	Touch-based inhibitory control task (vertical)	2024-01-20
```

**Participants tab**:
```
userName	no	projectNo	ref	birthYear	birthMonth	birthDay	gender
admin	1	1	TEST_001	1990	5	15	M
```

**SyncPoints tab** (leave empty except headers):
```
userName	projectNo	testSetNo	partNo	timestamp
```

**Responses tab** (from GOOGLE_SHEETS_SETUP.md):
```
Timestamp	User	ProjectNo	TestSetNo	TestName	PartNo	PrevRespTime	TrialStartTime	TrialType	TrialPhase	TrialNo	TrialVariant	Accuracy	TouchTime	ReactionTime	TrialTime	ButtonPressed	AnimationShowed	DotPressed	MoveEvents	Latitude	Longitude	TrialQueueLength
```

**Events tab** (from GOOGLE_SHEETS_SETUP.md):
```
Timestamp	EventType	EventData	UserName	ClientIP	Source
```

---

## Testing Your Setup

1. **Share the Google Sheet** with your service account email (from credentials JSON)
   - Grant "Editor" access
   
2. **Start the server**:
   ```
   start-server.bat
   ```

3. **Open Controller and Responder**:
   - Controller: `http://localhost:8000`
   - Responder: Open in another tab/device

4. **Login** with `admin` / `admin`

5. **Select** → Project: "ECITT Study" → TestSet: "Main Battery"

6. **Tests page**: You should now see "Adult" listed

7. **Select the test** and assign to Participant "TEST_001"

8. **Pair Controller and Responder**, then run the test

---

## Verification Checklist

✅ **Users sheet**: Has `admin` user with password `admin`  
✅ **Projects sheet**: Has at least one project (no=1)  
✅ **TestSets sheet**: Has test set linked to project  
✅ **Tests sheet**: Has test row with correct specName (adt, adth, 9m, etc.)  
✅ **Participants sheet**: Has at least one participant  
✅ **Sheet permissions**: Service account has Editor access  
✅ **Environment vars**: `GOOGLE_SHEETS_SPREADSHEET_ID` set correctly  

---

## Troubleshooting

### "No tests found" on Tests page (Tests dropdown is empty)

**Cause**: Tests sheet empty, incorrectly named, or missing required columns

**Fix**: 
1. Verify Tests sheet exists and is named exactly `Tests` (case-sensitive, NOT "Test" or "tests")
2. Check column headers in row 1 match EXACTLY: `name | specName | description | created`
3. Ensure at least one data row exists (row 2 or later)
4. Verify both `name` and `specName` columns are NOT empty
5. Check backend logs at `d:\coding\BEAD Lab\Work\USC-BEAD-Lab-ECITT\private\logs\`
   - Look for "sheetsTestsSelect" entries
   - Should show "Found X tests" message
6. Test the endpoint directly: `http://localhost:8000/gsheetsacc/?type=testsSelect&data=admin`
   - Should return XML with `<tests>` containing `<test>` elements

**Example valid Tests sheet**:
```
Row 1 (headers):  name        | specName    | description                                      | created
Row 2 (data):     Adult       | adt         | Touch-based inhibitory control task (vertical)   | 2024-01-20
```

### "Failed to load projects"

**Cause**: Projects sheet empty or service account lacks permissions

**Fix**:
1. Check Projects sheet has data
2. Verify service account email has Editor access to the sheet
3. Check `GOOGLE_SHEETS_SPREADSHEET_ID` environment variable

### "Permission denied" errors

**Cause**: Service account not granted access

**Fix**:
1. Copy service account email from credentials JSON file
2. Click "Share" on Google Sheet
3. Paste email and grant "Editor" access

### Test appears but won't start

**Cause**: Missing Participants or TestSets data

**Fix**:
1. Ensure Participants sheet has at least one participant
2. Verify TestSets sheet links to your project
3. Check that participant's `projectNo` matches your project

---

## Adding More Tests

To add additional tests to your sheet:

1. Open **Tests** sheet
2. Add a new row with:
   - `name`: Display name (e.g., "Adult Hor")
   - `specName`: Internal ID matching cntr.xml (e.g., "adth")
   - `description`: Brief description
   - `created`: Today's date (YYYY-MM-DD)

**CRITICAL**: The `specName` must match a `<testCntr test="...">` value in cntr.xml

**Available Test Spec Names** (from original ECITT study):
```
name            specName    description                                      created
Prohibition     phb         Prohibition approach/restraint tasks              2024-01-20
9 Months        9m          Touch task for 9-month-olds                       2024-01-20
Box Test        box         A-not-B box task                                  2024-01-20
Box Test 3-1    box31       A-not-B box task (3-1 version)                    2024-01-20
24 Months 1     24m1        Touch task for 24-month-olds (version 1)          2024-01-20
24 Months 2     24m2        Touch task for 24-month-olds (version 2)          2024-01-20
24 Months 2 Hor 24m2h       Touch task for 24-month-olds (horizontal)         2024-01-20
48 Months       48m         Touch task for 48-month-olds                      2024-01-20
Dev             dev         Development/baseline video tasks                  2024-01-20
NIRS Ver        nirsv       NIRS vertical tasks                               2024-01-20
Nirs Hor        nirsh       NIRS horizontal t using correct specNames
3. 🔄 Test "Adult" appears in Controller with functional page                     2024-01-20
Adult           adt         Adult inhibitory control task (vertical)          2024-01-20
Adult Hor       adth        Adult inhibitory control task (horizontal)        2024-01-20
Spatial Confl   spc         Spatial conflict task                             2024-01-20
```

---

## Next Steps

After populating your sheets:

1. ✅ Console spam removed (polling logs cleaned up)
2. ✅ Google Sheets populated with sample data
3. 🔄 Test "Adult Touch Task ECITT" appears in Controller
4. 🔄 Run a test trial to verify Responses sheet gets populated

## Related Documentation

- [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) - Initial Google Sheets API setup
- [README.md](README.md) - General project overview
