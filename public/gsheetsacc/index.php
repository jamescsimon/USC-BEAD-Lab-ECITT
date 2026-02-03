<?php
	// Google Sheets Logging Endpoint
	// Replaces MySQL backend for app interaction logging
	// All timestamps are in UTC
	
	if (ob_get_level()) {
		while (ob_get_level()) {
			ob_end_clean();
		}
	}
	ini_set('output_buffering', 'Off');
	
	$type = isset($_GET['type']) ? $_GET['type'] : 'NO_TYPE';
	$data = isset($_GET['data']) ? $_GET['data'] : 'NO_DATA';
	
	error_log("gsheetsacc/index.php START: type=[$type], data=[$data], REQUEST_METHOD=".$_SERVER['REQUEST_METHOD'].", REMOTE_ADDR=".$_SERVER['REMOTE_ADDR']);
	
	// If this is a test request, return immediately
	if ($type === 'test') {
		header("Content-type: text/xml; charset=UTF-8");
		echo '<?xml version="1.0"?><test>OK</test>';
		exit;
	}
	
	error_reporting(E_ALL);
	ini_set('display_errors', 0);
	ini_set('log_errors', 1);
	
	set_time_limit(30);
	
	error_log("gsheetsacc/index.php: About to include boot.php");
	try {
		include $_SERVER["DOCUMENT_ROOT"]."/boot.php";
		error_log("gsheetsacc/index.php: boot.php included");
		include_once(LIB_ROOT."/lib.php");
		error_log("gsheetsacc/index.php: lib.php included");
		include_once(LIB_ROOT."/sheetsLib.php");
		error_log("gsheetsacc/index.php: sheetsLib.php included");
		initTouchTasks();
		error_log("gsheetsacc/index.php: initTouchTasks() completed");
		
		// Log request arrival
		logMsg("gsheetsacc/index.php: REQUEST ARRIVED, type=[$type], data=[$data]");
		logMsg("gsheetsacc/index.php: About to process request");
		
		// Process different operation types
		gsheetsOpXml();
		
	} catch (Exception $e) {
		error_log("gsheetsacc/index.php EXCEPTION: " . $e->getMessage());
		logMsg("gsheetsacc/index.php EXCEPTION: " . $e->getMessage());
		header("Content-type: text/xml; charset=UTF-8");
		echo '<?xml version="1.0"?><error code="exception" msg="'.$e->getMessage().'"></error>';
		exit;
	}
	
	/**
	 * Process Google Sheets operations
	 * Converts data to appropriate format and logs to Google Sheets
	 */
	function gsheetsOpXml() {
		global $type, $data;
		
		try {
			logMsg("gsheetsOpXml: Processing operation type: $type");
			
			$result = false;
			$statusCode = "error";
			$statusMsg = "Unknown operation";
			
			switch ($type) {
				case "respInsert":
					$result = handleRespInsert($data);
					if ($result) {
						$statusCode = "ok";
						$statusMsg = "Response logged to Google Sheets";
					} else {
						$statusMsg = "Failed to log response";
					}
					break;
					
				case "eventLog":
					$result = handleEventLog($data);
					if ($result) {
						$statusCode = "ok";
						$statusMsg = "Event logged to Google Sheets";
					} else {
						$statusMsg = "Failed to log event";
					}
					break;
					
				case "test":
					$statusCode = "ok";
					$statusMsg = "Google Sheets endpoint is operational";
					break;
					
				default:
					$statusMsg = "Unknown operation type: $type";
			}
			
			// Return status as XML
			header("Content-type: text/xml; charset=UTF-8");
			echo '<?xml version="1.0"?>';
			echo '<status code="'.$statusCode.'" msg="'.$statusMsg.'"></status>';
			
			logMsg("gsheetsOpXml: Operation complete, status: $statusCode");
			
		} catch (Exception $e) {
			logMsg("gsheetsOpXml EXCEPTION: " . $e->getMessage());
			header("Content-type: text/xml; charset=UTF-8");
			echo '<?xml version="1.0"?><status code="error" msg="Exception: '.$e->getMessage().'"></status>';
		}
	}
	
	/**
	 * Handle response insert operation
	 * Parse CSV data and log to Google Sheets
	 * 
	 * @param string $dataStr CSV formatted response data
	 * @return bool True on success
	 */
	function handleRespInsert($dataStr) {
		logMsg("handleRespInsert: Processing data: " . substr($dataStr, 0, 100) . "...");
		
		// Parse CSV data
		// Format from comm.js: curUserName,projectNo,testSetNo,testName,partNo,prevRespTime,trialStartTime,
		// trialType,trialPhase,trialNo,trialVariant,accuracy,touchTime,reactionTime,trialTime,buttonPressed,
		// animationShowed,dotPressed,moveEvents,curPosLat,curPosLng,trialQueueLength
		
		$parts = explode(",", trim($dataStr));
		
		if (count($parts) < 20) {
			logMsg("handleRespInsert ERROR: Invalid data format, expected at least 20 fields, got " . count($parts));
			return false;
		}
		
		$data = [
			'curUserName' => $parts[0] ?? '',
			'projectNo' => $parts[1] ?? '',
			'testSetNo' => $parts[2] ?? '',
			'testName' => $parts[3] ?? '',
			'partNo' => $parts[4] ?? '',
			'prevRespTime' => $parts[5] ?? '',
			'trialStartTime' => $parts[6] ?? '',
			'trialType' => $parts[7] ?? '',
			'trialPhase' => $parts[8] ?? '',
			'trialNo' => $parts[9] ?? '',
			'trialVariant' => $parts[10] ?? '',
			'accuracy' => $parts[11] ?? '',
			'touchTime' => $parts[12] ?? '',
			'reactionTime' => $parts[13] ?? '',
			'trialTime' => $parts[14] ?? '',
			'buttonPressed' => $parts[15] ?? '',
			'animationShowed' => $parts[16] ?? '',
			'dotPressed' => $parts[17] ?? '',
			'moveEvents' => $parts[18] ?? '',
			'curPosLat' => $parts[19] ?? '',
			'curPosLng' => $parts[20] ?? '',
			'trialQueueLength' => $parts[21] ?? ''
		];
		
		$result = logResponseToSheets($data);
		
		if ($result) {
			logMsg("handleRespInsert: Successfully logged response");
			return true;
		} else {
			logMsg("handleRespInsert ERROR: Failed to log response");
			return false;
		}
	}
	
	/**
	 * Handle event log operation
	 * 
	 * @param string $eventStr Event data
	 * @return bool True on success
	 */
	function handleEventLog($eventStr) {
		logMsg("handleEventLog: Processing event: " . substr($eventStr, 0, 100) . "...");
		
		// Parse event data
		// Format: eventType|eventData|userName
		$parts = explode("|", $eventStr);
		
		$eventType = $parts[0] ?? "unknown";
		$eventData = $parts[1] ?? "";
		$userName = $parts[2] ?? "";
		
		$result = logEventToSheets($eventType, $eventData, $userName);
		
		if ($result) {
			logMsg("handleEventLog: Successfully logged event");
			return true;
		} else {
			logMsg("handleEventLog ERROR: Failed to log event");
			return false;
		}
	}

?>
