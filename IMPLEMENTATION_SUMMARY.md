# Google Sheets Logging Branch - Implementation Summary

## Branch Information

**Branch Name**: `google-sheets-logging`  
**Based On**: ECITT PWA main branch  
**Commit**: Latest commit contains full Google Sheets integration  
**Status**: ✅ Ready for deployment

## What Was Implemented

### 1. Google Sheets API Integration (`private/libs/php/sheetsLib.php`)
- Service account OAuth 2.0 authentication with JWT creation
- Access token management with automatic refresh
- Two main logging functions:
  - `logResponseToSheets()` - Log trial responses with all metrics
  - `logEventToSheets()` - Log app events
- UTC timestamp generation in ISO 8601 format
- Error handling and logging throughout

### 2. Google Sheets Logging Endpoint (`public/gsheetsacc/index.php`)
- New endpoint to replace MySQL backend: `/gsheetsacc/`
- Supports operation types:
  - `respInsert` - Log trial responses
  - `eventLog` - Log app events
  - `test` - Endpoint connectivity test
- Parses CSV and pipe-delimited data formats
- Returns XML status responses for consistency with original app

### 3. Frontend Updates (`public/js/comm.js`)
- Modified `recordResponse()` function to use `/gsheetsacc/?type=respInsert`
- Modified `recordAndReport()` function to use `/gsheetsacc/?type=respInsert`
- All app interactions now logged to Google Sheets instead of MySQL
- Maintains same data format and timing behavior

### 4. Configuration System (`public/boot.php`)
- Added `USE_GOOGLE_SHEETS` environment variable flag
- Allows switching between Google Sheets and MySQL backends
- Optional environment variable based configuration
- Maintains backward compatibility with original MySQL code

### 5. Documentation

#### GOOGLE_SHEETS_SETUP.md
- Step-by-step guide for Google Cloud setup
- Service account creation and credential download
- Google Sheet creation with correct column headers
- Environment variable configuration (all OS)
- Troubleshooting section with common issues
- Data format documentation
- Security best practices

#### GOOGLE_SHEETS_BRANCH_README.md
- Branch overview and quick start
- Key features highlighting no MySQL requirement
- Integration guide and deployment instructions
- API endpoint reference
- Security considerations
- Version and support information

### 6. Setup Automation Scripts

#### setup-google-sheets.bat (Windows)
- Interactive configuration wizard
- Validates spreadsheet ID and credentials file
- Chooses between system-wide or user-specific variables
- Automatic setx command execution
- Clear next steps output

#### setup-google-sheets.sh (Mac/Linux)
- Interactive configuration wizard
- Shell detection (Bash/Zsh)
- Automatic backup of shell profile
- Adds environment variables to shell config
- Sources profile for immediate activation

### 7. Git Configuration
- `.gitignore` - Excludes credentials and sensitive files
- Prevents accidental credential commits
- Protects `private/creds/` directory

## Data Logging

### Trial Response Data (Responses Sheet)
All trial data is logged with UTC timestamps and includes:
- Participant identifier
- Study/test identifiers
- Trial type and phase
- Performance metrics (accuracy, reaction time, etc.)
- Touchscreen interaction data
- Geographic coordinates (if available)

### Event Data (Events Sheet)
App events logged with:
- Event type and additional data
- Participant identifier
- Client IP address
- ISO 8601 UTC timestamp

## Technical Specifications

- **PHP Version**: 8.0 or higher
- **Google Sheets API**: v4
- **Authentication**: Service Account with OAuth 2.0 JWT
- **Timestamp Format**: ISO 8601 UTC (e.g., `2024-02-03T15:30:45Z`)
- **Data Transfer**: HTTPS/cURL with JSON requests
- **Token Caching**: Automatic refresh when expiring
- **Error Handling**: Comprehensive logging and status reporting

## File Changes Summary

| File | Changes | Type |
|------|---------|------|
| `private/libs/php/sheetsLib.php` | NEW | PHP Library |
| `public/gsheetsacc/index.php` | NEW | PHP Endpoint |
| `public/js/comm.js` | MODIFIED | Logging routing |
| `public/boot.php` | MODIFIED | Configuration flag |
| `.gitignore` | NEW | Git configuration |
| `GOOGLE_SHEETS_SETUP.md` | NEW | Documentation |
| `GOOGLE_SHEETS_BRANCH_README.md` | NEW | Documentation |
| `setup-google-sheets.bat` | NEW | Setup script |
| `setup-google-sheets.sh` | NEW | Setup script |

## Quick Deployment Checklist

- [ ] Clone the repository
- [ ] Switch to `google-sheets-logging` branch
- [ ] Create Google Cloud project
- [ ] Enable Google Sheets API
- [ ] Create service account and download credentials
- [ ] Create Google Sheet with Responses and Events tabs
- [ ] Share sheet with service account email
- [ ] Run setup script (Windows: `setup-google-sheets.bat` or Mac/Linux: `bash setup-google-sheets.sh`)
- [ ] Start server
- [ ] Verify data logging in Google Sheet

## No MySQL Required

This branch requires NO MySQL installation or configuration:
- No database setup needed
- No server configuration required
- No credential management for database
- Data immediately available in Google Sheets
- Easy to backup and share data

## Backward Compatibility

- Original MySQL code remains intact
- Can switch back to MySQL by setting `USE_GOOGLE_SHEETS=0`
- Both backends can coexist in the same deployment
- No breaking changes to app functionality

## Security Considerations

✅ Credentials stored in `private/` (not web-accessible)  
✅ Credentials file in `.gitignore` to prevent accidental commits  
✅ Service account authentication (no user credentials needed)  
✅ OAuth 2.0 JWT flow with automatic token refresh  
✅ HTTPS communication with Google Sheets API  
✅ Read-only access to source code (credentials path only in env vars)  

## Testing

The endpoint supports test operation:
```bash
curl "http://localhost:8000/gsheetsacc/?type=test"
```

Expected response:
```xml
<?xml version="1.0"?>
<status code="ok" msg="Google Sheets endpoint is operational"></status>
```

## Support & Troubleshooting

Refer to [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) for:
- Common error messages and solutions
- Credential file issues
- Permission/access problems
- Timezone and timestamp issues
- Data not appearing in sheet

## Future Enhancements

Potential improvements (not in scope):
- Database-like query interface for Google Sheets
- Automatic data archiving from Google Sheets
- Real-time dashboard using Google Sheets API
- Data export to CSV/Excel
- Integration with data analysis tools
- Multi-sheet support for different studies

## Version History

- **v1.0**: Initial implementation
  - Google Sheets API integration
  - Service account authentication
  - Basic logging to two sheets
  - Setup automation scripts
  - Comprehensive documentation

---

**Status**: ✅ Complete and ready for deployment

For detailed setup instructions, see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)
