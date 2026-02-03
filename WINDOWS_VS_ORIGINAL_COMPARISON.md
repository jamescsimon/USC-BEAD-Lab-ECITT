# Windows Version vs Original Version - Key Differences

## Critical Differences That May Cause Hanging

### 1. **dbacc/index.php** - Extensive Debugging Output

**Windows Version (USC-BEAD-Lab-ECITT):**
```php
<?php
// Disable output buffering completely
if (ob_get_level()) {
    ob_end_clean();
}

// Send immediate output to verify request reaches PHP
header("Content-type: text/xml; charset=UTF-8");
echo "<?xml version=\"1.0\"?><debug>START</debug>\n";
flush();

// Log immediately when request arrives
error_log("dbacc/index.php: Request received - type: " . ($_GET['type'] ?? 'none'));

include $_SERVER["DOCUMENT_ROOT"]."/boot.php";
echo "<!-- BOOT -->\n";
flush();

include_once(LIB_ROOT."/lib.php");
echo "<!-- LIB -->\n";
flush();

include_once(LIB_ROOT."/dbLib.php");
echo "<!-- DBLIB -->\n";
flush();

initTouchTasks();
echo "<!-- INIT -->\n";
flush();

dbOpXml();
echo "<!-- DONE -->\n";
```

**Original Version (1-14/codebases/ECITT_Web_App):**
```php
<?php
include $_SERVER["DOCUMENT_ROOT"]."/boot.php";
include_once(LIB_ROOT."/lib.php");
include_once(LIB_ROOT."/dbLib.php");
initTouchTasks();
dbOpXml();
```

**Issue:** The Windows version sends debug output BEFORE setting headers properly. The `echo` statements before `header()` calls can cause issues if output buffering isn't working correctly.

---

### 2. **initDbLib()** - Database Connection Method

**Windows Version:**
```php
function initDbLib() {
    logMsg("=== initDbLib ENTRY ===");
    // ... extensive logging ...
    
    // Close existing connection if it exists
    if (isset($db) && $db instanceof mysqli) {
        logMsg("initDbLib: Closing existing connection...");
        @$db->close();
        logMsg("initDbLib: Existing connection closed");
    }
    
    // Set connection timeout before connecting
    ini_set('default_socket_timeout', 5);
    
    // Initialize mysqli with options BEFORE connecting
    $db = mysqli_init();
    
    // Set options BEFORE connecting
    $db->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);
    if (defined('MYSQLI_OPT_READ_TIMEOUT')) {
        $db->options(MYSQLI_OPT_READ_TIMEOUT, 10);
    }
    
    // Now connect with the options set
    $connectResult = $db->real_connect("localhost", "ecitt_user", "We_are_1017!", "ecitt_db");
    
    // ... extensive error handling ...
    
    $db->set_charset("utf8mb4");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}
```

**Original Version:**
```php
function initDbLib() {
    //initTouchTasks();
    
    global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
    
    $permTable = "ecitt_perm";
    // ... set table names ...
    
    global $db;
    // ... set other globals ...
    
    $db=new mysqli("localhost", "ecitt_user", "We_are_1017!", "ecitt_db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}
```

**Key Differences:**
- Windows version uses `mysqli_init()` + `real_connect()` with timeout options
- Windows version closes existing connection every time
- Original version uses simple `new mysqli()` constructor
- Windows version has extensive logging that could slow things down

**Potential Issue:** Closing and reopening the connection on EVERY request could cause connection pool exhaustion or hanging if connections aren't properly released.

---

### 3. **dbOpXml()** - Connection Initialization

**Windows Version:**
```php
function dbOpXml() {
    error_log("dbOpXml: ENTRY at " . microtime(true));
    logMsg("=== dbOpXml ENTRY ===");
    global $db;
    
    // Initialize database connection - this will close any existing connection and create a fresh one
    logMsg("dbOpXml: Calling initDbLib()...");
    error_log("dbOpXml: About to call initDbLib()");
    initDbLib();  // <-- CALLED EVERY TIME
    logMsg("dbOpXml: initDbLib() completed");
    error_log("dbOpXml: initDbLib() completed");
    
    $type=getParam("type", "");
    $data=getParam("data", "");
    // ... rest of function
}
```

**Original Version:**
```php
function dbOpXml() {
    global $db;
    initDbLib();  // <-- ALSO CALLED EVERY TIME, but simpler
    $type=getParam("type", "");
    $data=getParam("data", "");
    logMsg("$type, data: [$data]");
    // ... rest of function
}
```

**Issue:** Both versions call `initDbLib()` every time, but the Windows version's `initDbLib()` is much more complex and closes/reopens connections, which could cause hanging.

---

### 4. **projectsSelect()** - Query Logic Completely Rewritten

**Windows Version:**
```php
function projectsSelect($db, $data, $current = null) {
    error_log("projectsSelect: ENTRY at " . microtime(true) . ", data=[$data]");
    // ... extensive logging ...
    
    // Check if database connection is still alive
    if (!isset($db) || !($db instanceof mysqli)) {
        logMsg("projectsSelect: db not set or not mysqli instance, initializing...");
        initDbLib();
        global $db;
    }
    
    // Skip ping check - it can hang on some systems
    
    try {
        // Simplified approach: Check global permission first with a quick query
        $globalCheckQuery = "SELECT 1 FROM $permTable WHERE userName = '$user' AND entityType = 'global' LIMIT 1";
        $globalCheck = $db->query($globalCheckQuery);
        $hasGlobalPerm = ($globalCheck && $globalCheck->num_rows > 0);
        
        if ($hasGlobalPerm) {
            $query = "SELECT p.no, p.name, 'adm' as perm FROM $projectTable p ORDER BY p.name";
        } else {
            $query = "SELECT DISTINCT p.no, p.name, perm.permName as perm 
                FROM $projectTable p 
                INNER JOIN $permTable perm ON perm.entityType = 'project' AND perm.entityNo = p.no 
                WHERE perm.userName = '$user' 
                ORDER BY p.name";
        }
        
        $result = $db->query($query);
        // ... extensive error handling ...
    } catch (Exception $e) {
        // ... extensive error handling ...
    }
}
```

**Original Version:**
```php
function projectsSelect($db, $data, $current = null) {
    global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
    $rawValues = explode(",", $data);
    $i = 0;
    $user = $rawValues[$i++];
    if ($current == null) {
        $current = $rawValues[$i++];
    }
    $query = "select $projectTable.*, permName as perm from $projectTable, $permTable where userName = '$user' and (entityType = 'global' or (entityType = 'project' and (every or no = entityNo))) group by no order by $projectTable.name";
    logMsg($query);
    try {
        $result = $db->query($query);
        return genMultiXmlElemDocFromDbResult($result, "project", array("current"=>$current));
    } catch (Exception $e) {
        logMsg($e->getMessage());
        return genMultiXmlElemDocFromDbResult(array(), "project", array("current"=>0));
    }
}
```

**Key Differences:**
- Windows version uses two separate queries (permission check + main query)
- Windows version uses INNER JOIN instead of implicit join
- Original version uses a single query with GROUP BY
- Windows version has extensive logging that could slow execution

**Potential Issue:** The two-query approach might be slower, and the extensive logging could cause output buffering issues.

---

## Summary of Potential Issues

1. **Output Buffering:** Windows version sends debug output before headers, which could cause issues
2. **Connection Management:** Windows version closes/reopens connections every request, which could cause hanging
3. **Excessive Logging:** Windows version logs extensively, which could slow execution and cause output buffering issues
4. **Query Complexity:** Windows version uses two queries instead of one, potentially slower

## Recommendations

1. **Remove debug output from dbacc/index.php** - The echo statements before headers could cause issues
2. **Simplify initDbLib()** - Don't close/reopen connections every time, reuse existing connection
3. **Reduce logging** - Too much logging can slow execution and cause output buffering issues
4. **Use original query approach** - The single query with GROUP BY might be more reliable

## Most Likely Cause of Hanging

The most likely cause is **initDbLib() being called every time and closing/reopening connections**. On Windows, this could cause:
- Connection pool exhaustion
- MySQL connection limits being hit
- Connections not being properly released
- Race conditions when multiple requests come in

The extensive logging and output buffering issues could also contribute to the hanging.
