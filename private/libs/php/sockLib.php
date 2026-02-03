<?php
	function initSocketServer($url) {
		//logMsg("initSocketServer, url: $url");
		$sock = stream_socket_server($url, $errno, $errstr, STREAM_SERVER_BIND|STREAM_SERVER_LISTEN);
		if (!is_resource($sock)) {
			//logMsg("initSocketServer, not resource, sock: $sock, errno: $errno, errstr: $errstr");
			throw new Exception("stream_socket_server failed, errstr: $errstr", $errno);
		}
		//logMsg("initSocketServer, exit");
		return $sock;
	}
	
	function acceptConn($sock, $timeout) {
		$fp = stream_socket_accept($sock, $timeout);
		if (!is_resource($fp)) {
			//logMsg("acceptConn, not resource, fp: $fp");
		}
		return $fp;
	}
	
	function initSocketClient($url) {
		$timeout = ini_get("default_socket_timeout");
		//logMsg("initSocketClient, url: $url, timeout: $timeout");
		$fp = stream_socket_client($url, $errno, $errstr, ini_get("default_socket_timeout"), STREAM_CLIENT_CONNECT);
		if (!is_resource($fp)) {
			//logMsg("initSocketClient, not resource, fp: $fp, errno: $errno, errstr: $errstr");
			throw new Exception("stream_socket_client failed, errstr: $errstr", $errno);
		}
		//logMsg("initSocketClient, exit");
		return $fp;
	}
	
	function shutdownSocket($sock) {
		if (!stream_socket_shutdown($sock, STREAM_SHUT_RDWR)) {
			throw new Exception("stream_socket_shutdown failed");
		}
	}
	
	function receiveFromSocket($fp) {
		$msg = stream_get_line($fp, 1024, "\n");
		return $msg;
	}
	
	function receiveFromSocket2($fp) {
		$msg = stream_socket_recvfrom($fp, 1024, "\n");
		return $msg;
	}
	
	function sendToSocket($fp, $msg) {
		$msgLength = sizeof($msg)+1;
		$sentLength = stream_socket_sendto($fp, "$msg\n");
		if ($sentLength < $msgLength) {
			throw new Exception("stream_socket_sendto failed, msgLength: $msgLength, sentLength: $sentLength");
		}
	}
	?>
