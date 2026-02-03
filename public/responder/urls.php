<?php
	$inclNirs = $_GET["inclNirs"];
	$buttons = glob("../graphics/buttons/*.png");
	$frames = glob("../graphics/frames/*.png");
	$icons = glob("../graphics/icons/*.png");
	$images = glob("../graphics/images/*.png");
	$sprites = glob("../graphics/sprites/*.png");
	$video = glob("../video/*.mp4");
	$videoNirs = glob("../video/nirs/*.mp4");
	$audio = glob("../audio/*.mp3");
	$audioNirs = glob("../audio/nirs/*.mp3");
	$pathsStr = implode(",", $video).",".implode(",", $frames).",".implode(",", $buttons).",".implode(",", $images).",".implode(",", $icons).",".implode(",", $sprites).",".implode(",", $audio);
	if ($inclNirs) {
		$pathsStr .= ",".implode(",", $videoNirs).",".implode(",", $audioNirs);
	}
	echo "$pathsStr";
