<?php
	// Disable output buffering completely - must be first
	if (ob_get_level()) {
		while (ob_get_level()) {
			ob_end_clean();
		}
	}
	ini_set('output_buffering', 'Off');
	
	// Log immediately using error_log (works before any includes)
	$type = isset($_GET['type']) ? $_GET['type'] : 'NO_TYPE';
	$data = isset($_GET['data']) ? $_GET['data'] : 'NO_DATA';
	
	// Force immediate output to see if PHP is executing
	error_log("dbacc/index.php START: type=[$type], data=[$data], REQUEST_METHOD=".$_SERVER['REQUEST_METHOD'].", REMOTE_ADDR=".$_SERVER['REMOTE_ADDR']);
	
	// If this is a test request, return immediately
	if ($type === 'test') {
		header("Content-type: text/xml; charset=UTF-8");
		echo '<?xml version="1.0"?><test>OK</test>';
		exit;
	}
	
	error_log("dbacc/index.php: REQUEST_URI=" . (isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : 'NOT_SET'));
	error_log("dbacc/index.php: QUERY_STRING=" . (isset($_SERVER['QUERY_STRING']) ? $_SERVER['QUERY_STRING'] : 'NOT_SET'));
	
	// Enable error reporting (but don't display - log only)
	error_reporting(E_ALL);
	ini_set('display_errors', 0);
	ini_set('log_errors', 1);
	
	// Set execution time limit
	set_time_limit(30);
	
	error_log("dbacc/index.php: About to include boot.php");
	try {
		include $_SERVER["DOCUMENT_ROOT"]."/boot.php";
		error_log("dbacc/index.php: boot.php included");
		include_once(LIB_ROOT."/lib.php");
		error_log("dbacc/index.php: lib.php included");
		include_once(LIB_ROOT."/dbLib.php");
		error_log("dbacc/index.php: dbLib.php included");
		initTouchTasks();
		error_log("dbacc/index.php: initTouchTasks() completed");
		
		// Log request arrival (after constants are available)
		logMsg("dbacc/index.php: REQUEST ARRIVED, type=[$type], data=[$data]");
		logMsg("dbacc/index.php: About to call dbOpXml()");
		
		dbOpXml();
		
		logMsg("dbacc/index.php: dbOpXml() completed");
		error_log("dbacc/index.php: SUCCESS - completed normally");
		
		// Ensure all output is sent and exit cleanly
		if (ob_get_level()) {
			ob_end_flush();
		}
		flush();
		exit;
	} catch (Exception $e) {
		error_log("dbacc/index.php Exception: " . $e->getMessage() . " | Trace: " . $e->getTraceAsString());
		// Try to log if constants are available
		if (defined('LOG_ROOT') && defined('APP_NAME')) {
			logMsg("dbacc/index.php Exception: " . $e->getMessage());
		}
		header("Content-type: text/xml; charset=UTF-8");
		echo '<?xml version="1.0"?><error>' . htmlspecialchars($e->getMessage()) . '</error>';
	} catch (Error $e) {
		error_log("dbacc/index.php Fatal Error: " . $e->getMessage() . " | Trace: " . $e->getTraceAsString());
		// Try to log if constants are available
		if (defined('LOG_ROOT') && defined('APP_NAME')) {
			logMsg("dbacc/index.php Fatal Error: " . $e->getMessage());
		}
		header("Content-type: text/xml; charset=UTF-8");
		echo '<?xml version="1.0"?><error>' . htmlspecialchars($e->getMessage()) . '</error>';
	}
