function mediaDeclareGlobals() {
	
	//console.log("mediaDeclareGlobals");

	animsDoc=null;
	imagesDoc=null;
	soundsDoc=null;
	
	imageSources=new Array();
	soundSources=new Array();
	
	//animNames = new Array();
	//animSoundNames = new Array();
	
	minFrameInterval = 50;
	maxFrameInterval = 1000;
	defFrameInterval = 50;
	curFrameInterval = defFrameInterval;
	
	curAnimName = "";
	curAnimContainerElem = null;
	curAnimFrameNo = 0;
	curAnimFrameId = "";
	
	animFrameTimer = null;
	animFrameSources = new Object();
	animFrameCounts = new Object();
	
	loadedImgElems = new Object();
	audioBuffers = new Object();
	playingAudioSources = new Object();

	imagesLoaded=false;
	soundsLoaded=false;
	
	AudioContext = window.AudioContext || window.webkitAudioContext;
	audioContext = new AudioContext();
	
	var curSoundElem = null;
	var loadAudioBuffersEndHandler = null;

}

// Images

function getImagesDoc(endHandler) {
	//console.log("getImagesDoc");
	getXmlDoc("../getinfo/?type=images", "imagesDoc", endHandler);
}

function loadImages(endHandler) {
	//console.log("loadImages");
	var imagesElem, imageElem, imageColl, imageName, imgUrl, imgElem;
	imagesElem = imagesDoc.documentElement;
	imageElem = imagesElem.firstChild;
	while (imageElem != null) {
		imageColl = imageElem.getAttribute("coll");
		imageName = imageElem.getAttribute("name");
		imageId = imageColl+"_"+imageName;
		imgUrl = "../graphics/"+imageColl+"/"+imageName+".png";
		imgElem = createImg(imgUrl);
		imgElem.setAttribute("rel", "preload");
		imgElem.setAttribute("draggable", "false");
		imgElem.setAttribute("ontouchstart", "event.preventDefault();");
		imgElem.addEventListener("touchstart", touchStartHandler, false);
		imgElem.addEventListener("touchmove", touchMoveHandler, false);
		imgElem.addEventListener("touchend", touchEndHandler, false);
		//console.log("loadImages, imgUrl: "+imgUrl, imgElem);
		loadedImgElems[imageId] = imgElem;
		imageElem = imageElem.nextSibling;
	}
	endHandler();
}

function getImageElem(imageColl, imageName, className) {
	//console.log("getImageElem, imageColl: "+imageColl+", imageName: "+imageName+", className: "+className);
	var imageId, imageElem;
	imageId=imageColl+"_"+imageName;
	imageElem = loadedImgElems[imageId];
	imageElem.setAttribute("class", className);
	console.log("imageElem", imageElem);
	return imageElem;
}

function touchStartHandler(event) {
	//console.log("touchStartHandler");
	event.preventDefault();
}

function touchEndHandler(event) {
	//console.log("touchEndHandler");
	event.preventDefault();
}

// Animations

function getAnimsDoc(endHandler) {
	//console.log("getAnimsDoc");
	var searchStr;
	searchStr="../getinfo/?type=anims";
	getXmlDoc(searchStr, "animsDoc", endHandler);
	//console.log("getAnimsDoc searchStr:"+searchStr);
}

function getAnimFrameSources() {
	var animsElem, animElem, animName, frameElem, frameDuration, frameNo, animSource, frameList, i, frameImageId;
	animsElem=animsDoc.documentElement;
	animFrameSources.sourcePath=animsElem.getAttribute("sourcePath");
	animElem=animsElem.firstChild;
	while (animElem!=null) {
		animName=animElem.getAttribute("name");
		animSource=new Object();
		animFrameSources[animName]=animSource;
		frameList=new Array();
		animSource.soundId=animElem.getAttribute("sound");
		animSource.frameList=frameList;
		frameNo=0;
		frameElem=animElem.firstChild;
		while (frameElem!=null) {
			frameImageId=frameElem.getAttribute("imageId");
			frameDuration=frameElem.getAttribute("duration");
			for (i=0; i<frameDuration; i++, frameNo++) {
				frameList[frameNo]=frameImageId;
			}
			frameElem=frameElem.nextSibling;
		}
		animSource.noOfFrames=frameNo;
		animElem=animElem.nextSibling;
	}
}

function initAnimPlayer(animContainerElem, animName, frameInterval) {
	//console.log("initAnimPlayer animContainerElem:"+animContainerElem+" animName:"+animName+" frameInterval:"+frameInterval);
	//console.log(animContainerElem);
	clearAnimFrameTimer()
	curAnimContainerElem=animContainerElem;
	removeChildren(animContainerElem);
	curAnimName=animName;
	if (frameInterval>=minFrameInterval && frameInterval<=maxFrameInterval)
		curFrameInterval=frameInterval;
	else
		curFrameInterval=defFrameInterval;
	curAnimFrameNo=0;
}

function clearAnimFrameTimer() {
	//console.log("clearAnimFrameTimer");
	if (animFrameTimer) {
		clearTimeout(animFrameTimer);
	}
	animFrameTimer=null;
}

function setAnimFrameTimer(handler, timeout) {
	//console.log("setAnimFrameTimer");
	if (animFrameTimer)
		clearTimeout(animFrameTimer);
	animFrameTimer=setTimeout(handler, timeout);
}

function getAnimFrameId(animName, animFrameNo) {
	var frameId=animFrameSources[animName].frameList[animFrameNo];
	//console.log("getAnimFrameId frameId:"+frameId);
	return frameId;
}

function getAnimFrameCount(animName) {
	//console.log("getAnimFrameCount");
	return animFrameSources[animName].noOfFrames;
}

function showNextAnimFrame(nextFrameHandler, animationEndedHandler) {
	//console.log("showNextAnimFrame curAnimName:"+curAnimName+" curAnimFrameNo:"+curAnimFrameNo+" frameCount:"+getAnimFrameCount(curAnimName));
	var frameImageElem, animFrameCount;
	animFrameCount = getAnimFrameCount(curAnimName);
	if (curAnimFrameNo < animFrameCount) {
		frameImageElem=getImageElem("frames", animFrameSources[curAnimName].frameList[curAnimFrameNo], "animFrame");
		replaceChildren(curAnimContainerElem, frameImageElem);
		curAnimFrameNo++;
		setAnimFrameTimer(nextFrameHandler, curFrameInterval);
	}
	else {
		clearAnimFrameTimer()
		animationEndedHandler();
	}
}

function playAnimSound(animName) {
	playSound(animFrameSources[animName].soundId);
}

function stopAnimSound(animName) {
	stopSound(animFrameSources[animName].soundId);
}

// Audio

function getSoundsDoc(endHandler) {
	//console.log("getSoundsDoc");
	getXmlDoc("../getinfo/?type=sounds", "soundsDoc", endHandler);
}

function loadAudioBuffers(endHandler) {
	var soundsElem, soundElem, soundName;
	loadAudioBuffersEndHandler = endHandler;
	//console.log("loadAudioBuffers");
	//console.log(soundsDoc);
	soundsElem = soundsDoc.documentElement;
	curSoundElem = soundsElem.firstChild;
	loadNextSound()
}

function loadNextSound() {
	if (curSoundElem) {
		soundName = curSoundElem.getAttribute("name");
		//console.log("loadNextSound, soundName: "+soundName);
		fetchSound(soundName);
		curSoundElem = curSoundElem.nextSibling;
	}
	else {
		//console.log("loadNextSound, done");
		loadAudioBuffersEndHandler();
	}
}

function fetchSound(soundName) {
	//console.log("fetchSound, soundName: "+soundName);
	fetch("../audio/"+soundName+".mp3").then(function(response){saveAudioResponse(response, soundName)});
}

async function saveAudioResponse(response, soundName) {
	//console.log("saveAudioResponse, soundName: "+soundName);
	response.arrayBuffer().then(function(buffer){saveAudioBuffer(buffer, soundName)});
}

function saveAudioBuffer(buffer, soundName) {
	//console.log("saveAudioBuffer, soundName: "+soundName);
	audioContext.decodeAudioData(buffer, function(codedBuffer){audioBuffers[soundName] = codedBuffer; loadNextSound()});
}

function playSound(soundName, loops) {
	//console.log("playSound, soundName: "+soundName+", loops: "+loops);
	const curPlayingSource = playingAudioSources[soundName];
	if (curPlayingSource) {
		//console.log("playSound, stopping, soundName: "+soundName);
		curPlayingSource.stop();
	}
	const audioBuffer = audioBuffers[soundName];
	if (audioBuffer) {
		const audioSource = audioContext.createBufferSource();
		audioSource.connect(audioContext.destination);
		audioSource.buffer = audioBuffers[soundName];
		audioSource.onended = function(event){audioEnded(soundName)}
		if (loops) {
			audioSource.loops = loops;
		}
		audioSource.start();
		playingAudioSources[soundName] = audioSource;
	}
	else {
		//console.log("playSound, no audioBuffer, soundName: "+soundName);
	}
}

function audioEnded(soundName) {
	//console.log("audioEnded, soundName: "+soundName);
	if (playingAudioSources[soundName]) {
		playingAudioSources[soundName] = null;
	}
}

function stopSound(soundName) {
	//console.log("stopSound, soundName: "+soundName);
	const playingAudioSource = playingAudioSources[soundName];
	if (playingAudioSource) {
		playingAudioSource.stop();
		playingAudioSources[soundName] = null;
	}
	else {
		//console.log("stopSound, no playingAudioSource, soundName: "+soundName);
	}
}


// Loading Resources

function mediaLoadResources(endHandler) {
	//console.log("mediaLoadResources");
	if (endHandler) {
		mediaLoadResourcesEndHandler = endHandler;
		getAnimsDoc(mediaLoadResources2);
	}
	else {
		//console.log("mediaLoadResources, no endHandler");
	}
}

function mediaLoadResources2() {
	//console.log("mediaLoadResources2");
	getAnimFrameSources();
	getImagesDoc(mediaLoadResources3);
}

function mediaLoadResources3() {
	//console.log("mediaLoadResources3");
	loadImages(mediaLoadResources4);
}

function mediaLoadResources4() {
	//console.log("mediaLoadResources4");
	getSoundsDoc(mediaLoadResources5);
}

function mediaLoadResources5() {
	//console.log("mediaLoadResources5");
	loadAudioBuffers(mediaLoadResourcesEndHandler);
}

function mediaResourcesLoaded() {
	return (animsDoc && imagesDoc && soundsDoc);
}
