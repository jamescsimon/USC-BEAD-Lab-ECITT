<?php
	$frames = glob("../graphics/frames/*.png");
	$buttons = glob("../graphics/buttons/*.png");
	$images = glob("../graphics/images/*.png");
	$video = glob("../video/*.mp4");
	$audio = glob("../audio/*.mp3");
	$scripts = glob("js/*.js");
	$styleSheets = glob("css/*.css");
	$pathsStr = implode(",", $frames).",".implode(",", $buttons).",".implode(",", $images).",".implode(",", $video).",".implode(",", $audio).",".implode(",", $pages).",".implode(",", $scripts).",".implode(",", $styleSheets);
	echo "$pathsStr";
