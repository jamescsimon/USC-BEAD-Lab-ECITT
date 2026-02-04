<?php
	include $_SERVER["DOCUMENT_ROOT"]."/boot.php";
	include_once(LIB_ROOT."/lib.php");
	include_once(LIB_ROOT."/eventLib.php");
	initTouchTasks();
	
	// Get events for the responder by polling queue file
	$role = getParam("role", "unknown");
	$pairingCode = getParam("pc", "----");
	
	$events = array();
	$socketQueuePath = genSocketLogPath($role, $pairingCode, "que");
	
	if (file_exists($socketQueuePath)) {
		$queueContents = file_get_contents($socketQueuePath);
		if ($queueContents) {
			$events = explode("\n", trim($queueContents));
			// Clear the queue after reading
			unlink($socketQueuePath);
		}
	}
	
	// Return events as XML
	header("Content-Type: text/xml");
	echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
	echo "<events>\n";
	
	foreach ($events as $eventStr) {
		if ($eventStr && preg_match("/(.*);(.*)/", $eventStr, $matches)) {
			$type = $matches[1];
			$data = $matches[2];
			echo "\t<event type=\"" . htmlspecialchars($type) . "\" data=\"" . htmlspecialchars($data) . "\"/>\n";
		}
	}
	
	echo "</events>\n";
