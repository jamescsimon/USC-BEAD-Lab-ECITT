<?php
	// CSV Data Access Endpoint
	// Handles data operations with CSV file storage instead of Google Sheets
	// All timestamps are in UTC, data written to CSV files on server
	
	if (ob_get_level()) {
		while (ob_get_level()) {
			ob_end_clean();
		}
	}
	ini_set('output_buffering', 'Off');
	
	$type = isset($_GET['type']) ? $_GET['type'] : 'NO_TYPE';
	$data = isset($_GET['data']) ? $_GET['data'] : 'NO_DATA';
	
	error_log("csvdata/index.php START: type=[$type], data=[" . substr($data, 0, 100) . "...], REQUEST_METHOD=".$_SERVER['REQUEST_METHOD'].", REMOTE_ADDR=".$_SERVER['REMOTE_ADDR']);
	
	// If this is a test request, return immediately
	if ($type === 'test') {
		header("Content-type: text/xml; charset=UTF-8");
		echo '<?xml version="1.0"?><test>OK</test>';
		exit;
	}
	
	error_reporting(E_ALL);
	ini_set('display_errors', 0);  // Hide errors in production
	ini_set('log_errors', 1);
	
	set_time_limit(30);
	
	try {
		include $_SERVER["DOCUMENT_ROOT"]."/boot.php";
		include_once(LIB_ROOT."/lib.php");
		include_once(LIB_ROOT."/domlib.php");
		include_once(LIB_ROOT."/dbLib.php");  // For metadata operations (projects, participants, etc.)
		initTouchTasks();
		
		logMsg("csvdata/index.php: REQUEST ARRIVED, type=[$type]");
		
		// Process different operation types
		csvOpXml();
		
	} catch (Exception $e) {
		error_log("csvdata/index.php EXCEPTION: " . $e->getMessage());
		logMsg("csvdata/index.php EXCEPTION: " . $e->getMessage());
		header("Content-type: text/xml; charset=UTF-8");
		echo '<?xml version="1.0"?><error code="exception" msg="'.$e->getMessage().'"></error>';
		exit;
	}
	
	/**
	 * Process CSV operations
	 * For response logging (respInsert, respBatchInsert, eventLog), writes to CSV files
	 * For metadata operations (projects, participants, etc.), falls back to database
	 */
	function csvOpXml() {
		global $type, $data;
		
		// Set headers first
		if (!headers_sent()) {
			header("Content-type: text/xml; charset=UTF-8");
			header("Cache-Control: no-cache, must-revalidate");
			header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
		}
		
		try {
			logMsg("csvOpXml: Processing operation type: $type");
			
			$doc = null;
			$rawValues = explode(",", $data);
			
			switch ($type) {
				// TRIAL RESPONSE LOGGING - CSV Storage
				case "respInsert":
					$result = handleRespInsertCsv($data);
					if ($result) {
						$parts = explode(",", trim($data));
						$username = $parts[0] ?? '';
						$trialStartTime = $parts[6] ?? '';
						$recordKey = $username . "_" . $trialStartTime;
						$doc = genStatusDoc("ok", $recordKey);
					} else {
						$doc = genStatusDoc("error", "Failed to log response");
					}
					break;
				
				// BATCH TRIAL RESPONSE LOGGING - CSV Storage
				case "respBatchInsert":
					$result = handleRespBatchInsertCsv($data);
					if ($result) {
						$doc = genStatusDoc("ok", "Batch insert successful");
					} else {
						$doc = genStatusDoc("error", "Batch insert failed");
					}
					break;
				
				// EVENT LOGGING - CSV Storage
				case "eventLog":
					$result = handleEventLogCsv($data);
					if ($result) {
						$doc = genStatusDoc("ok", "Event logged");
					} else {
						$doc = genStatusDoc("error", "Failed to log event");
					}
					break;
				
				// TELEMETRY EVENT LOGGING - CSV Storage (Task 5)
				case "telemetryEvent":
					$result = handleTelemetryEventCsv($data);
					if ($result) {
						$doc = genStatusDoc("ok", "Telemetry logged");
					} else {
						$doc = genStatusDoc("error", "Failed to log telemetry");
					}
					break;
				
				// METADATA OPERATIONS - Use existing database backend
				case "userSelect":
					global $db;
					if (!$db) initDbLib();
					$doc = userSelect($db, $data);
					break;
				
				case "projectsSelect":
					global $db;
					logMsg("csvOpXml: projectsSelect case - checking db");
					if (!$db) {
						logMsg("csvOpXml: db is null, calling initDbLib");
						initDbLib();
						logMsg("csvOpXml: initDbLib completed, db is now: " . (isset($db) && $db ? "connected" : "null"));
					}
					logMsg("csvOpXml: calling projectsSelect with data: $data");
					$doc = projectsSelect($db, $data);
					logMsg("csvOpXml: projectsSelect returned, doc type: " . gettype($doc));
					break;
					
				case "projectInsert":
					global $db;
					if (!$db) initDbLib();
					$newNo = projectInsert($db, $data);
					$username = $rawValues[0] ?? '';
					$doc = projectsSelect($db, "$username,$newNo");
					break;
					
				case "projectUpdate":
					global $db;
					if (!$db) initDbLib();
					projectUpdate($db, $data);
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$doc = projectsSelect($db, "$username,$projectNo");
					break;
					
				case "projectDelete":
					global $db;
					if (!$db) initDbLib();
					projectDelete($db, $data);
					$username = $rawValues[0] ?? '';
					$doc = projectsSelect($db, "$username,0");
					break;
				
				case "testSetsSelect":
					global $db;
					if (!$db) initDbLib();
					$doc = testSetsSelect($db, $data);
					break;
					
				case "testSetInsert":
					global $db;
					if (!$db) initDbLib();
					$newNo = testSetInsert($db, $data);
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$doc = testSetsSelect($db, "$username,$projectNo,$newNo");
					break;
					
				case "testSetUpdate":
					global $db;
					if (!$db) initDbLib();
					testSetUpdate($db, $data);
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetNo = $rawValues[2] ?? 0;
					$doc = testSetsSelect($db, "$username,$projectNo,$testSetNo");
					break;
					
				case "testSetDelete":
					global $db;
					if (!$db) initDbLib();
					testSetDelete($db, $data);
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$doc = testSetsSelect($db, "$username,$projectNo,0");
					break;
				
				case "partsSelect":
					global $db;
					if (!$db) initDbLib();
					$doc = partsSelect($db, $data);
					break;
					
				case "partInsert2":
					global $db;
					if (!$db) initDbLib();
					$newNo = partInsert2($db, $data);
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetNo = $rawValues[2] ?? 0;
					$doc = partsSelect($db, "$username,$projectNo,$testSetNo,$newNo");
					break;
					
				case "partUpdate2":
					global $db;
					if (!$db) initDbLib();
					partUpdate2($db, $data);
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetNo = $rawValues[2] ?? 0;
					$partNo = $rawValues[3] ?? 0;
					$doc = partsSelect($db, "$username,$projectNo,$testSetNo,$partNo");
					break;
					
				case "partDelete":
					global $db;
					if (!$db) initDbLib();
					partDelete($db, $data);
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetNo = $rawValues[2] ?? 0;
					$doc = partsSelect($db, "$username,$projectNo,$testSetNo,0");
					break;
				
				case "testsSelect":
					global $db;
					if (!$db) initDbLib();
					$doc = testsSelect($db, $data);
					break;
					
				case "syncPointsSelect":
					global $db;
					if (!$db) initDbLib();
					$doc = syncPointsSelect($db, $data);
					break;
					
				case "getPartsDoc":
					global $db;
					if (!$db) initDbLib();
					// Note: this may not exist in dbLib, might need to implement or redirect
					$doc = genStatusDoc("error", "getPartsDoc not available via csv endpoint");
					break;
				
				default:
					logMsg("csvOpXml: Unknown operation type: $type");
					$doc = genStatusDoc("error", "Unknown operation type: $type");
			}
			
			// Output the XML document
			if ($doc) {
				echo $doc->saveXML();
				logMsg("csvOpXml: Operation complete, type: $type");
			} else {
				echo '<?xml version="1.0"?><error>No document generated</error>';
				logMsg("csvOpXml ERROR: No document generated for type: $type");
			}
			
		} catch (Exception $e) {
			logMsg("csvOpXml EXCEPTION: " . $e->getMessage());
			echo '<?xml version="1.0"?><error>' . htmlspecialchars($e->getMessage()) . '</error>';
		}
	}

	// ========== CSV Writing Functions ==========

	/**
	 * Log response data to CSV file
	 * Creates session CSV files in: {CSV_DATA_DIR}/{projectNo}/{testSetNo}/
	 * 
	 * @param string $dataStr CSV formatted response data
	 * @return bool True on success
	 */
	function handleRespInsertCsv($dataStr) {
		logMsg("handleRespInsertCsv: Processing data");
		
		// Parse CSV data
		// Format: curUserName,projectNo,testSetNo,testName,partNo,prevRespTime,trialStartTime,
		// trialType,trialPhase,trialNo,trialVariant,accuracy,touchTime,reactionTime,trialTime,
		// buttonPressed,animationShowed,dotPressed,moveEvents,curPosLat,curPosLng,trialQueueLength
		
		$parts = explode(",", trim($dataStr));
		
		if (count($parts) < 20) {
			logMsg("handleRespInsertCsv ERROR: Invalid data format, expected at least 20 fields, got " . count($parts));
			return false;
		}
		
		$data = [
			'timestamp' => date('c'),  // ISO 8601 UTC timestamp when written
			'curUserName' => $parts[0] ?? '',
			'projectNo' => $parts[1] ?? '',
			'testSetNo' => $parts[2] ?? '',
			'testName' => $parts[3] ?? '',
			'partNo' => $parts[4] ?? '',
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
		
		$result = logResponseToCsv($data);
		
		if ($result) {
			logMsg("handleRespInsertCsv: Successfully logged response");
			return true;
		} else {
			logMsg("handleRespInsertCsv ERROR: Failed to log response to CSV");
			return false;
		}
	}

	/**
	 * Log telemetry event data to CSV file (Task 5)
	 * Telemetry events logged to main tracker file on server
	 * 
	 * @param string $dataStr CSV formatted telemetry data
	 * @return bool True on success
	 */
	function handleTelemetryEventCsv($dataStr) {
		logMsg("handleTelemetryEventCsv: Processing telemetry event");
		
		// Parse telemetry fields
		$parts = explode(",", trim($dataStr));
		if (count($parts) < 12) {
			logMsg("handleTelemetryEventCsv ERROR: Invalid data format, expected 12 fields, got " . count($parts));
			return false;
		}
		
		// Ensure telemetry directory exists
		$baseDir = defined('CSV_DATA_DIR') ? CSV_DATA_DIR : dirname(__FILE__) . "/../csv_data";
		$telemetryDir = $baseDir . "/telemetry";
		
		if (!is_dir($telemetryDir)) {
			if (!mkdir($telemetryDir, 0755, true)) {
				logMsg("handleTelemetryEventCsv ERROR: Failed to create telemetry directory");
				return false;
			}
		}
		
		// Main telemetry CSV file
		$csvFile = $telemetryDir . "/ECITT_Telemetry_Tracker.csv";
		
		// Create file with headers if doesn't exist
		if (!file_exists($csvFile)) {
			$headers = "TestDate,StartTimestamp,ResponserName,ControllerName,Section,Stimuli,InvokedBy,Accuracy,ProjectName,TestSetName,TestName,TrialsRemaining\n";
			if (file_put_contents($csvFile, $headers) === false) {
				logMsg("handleTelemetryEventCsv ERROR: Failed to create CSV file with headers");
				return false;
			}
			logMsg("handleTelemetryEventCsv: Created new telemetry CSV file");
		}
		
		// Append telemetry row with file locking
		$handle = fopen($csvFile, 'a');
		if (!$handle) {
			logMsg("handleTelemetryEventCsv ERROR: Failed to open CSV file for writing");
			return false;
		}
		
		if (!flock($handle, LOCK_EX)) {
			logMsg("handleTelemetryEventCsv WARNING: Could not acquire exclusive lock");
		}
		
		// Write the record
		if (fwrite($handle, $dataStr . "\n") === false) {
			logMsg("handleTelemetryEventCsv ERROR: Failed to write telemetry row to CSV");
			flock($handle, LOCK_UN);
			fclose($handle);
			return false;
		}
		
		flock($handle, LOCK_UN);
		fclose($handle);
		
		logMsg("handleTelemetryEventCsv: Successfully logged telemetry event");
		return true;
	}

	/**
	 * Log batch response data to CSV files
	 * Multiple responses written to same session CSV
	 * 
	 * @param string $dataStr Newline-separated CSV formatted response data
	 * @return bool True on success
	 */
	function handleRespBatchInsertCsv($dataStr) {
		logMsg("handleRespBatchInsertCsv: Processing batch data");
		
		$records = explode("\n", trim($dataStr));
		$successCount = 0;
		$failCount = 0;
		
		foreach ($records as $record) {
			if (empty(trim($record))) {
				continue;
			}
			
			if (handleRespInsertCsv($record)) {
				$successCount++;
			} else {
				$failCount++;
				logMsg("handleRespBatchInsertCsv: Skipping invalid record");
			}
		}
		
		logMsg("handleRespBatchInsertCsv: Complete - Success: $successCount, Failed: $failCount");
		
		return $successCount > 0;
	}

	/**
	 * Log event data to CSV file
	 * Events written to timestamped event log
	 * 
	 * @param string $dataStr CSV formatted event data
	 * @return bool True on success
	 */
	function handleEventLogCsv($dataStr) {
		logMsg("handleEventLogCsv: Processing data");
		
		$data = [
			'timestamp' => date('c'),
			'eventData' => $dataStr
		];
		
		$result = logEventToCsv($data);
		
		if ($result) {
			logMsg("handleEventLogCsv: Successfully logged event");
			return true;
		} else {
			logMsg("handleEventLogCsv ERROR: Failed to log event to CSV");
			return false;
		}
	}

	/**
	 * Write response row to CSV file
	 * Appends to appropriate session CSV based on project/testset/participant
	 * 
	 * @param array $data Response data fields
	 * @return bool True on success
	 */
	function logResponseToCsv($data) {
		$csvDir = getenv('CSV_DATA_DIR');
		if (!$csvDir) {
			$csvDir = $_SERVER['DOCUMENT_ROOT'] . '/../csv_data';
		}
		
		// Create directory structure: {CSV_DIR}/sessions/{YYYY-MM}/{projectNo}_{testSetNo}_{partNo}/
		$date = new DateTime('now', new DateTimeZone('UTC'));
		$yearMonth = $date->format('Y-m');
		$sessionDir = $csvDir . '/sessions/' . $yearMonth . '/' . 
			$data['projectNo'] . '_' . $data['testSetNo'] . '_' . $data['partNo'];
		
		// Create directories if they don't exist
		if (!is_dir($sessionDir)) {
			if (!@mkdir($sessionDir, 0777, true)) {
				logMsg("logResponseToCsv ERROR: Could not create directory: $sessionDir");
				return false;
			}
		}
		
		// Filename: ECITT_Study_{DATE}_{TrialStartTime}.csv
		$trialStartTime = str_replace([':', '.'], '', $data['trialStartTime']);
		$filename = 'ECITT_Study_' . $date->format('Y-m-d') . '_' . $trialStartTime . '.csv';
		$filePath = $sessionDir . '/' . $filename;
		
		// CSV headers (BOM for Excel compatibility)
		$headers = "Timestamp,User,ProjectNo,TestSetNo,TestName,PartNo,TrialStartTime,TrialType,TrialPhase,TrialNo,TrialVariant,Accuracy,TouchTime,ReactionTime,TrialTime,ButtonPressed,AnimationShowed,DotPressed,MovementCount\n";
		
		// Prepare CSV row
		$row = sprintf(
			"%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n",
			csvEscape($data['timestamp']),
			csvEscape($data['curUserName']),
			csvEscape($data['projectNo']),
			csvEscape($data['testSetNo']),
			csvEscape($data['testName']),
			csvEscape($data['partNo']),
			csvEscape($data['trialStartTime']),
			csvEscape($data['trialType']),
			csvEscape($data['trialPhase']),
			csvEscape($data['trialNo']),
			csvEscape($data['trialVariant']),
			csvEscape($data['accuracy']),
			csvEscape($data['touchTime']),
			csvEscape($data['reactionTime']),
			csvEscape($data['trialTime']),
			csvEscape($data['buttonPressed']),
			csvEscape($data['animationShowed']),
			csvEscape($data['dotPressed']),
			csvEscape($data['moveEvents'])
		);
		
		// Write to file
		try {
			// Add headers if file doesn't exist
			if (!file_exists($filePath)) {
				if (file_put_contents($filePath, $headers, FILE_APPEND | LOCK_EX) === false) {
					logMsg("logResponseToCsv ERROR: Could not write headers to: $filePath");
					return false;
				}
			}
			
			// Append data row
			if (file_put_contents($filePath, $row, FILE_APPEND | LOCK_EX) === false) {
				logMsg("logResponseToCsv ERROR: Could not write row to: $filePath");
				return false;
			}
			
			logMsg("logResponseToCsv: Successfully wrote to $filePath");
			return true;
			
		} catch (Exception $e) {
			logMsg("logResponseToCsv EXCEPTION: " . $e->getMessage());
			return false;
		}
	}

	/**
	 * Write event to CSV log file
	 * Appends to timestamped event log
	 * 
	 * @param array $data Event data
	 * @return bool True on success
	 */
	function logEventToCsv($data) {
		$csvDir = getenv('CSV_DATA_DIR');
		if (!$csvDir) {
			$csvDir = $_SERVER['DOCUMENT_ROOT'] . '/../csv_data';
		}
		
		// Create events log directory
		$eventsDir = $csvDir . '/events';
		if (!is_dir($eventsDir)) {
			if (!@mkdir($eventsDir, 0777, true)) {
				logMsg("logEventToCsv ERROR: Could not create directory: $eventsDir");
				return false;
			}
		}
		
		// Filename: events_{YYYY-MM-DD}.csv
		$date = new DateTime('now', new DateTimeZone('UTC'));
		$filename = 'events_' . $date->format('Y-m-d') . '.csv';
		$filePath = $eventsDir . '/' . $filename;
		
		$headers = "Timestamp,EventData\n";
		$row = sprintf(
			"%s,%s\n",
			csvEscape($data['timestamp']),
			csvEscape($data['eventData'])
		);
		
		try {
			if (!file_exists($filePath)) {
				if (file_put_contents($filePath, $headers, FILE_APPEND | LOCK_EX) === false) {
					logMsg("logEventToCsv ERROR: Could not write headers to: $filePath");
					return false;
				}
			}
			
			if (file_put_contents($filePath, $row, FILE_APPEND | LOCK_EX) === false) {
				logMsg("logEventToCsv ERROR: Could not write row to: $filePath");
				return false;
			}
			
			logMsg("logEventToCsv: Successfully wrote to $filePath");
			return true;
			
		} catch (Exception $e) {
			logMsg("logEventToCsv EXCEPTION: " . $e->getMessage());
			return false;
		}
	}

	/**
	 * Escape CSV field values
	 * @param string $field Field value
	 * @return string Escaped field
	 */
	function csvEscape($field) {
		// Remove line breaks and quotes
		$field = str_replace(["\r", "\n", '"'], ['', '', '""'], $field);
		
		// Quote if contains comma, quote, or space
		if (strpos($field, ',') !== false || strpos($field, '"') !== false || strpos($field, ' ') !== false) {
			$field = '"' . $field . '"';
		}
		
		return $field;
	}

	// ========== XML Helper Functions ==========

	/**
	 * Generate status XML document
	 * @param string $type Status type (e.g., "ok", "error")
	 * @param string $msg Status message
	 * @return DOMDocument
	 */
	if (!function_exists('genStatusDoc')) {
		function genStatusDoc($type, $msg) {
			$doc = new DOMDocument("1.0", "utf-8");
			$parentElem = $doc->createElement($type);
			$parentElem->setAttribute("msg", $msg);
			$doc->appendChild($parentElem);
			return $doc;
		}
	}
	
	/**
	 * Generate multi-element XML document from array
	 * @param array $rows Array of associative arrays
	 * @param string $elemName Element name (e.g., "project")
	 * @param array $parentAttrs Attributes for parent element
	 * @return DOMDocument
	 */
	if (!function_exists('genMultiXmlElemDocFromDbResult')) {
		function genMultiXmlElemDocFromDbResult($rows, $elemName, $parentAttrs=array()) {
			$doc = new DOMDocument("1.0", "utf-8");
			$parentElem = $doc->createElement($elemName."s");
			foreach ($parentAttrs as $attr=>$value) {
				$parentElem->setAttribute($attr, $value);
			}
			$doc->appendChild($parentElem);
			
			if (!is_array($rows)) {
				$rows = [];
			}
			
			foreach ($rows as $row) {
				$childElem = $doc->createElement($elemName);
			if (is_array($row)) {
				setAttributes($childElem, $row);
			}
			$parentElem->appendChild($childElem);
		}
		return $doc;
		}
	}
	
	/**
	 * Generate single-element XML document
	 * @param array $row Associative array
	 * @param string $elemName Element name
	 * @return DOMDocument
	 */
	if (!function_exists('genSingleXmlElemDoc')) {
		function genSingleXmlElemDoc($row, $elemName) {
			$doc = new DOMDocument("1.0", "utf-8");
			$elem = $doc->createElement($elemName);
		if (is_array($row)) {
			setAttributes($elem, $row);
		}
		$doc->appendChild($elem);
		return $doc;
		}
	}
