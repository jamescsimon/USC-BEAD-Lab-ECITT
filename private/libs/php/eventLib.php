<?php
	include_once "lib.php";
	include_once "sockLib.php";
	
	
	function initEventSource() {
		//initTouchTasks();
		
		global $socketPath, $socketQueuePath, $sock, $eventStreamFp, $role, $pairingCode, $socketAlive, $connected, $serverRunning, $reconnecting;
		$socketAlive = true;
		$connected = true;
		$reconnecting = false;
		$saidGoodbye = false;
		
		set_error_handler("errorHandler");
		$role=getParam("role", "unknown");
		$pairingCode=getParam("pc", "----");
		
		//logMsg("initEventSource $role $pairingCode, entry");
		
		sendEventStreamHeaders();
		echoEvent("hello", $role);
		// Force immediate flush to ensure "hello" event is sent before entering event loop
		if (ob_get_level()) {
			ob_end_flush();
		}
		flush();
		
		$socketPath = genSocketPath($role, $pairingCode);
		$socketURL = genSocketURL($role, $pairingCode);
		$socketQueuePath = genSocketLogPath($role, $pairingCode, "que");
		
		// On Windows, Unix sockets typically don't work, so go straight to queue polling
		// This avoids the delay and potential errors from trying Unix sockets first
		if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
			logMsg("Windows detected: using queue file polling for EventSource");
			eventLoopQueuePoll();
		}
		else {
			try {
				unlinkIfExists($socketPath);
				$sock = initSocketServer($socketURL);
				if (file_exists($socketPath)) {
					register_shutdown_function("finalizeEventSource");
					eventLoop();
				}
				else {
					logMsg("eventLoop $role $pairingCode, no sock file, socketPath: $socketPath");
					// Fallback to queue file polling if Unix sockets don't work
					eventLoopQueuePoll();
				}
			} catch (Exception $e) {
				logMsg("eventLoop $role $pairingCode, exception:".$e->getMessage());
				// Windows workaround: If Unix sockets fail, poll queue files instead
				if (strpos($e->getMessage(), "unix") !== false || strpos($e->getMessage(), "socket transport") !== false) {
					logMsg("Unix sockets failed, falling back to queue file polling");
					eventLoopQueuePoll();
				}
			}
		}
		//logMsg("initEventSource $role $pairingCode, exit");
	}
	
	function eventLoop() {
		
		global $socketPath, $socketQueuePath, $sock, $eventStreamFp, $role, $pairingCode, $socketAlive, $connected, $serverRunning, $reconnecting;
		
		//logMsg("eventLoop $role $pairingCode, entry");
		try {
			$socketAlive = true;
			$serverRunning = (getServerState() == "running");
			while ($socketAlive && $connected && $serverRunning) {
				if (file_exists($socketPath)) {
					$acceptTimeout = 5;
					$eventStreamFp = acceptConn($sock, $acceptTimeout);
					if (is_resource($eventStreamFp)) {
						if (file_exists($socketQueuePath)) {
							logMsg("eventLoop $role $pairingCode, flushing event queue");
							$events = file($socketQueuePath);
							unlink($socketQueuePath);
						}
						else {
							$events = array();
						}
						while (!feof($eventStreamFp)) {
							$events[] = receiveFromSocket($eventStreamFp);
						}
						foreach ($events as $str) {
							if ($str) {
								logMsg("eventLoop $role $pairingCode, event: $str");
								if (preg_match("/(.*);(.*)/", $str, $matches)) {
									$type=$matches[1];
									$data=$matches[2];
									switch ($type) {
										case "goodbye":
											$connected = false;
											break;
										default:
											echoEvent($type, $data);
											break;
									}
								}
								else {
									logMsg("eventLoop $role $pairingCode, ignored [$str]");
								}
							}
						}
					}
				}
				else {
					logMsg("eventLoop $role $pairingCode, no file, socketPath: $socketPath");
					//if (!$reconnecting) {
						$socketAlive = false;
					//}
					//else {
					//	logMsg("eventLoop $role $pairingCode, reconnecting");
					//}
				}
				$serverRunning=(getServerState() == "running");
			}
			if (!$serverRunning) {
				logMsg("eventLoop $role $pairingCode, not running");
				echoEvent("goodbye", $role);
			}
			elseif (!$connected) {
				logMsg("eventLoop $role $pairingCode, not conneted");
			}
			elseif (!$socketAlive) {
				logMsg("eventLoop $role $pairingCode, not alive");
				echoEvent("timeout", $role);
				//echoEvent("goodbye", $role);
			}
		} catch (Exception $e) {
			logMsg("eventLoop $role $pairingCode, exception:".$e->getMessage());
		}
		//logMsg("eventLoop $role $pairingCode, exit");
	}
	
	// Windows workaround: Poll queue files when Unix sockets don't work
	function eventLoopQueuePoll() {
		global $socketQueuePath, $role, $pairingCode, $connected, $serverRunning;
		
		logMsg("eventLoopQueuePoll $role $pairingCode, starting queue file polling");
		$serverRunning = (getServerState() == "running");
		$timeout = 3600; // 1 hour timeout
		$startTime = time();
		$lastEventTime = time();
		
		// Send initial ping immediately to ensure connection is alive
		// This helps browsers that might not have received the "hello" event
		echoEvent("ping", $role);
		$lastEventTime = time();
		
		// Ensure all buffered output is sent before entering loop
		if (ob_get_level()) {
			ob_end_flush();
		}
		flush();
		
		// Note: PHP dev server is single-threaded and will block other requests
		// For production, use Apache/Nginx with PHP-FPM which supports concurrent requests
		// For now, we'll use longer sleep intervals to reduce CPU usage
		
		while ($connected && $serverRunning && (time() - $startTime) < $timeout) {
			// Check for queued events
			if (file_exists($socketQueuePath)) {
				$events = file($socketQueuePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
				if (!empty($events)) {
					logMsg("eventLoopQueuePoll $role $pairingCode, flushing event queue (".count($events)." events)");
					foreach ($events as $str) {
						if ($str) {
							logMsg("eventLoopQueuePoll $role $pairingCode, event: $str");
							if (preg_match("/(.*);(.*)/", $str, $matches)) {
								$type = $matches[1];
								$data = $matches[2];
								switch ($type) {
									case "goodbye":
										$connected = false;
										echoEvent("goodbye", $role);
										break;
									default:
										echoEvent($type, $data);
										break;
								}
							}
						}
					}
					// Clear queue after processing
					unlink($socketQueuePath);
					$lastEventTime = time();
				}
			}
			
			// Check server state
			$serverRunning = (getServerState() == "running");
			
			// Flush output to ensure EventSource data is sent immediately
			if (ob_get_level()) {
				ob_end_flush();
			}
			flush();
			
			// Check if client disconnected
			if (function_exists('fastcgi_finish_request')) {
				// With fastcgi_finish_request, connection_aborted() works
				if (connection_aborted()) {
					logMsg("eventLoopQueuePoll: Client disconnected");
					$connected = false;
					break;
				}
			}
			
			// Delay to avoid busy waiting - longer delay allows server to process other requests
			// PHP dev server is single-threaded, so we need to yield frequently
			usleep(1000000); // 1 second - gives server time to process other requests between polls
			
			// Send periodic ping to keep connection alive
			if ((time() - $lastEventTime) > 30) {
				echoEvent("ping", $role);
				flush();
				$lastEventTime = time();
			}
		}
		
		if (!$serverRunning) {
			logMsg("eventLoopQueuePoll $role $pairingCode, not running");
			echoEvent("goodbye", $role);
		}
		elseif (!$connected) {
			logMsg("eventLoopQueuePoll $role $pairingCode, not connected");
		}
		else {
			logMsg("eventLoopQueuePoll $role $pairingCode, timeout");
			echoEvent("timeout", $role);
		}
	}
	
	function finalizeEventSource() {
		
		global $sock, $role, $pairingCode, $socketAlive, $connected, $serverRunning, $reconnecting;
		
		//if ($serverRunning && $connected && $socketAlive) {
		//	$reconnecting = true;
		//}

		//logMsg("finalizeEventSource $role $pairingCode, entry");
		
		set_error_handler("errorHandler");
		try {
			unlinkIfExists(genSocketPath($role, $pairingCode));
			unlinkIfExists(genSocketLogPath($role, $pairingCode, "que"));
			if (is_resource($sock)) {
				shutdownSocket($sock);
			}
			//else {
			//	logMsg("finalizeEventSource $role $pairingCode, not resource, sock: $sock");
			//}
		} catch (Exception $e) {
			logMsg("finalizeEventSource $role $pairingCode, exception:".$e->getMessage());
		}
		//if ($serverRunning && $connected && $socketAlive) {
		//	echoEvent("timeout", $role);
		//}
		//logMsg("finalizeEventSource $role $pairingCode, exit");
	}
	
	function abortConn() {
		//initTouchTasks();
		set_error_handler("errorHandler");
		$pairingCode=getParam("pc");
		if (preg_match("/[a-z]+/", $pairingCode)) {
			unlinkIfExists(genSocketPath("resp", $pairingCode));
			unlinkIfExists(genSocketPath("cntr", $pairingCode));
			logMsg("aborted connection, pairingCode: $pairingCode");
			sendStatusDoc("ok", "connection aborted, pairingCode: $pairingCode");
		}
		else {
			logMsg("illegal pairingCode: $pairingCode");
		}
	}
	
	function sendEvent($returnStatus = true) {
		//initTouchTasks();
		set_error_handler("errorHandler");
		$target=getParam("target");
		$pairingCode=getParam("pc");
		$appVersion=getParam("av");
		$type = getParam("type");
		$data = getParam("data", "");
		if (($target == "cntr" || $target=="resp") && preg_match("/[a-z]+/", $pairingCode) && $type) {
			$url=genSocketURL($target, $pairingCode);
			try {
				$fp = initSocketClient($url);
				sendToSocket($fp, "$type;$data");
				$status = "ok";
				$msg="sendEvent forwarded [$appVersion] [$target] [$pairingCode] [$type] [$data]";
				file_put_contents(genSocketLogPath($target, $pairingCode, "log"), "$type;$data\n", FILE_APPEND);
			} catch (Exception $e) {
				$status="warn";
				$msg="sendEvent [$appVersion] [$target] [$pairingCode] [$type] [$data] [exception: ".$e->getMessage()."]";
				file_put_contents(genSocketLogPath($target, $pairingCode, "err"), "$type;$data\n", FILE_APPEND);
				file_put_contents(genSocketLogPath($target, $pairingCode, "que"), "$type;$data\n", FILE_APPEND);
			}
		}
		else {
			$status="warn";
			$msg="sendEvent ignored [$appVersion] [$target] [$pairingCode] [$type] [$data]";
		}
		logMsg($msg);
		if ($returnStatus) {
			sendStatusDoc($status, $msg);
		}
	}
	
	function sendEventStreamHeaders() {
		// Ensure output buffering is disabled for EventSource
		if (ob_get_level()) {
			ob_end_clean();
		}
		header("Content-Type: text/event-stream");
		header("Cache-Control: no-cache");
		header("Connection: keep-alive");
		flush();
	}
	
	function echoEvent($type, $data) {
		logMsg("echoEvent type: $type, data: [$data]");
		echo "event: $type\n";
		echo "data: $data\n";
		echo "\n";
		// Ensure output is flushed immediately - critical for EventSource
		if (ob_get_level()) {
			ob_end_flush();
		}
		flush();
	}
	?>
