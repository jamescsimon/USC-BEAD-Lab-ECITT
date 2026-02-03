<?php
error_log("test.php: START");
error_log("test.php: type=" . (isset($_GET['type']) ? $_GET['type'] : 'NOT_SET'));
error_log("test.php: data=" . (isset($_GET['data']) ? $_GET['data'] : 'NOT_SET'));

header("Content-type: text/xml; charset=UTF-8");
echo '<?xml version="1.0"?><test>OK</test>';
error_log("test.php: END");
