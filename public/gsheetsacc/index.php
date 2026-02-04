<?php
	// Google Sheets Data Access Endpoint
	// Replaces MySQL backend completely - handles all data operations via Google Sheets API
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
		include_once(LIB_ROOT."/domlib.php");
		error_log("gsheetsacc/index.php: domlib.php included");
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
	 * Handles all database-like operations via Google Sheets API
	 */
	function gsheetsOpXml() {
		global $type, $data;
		
		// Set headers first
		if (!headers_sent()) {
			header("Content-type: text/xml; charset=UTF-8");
			header("Cache-Control: no-cache, must-revalidate");
			header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
		}
		
		try {
			logMsg("gsheetsOpXml: Processing operation type: $type");
			
			$doc = null;
			$rawValues = explode(",", $data);
			
			switch ($type) {
				// USER MANAGEMENT
				case "userSelect":
					logMsg("gsheetsOpXml: Entering userSelect case");
					$username = $rawValues[0] ?? '';
					$password = $rawValues[1] ?? '';
					$userArr = sheetsUserSelect($username, $password);
					$doc = genSingleXmlElemDoc($userArr, "user");
					break;
				
				// PROJECT MANAGEMENT
				case "projectsSelect":
					logMsg("gsheetsOpXml: Entering projectsSelect case");
					$username = $rawValues[0] ?? '';
					$current = $rawValues[1] ?? 0;
					$result = sheetsProjectsSelect($username, $current);
					$doc = genMultiXmlElemDocFromDbResult($result['projects'], "project", array("current" => $result['current']));
					break;
					
				case "projectInsert":
					$username = $rawValues[0] ?? '';
					$projectName = $rawValues[1] ?? '';
					$newNo = sheetsProjectInsert($username, $projectName);
					$result = sheetsProjectsSelect($username, $newNo);
					$doc = genMultiXmlElemDocFromDbResult($result['projects'], "project", array("current" => $newNo));
					break;
					
				case "projectUpdate":
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$projectName = $rawValues[2] ?? '';
					sheetsProjectUpdate($projectNo, $projectName);
					$result = sheetsProjectsSelect($username, $projectNo);
					$doc = genMultiXmlElemDocFromDbResult($result['projects'], "project", array("current" => $projectNo));
					break;
					
				case "projectDelete":
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					sheetsProjectDelete($projectNo);
					$result = sheetsProjectsSelect($username, 0);
					$doc = genMultiXmlElemDocFromDbResult($result['projects'], "project", array("current" => 0));
					break;
				
				// TEST SET MANAGEMENT
				case "testSetsSelect":
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$current = $rawValues[2] ?? 0;
					$result = sheetsTestSetsSelect($username, $projectNo, $current);
					$doc = genMultiXmlElemDocFromDbResult($result['testSets'], "testSet", array("current" => $result['current']));
					break;
					
				case "testSetInsert":
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetName = $rawValues[2] ?? '';
					$newNo = sheetsTestSetInsert($username, $projectNo, $testSetName);
					$result = sheetsTestSetsSelect($username, $projectNo, $newNo);
					$doc = genMultiXmlElemDocFromDbResult($result['testSets'], "testSet", array("current" => $newNo));
					break;
					
				case "testSetUpdate":
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetNo = $rawValues[2] ?? 0;
					$testSetName = $rawValues[3] ?? '';
					sheetsTestSetUpdate($projectNo, $testSetNo, $testSetName);
					$result = sheetsTestSetsSelect($username, $projectNo, $testSetNo);
					$doc = genMultiXmlElemDocFromDbResult($result['testSets'], "testSet", array("current" => $testSetNo));
					break;
					
				case "testSetDelete":
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetNo = $rawValues[2] ?? 0;
					sheetsTestSetDelete($testSetNo);
					$result = sheetsTestSetsSelect($username, $projectNo, 0);
					$doc = genMultiXmlElemDocFromDbResult($result['testSets'], "testSet", array("current" => 0));
					break;
				
				// PARTICIPANT MANAGEMENT
				case "partsSelect":
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetNo = $rawValues[2] ?? 0;
					$current = $rawValues[3] ?? 0;
					$result = sheetsPartsSelect($username, $projectNo, $testSetNo, $current);
					$doc = genMultiXmlElemDocFromDbResult($result['parts'], "part", array("current" => $result['current']));
					break;
					
				case "partInsert2":
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetNo = $rawValues[2] ?? 0;
					$ref = $rawValues[3] ?? '';
					$birthYear = $rawValues[4] ?? 0;
					$birthMonth = $rawValues[5] ?? 0;
					$birthDay = $rawValues[6] ?? 0;
					$gender = $rawValues[7] ?? '';
					$newNo = sheetsPartInsert2($username, $projectNo, $testSetNo, $ref, $birthYear, $birthMonth, $birthDay, $gender);
					$result = sheetsPartsSelect($username, $projectNo, $testSetNo, $newNo);
					$doc = genMultiXmlElemDocFromDbResult($result['parts'], "part", array("current" => $newNo));
					break;
					
				case "partUpdate2":
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetNo = $rawValues[2] ?? 0;
					$partNo = $rawValues[3] ?? 0;
					$ref = $rawValues[4] ?? '';
					$birthYear = $rawValues[5] ?? 0;
					$birthMonth = $rawValues[6] ?? 0;
					$birthDay = $rawValues[7] ?? 0;
					$gender = $rawValues[8] ?? '';
					sheetsPartUpdate2($username, $projectNo, $testSetNo, $partNo, $ref, $birthYear, $birthMonth, $birthDay, $gender);
					$result = sheetsPartsSelect($username, $projectNo, $testSetNo, $partNo);
					$doc = genMultiXmlElemDocFromDbResult($result['parts'], "part", array("current" => $partNo));
					break;
					
				case "partDelete":
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetNo = $rawValues[2] ?? 0;
					$partNo = $rawValues[3] ?? 0;
					sheetsPartDelete($partNo);
					$result = sheetsPartsSelect($username, $projectNo, $testSetNo, 0);
					$doc = genMultiXmlElemDocFromDbResult($result['parts'], "part", array("current" => 0));
					break;
				
				// TESTS AND SYNC POINTS
				case "testsSelect":
					$username = $rawValues[0] ?? '';
					$filterValue = $rawValues[1] ?? '';
					$result = sheetsTestsSelect($username, $filterValue);
					$doc = genMultiXmlElemDocFromDbResult($result['tests'], "test", array());
					break;
					
				case "syncPointsSelect":
					$username = $rawValues[0] ?? '';
					$projectNo = $rawValues[1] ?? 0;
					$testSetNo = $rawValues[2] ?? 0;
					$partNo = $rawValues[3] ?? 0;
					$result = sheetsSyncPointsSelect($username, $projectNo, $testSetNo, $partNo);
					$doc = genMultiXmlElemDocFromDbResult($result['syncPoints'], "syncPoint", array());
					break;
					
				case "getPartsDoc":
					$projectId = $rawValues[0] ?? 0;
					$dataSetNo = $rawValues[1] ?? 0;
					$result = sheetsGetPartsDoc($projectId, $dataSetNo);
					$doc = genMultiXmlElemDocFromDbResult($result['parts'], "part", array());
					break;
				
				// TRIAL RESPONSE LOGGING
				case "respInsert":
					$result = handleRespInsert($data);
					if ($result) {
						// Extract username and trialStartTime to generate localStorage key
						// Data format: curUserName,projectNo,testSetNo,testName,partNo,prevRespTime,trialStartTime,...
						$parts = explode(",", trim($data));
						$username = $parts[0] ?? '';
						$trialStartTime = $parts[6] ?? ''; // trialStartTime is at index 6
						$recordKey = $username . "_" . $trialStartTime;
						$doc = genStatusDoc("ok", $recordKey); // Return localStorage key for client to remove
					} else {
						$doc = genStatusDoc("error", "Failed to log response");
					}
					break;
				
				// BATCH TRIAL RESPONSE LOGGING
				case "respBatchInsert":
					$result = handleRespBatchInsert($data);
					if ($result) {
						$doc = genStatusDoc("ok", "Batch insert successful");
					} else {
						$doc = genStatusDoc("error", "Batch insert failed");
					}
					break;
				
				// EVENT LOGGING
				case "eventLog":
					$result = handleEventLog($data);
					if ($result) {
						$doc = genStatusDoc("ok", "Event logged");
					} else {
						$doc = genStatusDoc("error", "Failed to log event");
					}
					break;
					
				default:
					logMsg("gsheetsOpXml: Unknown operation type: $type");
					$doc = genStatusDoc("error", "Unknown operation type: $type");
			}
			
			// Output the XML document
			if ($doc) {
				echo $doc->saveXML();
				logMsg("gsheetsOpXml: Operation complete, type: $type");
			} else {
				echo '<?xml version="1.0"?><error>No document generated</error>';
				logMsg("gsheetsOpXml ERROR: No document generated for type: $type");
			}
			
		} catch (Exception $e) {
			logMsg("gsheetsOpXml EXCEPTION: " . $e->getMessage());
			echo '<?xml version="1.0"?><error>' . htmlspecialchars($e->getMessage()) . '</error>';
		}
	}
	
	/**
	 * Generate status XML document
	 * @param string $type Status type (e.g., "ok", "error")
	 * @param string $msg Status message
	 * @return DOMDocument
	 */
	function genStatusDoc($type, $msg) {
		$doc = new DOMDocument("1.0", "utf-8");
		$parentElem = $doc->createElement($type);
		$parentElem->setAttribute("msg", $msg);
		$doc->appendChild($parentElem);
		return $doc;
	}
	
	/**
	 * Generate multi-element XML document from array
	 * @param array $rows Array of associative arrays
	 * @param string $elemName Element name (e.g., "project")
	 * @param array $parentAttrs Attributes for parent element
	 * @return DOMDocument
	 */
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
	
	/**
	 * Generate single-element XML document
	 * @param array $row Associative array
	 * @param string $elemName Element name
	 * @return DOMDocument
	 */
	function genSingleXmlElemDoc($row, $elemName) {
		$doc = new DOMDocument("1.0", "utf-8");
		$elem = $doc->createElement($elemName);
		if (is_array($row)) {
			setAttributes($elem, $row);
		}
		$doc->appendChild($elem);
		return $doc;
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
 * Handle batch response insert operation
 * Logs multiple trial responses in one API call to avoid rate limiting
 *
 * @param string $dataStr Newline-separated trial data records
 * @return bool True on success
 */
function handleRespBatchInsert($dataStr) {
	logMsg("handleRespBatchInsert: Processing batch data");

	$records = explode("\n", trim($dataStr));
	$successCount = 0;
	$failCount = 0;

	foreach ($records as $record) {
		$record = trim($record);
		if (empty($record)) {
			continue;
		}

		$parts = explode(",", $record);
		if (count($parts) < 20) {
			logMsg("handleRespBatchInsert: Skipping invalid record");
			$failCount++;
			continue;
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
			$successCount++;
		} else {
			$failCount++;
		}
	}

	logMsg("handleRespBatchInsert: Complete - Success: $successCount, Failed: $failCount");
	return $successCount > 0;
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
