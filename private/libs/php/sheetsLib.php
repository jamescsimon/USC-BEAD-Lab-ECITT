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
define("GOOGLE_SHEETS_CREDENTIALS_FILE", getenv("GOOGLE_SHEETS_CREDENTIALS_FILE") ?: dirname(__DIR__) . "/creds/google-credentials.json");

// Google Sheets ranges for different data types
define("SHEETS_RESP_RANGE", "Responses!A:S");  // Response data sheet
define("SHEETS_EVENTS_RANGE", "Events!A:F");   // Events sheet

// Global variable to hold the access token
$gsheets_access_token = null;
$gsheets_token_expires_at = 0;

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
		
		$response = curl_exec($ch);
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
		
		$response = curl_exec($ch);
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
		
		$response = curl_exec($ch);
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

?>
