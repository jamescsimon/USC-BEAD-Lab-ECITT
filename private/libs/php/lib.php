<?php
	function initTouchTasks() {
		global $dateTime;
		define("SERVERSTATE_FILEPATH", DATA_ROOT."/serverstate.txt");
		define("APPVERSION_FILEPATH", DATA_ROOT."/appversion.txt");
		define("STRIPPED_UA", preg_replace("/[^a-z]/", "", strtolower($_SERVER["HTTP_USER_AGENT"])));
		error_reporting(E_ALL);
		date_default_timezone_set("UTC");
	}
	
	function getPartner($role) {
		switch ($role) {
			case "resp":
				$partner="cntr";
				break;
			case "cntr":
				$partner="resp";
				break;
			default:
				$partner="unknown";
				break;
		}
		return $partner;
	}
	
	function genSocketURL($role, $pairingCode) {
		return "unix://".SOCKET_ROOT."/$role"."_".$pairingCode.".sock";
	}
	
	function genSocketPath($role, $pairingCode) {
		return SOCKET_ROOT."/$role"."_".$pairingCode.".sock";
	}
	
	function genSocketLogPath($role, $pairingCode, $suffix) {
		return SOCKET_ROOT."/$role"."_".$pairingCode."_".$suffix.".txt";
	}
	
	function getAppDirs() {
		return array("adm", "anim", "controller", "eventsource", "getinfo", "responder", "results", "sendevent", "respdel", "resplist", "resprec", "resprest");
	}
	
	function unlinkIfExists($filePath, &$receipts=null) {
		//logMsg($filePath);
		if (file_exists($filePath)) {
			unlink($filePath);
			//logMsg("unlinked: $filePath");
			if (is_array($receipts)) {
				$receipts[]=array("status"=>"ok", "msg"=>"unlinked $filePath");
			}
		}
		else {
			//logMsg("not found: $filePath");
		}
	}
	
	function addLineIfExists($filePath, &$lines) {
		if (file_exists($filePath))
			$lines[]=$filePath;
	}
	
	function getLogFilePath($appName) {
		return LOG_ROOT."/$appName.log";
	}
	
	function logMsg($msg, $addTime=true) {
		if ($addTime)
			$msg=curTimeStr()." $msg";
		file_put_contents(getLogFilePath(APP_NAME), "$msg\n", FILE_APPEND);
	}
	
	function getAppVersion() {
		if (file_exists(APPVERSION_FILEPATH)) {
			$appVersion=trim(file_get_contents(APPVERSION_FILEPATH));
		}
		else
			$appVersion="unknown";
		return $appVersion;
	}
	
	function getUAPlatform() {
		if (preg_match("/(android|iphone|ipad|ipod|macintosh|windows)/", STRIPPED_UA, $matches))
			return $matches[1];
		elseif (preg_match("/(ios|macosx|linux|x11)/", STRIPPED_UA, $matches))
		return $matches[1];
		else
			return "unknown";
	}
	
	function getUABrowserName() {
		if (preg_match("/(chrome|firefox|msie|opera|safari)/", STRIPPED_UA, $matches))
			return $matches[1];
		elseif (preg_match("/(applewebkit|trident|gecko)/", STRIPPED_UA, $matches))
		return $matches[1];
		else
			return "unknown";
	}
	
	function getConnectionInfo($pc, $sender, &$inputState, &$outputState) {
		//logMsg("$pc, $sender, &$inputState, &$outputState");
		if (file_exists(genSocketPath($sender, $pc)))
			$inputState="connected";
		else
			$inputState="notConnected";
		if (file_exists(genSocketPath(getPartner($sender), $pc)))
			$outputState="connected";
		else
			$outputState="notConnected";
		
	}
	
	function getServerState() {
		if (file_exists(SERVERSTATE_FILEPATH)) {
			$serverState=trim(file_get_contents(SERVERSTATE_FILEPATH));
		}
		else
			$serverState="unknown";
		//logMsg("getServerState [$serverState]");
		return $serverState;
	}
	
	function errorHandler($errno, $errstr, $errfile, $errline, $errcontext = null) {
		global $pairingCode;
		$errstr=preg_replace("/\s*\[.*\]\s*/", "", $errstr);
		if (!preg_match("/(stream_socket_accept|stream_socket_client)/", $errstr, $matches)) {
			logMsg("errorHandler [$pairingCode] [$errno] [$errstr] [$errfile] [$errline]");
		}
	}
	
	function curTimeStr($inclSep=true) {
		//logMsg("curTimeStr default_timezone:".date_default_timezone_get());
		if ($inclSep)
			return date("y.m.d H:i:s");
		else
			return date("ymdHis");
	}
	
	function getTimeStr($stamp, $exact=true, $inclSep=true) {
		//logMsg("curTimeStr default_timezone:".date_default_timezone_get());
		if ($inclSep)
			if ($exact)
				return gmdate("y.m.d H:i:s", $stamp);
			else
				return gmdate("m.d H:i", $stamp);
			else
				if ($exact)
					return gmdate("ymdHis", $stamp);
				else
					return gmdate("mdHi", $stamp);
	}
	
	function getParam($name, $default=null, $legalValues=null) {
		$value=$default;
		$params=array_merge($_COOKIE, $_POST, $_GET);
		if (isset($params[$name])) {
			$tentativeValue=$params[$name];
			if ($tentativeValue!="" && (!$legalValues || in_array($tentativeValue, $legalValues)))
				$value=$tentativeValue;
		}
		return $value;
	}
	
	function getCSVAttribute($elem, $attrName) {
		$attrValue=$elem->getAttribute($attrName);
		$attrList=explode(",", $attrValue);
		return $attrList;
	}
	
	function sendHtmlDoc($title, $lines) {
		header("Content-type: text/html; charset=UTF-8");
		echo "<!DOCTYPE html>\n";
		echo "<html lang='no'>\n";
		echo "<head>\n";
		echo "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>\n";
		echo "<title>$title</title>\n";
		echo "</head>\n";
		echo "<body>\n";
		echo "<h1>$title</h1>\n";
		foreach ($lines as $line) {
			echo "<p>$line</p>\n";
		}
		echo "</body>\n";
		echo "</html>";
	}
	
	function sendLinesXML($lines) {
		header("Content-type: text/xml; charset=UTF-8");
		echo "<lines>\n";
		foreach ($lines as $line) {
			echo "<line>$line</line>\n";
		}
		echo "</lines>\n";
	}
	
	function sendStatusDoc($code, $msg) {
		logMsg("sendStatusDoc [$code] [$msg]");
		header("Content-type: text/xml; charset=UTF-8");
		echo "<status code='$code' appVersion='".getAppVersion()."' msg='$msg'/>";
	}
	
	function genHtml($sourceDocName, $styleSheetName=null, $params=array(), $sourceDoc=null) {
		if (!$styleSheetName)
			$styleSheetName=$sourceDocName;
		$XSLProc=new XSLTProcessor();
		foreach ($params as $name=>$value) {
			$XSLProc->setParameter("", $name, $value);
		}
		if (!$sourceDoc) {
			$sourceDoc=new DOMDocument();
			$sourceDoc->load(XML_ROOT."/$sourceDocName.xml");
		}
		$XSLProc->setParameter("", "appVersion", getAppVersion());
		$XSLFrameDoc=new DOMDocument();
		$XSLFrameDoc->load(XSL_ROOT."/$styleSheetName.xsl");
		$XSLProc->importStyleSheet($XSLFrameDoc);
		$resDoc=$XSLProc->transformToDoc($sourceDoc);
		header("Cache-Control: max-age=0, no-cache, no-store");
		header("Content-type: text/html; charset=UTF-8");
		echo "<!DOCTYPE html>\n";
		echo $resDoc->saveHTML();
	}
