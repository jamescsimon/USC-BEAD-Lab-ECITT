<?php
	include_once "lib.php";
	include_once "dbLib.php";

	function getInfo() {
		//initTouchTasks();
		//$passwords = array("henrik"=>"1428", "hd1"=>"1428", "karla"=>"3030", "alex"=>"7001", "apple"=>"1234", "carina"=>"0557");
		//$privileges = array("henrik"=>"dev", "hd1"=>"adm", "karla"=>"user", "alex"=>"user", "apple"=>"demo", "carina"=>"user");
		$av=getParam("av");
		$sender=getParam("sender");
		$pc=getParam("pc");
		$type=getParam("type");
		$data=getParam("data", "");
		logMsg("[$av] [$sender] [$pc] [$type] [$data]");
		header("Content-type: text/xml; charset=UTF-8");
		switch ($type) {
/*
			case "parts":
				$doc = genPartsDoc($data);
				echo $doc->saveXML();
				break;
			case "testSets":
				$doc = genTestSetsDoc($data);
				echo $doc->saveXML();
				break;
			case "perms":
				$path=XML_ROOT."/perms.xml";
				if (file_exists($path))
					readfile($path);
				break;
*/
			case "uaInfo":
				$platform=getUAPlatform();
				$browser=getUABrowserName();
				echo "<uaInfo platform='$platform' browser='$browser'/>\n";
				break;
			case "serverState":
				$state=getServerState();
				echo "<serverState state='$state'/>\n";
				break;
				/*
			case "auth":
				$username=getParam("username");
				$password=getParam("password");
				if ($passwords[$username] == $password) {
					$privilege = $privileges[$username];
				}
				else {
					$privilege = "none";
				}
				logMsg("auth [$username] [$password] [$privilege]");
				echo "<auth priv='$privilege'/>\n";
				break;
				*/
			case "pairingCode":
				$code=sprintf("%04d", rand(0,8999));
				while (file_exists(genSocketPath("resp", $code)) || file_exists(genSocketPath("cntr", $code))) {
					$code=sprintf("%04d", rand(0,8999));
				}
				echo "<pairingCode code='$code' appVersion='".getAppVersion()."'/>\n";
				break;
			case "appVersion":
				echo "<appVersion appVersion='".getAppVersion()."'/>\n";
				break;
			case "connection":
				getConnectionInfo($pc, $sender, $inputState, $outputState);
				echo "<connection inputState='$inputState' outputState='$outputState' appVersion='".getAppVersion()."'/>\n";
				break;
			case "responses":
				$path=DATA_ROOT."/".APP_SUITE_NAME."/responses.xml";
				if (file_exists($path))
					readfile($path);
				break;
			case "anims":
				$path=XML_ROOT."/anims.xml";
				if (file_exists($path))
					readfile($path);
				break;
			case "configs":
				$path=XML_ROOT."/configs.xml";
				if (file_exists($path))
					readfile($path);
				break;
			case "projects":
				$path=XML_ROOT."/projects.xml";
				if (file_exists($path))
					readfile($path);
				break;
			case "locs":
				$path=XML_ROOT."/locs.xml";
				if (file_exists($path))
					readfile($path);
				break;
			case "images":
				echo "<images>\n";
				$paths=glob("../graphics/frames/*.png");
				foreach ($paths as $path) {
					echo "<image coll='frames' name='".basename($path, ".png")."'/>\n";
				}
				$paths=glob("../graphics/buttons/*.png");
				foreach ($paths as $path) {
					echo "<image coll='buttons' name='".basename($path, ".png")."'/>\n";
				}
				$paths=glob("../graphics/sprites/*.png");
				foreach ($paths as $path) {
					echo "<image coll='sprites' name='".basename($path, ".png")."'/>\n";
				}
				$paths=glob("../graphics/images/*.png");
				foreach ($paths as $path) {
					echo "<image coll='images' name='".basename($path, ".png")."'/>\n";
				}
				echo "</images>\n";
				break;
			case "sounds":
				echo "<sounds>\n";
				$paths=glob("../audio/*.mp3");
				foreach ($paths as $path) {
					echo "<sound name='".basename($path, ".mp3")."'/>\n";
				}
				$paths=glob("../audio/nirs/*.mp3");
				foreach ($paths as $path) {
					echo "<sound name='nirs/".basename($path, ".mp3")."'/>\n";
				}
				echo "</sounds>";
				break;
			default:
				echo "<error msg='ignored type:[$type] data:[$data]'/>";
		}
	}
	?>
