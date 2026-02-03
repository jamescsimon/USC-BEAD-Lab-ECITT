<?php
error_log("test2.php: START");
error_log("test2.php: REQUEST_URI=" . $_SERVER['REQUEST_URI']);
error_log("test2.php: QUERY_STRING=" . $_SERVER['QUERY_STRING']);
error_log("test2.php: type=" . (isset($_GET['type']) ? $_GET['type'] : 'NOT_SET'));

header("Content-type: text/xml; charset=UTF-8");
echo '<?xml version="1.0"?><test>OK</test>';
error_log("test2.php: END");
