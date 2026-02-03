# Critical Analysis: projectsSelect Issue - RESOLVED

## Problem Summary

**Issue**: `projectsSelect` requests were hanging - PHP wasn't executing (no START log entries)

**Root Cause**: A previous `projectsSelect` request was hanging and blocking new connections due to:
1. MySQL 8+ strict mode (`ONLY_FULL_GROUP_BY`) causing query to fail
2. Query using `$projectTable.*` with `GROUP BY no` - MySQL 8+ requires all selected columns in GROUP BY

## Solution Applied

### 1. Fixed MySQL 8+ Compatibility
Changed query from:
```sql
select $projectTable.*, permName as perm ... group by no
```

To:
```sql
select $projectTable.no, $projectTable.name, any_value(permName) as perm ... group by $projectTable.no, $projectTable.name
```

This ensures:
- All selected columns are either in GROUP BY or aggregated
- Compatible with MySQL 8+ strict mode
- Uses `any_value()` for the permission column (works in MySQL 5.7.5+)

### 2. Fixed Header Warning
Added header check at start of `dbOpXml()` to prevent "headers already sent" warnings:
```php
if (!headers_sent()) {
    header("Content-type: text/xml; charset=UTF-8");
}
```

### 3. Process Management
When requests hang, kill PHP processes:
```powershell
Stop-Process -Name php -Force
```

## Current Status

✅ PHP executes successfully for `projectsSelect` requests
✅ Query is MySQL 8+ compatible
✅ Headers are set correctly
✅ Request completes and returns XML

## Testing

1. Restart server: `start-server.bat`
2. Access: `http://localhost:8000/dbacc/?type=projectsSelect&data=admin,1`
3. Should see XML response with projects list
4. Click "Tests" button in Controller - should load project selection screen

## Notes

- The query now matches MySQL 8+ requirements while maintaining compatibility with older versions
- `any_value()` function works in MySQL 5.7.5+ and 8+
- If issues persist, check MySQL process list for hanging queries: `SHOW PROCESSLIST;`
