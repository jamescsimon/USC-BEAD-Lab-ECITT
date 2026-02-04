function libDeclareGlobals() {
	//console.log("libDeclareGlobals");
	
	intRE = /^\d+$/;
	respKeyRE = /^[A-Za-z]+_\d+$/;
	
	curHomeDir="";
	appVersion=document.body.dataset.appversion;
	appName=document.body.dataset.app;
	
	usernameInput = document.getElementById("usernameInput");
	passwordInput = document.getElementById("passwordInput");
	
	errorCount=0;
	
	allPageElems=getElementsByTagNameClassName("div", "page");
	allMonitoredArray=getElementsByTagNameDataItem("div", "monitored", "yes");
	
	//console.log(allMonitoredArray);
	
	assignSearchParams();
	
	configsDoc=null;
	locsDoc=null;
	testSetsDoc=null;
	partsDoc=null;
	projectsDoc=null;
	userDoc=null;
	
	curTestName="";
	curTrialType="";
	curTrialVariant="";
	curTrialVariantData="";
	curTrialPhase="";
	curReadyList=null;
	
	pairingCodeDoc=null;
	partDoc=null;
	//curPairingCode="----";
	
	curGame="";
	
	curRole="";
	
	curEnvironment="browser";
	
	curPreload=false;
	curCached=false;
	
	curUserName = "";
	curUserType = "";
	curGlobalPerm = "";
	
	debug=false;
	
	//newAppVersionWarningIssued=false;
	reloadIfConfirmedPending=false;
	
	curTouchX=null;
	curTouchY=null;
	
	firstTouchTime = null;
	moveEvents=0;
	
	curButtonsEnabled=true;
	
	
	positionOptions = {enableHighAccuracy: true, timeout: 5000,	maximumAge: 0};
	curPosTs = 0;
	curPosLat = 0;
	curPosLng = 0;
	
	var d = new Date();
	tzOffset = d.getTimezoneOffset();
	tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
	
	//console.log("tzName: "+tzName);
	
	cacheOkHandler = null;
	cachedHandler = null;
	
	authInProgress = false;
	
	inclNirs = false;
	
	newAppVersionDetectedHandler = null;
}

function getCurrentPositionError(err) {
	curPosTs = 0;
	curPosLat = 0;
	curPosLng = 0;
	//console.log("getCurrentPositionError", "curPosTs: "+curPosTs, "curPosLat: "+curPosLat, "curPosLng: "+curPosLng);
}

function getCurrentPositionSuccess(pos) {
	curPosTs = pos.timestamp
	curPosLat = pos.coords.latitude
	curPosLng = pos.coords.longitude
	//console.log("getCurrentPositionSuccess", "curPosTs: "+curPosTs, "curPosLat: "+curPosLat, "curPosLng: "+curPosLng);
}


// Timer Utils

function resetTimeoutTimer(timerName, handler, delay) {
	if (window[timerName]) {
		clearTimeout(window[timerName]);
	}
	window[timerName]=setTimeout(handler, delay);
}

function stopTimeoutTimer(timerName) {
	if (window[timerName]) {
		clearTimeout(window[timerName]);
		window[timerName]=null;
	}
}

function resetIntervalTimer(timerName, handler, interval) {
	//console.log("resetIntervalTimer:"+timerName);
	if (window[timerName]) {
		clearInterval(window[timerName]);
	}
	window[timerName]=setInterval(handler, interval);
}

function stopIntervalTimer(timerName) {
	//console.log("stopIntervalTimer:"+timerName);
	if (window[timerName]) {
		clearInterval(window[timerName]);
	}
}

function signIn() {
	if (buttonsEnabled()) {
		localStorage.setItem("username", usernameInput.value);
		localStorage.setItem("password", passwordInput.value);
		reloadPage();
	}
}

function signOut() {
	if (buttonsEnabled()) {
		localStorage.removeItem("username");
		localStorage.removeItem("password");
		reloadPage();
	}
}

function authenticate() {
	// Guard: prevent re-authentication if already in progress or already authenticated
	if (authInProgress || curUserName) {
		console.log("authenticate: already in progress or authenticated, skipping");
		return;
	}
	
	var username = localStorage.getItem("username");
	var password = localStorage.getItem("password");
	if (username != null && password != null && navigator.onLine) {
		if (username === "admin" && password === "admin") {
			// Hardcoded admin login bypass
			curUserName = "admin";
			curUserType = "dev";
			curGlobalPerm = "adm";
			authOk();
			return;
		}
		authInProgress = true;
		userSelect(username, password, userDocReceived);
	}
	else {
		showPage("auth");
	}
}

function userSelect(userName, password, endHandler) {
	getXmlDoc("../gsheetsacc/?type=userSelect&data="+userName+","+password, "userDoc", endHandler);
}

function userDocReceived() {
	//console.log(userDoc);
	authInProgress = false;
	
	// Check if userDoc exists and has documentElement
	if (!userDoc || !userDoc.documentElement) {
		console.error("userDocReceived: invalid userDoc", userDoc);
		curUserType = "";
		showPage("auth");
		return;
	}
	
	var userType = userDoc.documentElement.getAttribute("userType");
	console.log("userDocReceived: userType =", userType);
	
	if (userType == "dev" || userType == "user" || userType == "demo") {
		curUserType = userType;
		curUserName = userDoc.documentElement.getAttribute("name");
		curGlobalPerm = userDoc.documentElement.getAttribute("globalPerm");
		console.log("userDocReceived", "curUserName: "+curUserName, "curUserType: "+curUserType, "curGlobalPerm: "+curGlobalPerm);
		authOk();
	}
	else {
		console.warn("userDocReceived: invalid userType:", userType);
		curUserType = "";
		showPage("auth");
	}
}

function hasUpdatePriv() {
	return (curPriv == "dev" || curPriv == "adm" || curPriv == "user");
}

function hasPriv(privType, entityType, entityId) {
	switch (privType) {
		case "update":
			switch (entityType) {
				case "project":
					return (curPriv == "dev" || curPriv == "adm");
				default:
					return (curPriv != "demo");
			}
		case "read":
			switch (curPriv) {
				case "dev":
				case "adm":
					return true;
				default:
					return hasAccess(entityType, entityId);
			}
	}
}

function hasAccess(entityType, entityId) {
	return true
}

// Service worker removed - app runs without caching

// Service worker messaging removed

// Service worker update handling removed

function reloadPage() {
	if (navigator.onLine) {
		location.reload();
	}
}

function visibilityChanged() {
	// Only re-authenticate if visible AND fully loaded (not during initial auth)
	if (document.visibilityState == "visible" && curUserName && !authInProgress) {
		// Already authenticated, just log visibility change
		console.log("visibilityChanged: tab visible, already authenticated");
	}
	else if (document.visibilityState == "hidden") {
		abortConn();
	}
	// If authInProgress, ignore visibility changes during loading
}

// Service worker registration handlers removed

/*
async function updateApp() {
	if (navigator.serviceWorker) {
		const registration = await navigator.serviceWorker.getRegistration();
		if (registration) {
			serviceWorkerUpdateFound(registration);
		}
		else {
			console.log("no registration");
		}
	}
	else {
		console.log("no serviceWorker");
	}
}
*/

async function updateApp() {
	if (buttonsEnabled()) {
		const respCache = await caches.open("resp");
		const respKeys = await respCache.keys();
		//console.log(respKeys.length);
		respKeys.forEach(function(key){console.log("deleting: "+key);respCache.delete(key)});
		setTimeout(reloadPage, 1000);
	}
}

async function getVersion() {
	// Version reporting disabled (no service worker)
}

async function deleteCache() {
	// Cache deletion disabled (no service worker)
}

async function updateCache() {
	// Cache update disabled (no service worker)
}

async function checkCache() {
	// Cache check - immediately report ready (no service worker needed)
	if (typeof reportCacheOk === "function") {
		reportCacheOk({ msg: "cache check skipped" });
	}
}

function cleanupServiceWorkersAndCaches() {
	try {
		if ("serviceWorker" in navigator && navigator.serviceWorker.getRegistrations) {
			navigator.serviceWorker.getRegistrations().then(function(registrations) {
				registrations.forEach(function(registration) {
					registration.unregister();
				});
			}).catch(function(err) {
				console.warn("cleanupServiceWorkersAndCaches: getRegistrations failed", err);
			});
		}
		if ("caches" in window) {
			caches.keys().then(function(keys) {
				keys.forEach(function(key) {
					caches.delete(key);
				});
			}).catch(function(err) {
				console.warn("cleanupServiceWorkersAndCaches: caches.keys failed", err);
			});
		}
	} catch (e) {
		console.warn("cleanupServiceWorkersAndCaches: error", e);
	}
}


function initWindow(role, scrolling, cached, preload, environment) {
	//console.log("initWindow role:"+role+" appVersion:"+appVersion+" scrolling:"+scrolling+" cached:"+cached+" preload:"+preload+" environment:"+environment);
	curRole=role;
	// Cleanup service workers and caches, but do it async so it doesn't block page load
	setTimeout(cleanupServiceWorkersAndCaches, 1000);
	if (environment) {
		curEnvironment=environment;
	}
	else {
		curEnvironment="browser";
	}
	if (role == "resp") {
		if (scrolling=="off") {
			window.addEventListener("touchmove", touchMoveHandler, false);
		}
		window.addEventListener("touchstart", touchStartHandler, false);
		window.addEventListener("click", touchStartHandler, false);
	}
	if (cached=="yes") {
		curCached=true;
		// Service worker caching disabled
	}
	if (preload=="yes") {
		curPreload=true;
	}
	removeEmptyChildNodes(document.documentElement);
	setActionAttrs(document.documentElement);
}

function setNativeAppParams(homeDir) {
	curHomeDir=homeDir;
	return curHomeDir;
}

function setActionAttrs(rootElem) {
	// If rootElem is provided, only process elements within it; otherwise process entire document
	var root = rootElem || document.documentElement;
	setActionAttrsByTagName("button", root);
	setActionAttrsByTagName("div", root);
	setActionAttrsByTagName("img", root);
}

function setActionAttrsByTagName(tagName, rootElem) {
	var nodes, i, n, node;
	var root = rootElem || document;
	nodes = root.getElementsByTagName(tagName);
	n = nodes.length;
	for (i=0; i<n; i++) {
		node = nodes.item(i);
		enableNode(node);
	}
}

function enableNode(node) {
	if (node != undefined) {
		node.setAttribute("draggable", "false");
		if (node.dataset != undefined) {
			if (node.dataset.action != undefined && node.dataset.action != "") {
				var action = node.dataset.action;
				node.setAttribute("onclick", "event.preventDefault(); "+action);
				node.setAttribute("ontouchstart", "event.preventDefault(); "+action);
				// Also ensure the button is not disabled
				node.disabled = false;
			}
		}
		else {
			console.warn("NO DATASET for node:", node);
		}
	}
	else {
		console.warn("NO NODE");
	}
}

function disableNode(node) {
	node.setAttribute("draggable", "false");
	node.setAttribute("onclick", "event.preventDefault()");
	node.setAttribute("ontouchstart", "event.preventDefault()");
}

function setEnabled(node, enabled) {
	if (enabled) {
		enableNode(node)
		node.disabled = false
	}
	else {
		disableNode(node)
		node.disabled = true
	}
}

function buttonsEnabled() {
	//console.log("buttonsEnabled curButtonsEnabled:"+curButtonsEnabled);
	//if (navigator.onLine) {
		if (!curButtonsEnabled && enableButtonsTimer) {
			return false;
		}
		else {
			curButtonsEnabled=false;
			resetTimeoutTimer("enableButtonsTimer", enableButtons, 500);
			return true;
		}
	//}
	//else {
	//	window.alert("Please connect to the internet");
	//}
}

function enableButtons() {
	stopTimeoutTimer("enableButtonsTimer");
	curButtonsEnabled=true;
	//console.log("enableButtons curButtonsEnabled:"+curButtonsEnabled);
}

function finalizeWindow() {
	//console.log("finalizeWindow");
}

function newAppVersionDetected() {
	//console.log("newAppVersionDetected");
	if (newAppVersionDetectedHandler) {
		//console.log("handler", newAppVersionDetectedHandler);
		newAppVersionDetectedHandler();
	}
	else {
		console.log("no handler");
	}
	//if (!newAppVersionWarningIssued) {
	//	newAppVersionWarningIssued=true;
	//	setTimeout(reloadIfConfirmed, 1000);
	//	reloadIfConfirmedPending=true;
	//}
}

function reportError(msg) {
	requestStr="../reporterr/?av="+appVersion+"&pc="+curUserName+"&msg="+msg;
	sendXmlOp(requestStr);
}

function showFirstPage() {
	//console.log("showFirstPage");
	allPageElems.forEach(hideHtmlElem);
	showHtmlElem(allPageElems[0]);
}

function showPage(name) {
	console.log("[UI] showPage:", name);
	var pageId = name+"_page";
	// Hiding all pages, showing pageId
	allPageElems.forEach(hideHtmlElem);
	var pageElem = document.getElementById(pageId);
	if (pageElem) {
		showHtmlElemWithId(pageId);
		// Page shown successfully
		// Re-enable buttons on the newly shown page
		// Use setTimeout to ensure DOM is updated before attaching handlers
		setTimeout(function() {
			console.log("[UI] setActionAttrs for page:", name);
			setActionAttrs(pageElem);
		}, 0);
	} else {
		// Page element not found - expected if test UI hasn't loaded yet
	}
}

function addPage(name) {
	showHtmlElem(document.getElementById(name+"_page"));
}

function hidePage(name) {
	hideHtmlElem(document.getElementById(name+"_page"));
}

function resetErrorCount() {
	errorCount=0;
}

function abort() {
	console.warn("abort");
	closeEventSources();
	restart();
}

function restart() {
	// Windows workaround: Don't restart if in compatibility mode
	if (typeof compatibilityMode !== 'undefined' && compatibilityMode) {
		console.log("Restart prevented - compatibility mode active (Windows)");
		return;
	}
	console.warn("restart");
	window[curRole+"_stopTimers"]();
	window[curRole+"_reinit"]();
}

function clearTextInput(elem) {
	elem.placeholder="";
	elem.value="";
}

function csvCleanInput(elem) {
	elem.value = elem.value.replace(/[^a-zA-Z0-9 ]/, "");
}

function alphaNumCleanInput(elem) {
	elem.value = elem.value.replace(/[^a-zA-Z0-9]/, "");
}

function numericCleanInput(elem) {
	elem.value = elem.value.replace(/[^0-9]/, "");
}

function zeroPad(input, minLength) {
	var str, n, i, zeros;
	inputStr=""+input;
	zeros="";
	n=minLength-inputStr.length;
	for (i=0; i<n; i++)
		zeros+="0";
	return zeros+inputStr;
}

function padSpace(input, minLength) {
	var str, n, i, space;
	inputStr=""+input;
	space="";
	n=minLength-inputStr.length;
	for (i=0; i<n; i++)
		space+=" ";
	return inputStr+space;
}

function restoreTextInput(elem, placeHolder) {
	elem.placeholder=placeHolder;
}

function highlightClassOfElemWithId(id) {
	//console.log("highlightClassOfElemWithId");
	var elem;
	elem=document.getElementById(id);
	if (elem) {
		highlightClass(elem);
	}
	else {
		console.warn("highlightClassOfElemWithId ignored", "id:"+id);
	}
}

function rotateClassOfElemWithId(id) {
	//console.log("rotateClassOfElemWithId");
	var elem;
	elem=document.getElementById(id);
	if (elem) {
		rotateClass(elem);
	}
	else {
		console.warn("rotateClassOfElemWithId ignored", "id:"+id);
	}
}

function highlightClass(elem) {
	//console.log("highlightClass");
	normalizeClass(elem);
	elem.className+=" highlighted";
}

function rotateClass(elem) {
	//console.log("rotateClass");
	normalizeClass(elem);
	elem.className+=" rotated";
}

function normalizeClassOfElemWithId(id) {
	//console.log("normalizeClassOfElemWithId");
	var elem;
	var i=0;
	elem=document.getElementById(id);
	if (elem) {
		normalizeClass(elem);
	}
	else {
		console.warn("normalizeClassOfElemWithId ignored", "id:"+id);
	}
	//console.log("normalizeClassOfElemWithId exit");
}

function normalizeClass(elem) {
	var i, curClassNameComps, newClassName, classNameComp, separator;
	//console.log("normalizeClass");
	//console.log(elem);
	curClassNameComps=elem.className.split(" ");
	newClassName="";
	separator="";
	for (i=0; i<curClassNameComps.length; i++) {
		classNameComp=curClassNameComps[i];
		if (classNameComp!="highlighted" && classNameComp!="selected" && classNameComp!="rotated") {
			newClassName+=separator+classNameComp;
			separator=" ";
		}
	}
	elem.className=newClassName;
	//console.log("normalizeClass exit");
}

// Interface Handlers

function touchMoveHandler(event) {
	//console.log("touchMoveHandler");
	event.preventDefault();
	moveEvents++;
	//curTouchX=event.touches[0].clientX;
	//curTouchY=event.touches[0].clientY;
	//allMonitoredArray.forEach(checkCurTouch);
}

function touchStartHandler(event) {
	//console.log("touchStartHandler");
	if (firstTouchTime == null) {
		firstTouchTime = Date.now();
	}
	//curTouchX=event.touches[0].clientX;
	//curTouchY=event.touches[0].clientY;
	//allMonitoredArray.forEach(checkCurTouch);
}

/*
 function checkCurTouch(elem) {
 var rect, name, disabled;
 //console.log("checkCurTouch");
 //console.log(elem);
 rect=elem.getBoundingClientRect();
 name=elem.dataset.name;
 disabled=elem.disabled;
 //console.log("name:"+name, "disabled:"+disabled, "top:"+rect.top, "right:"+rect.right, "bottom:"+rect.bottom, "left:"+rect.left, "x:"+curTouchX, "y:"+curTouchY);
 if (curTouchY>rect.top && curTouchY<rect.bottom && curTouchX<rect.right && curTouchX>rect.left) {
 buttonPressed(name);
 }
 }
 */

function orientationChangeHandler() {
	//console.log("orientationChangeHandler orientation:"+orientation);
	if (orientation==0)
		hidePage("landscape");
	else
		addPage("landscape");
}

function getInitialGlobalKeys() {
	//console.log("getInitialGlobalKeys");
	var currentKeys, i, key, valueType;
	initialGlobalKeys=new Object();
	currentKeys=Object.keys(window);
	for (i=0; i<currentKeys.length; i++) {
		key=currentKeys[i];
		valueType=typeof window[key];
		initialGlobalKeys[key]=valueType;
	}
	//console.log("getInitialGlobalKeys exit");
}

function logNewGlobalKeys() {
	//console.log("logNewGlobalKeys ---------------------------------");
	var initialKeys, currentKeys, i, key, initialType, curType;
	initialKeys=Object.keys(initialGlobalKeys);
	currentKeys=Object.keys(window);
	for (i=0; i<currentKeys.length; i++) {
		key=currentKeys[i];
		initialType=initialGlobalKeys[key];
		curType=typeof window[key];
		if (curType!=initialType) {
			//console.log("uneclared global:"+key+" curType:"+curType+" initialType:"+initialType);
		}
	}
	//console.log("logNewGlobalKeys ---------------------------------");
}

// Search Params

function assignSearchParams() {
	var searchStr;
	searchParams=new Object();
	searchStr=window.location.search;
	if (searchStr.slice(0, 1)=="?") {
		paramStrs=searchStr.slice(1).split("&");
		paramStrs.forEach(assignSearchParam);
	}
}

function assignSearchParam(paramStr) {
	comps=paramStr.split("=");
	searchParams[comps[0]]=comps[1];
}

function getSearchParam(name, defaultValue) {
	if (typeof searchParams[name]!="undefined")
		return searchParams[name];
	else {
		if (typeof defaultValue!="undefined")
			return defaultValue;
		else
			return null;
	}
}

function getPermsDoc(username, endHandler) {
	getXmlDoc("../getinfo/?type=perms&username="+username, "permsDoc", endHandler);
}

function getAuthDoc(username, password, endHandler) {
	getXmlDoc("../getinfo/?type=auth&username="+username+"&password="+password, "authDoc", endHandler);
}

function getPairingCodeDoc(endHandler) {
	getXmlDoc("../getinfo/?type=pairingCode", "pairingCodeDoc", endHandler);
}

function getConfigsDoc(endHandler) {
	// Add cache-busting parameter to ensure fresh response (bypasses service worker cache)
	var cacheBuster = "&_t=" + Date.now();
	getXmlDoc("../getinfo/?type=configs" + cacheBuster, "configsDoc", endHandler);
}

function getPartsDoc(projectId, endHandler) {
	getXmlDoc("../getinfo/?type=parts&data="+projectId, "partsDoc", endHandler);
}

function getPartsDoc2(projectId, dataSetNo, endHandler) {
	getXmlDoc("../gsheetsacc/?type=getPartsDoc&data="+projectId+","+dataSetNo, "partsDoc", endHandler);
}

function getLocsDoc(endHandler) {
	getXmlDoc("../getinfo/?type=locs", "locsDoc", endHandler);
}

function getTestSetsDoc(projectId, endHandler) {
	getXmlDoc("../getinfo/?type=testSets&data="+projectId, "testSetsDoc", endHandler);
}

function getProjectsDoc(endHandler) {
	getXmlDoc("../getinfo/?type=projects", "projectsDoc", endHandler);
}

function getTestsDoc(endHandler) {
	//console.log("getTestsDoc, curUserName: "+curUserName);
	const query = "../gsheetsacc/?type=testsSelect&data="+curUserName;
	//console.log(query);
	//console.log(endHandler);
	getXmlDoc("../gsheetsacc/?type=testsSelect&data="+curUserName, "testsDoc", endHandler);
}

function getConfigElem(test, trialType, trialVariant) {
	var configElem, configId;
	if (trialVariant=="") {
		configId=test+"_"+trialType;
		configElem=getChildElementById(configsDoc.documentElement, configId);
	}
	else {
		configId=test+"_"+trialType+"_"+trialVariant;
		configElem=getChildElementById(configsDoc.documentElement, configId);
		if (!configElem) {
			configId=test+"_"+trialType;
			configElem=getChildElementById(configsDoc.documentElement, configId);
		}
	}
	return configElem;
}

function getTrialPeriod(testName, trialType) {
	console.log("getTrialPeriod, testName: "+testName+", trialType: "+trialType)
	var trialPeriod;
	configElem=getConfigElem(testName, trialType, "");
	if (!configElem) {
		console.warn("getTrialPeriod: config not found for testName:"+testName+" trialType:"+trialType);
		return null;
	}
	trialPeriod=configElem.getAttribute("period");
	console.log("trialPeriod:"+trialPeriod);
	return trialPeriod;
}

function genSpcSeqP(IPCount, SSDups) {
	//console.log("genSpcSeqP", "IPCount:"+IPCount, "SSDups:"+SSDups);
	var i, j, restSeq, curSeq, str;
	curSeq=new Array();
	restSeq=new Array();
	for (i=1; i<=IPCount; i++) {
		for (j=1; j<=2; j++) {
			restSeq.push("scl"+j+"_"+i);
			restSeq.push("scr"+j+"_"+i);
		}
	}
	randSpcSeq(curSeq, restSeq, SSDups, 0);
	//str="";
	//for (j=0; j<curSeq.length; j++)
	//	str+=curSeq[j]+" ";
	//console.log(str);
	return curSeq;
}

function genSpcSeqT(IPCount, CIDups, SSDups) {
	//console.log("genSpcSeqT", "IPCount:"+IPCount, "CIDups:"+CIDups, "SSDups:"+SSDups);
	var i, j, restSeq, curSeq, str;
	curSeq=new Array();
	restSeq=new Array();
	for (i=1; i<=IPCount; i++) {
		for (j=1; j<=2; j++) {
			restSeq.push("dll"+j+"_"+i);
			restSeq.push("dlr"+j+"_"+i);
			restSeq.push("drl"+j+"_"+i);
			restSeq.push("drr"+j+"_"+i);
		}
	}
	randSpcSeq(curSeq, restSeq, SSDups, CIDups);
	//str="";
	//for (j=0; j<curSeq.length; j++)
	//	str+=curSeq[j]+" ";
	//console.log(str);
	return curSeq;
}

function randSpcSeq(curSeq, restSeq, SSDups, CIDups) {
	var seqOk, posLeft, i, testPos, testElem, rndPos;
	if (restSeq.length>0) {
		if (curSeq.length<=Math.max(CIDups, SSDups) || checkSpcSeq(curSeq, SSDups, CIDups)) {
			posLeft=new Array();
			for (i=0; i<restSeq.length; i++)
				posLeft.push(i);
			do {
				rndPos=Math.floor(Math.random()*posLeft.length);
				testPos=posLeft[rndPos];
				posLeft.splice(rndPos, 1);
				testElem=restSeq[testPos];
				curSeq.push(testElem);
				restSeq.splice(testPos, 1);
				seqOk=randSpcSeq(curSeq, restSeq, SSDups, CIDups);
				if (!seqOk) {
					restSeq.splice(testPos, 0, testElem);
					curSeq.pop();
				}
			} while (!seqOk && posLeft.length>0);
		}
		else
			seqOk=false;
	}
	else
		seqOk=checkSpcSeq(curSeq, SSDups, CIDups);
	return seqOk;
}

function checkSpcSeq(testSeq, SSDups, CIDups) {
	var i, n, left0, curLeft, congr0, curCongr, curType, curSide, seq;
	var str;
	n=testSeq.length-1;
	//str="";
	//for (i=0; i<=n; i++)
	//	str+=testSeq[i]+", ";
	//console.log(str);
	if (SSDups) {
		tv=testSeq[n];
		curSide=tv.slice(2, 3);
		left0=(curSide=="l");
		//console.log("n:"+n, "SSDups:"+SSDups, "tv:"+tv, "curSide:"+curSide, "left0:"+left0);
		curLeft=left0;
		for (i=1; i<=SSDups && curLeft==left0; i++) {
			tv=testSeq[n-i];
			curSide=tv.slice(2, 3);
			curLeft=(curSide=="l");
			//console.log(i, "tv:"+tv, "curSide:"+curSide, "curLeft:"+curLeft);
		}
		if (curLeft==left0) {
			//console.log("false");
			return false;
		}
	}
	if (CIDups) {
		tv=testSeq[n];
		curType=tv.slice(1, 3);
		congr0=(curType=="ll" || curType=="rr");
		//console.log("n:"+n, "CIDups:"+CIDups, "tv:"+tv, "curType:"+curType, "congr0:"+congr0);
		curCongr=congr0;
		for (i=1; i<=CIDups && curCongr==congr0; i++) {
			tv=testSeq[n-i];
			curType=tv.slice(1, 3);
			curCongr=(curType=="ll" || curType=="rr");
			//console.log(i, "tv:"+tv , "curType:"+curType, "curCongr:"+curCongr);
		}
		if (curCongr==congr0) {
			//console.log("false");
			return false;
		}
	}
	//console.log("true");
	return true;
}

function genSeq(distr, leading, keepSep, maxDups, period) {
	//console.log("genSeq", "leading:"+leading, "keepSep:"+keepSep, "maxDups:"+maxDups);
	var restSeq, curSeq;
	restSeq=new Array();
	curSeq=new Array();
	while (restSeq.length<period) {
		restSeq=restSeq.concat(distr);
	}
	
	//var str, i;
	//str="";
	//for (i=0; i<restSeq.length; i++)
	//	str+=restSeq[i]+" ";
	//console.log(str);
	
	randSeq(curSeq, restSeq, leading, keepSep, maxDups);
	
	//str="";
	//for (i=0; i<curSeq.length; i++)
	//	str+=curSeq[i]+" ";
	//console.log(str);
	return curSeq;
}

function randSeq(curSeq, restSeq, leading, keepSep, maxDups) {
	var seqOk, posLeft, i, testPos, testElem, rndPos, testedElems;
	//var str;
	//str="";
	//for (i=0; i<curSeq.length; i++)
	//	str+=curSeq[i]+" ";
	//console.log(str);
	if (restSeq.length>0) {
		if (checkCurSeq(curSeq, leading, keepSep, maxDups)) {
			posLeft=new Array();
			testedElems= new Array();
			for (i=0; i<restSeq.length; i++)
				posLeft.push(i);
			do {
				rndPos=Math.floor(Math.random()*posLeft.length);
				testPos=posLeft[rndPos];
				posLeft.splice(rndPos, 1);
				testElem=restSeq[testPos];
				if (testedElems.indexOf(testElem)==-1) {
					testedElems.push(testElem);
					curSeq.push(testElem);
					restSeq.splice(testPos, 1);
					seqOk=randSeq(curSeq, restSeq, leading, keepSep, maxDups);
					if (!seqOk) {
						restSeq.splice(testPos, 0, testElem);
						curSeq.pop();
					}
				}
				else
					seqOk=false;
			} while (!seqOk && posLeft.length>0);
		}
		else
			seqOk=false;
	}
	else
		seqOk=checkCurSeq(curSeq, leading, keepSep, maxDups);
	return seqOk;
}

function checkRestSeq(restSeq, keepSep, maxDups) {
	var elem, i, ok, keepSepIndex;
	elem=restSeq[0];
	keepSepIndex=keepSep.indexOf(elem);
	if (restSeq.length>maxDups[keepSepIndex]) {
		ok=false;
		for (i=1; i<restSeq.length && !ok; i++) {
			if (restSeq[i]!=elem) {
				ok=true;
			}
		}
	}
	else {
		ok=true;
	}
	return ok;
}

function checkCurSeq(curSeq, leading, keepSep, maxDups) {
	var i, curDups, elem, curElem, keepSepIndex;
	ok=true;
	curDups=0;
	curElem="";
	for (i=0; i<leading.length && i<curSeq.length && ok; i++) {
		if (curSeq[i]!=leading[i]) {
			ok=false;
		}
	}
	if (ok) {
		for (i=0; i<curSeq.length && ok; i++) {
			elem=curSeq[i];
			if (elem==curElem) {
				curDups++;
			}
			else {
				curDups=0;
			}
			curElem=elem;
			keepSepIndex=keepSep.indexOf(elem);
			if (keepSepIndex>=0 && curDups>maxDups[keepSepIndex]) {
				ok=false;
			}
		}
	}
	return ok;
}

function shuffleArray(arr) {
	var i, r, t;
	for (i=arr.length-1; i>0; i--) {
		r=Math.floor(Math.random()*i);
		t=arr[i];
		arr[i]=arr[r];
		arr[r]=t;
	}
}

function testType(testName) {
	switch (testName) {
		case "9m":
			return "9m";
		case "box":
		case "box31":
			return "box";
		case "spc":
			return "spc";
		case "24m1":
		case "24m2":
		case "24m2h":
			return "24m";
		case "48m":
			return "48m";
		case "adt":
		case "adth":
			return "adt";
		case "phb":
			return "phb";
		case "tbv":
			return "tbv";
		case "nirsv":
			return "nirs";
		case "nirsh":
			return "nirs";
		case "48mn":
			return "nirs";
		case "dev":
			return "dev";
	}
}

function trialTypeCat(trialType) {
	switch (trialType) {
		case "tbvt":
		case "tbvb":
		case "tbvl":
		case "tbvla":
		case "tbvlb":
		case "tbvr":
		case "tbvra":
		case "tbvrb":
		case "bvh":
		case "bvv":
			return "tbv";
		default:
			return trialType;
	}
}

String.prototype.ucfirst = function() {
	return this.charAt(0).toUpperCase() + this.substr(1);
}

function daysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
}

function genDateDescr(year, monthNo, dayNo) {
	return zeroPad(dayNo, 2)+"."+zeroPad(monthNo, 2)+"."+zeroPad(year, 4);
}

function genTimeDescr(hours, mins, secs, mSecs = null) {
	if (mSecs != null) {
		return zeroPad(hours, 2)+":"+zeroPad(mins, 2)+":"+zeroPad(secs, 2)+"."+zeroPad(mSecs, 3);
	}
	else {
		return zeroPad(hours, 2)+":"+zeroPad(mins, 2)+":"+zeroPad(secs, 2);
	}
}

function genAgeDescr(birthYear, birthMonth, birthDay) {
	//console.log("genAgeDescr", birthYear, birthMonth, birthDay);
	var now = new Date();
	var descr = "";
	var sep = "";
	var dYears = 0;
	var dMonths = 0;
	var dDays = 0;
	
	if (birthYear > 0) {
		dYears = now.getFullYear() - birthYear;
		if (dYears >= 0) {
			if (birthMonth > 0) {
				dMonths = now.getMonth() + 1 - birthMonth;
				if (dMonths < 0 && dYears > 0) {
					dYears -= 1;
					dMonths += 12;
				}
				if (dMonths >= 0) {
					
					if (birthDay > 0) {
						dDays = now.getDate() - birthDay;
						if (dDays < 0 && dMonths > 0) {
							dMonths -= 1;
							dDays += daysInMonth(birthYear, birthMonth)
						}
					}
				}
			}
		}
	}
	
	if (dYears > 0) {
		descr = descr + sep + singularPlural(dYears, "year");
		sep = ", ";
	}
	
	if (dMonths > 0) {
		descr = descr + sep + singularPlural(dMonths, "month")
		sep = ", ";
	}
	
	if (dDays > 0) {
		descr = descr + sep + singularPlural(dDays, "day")
		sep = ", ";
	}
	
	return descr;
}

function singularPlural(no, labelSingular) {
	if (no == 1) {
		return no+" "+labelSingular;
	}
	else {
		return no+" "+labelSingular+"s";
	}
}

function genClockDescr(ts) {
	var date = new Date(ts);
	var dayNo = date.getDate();
	var monthNo = date.getMonth() + 1;
	var year = date.getFullYear();
	var hours = date.getHours();
	var mins = date.getMinutes();
	var secs = date.getSeconds();
	var mSecs = date.getMilliseconds();
	return genDateDescr(year, monthNo, dayNo)+" "+genTimeDescr(hours, mins, secs, mSecs);
}

function genClockDescrTime(ts) {
	var date = new Date(ts);
	var hours = date.getHours();
	var mins = date.getMinutes();
	var secs = date.getSeconds();
	var mSecs = date.getMilliseconds();
	return genTimeDescr(hours, mins, secs, mSecs);
}


