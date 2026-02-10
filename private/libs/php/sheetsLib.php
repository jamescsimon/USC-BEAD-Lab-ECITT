<?php
/**
 * Google Sheets API Logging Library
 * 
 * This library provides functions to log ECITT app interactions to Google Sheets
 * using the Google Sheets API. It replaces the MySQL backend for data logging.
 * 
 * All timestamps are stored in UTC format (ISO 8601).
 */

include_once "lib.php";

// Google Sheets configuration constants
// These should be set from environment variables or config files
define("GOOGLE_SHEETS_API_KEY", getenv("GOOGLE_SHEETS_API_KEY") ?: "");
define("GOOGLE_SHEETS_SPREADSHEET_ID", getenv("GOOGLE_SHEETS_SPREADSHEET_ID") ?: "");
define(
	"GOOGLE_SHEETS_CREDENTIALS_FILE",
	getenv("GOOGLE_SHEETS_CREDENTIALS_FILE")
		?: (file_exists(dirname(__DIR__, 3) . "/usc-bead-ecitt-755207cdd9c1.json")
			? dirname(__DIR__, 3) . "/usc-bead-ecitt-755207cdd9c1.json"
			: dirname(__DIR__) . "/creds/google-credentials.json")
);

// Google Sheets ranges for different data types
define("SHEETS_RESP_RANGE", "Responses!A:S");  // Response data sheet
define("SHEETS_EVENTS_RANGE", "Events!A:F");   // Events sheet

// Global variable to hold the access token
$gsheets_access_token = null;
$gsheets_token_expires_at = 0;

/**
 * Configure cURL SSL settings for Google API requests
 * Uses optional environment variables for CA bundle or SSL disable (dev only)
 */
function configureGoogleCurlSsl($ch) {
	$caBundle = getenv("GOOGLE_SHEETS_CA_BUNDLE") ?: "";
	if ($caBundle && file_exists($caBundle)) {
		curl_setopt($ch, CURLOPT_CAINFO, $caBundle);
	}
	if (getenv("GOOGLE_SHEETS_DISABLE_SSL_VERIFY") === "1") {
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	}
}

/**
 * Get or refresh Google Sheets API access token
 * Uses service account authentication with OAuth 2.0
 * 
 * @return string|false Access token or false on failure
 */
function getGoogleSheetsAccessToken() {
	global $gsheets_access_token, $gsheets_token_expires_at;
	
	// Return cached token if still valid
	if ($gsheets_access_token && time() < $gsheets_token_expires_at - 60) {
		logMsg("getGoogleSheetsAccessToken: Using cached token");
		return $gsheets_access_token;
	}
	
	$credentialsFile = GOOGLE_SHEETS_CREDENTIALS_FILE;
	
	if (!file_exists($credentialsFile)) {
		logMsg("getGoogleSheetsAccessToken ERROR: Credentials file not found at " . $credentialsFile);
		return false;
	}
	
	try {
		if (!function_exists('curl_init')) {
			logMsg("getGoogleSheetsAccessToken ERROR: cURL extension not available (curl_init missing)");
			return false;
		}
		if (!function_exists('openssl_sign')) {
			logMsg("getGoogleSheetsAccessToken ERROR: OpenSSL extension not available (openssl_sign missing)");
			return false;
		}
		$credentials = json_decode(file_get_contents($credentialsFile), true);
		
		if (!$credentials || !isset($credentials['private_key']) || !isset($credentials['client_email'])) {
			logMsg("getGoogleSheetsAccessToken ERROR: Invalid credentials format");
			return false;
		}
		
		// Create JWT for service account
		$jwt = createJWT(
			$credentials['private_key'],
			$credentials['client_email'],
			"https://oauth2.googleapis.com/token",
			"https://www.googleapis.com/auth/spreadsheets"
		);
		
		// Exchange JWT for access token
		$ch = curl_init("https://oauth2.googleapis.com/token");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
			"grant_type" => "urn:ietf:params:oauth:grant-type:jwt-bearer",
			"assertion" => $jwt
		]));
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		// Optional SSL configuration for local environments
		configureGoogleCurlSsl($ch);
		
		$response = curl_exec($ch);
		if ($response === false) {
			$curlErr = curl_error($ch);
			$curlErrNo = curl_errno($ch);
			logMsg("getGoogleSheetsAccessToken ERROR: cURL failed ($curlErrNo) $curlErr");
		}
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		
		if ($http_code !== 200) {
			logMsg("getGoogleSheetsAccessToken ERROR: Failed to get token, HTTP code: " . $http_code);
			return false;
		}
		
		$tokenData = json_decode($response, true);
		
		if (!isset($tokenData['access_token'])) {
			logMsg("getGoogleSheetsAccessToken ERROR: No access token in response");
			return false;
		}
		
		$gsheets_access_token = $tokenData['access_token'];
		$gsheets_token_expires_at = time() + intval($tokenData['expires_in'] ?? 3600);
		
		logMsg("getGoogleSheetsAccessToken: Successfully obtained new token");
		return $gsheets_access_token;
		
	} catch (Exception $e) {
		logMsg("getGoogleSheetsAccessToken EXCEPTION: " . $e->getMessage());
		return false;
	} catch (Error $e) {
		logMsg("getGoogleSheetsAccessToken FATAL ERROR: " . $e->getMessage());
		return false;
	}
}

/**
 * Create a JWT for Google OAuth authentication
 * 
 * @param string $private_key The private key from credentials
 * @param string $client_email The service account email
 * @param string $token_uri The token endpoint
 * @param string $scope The OAuth scope
 * @return string The JWT token
 */
function createJWT($private_key, $client_email, $token_uri, $scope) {
	$header = [
		"alg" => "RS256",
		"typ" => "JWT"
	];
	
	$now = time();
	$claims = [
		"iss" => $client_email,
		"scope" => $scope,
		"aud" => $token_uri,
		"exp" => $now + 3600,
		"iat" => $now
	];
	
	$headerEncoded = rtrim(strtr(base64_encode(json_encode($header)), '+/', '-_'), '=');
	$claimsEncoded = rtrim(strtr(base64_encode(json_encode($claims)), '+/', '-_'), '=');
	
	$signatureInput = $headerEncoded . "." . $claimsEncoded;
	
	$signature = '';
	if (!openssl_sign($signatureInput, $signature, $private_key, 'SHA256')) {
		throw new Exception("Failed to sign JWT");
	}
	
	$signatureEncoded = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
	
	return $signatureInput . "." . $signatureEncoded;
}

/**
 * Log a trial response to Google Sheets
 * Equivalent to the database respInsert operation
 * 
 * @param array $data Response data from the trial
 * @return bool True on success, false on failure
 */
function logResponseToSheets($data) {
	$token = getGoogleSheetsAccessToken();
	if (!$token) {
		logMsg("logResponseToSheets ERROR: Could not get access token");
		return false;
	}
	
	try {
		// Data format from comm.js recordResponse:
		// curUserName, projectNo, testSetNo, testName, partNo, prevRespTime, 
		// trialStartTime, trialType, trialPhase, trialNo, trialVariant, accuracy,
		// touchTime, reactionTime, trialTime, buttonPressed, animationShowed, 
		// dotPressed, moveEvents, curPosLat, curPosLng, trialQueueLength
		
		$row = [
			getCurrentUTCTimestamp(),  // Timestamp (UTC)
			$data['curUserName'] ?? '',
			$data['projectNo'] ?? '',
			$data['testSetNo'] ?? '',
			$data['testName'] ?? '',
			$data['partNo'] ?? '',
			$data['prevRespTime'] ?? '',
			$data['trialStartTime'] ?? '',
			$data['trialType'] ?? '',
			$data['trialPhase'] ?? '',
			$data['trialNo'] ?? '',
			$data['trialVariant'] ?? '',
			$data['accuracy'] ?? '',
			$data['touchTime'] ?? '',
			$data['reactionTime'] ?? '',
			$data['trialTime'] ?? '',
			$data['buttonPressed'] ?? '',
			$data['animationShowed'] ?? '',
			$data['dotPressed'] ?? '',
			$data['moveEvents'] ?? '',
			$data['curPosLat'] ?? '',
			$data['curPosLng'] ?? '',
			$data['trialQueueLength'] ?? ''
		];
		
		$values = [$row];
		
		$requestBody = [
			"values" => $values
		];
		
		$spreadsheetId = GOOGLE_SHEETS_SPREADSHEET_ID;
		$url = "https://sheets.googleapis.com/v4/spreadsheets/" . $spreadsheetId . "/values/" . SHEETS_RESP_RANGE . ":append";
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, [
			"Authorization: Bearer " . $token,
			"Content-Type: application/json"
		]);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
		curl_setopt($ch, CURLOPT_URL, $url . "?valueInputOption=USER_ENTERED");
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		configureGoogleCurlSsl($ch);
		
		$response = curl_exec($ch);
		if ($response === false) {
			$curlErr = curl_error($ch);
			$curlErrNo = curl_errno($ch);
			logMsg("logResponseToSheets ERROR: cURL failed ($curlErrNo) $curlErr");
		}
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		
		if ($http_code >= 200 && $http_code < 300) {
			logMsg("logResponseToSheets: Successfully logged response");
			return true;
		} else {
			logMsg("logResponseToSheets ERROR: HTTP " . $http_code . ", Response: " . $response);
			return false;
		}
		
	} catch (Exception $e) {
		logMsg("logResponseToSheets EXCEPTION: " . $e->getMessage());
		return false;
	}
}

/**
 * Log an event to Google Sheets
 * 
 * @param string $eventType Type of event (e.g., "gameStart", "buttonPress", etc.)
 * @param string $eventData Additional data about the event
 * @param string $userName The current user/participant
 * @return bool True on success, false on failure
 */
function logEventToSheets($eventType, $eventData, $userName = "") {
	$token = getGoogleSheetsAccessToken();
	if (!$token) {
		logMsg("logEventToSheets ERROR: Could not get access token");
		return false;
	}
	
	try {
		$row = [
			getCurrentUTCTimestamp(),  // Timestamp (UTC)
			$eventType,
			$eventData,
			$userName,
			getClientIP(),
			"ECITT_PWA"
		];
		
		$values = [$row];
		
		$requestBody = [
			"values" => $values
		];
		
		$spreadsheetId = GOOGLE_SHEETS_SPREADSHEET_ID;
		$url = "https://sheets.googleapis.com/v4/spreadsheets/" . $spreadsheetId . "/values/" . SHEETS_EVENTS_RANGE . ":append";
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, [
			"Authorization: Bearer " . $token,
			"Content-Type: application/json"
		]);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
		curl_setopt($ch, CURLOPT_URL, $url . "?valueInputOption=USER_ENTERED");
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		configureGoogleCurlSsl($ch);
		
		$response = curl_exec($ch);
		if ($response === false) {
			$curlErr = curl_error($ch);
			$curlErrNo = curl_errno($ch);
			logMsg("logEventToSheets ERROR: cURL failed ($curlErrNo) $curlErr");
		}
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		
		if ($http_code >= 200 && $http_code < 300) {
			logMsg("logEventToSheets: Successfully logged event");
			return true;
		} else {
			logMsg("logEventToSheets ERROR: HTTP " . $http_code . ", Response: " . $response);
			return false;
		}
		
	} catch (Exception $e) {
		logMsg("logEventToSheets EXCEPTION: " . $e->getMessage());
		return false;
	}
}

/**
 * Get current UTC timestamp in ISO 8601 format
 * Format: 2024-02-03T15:30:45Z
 * 
 * @return string UTC timestamp
 */
function getCurrentUTCTimestamp() {
	return gmdate("Y-m-d\TH:i:s\Z");
}

/**
 * Get client IP address
 * 
 * @return string Client IP address
 */
function getClientIP() {
	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
		return $_SERVER['HTTP_CLIENT_IP'];
	} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		$ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
		return trim($ips[0]);
	} else {
		return $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
	}
}

/**
 * Initialize Google Sheets logging
 * Called during app startup to verify credentials and permissions
 * 
 * @return bool True if initialization successful, false otherwise
 */
function initSheetsLogging() {
	logMsg("initSheetsLogging: Initializing Google Sheets logging...");
	
	if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
		logMsg("initSheetsLogging ERROR: GOOGLE_SHEETS_SPREADSHEET_ID not set");
		return false;
	}
	
	if (!GOOGLE_SHEETS_CREDENTIALS_FILE || !file_exists(GOOGLE_SHEETS_CREDENTIALS_FILE)) {
		logMsg("initSheetsLogging ERROR: Google credentials file not found");
		return false;
	}
	
	$token = getGoogleSheetsAccessToken();
	if (!$token) {
		logMsg("initSheetsLogging ERROR: Could not obtain access token");
		return false;
	}
	
	logMsg("initSheetsLogging: Successfully initialized");
	return true;
}

// =============================================================================
// GOOGLE SHEETS DATA MANAGEMENT FUNCTIONS
// These functions replace MySQL database operations with Google Sheets API calls
// =============================================================================

// Define sheet ranges for different data types
define("SHEETS_USERS_RANGE", "Users!A:D");           // username, password, userType, globalPerm
define("SHEETS_PROJECTS_RANGE", "Projects!A:C");    // no, name, userName (owner)
define("SHEETS_TESTSETS_RANGE", "TestSets!A:C");    // no, projectNo, name
define("SHEETS_PARTS_RANGE", "Participants!A:H");    // userName, no, projectNo, ref, birthYear, birthMonth, birthDay, gender
define("SHEETS_TESTS_RANGE", "Tests!A:D");           // testName, testDescription, created, modified
define("SHEETS_SYNCPOINTS_RANGE", "SyncPoints!A:E"); // userName, projectNo, testSetNo, partNo, timestamp

/**
 * Read data from a Google Sheets range
 * @param string $range The range to read (e.g., "Users!A:D")
 * @return array|false Array of rows or false on failure
 */
function readSheetRange($range) {
	$token = getGoogleSheetsAccessToken();
	if (!$token) {
		logMsg("readSheetRange ERROR: Could not get access token");
		return false;
	}
	
	try {
		$spreadsheetId = GOOGLE_SHEETS_SPREADSHEET_ID;
		$url = "https://sheets.googleapis.com/v4/spreadsheets/" . $spreadsheetId . "/values/" . urlencode($range);
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, [
			"Authorization: Bearer " . $token
		]);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		configureGoogleCurlSsl($ch);
		
		$response = curl_exec($ch);
		if ($response === false) {
			$curlErr = curl_error($ch);
			$curlErrNo = curl_errno($ch);
			logMsg("readSheetRange ERROR: cURL failed ($curlErrNo) $curlErr");
		}
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$curl_errno = curl_errno($ch);
		curl_close($ch);
		
		if ($http_code >= 200 && $http_code < 300) {
			$data = json_decode($response, true);
			$values = $data['values'] ?? [];
			logMsg("readSheetRange SUCCESS: Retrieved " . count($values) . " rows from $range");
			if (count($values) > 0) {
				logMsg("readSheetRange: First row: " . json_encode($values[0]));
			}
			return $values;
		} else {
			logMsg("readSheetRange ERROR: HTTP " . $http_code . ", cURL errno: " . $curl_errno . ", Response: " . substr($response, 0, 200));
			return false;
		}
	} catch (Exception $e) {
		logMsg("readSheetRange EXCEPTION: " . $e->getMessage());
		return false;
	}
}

/**
 * Append data to a Google Sheets range
 * @param string $range The range to append to
 * @param array $values Array of rows to append
 * @return bool True on success
 */
function appendSheetRange($range, $values) {
	$token = getGoogleSheetsAccessToken();
	if (!$token) {
		return false;
	}
	
	try {
		$spreadsheetId = GOOGLE_SHEETS_SPREADSHEET_ID;
		$url = "https://sheets.googleapis.com/v4/spreadsheets/" . $spreadsheetId . "/values/" . urlencode($range) . ":append";
		
		$requestBody = ["values" => $values];
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, [
			"Authorization: Bearer " . $token,
			"Content-Type: application/json"
		]);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
		curl_setopt($ch, CURLOPT_URL, $url . "?valueInputOption=USER_ENTERED");
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		configureGoogleCurlSsl($ch);
		
		$response = curl_exec($ch);
		if ($response === false) {
			$curlErr = curl_error($ch);
			$curlErrNo = curl_errno($ch);
			logMsg("appendSheetRange ERROR: cURL failed ($curlErrNo) $curlErr");
		}
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		
		return ($http_code >= 200 && $http_code < 300);
	} catch (Exception $e) {
		logMsg("appendSheetRange EXCEPTION: " . $e->getMessage());
		return false;
	}
}

/**
 * Update a specific row in Google Sheets
 * @param string $range The exact range to update (e.g., "Projects!A2:C2")
 * @param array $values Array containing one row of values
 * @return bool True on success
 */
function updateSheetRange($range, $values) {
	$token = getGoogleSheetsAccessToken();
	if (!$token) {
		return false;
	}
	
	try {
		$spreadsheetId = GOOGLE_SHEETS_SPREADSHEET_ID;
		$url = "https://sheets.googleapis.com/v4/spreadsheets/" . $spreadsheetId . "/values/" . urlencode($range);
		
		$requestBody = ["values" => [$values]];
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
		curl_setopt($ch, CURLOPT_HTTPHEADER, [
			"Authorization: Bearer " . $token,
			"Content-Type: application/json"
		]);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
		curl_setopt($ch, CURLOPT_URL, $url . "?valueInputOption=USER_ENTERED");
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		configureGoogleCurlSsl($ch);
		
		$response = curl_exec($ch);
		if ($response === false) {
			$curlErr = curl_error($ch);
			$curlErrNo = curl_errno($ch);
			logMsg("updateSheetRange ERROR: cURL failed ($curlErrNo) $curlErr");
		}
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		
		return ($http_code >= 200 && $http_code < 300);
	} catch (Exception $e) {
		logMsg("updateSheetRange EXCEPTION: " . $e->getMessage());
		return false;
	}
}

/**
 * Get next available ID number for a sheet
 * @param string $range The range containing IDs in first column
 * @return int Next available ID
 */
function getNextSheetId($range) {
	$data = readSheetRange($range);
	if (!$data || count($data) <= 1) { // <= 1 because first row is header
		return 1;
	}
	
	$maxId = 0;
	for ($i = 1; $i < count($data); $i++) { // Skip header row
		$id = intval($data[$i][0] ?? 0);
		if ($id > $maxId) {
			$maxId = $id;
		}
	}
	
	return $maxId + 1;
}

// =============================================================================
// USER MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Validate user login credentials
 * @param string $username
 * @param string $password
 * @return array User data array or empty array if not found
 */
function sheetsUserSelect($username, $password) {
	logMsg("sheetsUserSelect: username=$username");
	$data = readSheetRange(SHEETS_USERS_RANGE);
	
	if (!$data || count($data) < 2) {
		logMsg("sheetsUserSelect: No user data found");
		return [];
	}
	
	// Skip header row, search for matching user
	$username = trim($username);
	$password = trim($password);
	for ($i = 1; $i < count($data); $i++) {
		$row = $data[$i];
		$sheetUsername = trim($row[0] ?? '');
		$sheetPassword = trim($row[1] ?? '');
		if ($sheetUsername !== '' && $sheetPassword !== '' && $sheetUsername == $username && $sheetPassword == $password) {
			return [
				'name' => $sheetUsername,
				'userType' => $row[2] ?? 'user',
				'globalPerm' => $row[3] ?? ''
			];
		}
	}
	
	logMsg("sheetsUserSelect: User not found or password mismatch");
	return [];
}

// =============================================================================
// PROJECT MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Select projects for a user
 * @param string $username
 * @param int $currentNo Currently selected project number
 * @return array Array of project records
 */
function sheetsProjectsSelect($username, $currentNo = null) {
	logMsg("sheetsProjectsSelect: username=$username, currentNo=$currentNo");
	$data = readSheetRange(SHEETS_PROJECTS_RANGE);
	logMsg("sheetsProjectsSelect: readSheetRange returned " . (is_array($data) ? count($data) : "non-array") . " rows");
	
	if (!$data || count($data) < 2) {
		logMsg("sheetsProjectsSelect: No data or less than 2 rows, returning empty");
		return ['projects' => [], 'current' => 0];
	}
	
	$projects = [];
	// Skip header row
	for ($i = 1; $i < count($data); $i++) {
		$row = $data[$i];
		logMsg("sheetsProjectsSelect: Row $i: " . json_encode($row) . ", checking if userName=" . (isset($row[2]) ? $row[2] : "(undefined)") . " matches $username");
		if (count($row) >= 3 && $row[2] == $username) {
			logMsg("sheetsProjectsSelect: Row $i MATCHED, adding project");
			$projects[] = [
				'no' => $row[0],
				'name' => $row[1],
				'perm' => 'adm' // Owner has admin permission
			];
		}
	}
	
	logMsg("sheetsProjectsSelect: Returning " . count($projects) . " projects for user $username");
	return ['projects' => $projects, 'current' => $currentNo ?? 0];
}

/**
 * Insert a new project
 * @param string $username
 * @param string $projectName
 * @return int New project number or 0 on failure
 */
function sheetsProjectInsert($username, $projectName) {
	logMsg("sheetsProjectInsert: username=$username, projectName=$projectName");
	$nextNo = getNextSheetId(SHEETS_PROJECTS_RANGE);
	
	$success = appendSheetRange(SHEETS_PROJECTS_RANGE, [
		[$nextNo, $projectName, $username]
	]);
	
	return $success ? $nextNo : 0;
}

/**
 * Update a project name
 * @param int $projectNo
 * @param string $newName
 * @return bool True on success
 */
function sheetsProjectUpdate($projectNo, $newName) {
	logMsg("sheetsProjectUpdate: projectNo=$projectNo, newName=$newName");
	$data = readSheetRange(SHEETS_PROJECTS_RANGE);
	
	if (!$data) return false;
	
	// Find the row with this project number
	for ($i = 1; $i < count($data); $i++) {
		if ($data[$i][0] == $projectNo) {
			$rowNum = $i + 1; // +1 because Sheets are 1-indexed
			$range = "Projects!A{$rowNum}:C{$rowNum}";
			return updateSheetRange($range, [$projectNo, $newName, $data[$i][2]]);
		}
	}
	
	return false;
}

/**
 * Delete a project
 * @param int $projectNo
 * @return bool True on success
 */
function sheetsProjectDelete($projectNo) {
	logMsg("sheetsProjectDelete: projectNo=$projectNo");
	// Note: Google Sheets API doesn't have a simple delete row function
	// For now, we'll just clear the row data. A cleanup script can remove empty rows later.
	$data = readSheetRange(SHEETS_PROJECTS_RANGE);
	
	if (!$data) return false;
	
	for ($i = 1; $i < count($data); $i++) {
		if ($data[$i][0] == $projectNo) {
			$rowNum = $i + 1;
			$range = "Projects!A{$rowNum}:C{$rowNum}";
			return updateSheetRange($range, ['', '', '']); // Clear the row
		}
	}
	
	return false;
}

// =============================================================================
// TEST SET MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Select test sets for a project
 */
function sheetsTestSetsSelect($username, $projectNo, $currentNo = null) {
	logMsg("sheetsTestSetsSelect: username=$username, projectNo=$projectNo, currentNo=$currentNo");
	$data = readSheetRange(SHEETS_TESTSETS_RANGE);
	
	if (!$data || count($data) < 2) {
		return ['testSets' => [], 'current' => 0];
	}
	
	$testSets = [];
	for ($i = 1; $i < count($data); $i++) {
		$row = $data[$i];
		if (count($row) >= 3 && $row[1] == $projectNo) {
			$testSets[] = [
				'no' => $row[0],
				'projectNo' => $row[1],
				'name' => $row[2],
				'perm' => 'adm'
			];
		}
	}
	
	return ['testSets' => $testSets, 'current' => $currentNo ?? 0];
}

/**
 * Insert a new test set
 */
function sheetsTestSetInsert($username, $projectNo, $testSetName) {
	logMsg("sheetsTestSetInsert: username=$username, projectNo=$projectNo, testSetName=$testSetName");
	$nextNo = getNextSheetId(SHEETS_TESTSETS_RANGE);
	
	$success = appendSheetRange(SHEETS_TESTSETS_RANGE, [
		[$nextNo, $projectNo, $testSetName]
	]);
	
	return $success ? $nextNo : 0;
}

/**
 * Update a test set name
 */
function sheetsTestSetUpdate($projectNo, $testSetNo, $newName) {
	logMsg("sheetsTestSetUpdate: testSetNo=$testSetNo, newName=$newName");
	$data = readSheetRange(SHEETS_TESTSETS_RANGE);
	
	if (!$data) return false;
	
	for ($i = 1; $i < count($data); $i++) {
		if ($data[$i][0] == $testSetNo) {
			$rowNum = $i + 1;
			$range = "TestSets!A{$rowNum}:C{$rowNum}";
			return updateSheetRange($range, [$testSetNo, $projectNo, $newName]);
		}
	}
	
	return false;
}

/**
 * Delete a test set
 */
function sheetsTestSetDelete($testSetNo) {
	logMsg("sheetsTestSetDelete: testSetNo=$testSetNo");
	$data = readSheetRange(SHEETS_TESTSETS_RANGE);
	
	if (!$data) return false;
	
	for ($i = 1; $i < count($data); $i++) {
		if ($data[$i][0] == $testSetNo) {
			$rowNum = $i + 1;
			$range = "TestSets!A{$rowNum}:C{$rowNum}";
			return updateSheetRange($range, ['', '', '']);
		}
	}
	
	return false;
}

// =============================================================================
// PARTICIPANT MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Select participants for a project
 */
function sheetsPartsSelect($username, $projectNo, $testSetNo, $currentNo = null) {
	logMsg("sheetsPartsSelect: username=$username, projectNo=$projectNo, testSetNo=$testSetNo, currentNo=$currentNo");
	$data = readSheetRange(SHEETS_PARTS_RANGE);
	
	if (!$data || count($data) < 2) {
		return ['parts' => [], 'current' => 0];
	}
	
	$parts = [];
	for ($i = 1; $i < count($data); $i++) {
		$row = $data[$i];
		if (count($row) >= 8 && $row[2] == $projectNo) {
			$parts[] = [
				'userName' => $row[0],
				'no' => $row[1],
				'projectNo' => $row[2],
				'ref' => $row[3],
				'birthYear' => $row[4],
				'birthMonth' => $row[5],
				'birthDay' => $row[6],
				'gender' => $row[7],
				'owner' => ($row[0] == $username) ? '1' : '0'
			];
		}
	}
	
	return ['parts' => $parts, 'current' => $currentNo ?? 0];
}

/**
 * Insert a new participant
 */
function sheetsPartInsert2($username, $projectNo, $testSetNo, $ref, $birthYear, $birthMonth, $birthDay, $gender) {
	logMsg("sheetsPartInsert2: username=$username, projectNo=$projectNo, ref=$ref");
	$nextNo = getNextSheetId(SHEETS_PARTS_RANGE);
	
	$success = appendSheetRange(SHEETS_PARTS_RANGE, [
		[$username, $nextNo, $projectNo, $ref, $birthYear, $birthMonth, $birthDay, $gender]
	]);
	
	return $success ? $nextNo : 0;
}

/**
 * Update a participant
 */
function sheetsPartUpdate2($username, $projectNo, $testSetNo, $partNo, $ref, $birthYear, $birthMonth, $birthDay, $gender) {
	logMsg("sheetsPartUpdate2: partNo=$partNo, ref=$ref");
	$data = readSheetRange(SHEETS_PARTS_RANGE);
	
	if (!$data) return false;
	
	for ($i = 1; $i < count($data); $i++) {
		if ($data[$i][1] == $partNo) {
			$rowNum = $i + 1;
			$range = "Participants!A{$rowNum}:H{$rowNum}";
			return updateSheetRange($range, [$username, $partNo, $projectNo, $ref, $birthYear, $birthMonth, $birthDay, $gender]);
		}
	}
	
	return false;
}

/**
 * Delete a participant
 */
function sheetsPartDelete($partNo) {
	logMsg("sheetsPartDelete: partNo=$partNo");
	$data = readSheetRange(SHEETS_PARTS_RANGE);
	
	if (!$data) return false;
	
	for ($i = 1; $i < count($data); $i++) {
		if ($data[$i][1] == $partNo) {
			$rowNum = $i + 1;
			$range = "Participants!A{$rowNum}:H{$rowNum}";
			return updateSheetRange($range, ['', '', '', '', '', '', '', '']);
		}
	}
	
	return false;
}

// =============================================================================
// TEST & SYNC POINT FUNCTIONS
// =============================================================================

/**
 * Select available tests from Tests sheet
 * Returns all tests available to the user
 * @param string $username User requesting tests
 * @param string $filterValue Optional filter (not used in simplified version)
 * @return array Array with 'tests' key containing test records
 */
function sheetsTestsSelect($username, $filterValue = '') {
	logMsg("sheetsTestsSelect: username=$username, filterValue=$filterValue");
	$data = readSheetRange(SHEETS_TESTS_RANGE);
	
	if (!$data || count($data) < 2) {
		logMsg("sheetsTestsSelect: No test data found in Tests sheet");
		return ['tests' => []];
	}
	
	$tests = [];
	// Skip header row (row 0)
	for ($i = 1; $i < count($data); $i++) {
		$row = $data[$i];
		// Tests sheet columns: name, specName, description, created
		if (count($row) >= 2 && !empty($row[0]) && !empty($row[1])) {
			$tests[] = [
				'name' => $row[0],           // Display name
				'value' => $row[1],          // specName (internal identifier)
				'description' => $row[2] ?? '',
				'created' => $row[3] ?? '',
				'perm' => 'adm'              // All users have admin perm for tests (simplified)
			];
		}
	}
	
	logMsg("sheetsTestsSelect: Found " . count($tests) . " tests");
	return ['tests' => $tests];
}

/**
 * Select sync points for a participant
 */
function sheetsSyncPointsSelect($username, $projectNo, $testSetNo, $partNo) {
	logMsg("sheetsSyncPointsSelect: username=$username, projectNo=$projectNo, testSetNo=$testSetNo, partNo=$partNo");
	$data = readSheetRange(SHEETS_SYNCPOINTS_RANGE);
	
	if (!$data || count($data) < 2) {
		return ['syncPoints' => []];
	}
	
	$syncPoints = [];
	for ($i = 1; $i < count($data); $i++) {
		$row = $data[$i];
		if (count($row) >= 5 && 
			$row[0] == $username && 
			$row[1] == $projectNo && 
			$row[2] == $testSetNo && 
			$row[3] == $partNo) {
			$syncPoints[] = [
				'userName' => $row[0],
				'projectNo' => $row[1],
				'testSetNo' => $row[2],
				'partNo' => $row[3],
				'timestamp' => $row[4]
			];
		}
	}
	
	return ['syncPoints' => $syncPoints];
}

/**
 * Get parts document (used for test selection interface)
 */
function sheetsGetPartsDoc($projectId, $dataSetNo) {
	logMsg("sheetsGetPartsDoc: projectId=$projectId, dataSetNo=$dataSetNo");
	$data = readSheetRange(SHEETS_PARTS_RANGE);
	
	if (!$data || count($data) < 2) {
		return ['parts' => []];
	}
	
	$parts = [];
	for ($i = 1; $i < count($data); $i++) {
		$row = $data[$i];
		if (count($row) >= 8 && $row[2] == $projectId) {
			$parts[] = [
				'no' => $row[1],
				'ref' => $row[3],
				'birthYear' => $row[4],
				'birthMonth' => $row[5],
				'birthDay' => $row[6],
				'gender' => $row[7]
			];
		}
	}
	
	return ['parts' => $parts];
}

?>
