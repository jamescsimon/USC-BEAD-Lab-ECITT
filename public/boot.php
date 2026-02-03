<?php

// Update this path to point to your private directory
// For Windows, use forward slashes or double backslashes
// Example: "D:/coding/BEAD Lab/Work/1-14/codebases/ECITT_Web_App/private"
// Or use a relative path from the public directory
define("PRIVATE_ROOT", dirname(__DIR__) . "/private");
define("LIB_ROOT", PRIVATE_ROOT."/libs/php");
define("XSL_ROOT", PRIVATE_ROOT."/libs/xsl");
define("XML_ROOT", PRIVATE_ROOT."/libs/xml");
define("DATA_ROOT", PRIVATE_ROOT."/data");
define("LOG_ROOT", PRIVATE_ROOT."/logs");
define("SOCKET_ROOT", PRIVATE_ROOT."/sockets");
define("APP_NAME", basename(dirname($_SERVER["SCRIPT_FILENAME"])));

// Google Sheets configuration
// Set USE_GOOGLE_SHEETS=1 to use Google Sheets API instead of MySQL
// When enabled, app will only log to Google Sheets and not require MySQL
define("USE_GOOGLE_SHEETS", getenv("USE_GOOGLE_SHEETS") ?: 0);

define("PUBLIC_ROOT", $_SERVER["DOCUMENT_ROOT"]);
