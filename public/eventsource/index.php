<?php
	// Disable execution time limit and output buffering for long-running EventSource connections
	// Must be called before any output or includes
	set_time_limit(0);
	ini_set('max_execution_time', 0);
	if (ob_get_level()) {
		ob_end_clean();
	}
	
	// For PHP dev server: Register shutdown to ensure connection can be closed
	register_shutdown_function(function() {
		if (ob_get_level()) {
			ob_end_flush();
		}
		flush();
	});
	
	include $_SERVER["DOCUMENT_ROOT"]."/boot.php";
	include_once(LIB_ROOT."/lib.php");
	include_once(LIB_ROOT."/eventLib.php");
	initTouchTasks();
	
	// Ensure output is flushed before starting event loop
	flush();
	
	initEventSource();
