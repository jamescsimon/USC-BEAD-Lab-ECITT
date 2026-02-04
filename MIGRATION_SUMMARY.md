# MySQL to Google Sheets API Migration - Complete

**Date Completed**: February 3, 2026  
**Branch**: Current working branch  
**Status**: ✅ **COMPLETE** - No MySQL dependencies remain

---

## Summary

This branch has been **fully converted** from MySQL to Google Sheets API for all data storage operations. The conversion is complete and the app no longer requires MySQL or any relational database.

---

## What Was Changed

### 1. Backend PHP Libraries

#### Added: `private/libs/php/sheetsLib.php`
Complete Google Sheets API library with functions for:
- **Authentication**: OAuth 2.0 JWT service account authentication
- **User Management**: `sheetsUserSelect()` for login validation
- **Project Management**: Create, read, update, delete projects
- **Test Set Management**: Create, read, update, delete test sets  
- **Participant Management**: Create, read, update, delete participants
- **Response Logging**: `logResponseToSheets()` for trial data
- **Event Logging**: `logEventToSheets()` for application events
- **Sync Points**: Track synchronization points for multi-device setups

#### Modified: `public/gsheetsacc/index.php`
Extended from simple response logging to handle **all** database operations:
- `userSelect` - User authentication
- `projectsSelect`, `projectInsert`, `projectUpdate`, `projectDelete`
- `testSetsSelect`, `testSetInsert`, `testSetUpdate`, `testSetDelete`
- `partsSelect`, `partInsert2`, `partUpdate2`, `partDelete`
- `testsSelect`, `syncPointsSelect`, `getPartsDoc`
- `respInsert`, `eventLog`

Now includes XML generation functions matching the old database format:
- `genStatusDoc()` - Status responses
- `genMultiXmlElemDocFromDbResult()` - Multi-row results
- `genSingleXmlElemDoc()` - Single-row results

### 2. Frontend JavaScript

All database access calls updated from `../dbacc/` to `../gsheetsacc/`:

#### Modified Files:
- **`public/js/lib.js`**
  - `userSelect()` - Login
  - `getPartsDoc()` - Participant selection
  - `testsSelect()` - Test selection

- **`public/js/dmgr.js`**
  - `syncPointsSelect()` - Sync point management

- **`public/js/dmglib.js`**
  - `projectsSelect()`, `projectInsert()`, `projectUpdate()`, `projectDelete()`
  - `testSetsSelect()`, `testSetInsert()`, `testSetUpdate()`, `testSetDelete()`
  - `partsSelect()`, `partInsert()`, `partUpdate()`, `partDelete()`
  - `testsSelect()`

- **`public/js/comm.js`**
  - `recordResponse()` - Already using gsheetsacc
  - `recordAndReport()` - Already using gsheetsacc
  - `flushRecordQueue()` - Updated fallback to gsheetsacc

### 3. Database Architecture Changes

#### Old Architecture (MySQL):
```
MySQL Database (ecitt_db)
├── ecitt_user (users table)
├── ecitt_project (projects table)
├── ecitt_testSet (test sets table)
├── ecitt_part (participants table)
├── ecitt_resp (responses table)
├── ecitt_perm (permissions table)
└── ecitt_testSpec (test specs table)
```

#### New Architecture (Google Sheets):
```
Google Spreadsheet (single file)
├── Users (sheet)
├── Projects (sheet)
├── TestSets (sheet)
├── Participants (sheet)
├── Responses (sheet)
├── Events (sheet)
├── Tests (sheet - optional)
└── SyncPoints (sheet - optional)
```

### 4. Documentation Updates

- **README.md**: Updated to reflect Google Sheets-only setup
- **GOOGLE_SHEETS_SETUP.md**: Complete setup guide (already existed)
- **MIGRATION_SUMMARY.md**: This document

### 5. What Was NOT Changed

The following were intentionally left unchanged:
- `private/libs/php/dbLib.php` - Still exists but **not used** by this branch
  - Contains old MySQL code for reference
  - Could be removed or kept as fallback for other branches
- `public/dbacc/index.php` - Still exists but **not accessed** by frontend
  - All frontend calls now go to `gsheetsacc`
- Database schema files in `/database/` directory - Kept for reference

---

## Google Sheets Structure Required

### 1. Responses Sheet
Logs all trial responses:
```
Headers: Timestamp | User | ProjectNo | TestSetNo | TestName | PartNo | 
         PrevRespTime | TrialStartTime | TrialType | TrialPhase | TrialNo | 
         TrialVariant | Accuracy | TouchTime | ReactionTime | TrialTime | 
         ButtonPressed | AnimationShowed | DotPressed | MoveEvents | 
         Latitude | Longitude | TrialQueueLength
```

### 2. Events Sheet
Logs application events:
```
Headers: Timestamp | EventType | EventData | UserName | ClientIP | Source
```

### 3. Users Sheet
User authentication:
```
Headers: username | password | userType | globalPerm
Example: admin | admin | dev | adm
```

### 4. Projects Sheet
Research projects:
```
Headers: no | name | userName
```

### 5. TestSets Sheet
Test configurations:
```
Headers: no | projectNo | name
```

### 6. Participants Sheet
Participant information:
```
Headers: userName | no | projectNo | ref | birthYear | birthMonth | birthDay | gender
```

### 7. Tests Sheet (Optional)
Test definitions:
```
Headers: testName | testDescription | created | modified
```

### 8. SyncPoints Sheet (Optional)
Synchronization tracking:
```
Headers: userName | projectNo | testSetNo | partNo | timestamp
```

---

## Configuration Requirements

### 1. Service Account Credentials
Place the Google service account JSON file in project root:
```
usc-bead-ecitt-755207cdd9c1.json
```

### 2. Environment Variables
Set the spreadsheet ID (or edit `sheetsLib.php` directly):
```bash
# Windows PowerShell
$env:GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id"

# Mac/Linux  
export GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id"
```

### 3. Sheet Permissions
Share the Google Sheet with the service account email (found in JSON file):
```
service-account-name@project-id.iam.gserviceaccount.com
```
Grant **Editor** access.

---

## Key Differences from MySQL Version

| Aspect | MySQL Version | Google Sheets Version |
|--------|---------------|----------------------|
| **Setup** | Install MySQL, create database, run schema | Create spreadsheet, add headers, share with service account |
| **Permissions** | Database-level user permissions | Sheet-level sharing |
| **Queries** | SQL queries | Google Sheets API calls |
| **Transactions** | ACID transactions supported | Sequential API calls (eventual consistency) |
| **Speed** | Fast local queries | API call latency (~100-500ms) |
| **Concurrent Users** | Excellent | Good (API rate limits apply) |
| **Data Analysis** | Requires export or SQL tools | Native spreadsheet formulas, charts |
| **Backup** | MySQL dump required | Built-in Google Drive versioning |
| **Cost** | Free (self-hosted) | Free (Google Workspace limits) |

---

## Testing Checklist

Before using in production, test these operations:

- [ ] **Login** - User authentication works
- [ ] **Projects** - Create, view, edit, delete projects
- [ ] **Test Sets** - Create, view, edit, delete test sets
- [ ] **Participants** - Create, view, edit, delete participants
- [ ] **Trial Responses** - Response data logs to Responses sheet
- [ ] **Events** - Application events log to Events sheet
- [ ] **Multiple Users** - Data isolation works correctly
- [ ] **Timestamps** - All timestamps are in UTC format
- [ ] **Error Handling** - API failures don't crash the app

---

## Rollback Plan

If you need to revert to MySQL:

1. Switch to a branch with MySQL support
2. Set up MySQL database using `/database/schema.sql`
3. The MySQL code still exists in `dbLib.php`
4. Frontend would need to be reverted (all `../gsheetsacc/` → `../dbacc/`)

**However**: This branch is complete and doesn't support MySQL fallback in its current state.

---

## Performance Notes

### Google Sheets API Limits
- **Read requests**: 100 per 100 seconds per user
- **Write requests**: 100 per 100 seconds per user
- **Quota**: 500 requests per 100 seconds (project-wide)

For typical ECITT usage (1-2 active participants at a time), these limits are more than sufficient.

### Optimization Strategies Implemented
- Token caching (1 hour) to minimize auth requests
- Single API call per data operation
- Append operations for new data (faster than update)
- Row-level updates only when modifying existing data

---

## Future Enhancements (Optional)

Potential improvements for this Google Sheets implementation:

1. **Batch Operations**: Group multiple operations into single API calls
2. **Caching Layer**: Cache frequently-read data (users, projects) locally
3. **Retry Logic**: Automatic retry on API failures with exponential backoff
4. **Data Validation**: Server-side validation before writing to sheets
5. **Archive System**: Move old data to separate sheets to improve performance
6. **Real-time Sync**: Use Google Sheets webhooks for multi-device coordination

---

## Support & Troubleshooting

### Common Issues

**"Could not get access token"**
- Check service account JSON file is in correct location
- Verify Google Sheets API is enabled
- Ensure credentials file is valid JSON

**"No user data found"**  
- Verify Users sheet has headers in row 1
- Check at least one user exists in row 2+
- Confirm sheet is named exactly "Users"

**"HTTP 403 Forbidden"**
- Sheet not shared with service account email
- Service account needs Editor access
- Check project has Sheets API enabled

**Data not appearing**
- Check GOOGLE_SHEETS_SPREADSHEET_ID is correct
- Verify sheet names match exactly (case-sensitive)
- Look for errors in server logs/browser console

### Getting Help

1. Check browser console for JavaScript errors
2. Check PHP error logs (in `private/logs/`)
3. Verify Google Sheets API quota hasn't been exceeded
4. Test API access with `curl` commands from setup guide

---

## Conclusion

✅ **Migration is COMPLETE**

This branch now uses Google Sheets exclusively for all data operations. MySQL is no longer required or used. The app maintains the same user-facing functionality while storing all data in a Google Sheets spreadsheet that can be easily accessed, analyzed, and shared.

---

**For complete setup instructions, see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)**
