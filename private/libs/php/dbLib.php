<?php

include_once "lib.php";
include_once "eventLib.php";
include_once "domlib.php";

$permTable = "perm";
$userTable = "user";
$partTable = "part";
$respTable = "resp";
$projectTable = "project";
$testSetTable = "testSet";
$testSpecTable = "testSpec";

function initDbLib() {
	//initTouchTasks();
	
	global $db, $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	
	// Ensure $db is null before creating new connection
	if (isset($db) && $db instanceof mysqli) {
		logMsg("initDbLib: Closing existing connection before creating new one");
		@$db->close();
		$db = null;
	}
		
	$permTable = "ecitt_perm";
	$userTable = "ecitt_user";
	$partTable = "ecitt_part";
	$respTable = "ecitt_resp";
	$projectTable = "ecitt_project";
	$testSetTable = "ecitt_testSet";
	$testSpecTable = "ecitt_testSpec";
	
	global $testTrialTypeCond;
	global $blockedTrialTypes;
	global $blockedTestTrialTypes;
	global $baselineTrialTypes;
	global $tz;
	$tzName = getParam("tzName", "UTC");
	try {
		$tz = new DateTimeZone($tzName);
		if (!$tz) {
			$tz = new DateTimeZone("UTC");
		}
	} catch(Exception $e) {
		logMsg("NO TIME ZONE, tzName: $tzName, error: ".$e->getMessage());
	}
	$testTrialTypeCond = "trialType = 'tpt' or trialType = 'tpb' or trialType = 'tbt' or trialType = 'tbb' or trialType = 'tpl' or trialType = 'tpr' or trialType = 'test' or trialType = 'anba' or trialType = 'anbb' or trialType = 'app' or trialType = 'rst'";
	$blockedTrialTypes = array("ctl2", "ctr2", "exl2", "exr2", "tbvl", "tbvla", "tbvlb", "tbvr", "tbvra", "tbvrb", "tbvt", "tbvb");
	$blockedTestTrialTypes = array("ctl2", "ctr2", "exl2", "exr2");
	
	logMsg("initDbLib: Connecting to database...");
	// Set connection timeout (in seconds) to prevent indefinite hanging
	// Use ini_set for connection timeout as mysqli options may not work on all systems
	ini_set('default_socket_timeout', 3);
	try {
		$db=new mysqli();
		$db->options(MYSQLI_OPT_CONNECT_TIMEOUT, 3); // 3 second connection timeout
		$db->options(MYSQLI_OPT_READ_TIMEOUT, 3); // 3 second read timeout
		$connected = @$db->real_connect("localhost", "ecitt_user", "We_are_1017!", "ecitt_db", null, null, MYSQLI_CLIENT_FOUND_ROWS);
		
		if (!$connected || $db->connect_error) {
			$errorMsg = "Database connection failed: " . ($db->connect_error ?: "Unknown error");
			logMsg("initDbLib ERROR: " . $errorMsg);
			// Don't output here - let dbOpXml handle it
			throw new Exception($errorMsg);
		}
	} catch (Exception $e) {
		logMsg("initDbLib EXCEPTION during connection: " . $e->getMessage());
		if (isset($db) && $db instanceof mysqli) {
			@$db->close();
			$db = null;
		}
		throw $e;
	} catch (Error $e) {
		logMsg("initDbLib FATAL ERROR during connection: " . $e->getMessage());
		if (isset($db) && $db instanceof mysqli) {
			@$db->close();
			$db = null;
		}
		throw new Exception("Database connection error: " . $e->getMessage());
	}
	
	logMsg("initDbLib: Database connected successfully");
	$db->set_charset("utf8mb4");
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	// Set query timeout to prevent indefinite hanging (5 seconds)
	$db->query("SET SESSION max_execution_time = 5000");
	$db->query("SET SESSION wait_timeout = 5");
}

function trialNameAbbr($trialName) {
	switch ($trialName) {
		case "ctl2":
		case "ctr2":
			return "ct";
		case "exl2":
		case "exr2":
			return "ex";
		case "tbvl":
		case "tbvla":
		case "tbvlb":
		case "tbvr":
		case "tbvra":
		case "tbvrb":
		case "tbvt":
		case "tbvb":
			return "bv";
		default:
			return $trialName;
	}
}

function queryDb() {
	global $db, $queryAppDoc, $queryTextElem, $queryResElem;
	try {
		initDbLib();
		initQueryAppDoc();
		$queryText=stripcslashes(getParam("queryText", ""));
		$queryTextElem->appendChild($queryAppDoc->createTextNode($queryText));
		$i = 0;
		if ($queryText) {
			if ($db->multi_query($queryText)) {
				do {
					$i += 1;
					//appendResLine("Result $i:");
					$res = $db->store_result();
					$resType=gettype($res);
					switch ($resType) {
						case ("boolean"):
							appendResLine("Affected Rows:".$db->affected_rows);
							break;
						case ("object"):
							$resClass=get_class($res);
							if ($resClass=="mysqli_result") {
								do {
									$row=$res->fetch_array(MYSQLI_NUM);
									if ($row)
										appendResLine(implode(", ", $row));
								} while ($row);
							}
							break;
					}
					if ($db->more_results()) {
						$db->next_result();
					}
					else {
						break;
					}
				} while (true);
			}
			else {
				appendResLine("No result");
			}
		}
		else {
			appendResLine("No query");
		}
	} catch (Exception $e) {
		appendResLine($e->getMessage());
	}
	genHtml("respQuery", null, array("deviceType"=>"desktop"), $queryAppDoc);
}

function initQueryAppDoc() {
	global $queryAppDoc, $queryTextElem, $queryResElem;
	$queryAppDoc=new DOMDocument("1.0", "utf-8");
	$ecittAppElem=$queryAppDoc->createElement("ecittApp");
	setAttributes($ecittAppElem, array("app"=>"respQuery", "appName"=>"Resp Query", "appNameShort"=>"RspQ", "base"=>"../"));
	$queryAppDoc->appendChild($ecittAppElem);
	$respQueryElem=$queryAppDoc->createElement("respQuery");
	$ecittAppElem->appendChild($respQueryElem);
	$queryTextElem=$queryAppDoc->createElement("queryText");
	$respQueryElem->appendChild($queryTextElem);
	$queryResElem=$queryAppDoc->createElement("queryRes");
	$respQueryElem->appendChild($queryResElem);
}

function appendResLine($resLine) {
	global $db, $queryAppDoc, $queryResElem;
	$lineElem=$queryAppDoc->createElement("line");
	$lineElem->appendChild($queryAppDoc->createTextNode($resLine));
	$queryResElem->appendChild($lineElem);
}

function dbOpCsv() {
	global $db;
	$type=getParam("type", "");
	$data=getParam("data", "");
	//$tzOffset = getParam("tzOffset", 0);
	//$tzName = getParam("tzName", "UTC");
	initDbLib();
	logMsg("dbOpCsv, type: ".$type);
	switch ($type) {
		case "summarySelect":
			summarySelect($db, $data, $docName, $doc);
			break;
		case "accuracySelect":
			accuracySelect($db, $data, $docName, $doc);
			break;
		case "respSelect":
			respSelect($db, $data, $docName, $doc);
			break;
		case "ntsMarkersSelect":
			ntsMarkersSelect($db, $data, $docName, $doc);
			break;
		case "trialBlocksSelect":
			trialBlocksSelect($db, $data, $docName, $doc);
			break;
	}
	$length = strlen($doc);
	header("Content-Description: File Transfer");
	header("Content-Type: application/csv; charset=UTF-8") ;
	header("Content-Disposition: attachment; filename=".$docName.".csv");
	echo $doc;
}

function genInnerResultQuery($selectClauses) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	global $testTrialTypeCond;
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	return "select trialStartTime, ref, @testDate:=from_unixtime(trialStartTime/1000), @testYear:=extract(year from @testDate) as year, @testMonth:=extract(month from @testDate) as month, extract(day from @testDate) as day, partNo, testName, trialType, trialVariant, accuracy, dotPressed, reactionTime, ((@testYear - birthYear) * 12 + @testMonth - birthMonth) as age, gender from $respTable, $partTable where partNo = $partTable.no".$selectClauses." and ($testTrialTypeCond) and trialStartTime > 0";
}

function ntsMarkersSelect($db, $data, &$docName, &$doc) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectName = $rawValues[$i++];
	$testSetName = $rawValues[$i++];
	$partName = $rawValues[$i++];
	$testName = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$partNo = $rawValues[$i++];
	$testNo = $rawValues[$i++];
	$docNamePrefix = genRespDocNamePrefix($projectName, $testSetName, $partName, $testName);
	$docName = $docNamePrefix."_ntsMarkers";
	$selectClauses = genRespSelectClauses($testSetNo, $partNo, $testName);
	$header = array("timeZone", "date", "time", "mSecsUTC", "marker");
	$rows = array();
	$innerQuery = "select trialStartTime, ref, @testDate:=from_unixtime(trialStartTime/1000), @testYear:=extract(year from @testDate) as year, @testMonth:=extract(month from @testDate) as month, extract(day from @testDate) as day, extract(hour from @testDate) as hour, extract(minute from @testDate) as minute, extract(second from @testDate) as second, trialStartTime%1000 as msecs, partNo, testName, trialNo, trialType, trialVariant, accuracy, dotPressed, reactionTime, trialTime, ((@testYear - birthYear) * 12 + @testMonth - birthMonth) as age, animationShown from $respTable, $partTable where partNo = $partTable.no".$selectClauses." and trialStartTime > 0";
	$query = "select trialStartTime, year, month, day, hour, minute, second, msecs, partNo, ref, age, trialNo, testName, trialType, trialVariant, accuracy, dotPressed, reactionTime, trialTime, animationShown from ($innerQuery) as resp order by trialStartTime";
	$doc = implode(",", $header)."\n";
	try {
		$prevRow = NULL;
		$result = $db->query($query);
		$row = $result->fetch_assoc();
		while ($row) {
			addNtsMarkerRow($row, $prevRow, $doc);
			$prevRow = $row;
			$row = $result->fetch_assoc();
		}
		addNtsMarkerRow(NULL, $prevRow, $doc);
	} catch (Exception $e) {
		logMsg($e->getMessage());
	}
}

function trialBlocksSelect($db, $data, &$docName, &$doc) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectName = $rawValues[$i++];
	$testSetName = $rawValues[$i++];
	$partName = $rawValues[$i++];
	$testName = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$partNo = $rawValues[$i++];
	$testNo = $rawValues[$i++];
	$docNamePrefix = genRespDocNamePrefix($projectName, $testSetName, $partName, $testName);
	$docName = $docNamePrefix."_trialBlocks";
	$selectClauses = genRespSelectClauses($testSetNo, $partNo, $testName);
	$header = array("tester", "testName", "year", "mth", "day", "hour", "min", "sec", "partNo", "partRef", "age", "gender", "trialType", "#trials", "blockTime");
	$rows = array();
	$innerQuery = "select trialStartTime, ref, @testDate:=from_unixtime(trialStartTime/1000), @testYear:=extract(year from @testDate) as year, @testMonth:=extract(month from @testDate) as month, extract(day from @testDate) as day, extract(hour from @testDate) as hour, extract(minute from @testDate) as minute, extract(second from @testDate) as second, partNo, $respTable.userName, testName, trialNo, trialType, trialVariant, accuracy, dotPressed, touchTime, reactionTime, trialTime, ((@testYear - birthYear) * 12 + @testMonth - birthMonth) as age, gender, animationShown from $respTable, $partTable where partNo = $partTable.no".$selectClauses." and trialStartTime > 0";
	$query = "select trialStartTime, trialTime, userName, testName, year, month, day, hour, minute, second, partNo, ref, age, gender, trialNo, trialType from ($innerQuery) as resp order by trialStartTime";
	logMsg($query);
	$doc = implode(",", $header)."\n";
	try {
		$firstRow = NULL;
		$prevRow = NULL;
		$result = $db->query($query);
		$curRow = $result->fetch_assoc();
		while ($curRow) {
			//logMsg("trialBlocksSelect, curRow: [".implode(",", $curRow)."]");
			addTrialBlockRow($firstRow, $prevRow, $curRow, $doc);
			$curRow = $result->fetch_assoc();
		}
		addTrialBlockRow($firstRow, $prevRow, $curRow, $doc);
	} catch (Exception $e) {
		logMsg($e->getMessage());
	}
}


function getDateTimeStrsFromUtcMsStr($tsInt, $tz, &$tzName, &$dateStr, &$timeStr) {
	$unixTs = floor($tsInt / 1000);
	$unixTsStr = "@".$unixTs;
	$mSecs = $tsInt % 1000;
	$mSecsStr = sprintf("%03d", $mSecs);
	$date = new DateTime($unixTsStr);
	$date->setTimeZone($tz);
	$tzName = $date->format("e");
	$dateStr = $date->format("d.m.Y");
	$timeStr = $date->format("H:i:s").".".$mSecsStr;
}

function isBlockedTrial($row) {
	global $blockedTrialTypes;
	$trialType = $row["trialType"];
	return in_array($trialType, $blockedTrialTypes);
}

function isBlockedTestTrial($row) {
	global $blockedTestTrialTypes;
	$trialType = $row["trialType"];
	//logMsg("isBlockedTestTrial, trialType: $trialType, blockedTestTrialTypes: [".implode(",", $blockedTestTrialTypes)."]");
	return in_array($trialType, $blockedTestTrialTypes);
}

/*
 function isBaselineTrial($row) {
 global $baselineTrialTypes;
 $trialType = $row["trialType"];
 return in_array($trialType, $baselineTrialTypes);
 }
 */

function addNtsMarkerRow($row, $prevRow, &$doc) {
	global $tz;
	
	if ($row) {
		$tsStr = $row["trialStartTime"];
		$tsInt = intval($tsStr);
		$dtStr = $row["trialTime"];
		$dtInt = intval($dtStr);
		$endTsInt = $tsInt + $dtInt;
		getDateTimeStrsFromUtcMsStr($tsInt, $tz, $tzName, $dateStr, $timeStr);
		getDateTimeStrsFromUtcMsStr($endTsInt, $tz, $tzName, $endDateStr, $endTimeStr);
	}
	
	if ($prevRow) {
		$prevTsStr = $prevRow["trialStartTime"];
		$prevTsInt = intval($prevTsStr);
		$prevDtStr = $prevRow["trialTime"];
		$prevDtInt = intval($prevDtStr);
		$prevEndTsInt = $prevTsInt + $prevDtInt;
		getDateTimeStrsFromUtcMsStr($prevEndTsInt, $tz, $tzName, $prevEndDateStr, $prevEndTimeStr);
	}
	
	$blockSwitch = true;
	
	if ($row) {
		$trialNo = intval($row["trialNo"]);
	}
	else {
		$blockSwitch = false;
	}
	if ($prevRow) {
		$firstRow = false;
		$prevTrialNo = intval($prevRow["trialNo"]);
		if ($prevRow["testName"] == $row["testName"] && $prevRow["trialType"] == $row["trialType"]) {
			if ($prevTrialNo && $trialNo && $trialNo == $prevTrialNo + 1) {
				$blockSwitch = false;
			}
		}
	}
	else {
		$firstRow = true;
		$blockSwitch = false;
	}
	if (($firstRow || $blockSwitch) && isBlockedTrial($row)) {
		//$blockStartStr = "blockStart_".$row["testName"]."_".$row["trialType"];
		$blockStartStr = "blockStart_".$row["testName"]."_".trialNameAbbr($row["trialType"]);
		$doc .= "$tzName,$dateStr,$timeStr,$tsInt,$blockStartStr\n";
	}
}

function getStartEndTs($row, &$trialNo, &$startTs, &$endTs) {
	if ($row) {
		$trialNoStr = $row["trialNo"];
		$trialNo = intval($trialNoStr);
		$tsStr = $row["trialStartTime"];
		$startTs = intval($tsStr);
		$dtStr = $row["trialTime"];
		$dtInt = intval($dtStr);
		$endTs = $startTs + $dtInt + 1130;
		logMsg("trialNo: $trialNo, startTs: $startTs, dtInt: $dtInt, endTs: $endTs");
	}
}

function succeeds($row1, $row2) {
	$trialNo1 = intval($row1["trialNo"]);
	$trialNo2 = intval($row2["trialNo"]);
	return ($row1["testName"] == $row2["testName"] && $row1["trialType"] == $row2["trialType"] && $trialNo2 == $trialNo1 + 1);
}

//$query = "select trialStartTime, userName, testName, year, month, day, hour, minute, second, partNo, ref, age, gender, trialNo, trialType from ($innerQuery) as resp order by trialStartTime";

function addTrialBlockRowSummary($firstRow, $lastRow, &$doc) {
	$row = $firstRow;
	getStartEndTs($firstRow, $firstTrialNo, $firstStartTs, $firstEndTs);
	getStartEndTs($lastRow, $lastTrialNo, $lastStartTs, $lastEndTs);
	unset($row["trialStartTime"]);
	unset($row["trialTime"]);
	unset($row["trialNo"]);
	$row["noOfTrials"] = $lastTrialNo - $firstTrialNo + 1;
	$row["blockTime"] = $lastEndTs - $firstStartTs;
	$doc .= implode(",", $row)."\n";
}


function addTrialBlockRow(&$firstRow, &$prevRow, $curRow, &$doc) {
	if ($curRow && isBlockedTestTrial($curRow)) {
		logMsg("addTrialBlockRow, firstRow: [".implode(",", $firstRow)."]");
		logMsg("addTrialBlockRow, prevRow: [".implode(",", $prevRow)."]");
		logMsg("addTrialBlockRow, curRow: [".implode(",", $curRow)."]");
		if (!$prevRow) {
			$firstRow = $curRow;
			$prevRow = $curRow;
		}
		else {
			if (succeeds($prevRow, $curRow)) {
				$prevRow = $curRow;
			}
			else {
				addTrialBlockRowSummary($firstRow, $prevRow, $doc);
				$firstRow = $curRow;
				$prevRow = $curRow;
			}
		}
	}
	else {
		if ($firstRow && $prevRow) {
			addTrialBlockRowSummary($firstRow, $prevRow, $doc);
			$firstRow = NULL;
			$prevRow = NULL;
		}
	}
}
 

function respSelect($db, $data, &$docName, &$doc) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	global $testTrialTypeCond;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectName = $rawValues[$i++];
	$testSetName = $rawValues[$i++];
	$partName = $rawValues[$i++];
	$testName = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$partNo = $rawValues[$i++];
	$testNo = $rawValues[$i++];
	$docNamePrefix = genRespDocNamePrefix($projectName, $testSetName, $partName, $testName);
	$docName = $docNamePrefix."_responses";
	$selectClauses = genRespSelectClauses($testSetNo, $partNo, $testName);
	logMsg($docName);
	$header = array("tester", "testName", "year", "mth", "day", "hour", "min", "sec", "partNo", "partRef", "age", "gender", "trialNo", "trialType", "trialVar", "accu", "dotPr", "touchTime", "respTime", "trialTime", "animShown");
	//$rows = array();
	$innerQuery = "select trialStartTime, ref, @testDate:=from_unixtime(trialStartTime/1000), @testYear:=extract(year from @testDate) as year, @testMonth:=extract(month from @testDate) as month, extract(day from @testDate) as day, extract(hour from @testDate) as hour, extract(minute from @testDate) as minute, extract(second from @testDate) as second, partNo, $respTable.userName, testName, trialNo, trialType, trialVariant, accuracy, dotPressed, touchTime, reactionTime, trialTime, ((@testYear - birthYear) * 12 + @testMonth - birthMonth) as age, gender, animationShown from $respTable, $partTable where partNo = $partTable.no".$selectClauses." and trialStartTime > 0";
	$query = "select userName, testName, year, month, day, hour, minute, second, partNo, ref, age, gender, trialNo, trialType, trialVariant, accuracy, dotPressed, touchTime, reactionTime, trialTime, animationShown from ($innerQuery) as resp order by trialStartTime";
	logMsg($query);
	$doc = implode(",", $header)."\n";
	try {
		$result = $db->query($query);
		$row = $result->fetch_assoc();
		while ($row) {
			$doc .= implode(",", $row)."\n";
			$row = $result->fetch_assoc();
		}
	} catch (Exception $e) {
		logMsg($e->getMessage());
	}
}

function genRespSelectClauses($testSetNo, $partNo, $testName) {
	$clauses = "";
	if ($testSetNo != "null") {
		$clauses .= " and testSetNo = $testSetNo";
	}
	if ($partNo != "null") {
		$clauses .= " and partNo = $partNo";
	}
	if ($testName != "null") {
		$clauses .= " and testName = '$testName'";
	}
	return $clauses;
}

function genRespDocNamePrefix($projectName, $testSetName, $partName, $testName) {
	$name = $projectName;
	if ($testSetName != "null") {
		$name .= "_$testSetName";
	}
	if ($partName != "null") {
		$name .= "_$partName";
	}
	if ($testName != "null") {
		$name .= "_$testName";
	}
	return $name;
}

function summarySelect($db, $data, &$docName, &$doc) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	global $testTrialTypeCond;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectName = $rawValues[$i++];
	$testSetName = $rawValues[$i++];
	$partName = $rawValues[$i++];
	$testName = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$partNo = $rawValues[$i++];
	$testNo = $rawValues[$i++];
	$docNamePrefix = genRespDocNamePrefix($projectName, $testSetName, $partName, $testName);
	$docName = $docNamePrefix."_summary";
	$selectClauses = genRespSelectClauses($testSetNo, $partNo, $testName);
	logMsg($docName);
	$header = array("testName", "year", "mth", "day", "partNo", "partRef", "age", "gender", "trialType", "trialVariant", "accuracy", "dotPressed", "respTime");
	$rows = array();
	$innerQuery = "select trialStartTime, ref, @testDate:=from_unixtime(trialStartTime/1000), @testYear:=extract(year from @testDate) as year, @testMonth:=extract(month from @testDate) as month, extract(day from @testDate) as day, partNo, testName, trialType, trialVariant, accuracy, dotPressed, reactionTime, ((@testYear - birthYear) * 12 + @testMonth - birthMonth) as age, gender from $respTable, $partTable where partNo = $partTable.no".$selectClauses." and ($testTrialTypeCond) and trialStartTime > 0";
	$query = "select testName, year, month, day, partNo, ref, age, gender, trialType, trialVariant, accuracy, dotPressed, reactionTime from ($innerQuery) as resp order by partNo, testName, trialType, trialVariant, reactionTime";
	logMsg($query);
	$doc = implode(",", $header)."\n";
	try {
		$result = $db->query($query);
		$row = $result->fetch_assoc();
		while ($row) {
			$doc .= implode(",", $row)."\n";
			$row = $result->fetch_assoc();
		}
	} catch (Exception $e) {
		logMsg($e->getMessage());
	}
}

function accuracySelect($db, $data, &$docName, &$doc) {
	global $testTrialTypeCond;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectName = $rawValues[$i++];
	$testSetName = $rawValues[$i++];
	$partName = $rawValues[$i++];
	$testName = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$partNo = $rawValues[$i++];
	$testNo = $rawValues[$i++];
	$docNamePrefix = genRespDocNamePrefix($projectName, $testSetName, $partName, $testName);
	$docName = $docNamePrefix."_accuracy";
	$selectClauses = genRespSelectClauses($testSetNo, $partNo, $testName);
	$header = array("testName", "year", "mth", "day", "partNo", "partRef", "age", "trialType", "trialVariant", "avgDotPressed", "avgAccuracy", "noOfResps");
	$rows = array();
	$innerQuery = genInnerResultQuery($selectClauses);
	//$innerQuery = "select ref, partNo, testName , trialType, trialVariant, accuracy, dotPressed, @age:=from_unixtime(trialStartTime/1000) - interval birthYear year - interval birthMonth month, extract(year from @age) as ageYears, extract(month from @age) as ageMonths from resp, part where partNo = part.no and testSetNo = $testSetNo and ($testTrialTypeCond)";
	$query = "select testName, year, month, day, partNo, ref, age, trialType, trialVariant, avg(dotPressed), avg(accuracy), count(*) from ($innerQuery) as resp group by partNo, testName, trialType, trialVariant";
	logMsg($query);
	$doc = implode(",", $header)."\n";
	try {
		$result = $db->query($query);
		$row = $result->fetch_assoc();
		while ($row) {
			$doc .= implode(",", $row)."\n";
			$row = $result->fetch_assoc();
		}
	} catch (Exception $e) {
		logMsg($e->getMessage());
	}
}

function dbOpXml() {
	global $db;
	// Reset/close any existing database connection before creating a new one
	if (isset($db) && $db instanceof mysqli) {
		logMsg("dbOpXml: Closing existing database connection");
		@$db->close(); // Suppress errors if connection is already closed
		$db = null;
	}
	// Set headers first before any output
	if (!headers_sent()) {
		header("Content-type: text/xml; charset=UTF-8");
		header("Cache-Control: no-cache, must-revalidate");
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
	}
	logMsg("dbOpXml: ENTRY");
	try {
		logMsg("dbOpXml: About to call initDbLib()");
		initDbLib();
		logMsg("dbOpXml: initDbLib() completed successfully");
	} catch (Exception $e) {
		logMsg("dbOpXml: initDbLib() EXCEPTION - " . $e->getMessage());
		if (!headers_sent()) {
			header("Content-type: text/xml; charset=UTF-8");
		}
		echo '<?xml version="1.0"?><error>' . htmlspecialchars($e->getMessage()) . '</error>';
		error_log("dbOpXml: initDbLib failed - " . $e->getMessage());
		return;
	}
	logMsg("dbOpXml: Getting type and data parameters");
	$type=getParam("type", "");
	$data=getParam("data", "");
	logMsg("dbOpXml: type=[$type], data=[$data]");
	logMsg("$type, data: [$data]");
	logMsg("dbOpXml: About to enter switch statement");
	switch ($type) {
		case "userSelect":
			logMsg("dbOpXml: Entering userSelect case");
			$doc = userSelect($db, $data);
			logMsg("dbOpXml: userSelect completed");
			break;
		case "projectsSelect":
			logMsg("dbOpXml: Entering projectsSelect case");
			$doc = projectsSelect($db, $data);
			logMsg("dbOpXml: projectsSelect completed");
			break;
		case "projectInsert":
			$current = projectInsert($db, $data);
			$doc = projectsSelect($db, $data, $current);
			break;
		case "projectUpdate":
			$current = projectUpdate($db, $data);
			$doc = projectsSelect($db, $data, $current);
			break;
		case "projectDelete":
			projectDelete($db, $data);
			$doc = projectsSelect($db, $data, 0);
			break;
		case "testSetsSelect":
			$doc = testSetsSelect($db, $data);
			break;
		case "testSetInsert":
			$current = testSetInsert($db, $data);
			$doc = testSetsSelect($db, $data, $current);
			break;
		case "testSetUpdate":
			$current = testSetUpdate($db, $data);
			$doc = testSetsSelect($db, $data, $current);
			break;
		case "testSetDelete":
			testSetDelete($db, $data);
			$doc = testSetsSelect($db, $data, 0);
			break;
		case "partsSelect":
			//logMsg("partsSelect, data: [$data]");
			$doc = partsSelect($db, $data);
			break;
		case "partInsert":
			$current = partInsert($db, $data);
			//logMsg("partInsert, data: [$data], current: $current");
			$doc = partsSelect($db, $data, $current);
			break;
		case "partInsert2":
			$current = partInsert2($db, $data);
			//logMsg("partInsert2, data: [$data], current: $current");
			$doc = partsSelect($db, $data, $current);
			break;
		case "partUpdate":
			$current = partUpdate($db, $data);
			//logMsg("partUpdate, data: [$data], current: $current");
			$doc = partsSelect($db, $data, $current);
			break;
		case "partUpdate2":
			$current = partUpdate2($db, $data);
			//logMsg("partUpdate2, data: [$data], current: $current");
			$doc = partsSelect($db, $data, $current);
			break;
		case "partDelete":
			partDelete($db, $data);
			$doc = partsSelect($db, $data, 0);
			break;
		case "testsSelect":
			//logMsg("testsSelect, data: [$data]");
			$doc = testsSelect($db, $data);
			break;
		case "syncPointsSelect":
			//logMsg("partSyncSelect, data: [$data]");
			$doc = syncPointsSelect($db, $data);
			break;
		case "respInsert":
			$id = respInsert($db, $data);
			if ($id != "") {
				$doc = genStatusDoc("ok", "$id");
			}
			else {
				$doc = genStatusDoc("error", "$id");
			}
			break;
		case "trialResult":
			$id = respInsert($db, $data);
			if ($id != "") {
				sendEvent(false);
				$doc = genStatusDoc("ok", "$id");
			}
			else {
				$doc = genStatusDoc("error", "$id");
			}
			break;
		default:
			$msg = "unknown type: $type";
			//logMsg($msg);
			$doc = genStatusDoc("error", $msg);
	}
	// Headers should already be set at start of function
	if (!headers_sent()) {
		header("Content-type: text/xml; charset=UTF-8");
	}
	logMsg("dbOpXml: About to output XML, doc type: " . ($doc ? get_class($doc) : "NULL"));
	if (!$doc) {
		logMsg("dbOpXml: ERROR - doc is NULL!");
		echo '<?xml version="1.0"?><error>Document is null</error>';
		return;
	}
	$xmlOutput = $doc->saveXML();
	logMsg("dbOpXml: XML output length: " . strlen($xmlOutput));
	logMsg("dbOpXml: XML output preview (first 200 chars): " . substr($xmlOutput, 0, 200));
	
	// Ensure no output before XML
	if (ob_get_level()) {
		ob_clean();
	}
	
	// Output XML directly
	echo $xmlOutput;
	logMsg("dbOpXml: XML output sent, flushing");
	
	// Close database connection to free resources before flushing
	if (isset($db) && $db instanceof mysqli) {
		logMsg("dbOpXml: Closing database connection");
		$db->close();
		logMsg("dbOpXml: Database connection closed");
	}
	
	// Ensure all output is sent
	if (ob_get_level()) {
		ob_end_flush();
	}
	flush();
	logMsg("dbOpXml: Flush completed");
}

function userSelect($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$password = $rawValues[$i++];
	$query = "select name, userType, (select permName from $permTable where entityType = 'global' and name = userName) as globalPerm from $userTable where name = '$user' and password = '$password'";
	logMsg($query);
	try {
		$result = $db->query($query);
		$row = $result->fetch_assoc();
		if ($row) {
			return genSingleXmlElemDoc($row, "user");
		}
		else {
			return genSingleXmlElemDoc(array(), "user");
		}
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return genSingleXmlElemDoc(array(), "user");
	}
}

function projectsSelect($db, $data, $current = null) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	if ($current == null) {
		$current = $rawValues[$i++];
	}
	// MySQL 8+ compatible: Include name in GROUP BY or use any_value()
	// Using explicit columns with GROUP BY no, name for strict mode compatibility
	$query = "select $projectTable.no, $projectTable.name, any_value(permName) as perm from $projectTable, $permTable where userName = '$user' and (entityType = 'global' or (entityType = 'project' and (every = 1 or $projectTable.no = entityNo))) group by $projectTable.no, $projectTable.name order by $projectTable.name";
	logMsg($query);
	logMsg("projectsSelect: About to execute query");
	try {
		// Set a query timeout to prevent indefinite hanging
		$db->query("SET SESSION max_execution_time = 5000"); // 5 seconds
		$startTime = microtime(true);
		$result = $db->query($query);
		$elapsed = round((microtime(true) - $startTime) * 1000);
		logMsg("projectsSelect: Query executed in {$elapsed}ms, result=" . ($result ? "SUCCESS" : "FAILED"));
		if (!$result) {
			logMsg("projectsSelect: Query failed - " . $db->error . " (code: " . $db->errno . ")");
			return genMultiXmlElemDocFromDbResult(array(), "project", array("current"=>0));
		}
		logMsg("projectsSelect: Generating XML");
		try {
			$doc = genMultiXmlElemDocFromDbResult($result, "project", array("current"=>$current));
			logMsg("projectsSelect: XML generated successfully");
			// Free the result set
			$result->free();
			logMsg("projectsSelect: Result set freed, returning");
			return $doc;
		} catch (Exception $e) {
			logMsg("projectsSelect: XML generation EXCEPTION - " . $e->getMessage());
			if ($result) {
				$result->free();
			}
			return genMultiXmlElemDocFromDbResult(array(), "project", array("current"=>0));
		} catch (Error $e) {
			logMsg("projectsSelect: XML generation FATAL ERROR - " . $e->getMessage());
			if ($result) {
				$result->free();
			}
			return genMultiXmlElemDocFromDbResult(array(), "project", array("current"=>0));
		}
	} catch (Exception $e) {
		logMsg("projectsSelect: EXCEPTION - " . $e->getMessage());
		return genMultiXmlElemDocFromDbResult(array(), "project", array("current"=>0));
	} catch (Error $e) {
		logMsg("projectsSelect: FATAL ERROR - " . $e->getMessage());
		return genMultiXmlElemDocFromDbResult(array(), "project", array("current"=>0));
	}
}

function projectInsert($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$name = $rawValues[$i++];
	try {
		$db->autocommit(false);
		$query = "select max(no) as no from $projectTable";
		logMsg($query);
		$result = $db->query($query);
		$row = $result->fetch_assoc();
		$newNo = ($row["no"] === null) ? 1 : ($row["no"] + 1);
		$query = "insert into $projectTable values ($newNo, '$name')";
		logMsg($query);
		$result = $db->query($query);
		// Create permission record so the creator can see and manage the project
		$query = "insert into $permTable (userName, entityType, every, entityNo, permName) values ('$user', 'project', 0, $newNo, 'adm')";
		logMsg($query);
		$result = $db->query($query);
		$db->commit();
		return $newNo;
	} catch (Exception $e) {
		logMsg($e->getMessage());
		$db->rollback();
		return 0;
	}
}

function projectUpdate($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$no = $rawValues[$i++];
	$name = $rawValues[$i++];
	try {
		$query = "update $projectTable set name='$name' where no=$no";
		logMsg($query);
		$result = $db->query($query);
		return $no;
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return 0;
	}
}

function projectDelete($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$no = $rawValues[$i++];
	try {
		$query = "delete from $projectTable where no=$no";
		logMsg($query);
		$result = $db->query($query);
	} catch (Exception $e) {
		logMsg($e->getMessage());
	}
}


function testSetsSelect($db, $data, $current = null) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	if ($current == null) {
		$current = $rawValues[$i++];
	}
	$query = "select t.no, t.projectNo, t.name, any_value(perm.permName) as perm from $testSetTable t, $permTable perm where t.projectNo = $projectNo and perm.userName = '$user' and (perm.entityType = 'global' or (perm.entityType = 'project' and (perm.every = 1 or t.projectNo = perm.entityNo) and perm.permName = 'adm') or (perm.entityType = 'testSet' and (perm.every = 1 or t.no = perm.entityNo))) group by t.no, t.projectNo, t.name order by t.name";
	logMsg($query);
	try {
		$result = $db->query($query);
		return genMultiXmlElemDocFromDbResult($result, "testSet", array("current"=>$current));
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return genMultiXmlElemDocFromDbResult(array(), "testSet", array("current"=>0));
	}
}

function testSetInsert($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$name = $rawValues[$i++];
	try {
		$db->autocommit(false);
		$query = "select max(no) as no from $testSetTable";
		logMsg($query);
		$result = $db->query($query);
		$row = $result->fetch_assoc();
		$newNo = ($row["no"] === null) ? 1 : ($row["no"] + 1);
		$query = "insert into $testSetTable values ($newNo, $projectNo, '$name')";
		logMsg($query);
		$result = $db->query($query);
		// Create permission record so the creator can see and manage the testSet
		$query = "insert into $permTable (userName, entityType, every, entityNo, permName) values ('$user', 'testSet', 0, $newNo, 'adm')";
		logMsg($query);
		$result = $db->query($query);
		$db->commit();
		return $newNo;
	} catch (Exception $e) {
		logMsg($e->getMessage());
		$db->rollback();
		return 0;
	}
}

function testSetUpdate($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$no = $rawValues[$i++];
	$name = $rawValues[$i++];
	try {
		$query = "update $testSetTable set name='$name' where no=$no";
		logMsg($query);
		$result = $db->query($query);
		return $no;
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return 0;
	}
}

function testSetDelete($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$no = $rawValues[$i++];
	try {
		$query = "delete from $testSetTable where no=$no";
		logMsg($query);
		$result = $db->query($query);
	} catch (Exception $e) {
		logMsg($e->getMessage());
	}
}


function partsSelect($db, $data, $current = null) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	if ($current == null) {
		$current = $rawValues[$i++];
	}
	$query = "select *, (userName = '$user') as owner from $partTable where projectNo=$projectNo order by ref";
	logMsg($query);
	try {
		$result = $db->query($query);
		return genMultiXmlElemDocFromDbResult($result, "part", array("current"=>$current));
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return genMultiXmlElemDocFromDbResult(array(), "part", array("current"=>0));
	}
}

function partInsert($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$ref = $rawValues[$i++];
	$birthYear = $rawValues[$i++];
	$birthMonth = $rawValues[$i++];
	$gender = $rawValues[$i++];
	try {
		$db->autocommit(false);
		$query = "select max(no) as no from $partTable";
		logMsg($query);
		$result = $db->query($query);
		$row = $result->fetch_assoc();
		$newNo = $row["no"] + 1;
		$query = "insert into $partTable values ('$user', $newNo, $projectNo, '$ref', $birthYear, $birthMonth, 0, '$gender')";
		logMsg($query);
		$result = $db->query($query);
		$db->commit();
		return $newNo;
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return 0;
	}
}

function partInsert2($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$ref = $rawValues[$i++];
	$birthYear = $rawValues[$i++];
	$birthMonth = $rawValues[$i++];
	$birthDay = $rawValues[$i++];
	$gender = $rawValues[$i++];
	try {
		$db->autocommit(false);
		$query = "select max(no) as no from $partTable";
		logMsg($query);
		$result = $db->query($query);
		$row = $result->fetch_assoc();
		$newNo = $row["no"] + 1;
		$query = "insert into $partTable values ('$user', $newNo, $projectNo, '$ref', $birthYear, $birthMonth, $birthDay, '$gender')";
		logMsg($query);
		$result = $db->query($query);
		$db->commit();
		return $newNo;
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return 0;
	}
}

function partUpdate($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$no = $rawValues[$i++];
	$ref = $rawValues[$i++];
	$birthYear = $rawValues[$i++];
	$birthMonth = $rawValues[$i++];
	$gender = $rawValues[$i++];
	try {
		$query = "update $partTable set ref='$ref', birthYear=$birthYear, birthMonth=$birthMonth, gender='$gender' where no=$no";
		logMsg($query);
		$result = $db->query($query);
		return $no;
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return 0;
	}
}

function partUpdate2($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$no = $rawValues[$i++];
	$ref = $rawValues[$i++];
	$birthYear = $rawValues[$i++];
	$birthMonth = $rawValues[$i++];
	$birthDay = $rawValues[$i++];
	$gender = $rawValues[$i++];
	try {
		$query = "update $partTable set ref='$ref', birthYear=$birthYear, birthMonth=$birthMonth, birthDay=$birthDay, gender='$gender' where no=$no";
		logMsg($query);
		$result = $db->query($query);
		return $no;
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return 0;
	}
}

function partDelete($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$no = $rawValues[$i++];
	try {
		$query = "delete from $partTable where no=$no";
		logMsg($query);
		$result = $db->query($query);
	} catch (Exception $e) {
		logMsg($e->getMessage());
	}
}

function testsSelect($db, $data, $current = null) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	if ($current == null) {
		$current = 0;
	}
	$query = "select t.no, t.name, t.specName as value, any_value(perm.permName) as perm from $testSpecTable t, $permTable perm where perm.userName = '$user' and (perm.entityType = 'global' or (perm.entityType = 'test' and (perm.every = 1 or t.no = perm.entityNo))) group by t.no, t.name, t.specName order by t.name";
	logMsg($query);
	try {
		$result = $db->query($query);
		return genMultiXmlElemDocFromDbResult($result, "test", array("current"=>$current));
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return genMultiXmlElemDocFromDbResult(array(), "test", array("current"=>0));
	}
}

function syncPointsSelect($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues = explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$partNo = $rawValues[$i++];
	$innerQuery = "select trialStartTime, ref, @testDate:=from_unixtime(trialStartTime/1000), @testYear:=extract(year from @testDate) as year, @testMonth:=extract(month from @testDate) as month, extract(day from @testDate) as day, extract(hour from @testDate) as hour, extract(minute from @testDate) as minute, extract(second from @testDate) as second, trialStartTime%1000 as msecs, partNo, testName, trialNo, trialType, trialVariant, accuracy, dotPressed, reactionTime, ((@testYear - birthYear) * 12 + @testMonth - birthMonth) as age, animationShown from $respTable, $partTable where partNo = $partTable.no and testSetNo = $testSetNo and partNo = $partNo and trialStartTime > 0";
	$query = "select trialStartTime, year, month, day, hour, minute, second, msecs, partNo, ref, age, trialNo, testName, trialType, trialVariant, accuracy, dotPressed, reactionTime, animationShown from ($innerQuery) as resp order by trialStartTime";
	logMsg($query);
	try {
		$result = $db->query($query);
		return genMultiXmlElemDocFromDbResult($result, "syncPoint");
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return genMultiXmlElemDocFromDbResult(array(), "syncPoint");
	}
}

function respExists($db, $userName, $trialStartTime) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$query = "select count(*) from $respTable where userName = '$userName' and trialStartTime = $trialStartTime";
	logMsg($query);
	try {
		$result = $db->query($query);
		//logMsg("result: $result");
		$row = $result->fetch_row();
		//logMsg("row: $row");
		$rawVal = $row[0];
		$count = intval($rawVal);
		logMsg("rawVal: $rawVal, count: $count");
		if ($count > 0) {
			return true;
		}
		else {
			return false;
		}
	} catch (Exception $e) {
		logMsg($e->getMessage());
		return false;
	}
}

function respInsert($db, $data) {
	global $permTable, $userTable, $partTable, $respTable, $projectTable, $testSetTable, $testSpecTable;
	$rawValues=explode(",", $data);
	$i = 0;
	$user = $rawValues[$i++];
	$projectNo = $rawValues[$i++];
	$testSetNo = $rawValues[$i++];
	$testName = $rawValues[$i++];
	$partNo = $rawValues[$i++];
	$prevRespTime = $rawValues[$i++];
	$trialStartTime = $rawValues[$i++];
	$trialType = $rawValues[$i++];
	$trialPhase = $rawValues[$i++];
	$trialNo = $rawValues[$i++];
	$trialVariant = $rawValues[$i++];
	$accuracy = $rawValues[$i++];
	$touchTime = $rawValues[$i++];
	$reactionTime = $rawValues[$i++];
	$trialTime = $rawValues[$i++];
	$buttonPressed = $rawValues[$i++];
	$animationShown = $rawValues[$i++];
	$dotPressed = $rawValues[$i++];
	$moveEvents = $rawValues[$i++];
	$posLat = $rawValues[$i++];
	$posLong = $rawValues[$i++];
	$respId = "$user"."_"."$trialStartTime";
	if (!respExists($db, $user, $trialStartTime)) {
		$query = "insert into $respTable values ('$user', $projectNo, $testSetNo, '$testName', $partNo, $prevRespTime, $trialStartTime, '$trialType', '$trialPhase', $trialNo, '$trialVariant', $accuracy, $touchTime, $reactionTime, $trialTime, '$buttonPressed', '$animationShown', $dotPressed, $moveEvents, 0, $posLat, $posLong, '', 0, '')";
		logMsg($query);
		try {
			$db->query($query);
			return $respId;
		} catch (Exception $e) {
			logMsg($e->getMessage());
			return "";
		}
	}
	else {
		logMsg("duplicate: $respId");
		return $respId;
	}
}

function genStatusDoc($type, $msg) {
	$doc = new DOMDocument("1.0", "utf-8");
	$parentElem = $doc->createElement($type);
	$parentElem->setAttribute("msg", $msg);
	$doc->appendChild($parentElem);
	return $doc;
}

function genMultiXmlElemDocFromDbResult($dbResult, $elemName, $parentAttrs=array()) {
	$doc = new DOMDocument("1.0", "utf-8");
	$parentElem = $doc->createElement($elemName."s");
	foreach ($parentAttrs as $attr=>$value) {
		$parentElem->setAttribute($attr, $value);
	}
	$doc->appendChild($parentElem);
	$rows = array();
	if (is_array($dbResult)) {
		$rows = $dbResult;
	} else {
		while (($row = $dbResult->fetch_assoc()) !== null) {
			$rows[] = $row;
		}
	}
	foreach ($rows as $row) {
		$childElem = $doc->createElement($elemName);
		setAttributes($childElem, $row);
		$parentElem->appendChild($childElem);
	}
	return $doc;
}

function genSingleXmlElemDocFromDbResult($dbResult, $elemName) {
	$row = $dbResult->fetch_assoc();
	return genSingleXmlElemDoc($row, $elemName);
}

function genSingleXmlElemDoc($row, $elemName) {
	$doc = new DOMDocument("1.0", "utf-8");
	$elem = $doc->createElement($elemName);
	setAttributes($elem, $row);
	$doc->appendChild($elem);
	return $doc;
}

