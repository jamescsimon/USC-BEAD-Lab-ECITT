<?php
	include $_SERVER["DOCUMENT_ROOT"]."/boot.php";
	include_once(LIB_ROOT."/lib.php");
	include_once(LIB_ROOT."/dbLib.php");
	initTouchTasks();
	dbOpCsv();
