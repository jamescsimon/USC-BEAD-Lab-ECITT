<?php
	include $_SERVER["DOCUMENT_ROOT"]."/boot.php";
	include_once(LIB_ROOT."/lib.php");
	include_once(LIB_ROOT."/eventLib.php");
	
	// Clear the event queue for a given pairing code
	$pairingCode = getParam("pc", "");
	
	if ($pairingCode) {
		// Clear responder queue
		$respQueuePath = genSocketLogPath("resp", $pairingCode, "que");
		if (file_exists($respQueuePath)) {
			unlink($respQueuePath);
			logMsg("Cleared responder queue for pairing code: $pairingCode");
		}
		
		// Clear controller queue  
		$cntrQueuePath = genSocketLogPath("cntr", $pairingCode, "que");
		if (file_exists($cntrQueuePath)) {
			unlink($cntrQueuePath);
			logMsg("Cleared controller queue for pairing code: $pairingCode");
		}
		
		echo '<?xml version="1.0" encoding="UTF-8"?>';
		echo '<ok/>';
	} else {
		echo '<?xml version="1.0" encoding="UTF-8"?>';
		echo '<error>No pairing code provided</error>';
	}
?>
