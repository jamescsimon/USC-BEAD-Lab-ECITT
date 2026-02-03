<?php
	include_once "lib.php";

	function serverCtr() {
		//initTouchTasks();
		$type=getParam("type");
		$data=getParam("data", "");
		header("Content-type: text/plain; charset=UTF-8");
		try {
			switch ($type) {
				case "listLogFiles":
					$paths=glob(DATA_ROOT."/".APP_SUITE_NAME."/*.log");
					foreach ($paths as $path) {
						echo "$path\n";
					}
					$paths=glob(PUBLIC_HTML."/".APP_SUITE_NAME."/*/error_log");
					foreach ($paths as $path) {
						echo "$path\n";
					}
					break;
				case "listSockFiles":
					$paths=glob(SOCKET_ROOT."/*.sock");
					foreach ($paths as $path) {
						echo "$path\n";
					}
					break;
				case "showErrorLog":
					$path=PUBLIC_HTML."/".APP_SUITE_NAME."/$data/error_log";
					if (file_exists($path))
						readfile($path, FILE_IGNORE_NEW_LINES+FILE_SKIP_EMPTY_LINES);
					break;
				case "deleteSockFiles":
					$paths=glob(SOCKET_ROOT."/*.sock");
					foreach ($paths as $path) {
						unlink($path);
						echo "$path\n";
					}
					break;
				case "deleteLogFiles":
					$paths=glob(DATA_ROOT."/".APP_SUITE_NAME."/*.log");
					foreach ($paths as $path) {
						unlink($path);
						echo "Unlinked $path\n";
					}
					$paths=glob(PUBLIC_HTML."/".APP_SUITE_NAME."/*/error_log");
					foreach ($paths as $path) {
						unlink($path);
						echo "Unlinked $path\n";
					}
					break;
				case "deleteResponses":
					$path=RESPONSES_FILEPATH;
					if (file_exists($path)) {
						unlink($path);
						echo "Unlinked $path\n";
					}
					break;
				default:
					echo "serverCtr ignored type:[$type] data:[$data]\n";
					break;
			}
		} catch (Exception $e) {
			logMsg("serverCtr [$target] [$pairingCode] exception ".$e->getMessage());
			$receipts[]=array("status"=>"error", "msg"=>"Communication failure");
		}
	}
