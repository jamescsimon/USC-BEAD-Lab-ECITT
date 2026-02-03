# ECITT PWA - Google Sheets Logging Branch

**Branch Name**: `google-sheets-logging`

This is a specialized version of the ECITT PWA that uses Google Sheets API for logging app interactions instead of a MySQL database backend.

## What's Different?

### Original (main branch)
- Uses MySQL database for all data storage
- Requires MySQL server setup and configuration
- Data is stored in relational tables

### This Branch (google-sheets-logging)
- Uses Google Sheets API for all data logging
- **No MySQL required** - simplifies deployment
- Data is stored directly in Google Sheets in real-time
- All events logged with UTC timestamps (ISO 8601 format)
- Service account authentication for secure, headless operation

## Quick Start

1. **Setup Google Cloud Project** (see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) for detailed instructions):
   - Create a Google Cloud project
   - Enable Google Sheets API
   - Create a service account with credentials
   - Create a Google Sheet with "Responses" and "Events" tabs

2. **Configure Environment**:
   ```bash
   export USE_GOOGLE_SHEETS=1
   export GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id"
   export GOOGLE_SHEETS_CREDENTIALS_FILE="/path/to/credentials.json"
   ```

3. **Start Server**:
   ```bash
   # Windows
   start-server.bat
   
   # Mac/Linux
   ./start-server.sh
   ```

4. **Access App**:
   - From computer: `http://localhost:8000`
   - From iPad: `http://YOUR_IP_ADDRESS:8000`

## Key Features

✅ **No Database Setup**: No need to install MySQL  
✅ **Real-Time Logging**: Data appears in Google Sheet immediately  
✅ **UTC Timestamps**: All events recorded in UTC (ISO 8601 format)  
✅ **Service Account Auth**: Secure headless authentication  
✅ **Easy Data Access**: View and analyze data directly in Google Sheets  
✅ **Same ECITT Tasks**: All tasks and functionality identical to original  

## Modified Files

- **`public/js/comm.js`**: Routes data to `/gsheetsacc/` instead of `/dbacc/`
- **`public/boot.php`**: Adds `USE_GOOGLE_SHEETS` configuration flag
- **`private/libs/php/sheetsLib.php`**: New Google Sheets API wrapper (handles authentication, JWT creation, API calls)
- **`public/gsheetsacc/index.php`**: New endpoint for Google Sheets logging operations

## New Files

- **`GOOGLE_SHEETS_SETUP.md`**: Comprehensive setup guide for Google Sheets configuration
- **`private/creds/`**: (Created at setup time) Directory for storing Google credentials JSON
- **`.gitignore`**: Excludes credentials and sensitive files from version control

## Logging Data Structure

### Responses Sheet
Captures trial performance data:
- Timestamp (UTC)
- User identifier
- Study/Test identifiers  
- Trial performance metrics (accuracy, reaction time, etc.)
- Geographic coordinates

### Events Sheet
Captures app events:
- Timestamp (UTC)
- Event type and data
- User identifier
- Client IP address

## No MySQL Changes

The original MySQL code remains in the codebase. To revert to MySQL:
```bash
# Set environment variable to disable Google Sheets mode
export USE_GOOGLE_SHEETS=0
```

## API Endpoints

| Endpoint | Purpose | Legacy Alternative |
|----------|---------|-------------------|
| `/gsheetsacc/?type=respInsert&data=...` | Log trial response | `/dbacc/?type=respInsert&data=...` |
| `/gsheetsacc/?type=eventLog&data=...` | Log app event | Custom event handler |
| `/gsheetsacc/?type=test` | Test endpoint | `/dbacc/?type=test` |

## Security

- Credentials JSON file stored in `private/creds/` (not served by web server)
- Service account authentication uses OAuth 2.0 JWT flow
- Add `private/creds/` to `.gitignore` to prevent credential leaks
- Never commit credentials to version control

## Troubleshooting

See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md#troubleshooting) for detailed troubleshooting steps.

Common issues:
- Credentials file not found
- Invalid credentials format
- Permission denied when accessing sheet
- Data not appearing in Google Sheet
- Timestamps in wrong timezone

## Documentation

- **[GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)**: Complete setup guide
- **[README.md](README.md)**: Original ECITT PWA documentation
- **[QUICK_START.md](QUICK_START.md)**: Original quick start guide

## Development

### Running Tests

```bash
# Test Google Sheets endpoint connectivity
curl "http://localhost:8000/gsheetsacc/?type=test"

# Response should be:
# <?xml version="1.0"?><status code="ok" msg="Google Sheets endpoint is operational"></status>
```

### Debugging

Check logs in `private/logs/`:
- `dbacc.log` - Old endpoint logs (not used in this branch)
- `server-logs.md` - General server logs

Monitor browser console for JavaScript errors (F12 > Console)

## Integration with Original Branch

Both branches (`main` and `google-sheets-logging`) can coexist:
- `main`: Traditional MySQL backend
- `google-sheets-logging`: Google Sheets backend (this branch)

Use whichever fits your deployment needs.

## Support for Other Backends

This architecture makes it easy to add other backends:
1. Create a new library file (e.g., `firebaseLib.php`)
2. Create a new endpoint (e.g., `/firebaseacc/`)
3. Update `comm.js` to route to the new endpoint
4. Create a new branch for the variant

## Version Information

- **Branch**: `google-sheets-logging`
- **Based on**: ECITT PWA
- **PHP Version**: 8.0+
- **Google Sheets API**: v4
- **Authentication**: Service Account (OAuth 2.0)

---

For detailed setup instructions, see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)
