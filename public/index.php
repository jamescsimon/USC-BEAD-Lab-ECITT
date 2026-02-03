<?php
	include $_SERVER["DOCUMENT_ROOT"]."/boot.php";
	include_once(LIB_ROOT."/lib.php");
	initTouchTasks();
	genHtml("appIndexUsr", "appIndices");
