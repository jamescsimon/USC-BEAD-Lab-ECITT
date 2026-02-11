function respDeclareGlobals() {
	//console.log("respDeclareGlobals");
	curTrialStartedTime=0;
	
	curRewarded="";
	curEmp="";
	curEmpType="";
	curAnim="";
	curTotalTrials=0;
	prevAnim="";
	curAnimDups=0;
	curLayout="";
	nextInitImageNo=0;
	curVideoNo = 0;
	curVideoName = null;
	
	curGame="";
	
	curVideoElem = null;
	
	curGameInstance=null;
	
	curOffline="no";
	curOfflineApp="";
	
	curSpcImagePairList=null;
	curSpcImageIndexList=null;
	
	allSpcImageIndices=Array("stim_left", "stim_cntr", "stim_rght", "button_L", "button_R");
	curSpcStimsShown=false;
	
	allRespCellElems=getElementsByTagNameDataItem("td", "type", "respCell", false);
	allRespCellElemArray=getElementsByTagNameDataItem("td", "type", "respCell", true);
	
	allStimCellElems=getElementsByTagNameDataItem("td", "type", "stimCell", false);
	allStimCellElemArray=getElementsByTagNameDataItem("td", "type", "stimCell", true);
	
	allHorPageElemArray=getElementsByTagNameDataItem("div", "hor", "yes", true);
	
	allRespElems=getElementsByTagNameDataItem("div", "type", "respElem", false);
	allRespElemArray=getElementsByTagNameDataItem("div", "type", "respElem", true);
	
	initImageCell=document.getElementById("initImageCell");
	
	cacheMsgCell=document.getElementById("cacheMsgCell");
	cacheMsgRow=document.getElementById("cacheMsgRow");
	loadResButt=document.getElementById("loadResButt");
	reloadAppButt=document.getElementById("reloadAppButt");
	
	trialPending=false;
	waitForSuccess = false;
	
	curRotateHor = false;
	
	curTotalReactionTime=0;
	curTrialCount=0;
	
	curTestStage="";
	curProgressMessage="";
	curProgressAnim="";
	curProgressButton="";
	
	curProjectNo=0;
	curTestSetNo=0;
	curPartNo=0;
	curTransTrialType="";
	curTransTrialVar="";
	curRepeat=0;
	
	prevRespTime=0;
	dotPressed=0;
	requireReadyHold=false;
	waitingForHoldToStart=false;
	holdToStartMs=0;
	holdToStartTimer=null;
	allowReadyMessage=true;
	pendingReadyMessageData=null;
	readyMessageShown=false;
	
	trialQueue=new Array();
	curRandomVarList=new Array();
	curSpcSingleVarList=new Array();
	curSpcDoubleVarList=new Array();
	
	showingClock = false;
	
	prevTrialId = "";
	// Section Tracking (for telemetry)
	curSection = "";  // ReadyScreen, PromptScreen, FeedbackScreen, EndScreen
	curStimuliShown = "";  // Track what stimulus/animation is currently displayed
	curControllerName = "";  // Logged-in controller name (for telemetry)
	
	// Local CSV backup (Task 4)
	localTestCSVRows = [];  // In-memory buffer for CSV rows during test
	localTestCSVStartTime = 0;  // Timestamp when test started
	localTestName = "";  // Name of current test for filename
}

// Initialization

function respInit(scrolling, cached, preload, environment, offline, offlineApp, remote, rotateHor, recLoc) {
	//console.log("respInit");
	libDeclareGlobals();
	mediaDeclareGlobals();
	commDeclareGlobals();
	respDeclareGlobals();
	//window.ononline = windowIsOnline;
	//window.onoffline = windowIsOffline;
	document.onvisibilitychange = visibilityChanged;
	
	if (recLoc == "yes") {
		//navigator.geolocation.getCurrentPosition(getCurrentPositionSuccess, getCurrentPositionError, positionOptions);
	}
	
	if (rotateHor == "yes") {
		curRotateHor = true;
	}
	
	if (curRotateHor) {
		allHorPageElemArray.forEach(rotatePageElem);
	}
	
	curOffline=offline;
	curOfflineApp=offlineApp;
	partner="cntr";
	
	//if (cached=="yes") {
	//	cacheDeclareGlobals();
	//}
	
	getInitialGlobalKeys();
	
	initWindow("resp", scrolling, cached, preload, environment);
	onbeforeunload = respFinalize;
	serviceWorkerRegistrationOkHandler = swRegOk;
	serviceWorkerReadyHandler = swReady;
	cachedHandler = reportCached;
	cacheOkHandler = reportCacheOk;
	
	//newAppVersionDetectedHandler = showUpdateRow;
	
/*
	showHtmlElemWithId("cacheMsgRow");
	if (curCached) {
		applicationCache.onchecking=respCacheChecking;
		applicationCache.onnoupdate=respCacheNoUpdate;
		applicationCache.onprogress=respCacheProgress;
		applicationCache.onupdateready=respCacheUpdateReady;
		applicationCache.oncached=respCacheCached;
		applicationCache.onerror=respCacheError;
	}
	else {
		authenticate();
	}
 */
	authenticate();
}

function swRegOk() {
	//console.log("swRegOk");
}

function swReady() {
	//console.log("swReady");
}

function reportCached(data) {
	//console.log(data);
	replaceTextInElemWithId("cacheMsgCell", "Cached "+data.urlNo+"/"+data.noOfUrls);
}

function reportCacheOk(data) {
	//console.log("reportCacheOk");
	respInit1();
}

function authOk() {
	//console.log("authOk");
	showPage("loadRes");
	replaceTextInElemWithId("cacheMsgCell", "Checking Cache");
	getTestsDoc(authOk1);
}

function authOk1() {
	//console.log("authOk1, inclNirs: "+inclNirs);
	//console.log(testsDoc);
	var testName;
	var testElem;
	var testsElem;
	testsElem = testsDoc.documentElement;
	//console.log(testsElem);
	testElem = testsElem.firstChild;
	//console.log(testElem);
	while (testElem != null && !inclNirs) {
		//console.log(testElem);
		testName = testElem.getAttribute("name");
		if (testType(testName) == "nirs") {
			inclNirs = true;
		}
		testElem = testElem.nextSibling;
	}
	//console.log("inclNirs: "+inclNirs);
	setTimeout(checkCache, 100);
}

function showUpdateRow() {
	//console.log("showUpdateRow");
	showHtmlElemWithId("updateAppRow");
}

function respInit1() {
	//console.log("respInit1");
	showHtmlElemWithId("startPairingRow");
	showHtmlElemWithId("signOutRow");
	hideHtmlElemWithId("updateAppRow");
	replaceTextInElemWithId("cacheMsgCell", "Getting Configuration Files");
	//if (curOffline != "yes" && (!soundsLoaded || !mediaResourcesLoaded() || !imagesLoaded || !configsDoc)) {
	//if (curOffline != "yes" && (!mediaResourcesLoaded() || !configsDoc)) {
	if (curOffline != "yes") {
		getConfigsDoc(respInit2);
	}
	else {
		resp_reinit();
	}
}

function respInit2() {
	//console.log("respInit2");
	getLocsDoc(respInit3);
}

function respInit3() {
	//console.log("respInit3");
	//console.log(locsDoc);
	replaceTextInElemWithId("cacheMsgCell", "Preparing Audio");
	mediaLoadResources(respInit4);
}

function respInit4() {
	//console.log("respInit4");
	replaceTextInElemWithId("cacheMsgCell", "Ready");
	gameDeclareGlobals();
	if (curPreload) {
		//console.log("respInit4, ignoring preload");
		//showPage("loadRes");
		//replaceTextInElemWithId("connectPageTitle", "Loading Media");
		//mediaLoadMedia(respInit5);
	}
	//else {
	respInit5();
	//}
}

function respInit5() {
	//console.log("respInit5");
	resp_reinit();
	// Initialize button indicator for visual feedback
	initializeButtonIndicator();
}

/*
function respLoadMedia() {
	if (buttonsEnabled()) {
		showPage("loadRes");
		mediaLoadMedia(respInit5);
	}
}
*/

function respFinalize() {
	//console.log("respFinalize");
	resp_stopTimers();
	closeEventSources();
	finalizeWindow();
	if (curGameInstance) {
		curGameInstance.finalize();
		curGameInstance=null;
	}
	if (showingClock) {
		hideClock()
	}
	logNewGlobalKeys();
}

function resp_reinit() {
	console.log("resp_reinit called");
	//newAppVersionWarningIssued=false;
	if (curOffline!="yes") {
		resetErrorCount();
		curTestName="";
		reInitTrialState();
		if (curGameInstance) {
			curGameInstance.finalize();
			curGameInstance=null;
		}
		if (showingClock) {
			hideClock()
		}
		replaceTextInElemWithId("connectPageTitle", "Ready to Connect");
		normalizeClassOfElemWithId("startPairingButt");
		connectState = connectStateNotConnected;
		if (typeof updateConnectionState === "function") {
			updateConnectionState({
				connection_state: "disconnected",
				controller_ready: "false",
				responder_ready: "false",
				last_event: "responder_reset"
			});
		}
		// Clear server-side event queue FIRST to prevent stale events
		if (typeof clearServerEventQueue === "function" && curUserName) {
			clearServerEventQueue(curUserName);
		}
		// Upload any remaining trial records BEFORE clearing localStorage
		if (typeof batchSendAllRecords === "function") {
			batchSendAllRecords();
		} else if (typeof flushRecordQueue === "function") {
			flushRecordQueue();
		}
		// Now clear localStorage records after upload
		if (typeof clearAllRecordQueue === "function") {
			clearAllRecordQueue();
		}
		showPage("connect");
		clearReadyMessage();
		
		// Ensure button is enabled after showing page
		setTimeout(function() {
			var startPairingButt = document.getElementById("startPairingButt");
			if (startPairingButt) {
				console.log("resp_reinit: Ensuring startPairingButt is enabled");
				enableNode(startPairingButt);
				// Test if button has onclick handler
				var onclickAttr = startPairingButt.getAttribute("onclick");
				console.log("resp_reinit: startPairingButt onclick attribute:", onclickAttr);
				if (!onclickAttr || onclickAttr.indexOf("flipPairing") === -1) {
					console.warn("resp_reinit: Button onclick not set correctly! Re-enabling...");
					setActionAttrs(document.getElementById("connect_page"));
				}
			} else {
				console.warn("resp_reinit: startPairingButt element not found!");
			}
		}, 100);
	}
	else {
		startOfflineApp();
	}
}

function startOfflineApp() {
	switch (curOfflineApp) {
		case "frog":
			curGame="frog";
			showPage("canvas");
			curFrogGame=new FrogGame();
			curFrogGame.initiate();
			break;
		case "bfly":
			curGame="bfly";
			showPage("canvas");
			curBflyGame=new BflyGame();
			curBflyGame.initiate();
			break;
		case "bubble":
			curGame="bubble";
			showPage("canvas");
			curBubbleGame=new BubbleGame();
			curBubbleGame.initiate();
		case "snowflake":
			curGame="snowflake";
			showPage("canvas");
			curSnowflakeGame=new SnowflakeGame();
			curSnowflakeGame.initiate();
		break;
	}
}

function reInitTrialState() {
	console.log("[RESPONDER] reInitTrialState - clearing all trial state");
	curTestName="";
	curTrialType="";
	curTrialVar="";
	curTrialPhase="";
	curTrialStartedTime=0;
	curRewarded="";
	curEmp="";
	curEmpType="";
	curReadyList=new Array();
	curButtonTypeList=new Array();
	
	if (curAnim) {
		stopAnimSound(curAnim);
		curAnim="";
	}
	
	stopCurVideo();
	
	prevRespTime=0;
	dotPressed=0;
	moveEvents=0;
	requireReadyHold=false;
	waitingForHoldToStart=false;
	holdToStartTimer=null;
	allowReadyMessage=true;
	pendingReadyMessageData=null;
	readyMessageShown=false;
	
	trialPending=false;
	resp_stopTimers();
	
	initTrialQueue();
	
	curTotalReactionTime=0;
	curTrialCount=0;
	waitForSuccess = false;
	console.log("[RESPONDER] reInitTrialState complete - queue cleared, trialPending:", trialPending);
}

function initTrialQueue() {
	//console.log("initTrialQueue")
	trialQueue=new Array();
	curRandomVarList=new Array();
	curSpcSingleVarList=new Array();
	curSpcDoubleVarList=new Array();
}

// Timestamp Formatting Functions (Task 7)

function formatTimestampHHMMSSMMM() {
	var now = new Date();
	var h = now.getHours().toString().padStart(2, '0');
	var m = now.getMinutes().toString().padStart(2, '0');
	var s = now.getSeconds().toString().padStart(2, '0');
	var ms = now.getMilliseconds().toString().padStart(3, '0');
	return h + ":" + m + ":" + s + "." + ms;
}

function formatDateYYYYMMDD(date) {
	if (!date) date = new Date();
	var y = date.getFullYear();
	var m = (date.getMonth() + 1).toString().padStart(2, '0');
	var d = date.getDate().toString().padStart(2, '0');
	return y + "-" + m + "-" + d;
}

// Button Indicator Flash (Task 1.6)

function initializeButtonIndicator() {
	var indicator = document.getElementById('buttonIndicator');
	if (!indicator) {
		indicator = document.createElement('div');
		indicator.id = 'buttonIndicator';
		indicator.style.position = 'fixed';
		indicator.style.bottom = '10px';
		indicator.style.left = '10px';
		indicator.style.width = '2cm';
		indicator.style.height = '2cm';
		indicator.style.backgroundColor = 'black';
		indicator.style.border = '1px solid #555';
		indicator.style.zIndex = '9999';
		document.body.appendChild(indicator);
		console.log("[INDICATOR] Button indicator created");
	}
}

function flashButtonIndicator() {
	var indicator = document.getElementById('buttonIndicator');
	if (!indicator) {
		console.warn("[INDICATOR] Button indicator not found");
		return;
	}
	// Flash white for 3ms
	indicator.style.backgroundColor = 'white';
	setTimeout(function() {
		indicator.style.backgroundColor = 'black';
	}, 3);
}

// Telemetry Event Logging (Task 3)

function logTelemetryEvent(section, stimuli, invokedBy, accuracy) {
	// Skip if not in active test
	if (!curUserName || !curTestName) {
		//console.log("[TELEMETRY] Skipping event - no active test");
		return;
	}
	
	var now = new Date();
	var testDate = formatDateYYYYMMDD(now);
	var timestamp = formatTimestampHHMMSSMMM();
	
	var telemetryData = {
		testDate: testDate,
		timestamp: timestamp,
		responserName: curUserName,
		controllerName: curControllerName || "unknown",
		section: section || curSection,
		stimuli: stimuli || curAnim,
		invokedBy: invokedBy,
		accuracy: accuracy || "n/a",
		projectName: curProjectNo,
		testSetName: curTestSetNo,
		testName: curTestName,
		trialsRemaining: trialQueue.length
	};
	
	sendTelemetryToServer(telemetryData);
}

function sendTelemetryToServer(telemetryData) {
	// Build CSV row in correct field order
	var csvRow = telemetryData.testDate + "," +
		telemetryData.timestamp + "," +
		telemetryData.responserName + "," +
		telemetryData.controllerName + "," +
		telemetryData.section + "," +
		telemetryData.stimuli + "," +
		telemetryData.invokedBy + "," +
		telemetryData.accuracy + "," +
		telemetryData.projectName + "," +
		telemetryData.testSetName + "," +
		telemetryData.testName + "," +
		telemetryData.trialsRemaining;
	
	var requestStr = "../csvdata/?type=telemetryEvent&data=" + encodeURIComponent(csvRow);
	console.log("[TELEMETRY] Sending event:", telemetryData.invokedBy, "from", telemetryData.section);
	
	sendXmlOp(requestStr, function(statusElem) {
		if (statusElem && statusElem.tagName == "ok") {
			console.log("[TELEMETRY] Event logged successfully");
		} else {
			console.warn("[TELEMETRY] Event logging failed");
		}
	});
}

// Local CSV Backup Functions (Task 4)

function initializeLocalTestCSV() {
	console.log("[LOCAL CSV] Initializing local backup CSV for test");
	localTestCSVRows = [];
	localTestCSVStartTime = Date.now();
	localTestName = curTestName;
}

function appendToLocalTestCSV(csvRow) {
	if (!localTestCSVRows) {
		console.warn("[LOCAL CSV] Local CSV buffer not initialized");
		return;
	}
	localTestCSVRows.push(csvRow);
	//console.log("[LOCAL CSV] Appended row, buffer size:", localTestCSVRows.length);
}

function saveLocalTestCSV() {
	if (!localTestCSVRows || localTestCSVRows.length === 0) {
		console.log("[LOCAL CSV] No records to save for local backup");
		return;
	}
	
	var filename = "test_" + localTestCSVStartTime + "_" + localTestName + ".csv";
	var csvContent = localTestCSVRows.join("\n");
	
	// Store in localStorage as backup
	try {
		localStorage.setItem("localCSV_" + filename, csvContent);
		console.log("[LOCAL CSV] Saved backup:", filename, "with", localTestCSVRows.length, "rows");
	} catch (e) {
		console.warn("[LOCAL CSV] Storage failed:", e.message);
		if (e.name === 'QuotaExceededError') {
			console.warn("[LOCAL CSV] Storage quota exceeded - local backup not saved");
		}
	}
	
	// Clear buffer
	localTestCSVRows = [];
}

// Local CSV Download/Recovery Functions (Task 8)

function getStoredLocalCSVs() {
	var csvs = [];
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if (key && key.startsWith("localCSV_")) {
			csvs.push({
				key: key,
				name: key.substring(9)  // Remove "localCSV_" prefix
			});
		}
	}
	console.log("[LOCAL CSV] Found", csvs.length, "stored CSV backups");
	return csvs;
}

function downloadLocalCSV(storageKey) {
	var content = localStorage.getItem(storageKey);
	if (!content) {
		console.warn("[LOCAL CSV] No content found for key:", storageKey);
		return;
	}
	
	var filename = storageKey.substring(9);  // Remove "localCSV_" prefix
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(content));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
	console.log("[LOCAL CSV] Downloaded backup:", filename);
}

function listStoredLocalCSVs() {
	var csvs = getStoredLocalCSVs();
	if (csvs.length === 0) {
		console.log("[LOCAL CSV] No stored CSV backups available");
		return;
	}
	console.log("[LOCAL CSV] Stored backups:");
	for (var i = 0; i < csvs.length; i++) {
		var content = localStorage.getItem(csvs[i].key);
		var rowCount = content ? content.split('\n').length - 1 : 0;  // Subtract 1 for last empty line
		console.log("  [" + (i+1) + "] " + csvs[i].name + " (" + rowCount + " rows)");
	}
}

// Button Responders

function flipPairing() {
	// Check buttonsEnabled FIRST before doing anything else
	var enabled = buttonsEnabled();
	console.log("flipPairing called", "connectState: "+connectState, "buttonsEnabled:", enabled);
	
	if (!enabled) {
		console.warn("flipPairing: buttons not enabled!");
		return;
	}
	
	// CRITICAL FIX: Don't update UI if already connected
	// connectState values: 0=NotConnected, 1=Connecting, 3=Connected
	if (connectState === 3) {
		console.log("flipPairing: already connected (connectState: 3), ignoring call");
		return;
	}
	
	// IMMEDIATE UI FEEDBACK - Update UI right away, before any async operations
	var connectPageTitle = document.getElementById("connectPageTitle");
	if (connectPageTitle && typeof replaceTextInElemWithId !== 'undefined') {
		console.log("flipPairing: Immediately updating UI to 'Connecting...'");
		replaceTextInElemWithId("connectPageTitle", "Connecting...");
	} else {
		console.warn("flipPairing: connectPageTitle element not found or replaceTextInElemWithId undefined!");
	}
	
	playSound("wetClick");
	console.log("flipPairing, buttonsEnabled");
	switch (connectState) {
		case connectStateConnecting:
			console.log("flipPairing, abort");
			abort();
			break;
		case connectStateNotConnected:
			console.log("flipPairing, startPairing");
			if (navigator.onLine) {
				startPairing();
			}
			else {
				console.warn("flipPairing: navigator.onLine is false");
				abort();
			}
			break;
		default:
			console.log("flipPairing: default case, connectState:", connectState);
			break;
	}
}

function startPairing() {
	//console.log("startPairing", "connectState: "+connectState);
	if (connectState == connectStateNotConnected) {
		setTimeout(initConnection, 100);
	}
}

function initConnection() {
	console.log("initConnection called", "connectState: "+connectState);
	connectState = connectStateConnecting;
	console.log("initConnection: set connectState to Connecting");
	if (typeof updateConnectionState === "function") {
		updateConnectionState({
			connection_state: "connecting",
			responder_ready: "true",
			last_event: "responder_available"
		});
	}
	// Update UI immediately to show we're connecting
	if (typeof replaceTextInElemWithId !== 'undefined') {
		var connectPageTitle = document.getElementById("connectPageTitle");
		if (connectPageTitle) {
			replaceTextInElemWithId("connectPageTitle", "Connecting...");
		}
	}
	initEventSourceResp();
	console.log("initConnection: initEventSourceResp called, connectState:", connectState);
}

/*
 function reInitConnection() {
 console.log("reInitConnection", "connectState: "+connectState);
 connectState = connectStateReConnecting;
 reInitEventSourceResp();
 //console.log("connectState: "+connectState);
 }
 */

function eventSourceRespOpen() {
	console.log("eventSourceRespOpen called", "connectState: "+connectState);
	if (connectState == connectStateConnecting) {
		console.log("eventSourceRespOpen: updating UI to 'Available for Connection'");
		replaceTextInElemWithId("connectPageTitle", "Available for Connection");
		highlightClassOfElemWithId("startPairingButt");
		//setTimeout(cancelPairing, 10000);
	}
	if (connectState == connectStateReconnecting) {
		//highlightClassOfElemWithId("startPairingButt");
		connectState = connectStateConnected
		flushEventRequestQueue();
		console.log("eventSourceRespOpen: reconnecting, set state to Connected");
	}
}

/*
 function eventSourceRespReOpen() {
 console.log("eventSourceRespReOpen", "connectState: "+connectState);
 }
 */

function cancelPairing() {
	//console.log("cancelPairing", "connectState: "+connectState);
	if (connectState != connectStateConnected) {
		abort();
	}
}

function initEventSourceResp() {
	// Using polling instead of EventSource for local testing
	console.log("initEventSourceResp - starting polling");
	startConnectionPolling("responder", handleRespConnectionStateChange);
	// Start event polling to receive test commands from controller
	startEventPolling("resp", curUserName);
}

function handleRespConnectionStateChange(state) {
	// Reduce console spam - only log state changes
	// console.log("handleRespConnectionStateChange:", state);
	// Check if controller sent connect event
	if (state.connection_state == "connecting" && connectState == connectStateConnecting) {
		connectState = connectStateConnected;
		if (typeof updateConnectionState === "function") {
			updateConnectionState({
				connection_state: "connected",
				responder_ready: "true",
				last_event: "responder_connected"
			});
		}
		normalizeClassOfElemWithId("pairingButt");
		replaceTextInElemWithId("pairingMsg", "Connected to Controller");
		console.log("Responder connected - event polling active");
		
		// Show ready page after successful connection
		clearReadyMessage();
		showReadyPage();
		
		// Clear any stale trial records from previous sessions
		if (typeof clearAllRecordQueue === "function") {
			console.log("[RESPONDER] Clearing stale localStorage records on new connection");
			clearAllRecordQueue();
		}
	}
}

/*
 function reInitEventSourceResp() {
 var eventSource;
 //console.log("initEventSourceResp");
 eventSource=initEventSource("resp", curUserName, eventSourceRespOpen);
 eventSource.addEventListener("connect", connectFromCntr, false);
 eventSource.addEventListener("disconnect", disconnectFromCntr, false);
 
 eventSource.addEventListener("flipClock", flipClockFromCntr, false);
 eventSource.addEventListener("hideClock", hideClockFromCntr, false);
 
 eventSource.addEventListener("startGame", startGameFromCntr, false);
 eventSource.addEventListener("pressButton", pressButtonFromCntr, false);
 //eventSource.addEventListener("gameActiveOk", gameActiveOkFromCntr, false);
 eventSource.addEventListener("endGame", endGameFromCntr, false);
 eventSource.addEventListener("touchGame", touchGameFromCntr, false);
 
 eventSource.addEventListener("startTest", startTestFromCntr, false);
 eventSource.addEventListener("startTrial", startTrialFromCntr, false);
 eventSource.addEventListener("startMultiTrials", startMultiTrialsFromCntr, false);
 eventSource.addEventListener("cancelTrial", cancelTrialFromCntr, false);
 
 eventSource.addEventListener("endTrials", endTrialsFromCntr, false);
 eventSource.addEventListener("endTest", endTestFromCntr, false);
 
 eventSource.addEventListener("setReadyMessage", setReadyMessageFromCntr, false);
 eventSource.addEventListener("clearReadyMessage", clearReadyMessageFromCntr, false);
 }
 */

function dotButtonPressed(event) {
	//console.log("dotButtonPressed");
	flashButtonIndicator();  // Visual feedback (Task 1.6)
	dotPressed=1;
}

function trialSuccess() {
	console.log("[RESPONDER] trialSuccess called - This should only happen for certain trial types");
	console.trace("[RESPONDER] trialSuccess call stack");
	var trialTime;
	trialTime = Date.now() - curTrialStartedTime;
	console.log("[RESPONDER] trialSuccess - calling recordAndReport");
	recordAndReport(curProjectNo, curTestSetNo, curTestName, curPartNo, 0, curTrialStartedTime, curTransTrialType, curTrialPhase, curTotalTrials+1, curTransTrialVar, 1, 0, 0, trialTime, "", "", 0, 0, trialQueue.length);
	trialPending=false;
	reInitTrialState();
	hideAllRespElems();
	showReadyPage();
	resetTimeoutTimer("trialEndedTimer", sendTrialEnded, 100);
}

function stopCurVideo() {
	//console.log("stopCurVideo, curVideoName: "+curVideoName);
	if (curVideoElem) {
		//console.log("curVideoElem: "+curVideoElem);
		//curVideoElem.pause()
		curVideoElem.setAttribute("src", "")
		curVideoElem = null;
	}
	if (curVideoName) {
		stopSound("nirs/"+curVideoName);
	}
}

function buttonPressed(button, event) {
	console.log("[RESPONDER] buttonPressed CLICKED:", button, "curTestName:", curTestName, "curTrialType:", curTrialType);
	flashButtonIndicator();  // Visual feedback (Task 1.6)
	if (firstTouchTime == null) {
		firstTouchTime = Date.now();
	}
	var touchTime, reactionTime, trialTime, accuracy, eventData;
	var buttonElem;
	if (buttonsEnabled()) {
		//console.log("buttonsEnabled");
		if (event) {
			event.preventDefault();
		}
		if (!waitForSuccess) {
			buttonElem=document.getElementById(curLayout+"_"+button+"_button_resp");
			touchTime = firstTouchTime - curTrialStartedTime;
			reactionTime = Date.now() - curTrialStartedTime;
			trialTime = reactionTime;
			curTrialCount++;
			curTotalReactionTime+=reactionTime;
			avgReactionTime=Math.round(curTotalReactionTime/curTrialCount);
			if (button==curRewarded) {
				accuracy=1;
			}
			else {
				accuracy=0;
			}
			console.log("[RESPONDER] buttonPressed - calling recordAndReport, button:", button, "accuracy:", accuracy);
			recordAndReport(curProjectNo, curTestSetNo, curTestName, curPartNo, prevRespTime, curTrialStartedTime, curTransTrialType, curTrialPhase, curTotalTrials+1, curTransTrialVar, accuracy, touchTime, reactionTime, trialTime, button, curAnim, dotPressed, moveEvents, trialQueue.length);
			logTelemetryEvent("PromptScreen", curAnim, "Responder_" + button, accuracy);  // Log button press (Task 3)
			dotPressed=0;
			moveEvents=0;
			prevRespTime=Date.now();
		}
		if (button==curRewarded) {
			waitForSuccess = false
			switch (testType(curTestName)) {
				case "9m":
				case "24m":
				case "48m":
				case "spc":
				case "nirs":
					hideAllSpcStims();
					hideAllRespElems();
					showRespElem(curLayout, button, "anim");
					initAnimPlayer(document.getElementById(curLayout+"_"+button+"_anim"), curAnim);
					playAnimSound(curAnim);
					setTimeout(showNextRewAnimFrame, 100);
					if (curAnim==prevAnim)
						curAnimDups++;
					else {
						prevAnim=curAnim;
						curAnimDups=0;
					}
					break;
				case "adt":
					switch (curTestName) {
						case "adt":
							adtFinalizeButtonPressed(avgReactionTime, "", "mdl");
							break;
						case "adth":
							adtFinalizeButtonPressed(avgReactionTime, "Hor", "ctr");
							break;
					}
					break;
				default:
					break;
			}
		}
		else {
			switch (curTestName) {
				case "9m":
				case "spc":
				case "24m1":
					hideAllSpcStims();
					hideAllRespElems();
					resetTimeoutTimer("trialEndedTimer", trialEnded, 1000);
					break;
				case "24m2":
				case "24m2h":
				case "nirsv":
				case "nirsh":
				case "48m":
				case "48mn":
					waitForSuccess = true
					break;
				case "adt":
					adtFinalizeButtonPressed(avgReactionTime, "", "mdl");
					break;
				case "adth":
					adtFinalizeButtonPressed(avgReactionTime, "Hor", "ctr");
					break;
			}
		}
	}
	//console.log("buttonPressed exit");
}

function adtFinalizeButtonPressed(avgReactionTime, orientation, buttonPos) {
	//console.log("adtFinalizeButtonPressed", "curLayout: "+curLayout);
	hideAllRespElems();
	if (curRepeat > 1) {
		showRespElem("ecittTriple"+orientation, buttonPos, "button_dot");
		resetTimeoutTimer("trialEndedTimer", trialEnded, 1000);
	}
	else {
		clearEndMessage();
		showEndPage();
		replaceTextInElemWithId("endMessagePara1Top", "Average reaction time: "+avgReactionTime+" ms.");
		replaceTextInElemWithId("endMessagePara2Top", "Well done!");
		if (curTrialCount > 4) {
			curAnim="adt";
			initAnimPlayer(document.getElementById("end_btm_readyCell"), curAnim);
			adtAnimSoundDelayTimer=setTimeout(playAnimSound, 3000, curAnim);
			showNextAnimFrame(showNextEndAnimFrame, trialEnded);
		}
		else {
			setTimeout(trialEnded, 1000);
		}
	}
}

function showNextEndAnimFrame() {
	//console.log("showNextEndAnimFrame");
	showNextAnimFrame(showNextEndAnimFrame, trialEnded);
}

function trialEnded() {
	console.log("[RESPONDER] trialEnded - queue length:", trialQueue.length);
	var dataItems;
	if (trialQueue.length > 0) {
		console.log("[RESPONDER] More trials in queue, starting next");
		eventData = trialQueue.shift();
		startTrial(eventData);
	}
	else {
		console.log("[RESPONDER] All trials complete, resetting and notifying controller");
		trialPending = false;
		
		// Clear trial state but DON'T stop timers/polling yet
		curTestName="";
		curTrialType="";
		curTrialVar="";
		curTrialPhase="";
		initTrialQueue();
		
		// Restart event polling FIRST so controller can poll and receive events
		if (typeof startEventPolling === "function" && curUserName) {
			console.log("[RESPONDER] Restarting polling");
			startEventPolling("resp", curUserName);
		}
		
		// CRITICAL: Upload responder's trial data, then notify controller
		if (typeof batchSendAllRecords === "function") {
			console.log("[RESPONDER] Uploading trial data after natural completion");
			batchSendAllRecords(function() {
				console.log("[RESPONDER] Upload complete, sending trialEnded event to controller");
				sendEvent("cntr", "trialEnded", "");
			});
		} else {
			// Fallback if batchSendAllRecords doesn't exist
			console.log("[RESPONDER] Sending trialEnded event to controller");
			sendEvent("cntr", "trialEnded", "");
		}
		
		// Reset UI state
		hideAllRespElems();
		clearReadyMessage();
		showReadyPage();
		
		console.log("[RESPONDER] trialEnded complete");
	}
}

function sendTrialEnded() {
	sendEvent("cntr", "trialEnded", "");
}

// Handlers

function showNextRewAnimFrame() {
	//console.log("showNextRewAnimFrame");
	showNextAnimFrame(showNextRewAnimFrame, trialEnded);
}

// Event Handlers

function showReadyPage() {
	//console.log("showReadyPage", "curTestName: "+curTestName);
	curSection = "ReadyScreen";  // Track section change
	logTelemetryEvent("ReadyScreen", "", "Responder_ReadyScreenShown", "n/a");  // Log ready screen (Task 3)
	if (curTestName == "adth" && curRotateHor) {
		rotatePageElemWithId("ready_page");
	}
	else {
		straightenPageElemWithId("ready_page");
	}
	showPage("ready");
}

function showEndPage() {
	//console.log("showEndPage", "curTestName: "+curTestName);
	curSection = "EndScreen";  // Track section change
	logTelemetryEvent("EndScreen", "", "Responder_EndScreenShown", "n/a");  // Log end screen (Task 3)
	if (curTestName == "adth" && curRotateHor) {
		rotatePageElemWithId("end_page");
	}
	else {
		straightenPageElemWithId("end_page");
	}
	showPage("end");
}

function connectFromCntr(event) {
	//console.log("connectFromCntr", "connectState: "+connectState);
	normalizeClassOfElemWithId("startPairingButt");
	clearReadyMessage();
	showReadyPage();
	sendEvent("cntr", "connected", curPosLat+","+curPosLng);
	connectState = connectStateConnected;
	//console.log("connectState: "+connectState);
}

function removePrevAnim(anim) {
	return (anim!=prevAnim);
}

function flipClockFromCntr(event) {
	//console.log("flipClockFromCntr, data:"+event.data);
	if (!showingClock) {
		sendEvent("cntr", "showingClock", "");
		var dataItems = event.data.split(",");
		var i = 0;
		var partNo = dataItems[i++];
		var partRef = dataItems[i++];
		var birthYear = dataItems[i++];
		var birthMonth = dataItems[i++];
		var birthDay = dataItems[i++];
		showClock(partNo, partRef, birthYear, birthMonth, birthDay);
	}
	else {
		sendEvent("cntr", "hidingClock", "");
		hideClock()
	}
}

function hideClockFromCntr(event) {
	//console.log("hideClockFromCntr");
	if (showingClock) {
		sendEvent("cntr", "hidingClock", "");
		showingClock = false;
		hideClock()
	}
}

function showClock(partNo, partRef, birthYear, birthMonth, birthDay) {
	//console.log("showClock", "partNo: "+partNo, "partRef: "+partRef, "birthYear: "+birthYear, "birthMonth: "+birthMonth);
	showingClock = true;
	updateClock();
	replaceText(window["clock_partRefCell"], "Part no: "+partNo+", Part ref: "+partRef);
	replaceText(window["clock_partBirthCell"], "Birthdate: "+genDateDescr(birthYear, birthMonth, birthDay));
	replaceText(window["clock_partAgeCell"], "Age: "+genAgeDescr(birthYear, birthMonth, birthDay));
	showPage("clock");
}

function updateClock() {
	var ts = Date.now();
	var date = new Date(ts);
	//replaceText(window["clock_localTimeCell"], date.toUTCString());
	var dayNo = date.getDate();
	var monthNo = date.getMonth() + 1;
	var year = date.getFullYear();
	var hours = date.getHours();
	var mins = date.getMinutes();
	var secs = date.getSeconds();
	var mSecs = date.getMilliseconds();
	replaceText(window["clock_camTimeCell"], genDateDescr(year, monthNo, dayNo)+" "+genTimeDescr(hours, mins, secs, mSecs));
	//replaceText(window["clock_timestampCell"], ""+ts);
	resetTimeoutTimer("clockTimer", updateClock, 1);
}

function hideClock() {
	showingClock = false;
	//removeChildren(window["clock_localTimeCell"]);
	removeChildren(window["clock_camTimeCell"]);
	//removeChildren(window["clock_timestampCell"]);
	removeChildren(window["clock_partRefCell"]);
	removeChildren(window["clock_partBirthCell"]);
	removeChildren(window["clock_partAgeCell"]);
	stopTimeoutTimer("clockTimer");
	showPage("ready");
}

function startGameFromCntr(event) {
	//console.log("startGameFromCntr");
	var dataItems, i;
	dataItems=event.data.split(",");
	i=0;
	curGame=dataItems[i++];
	startGame(curGame);
}

function startGame(curGame) {
	if (curGameInstance) {
		curGameInstance.finalize();
		curGameInstance = null;
	}
	showPage("canvas");
	sendEvent("cntr", "gameStarted", curGame);
	switch (curGame) {
		case "frog":
			curGameInstance = frogGame;
			curGameInstance.initiate();
			break;
		case "bfly":
			curGameInstance = bflyGame;
			curGameInstance.initiate();
			break;
		case "bubble":
			curGameInstance = bubbleGame;
			curGameInstance.initiate();
			break;
		case "snowflake":
			curGameInstance = snowflakeGame;
			curGameInstance.initiate();
			break;
	}
}

function startTestFromCntr(event) {
	//console.log("startTestFromCntr");
	clearReadyMessage();
	showReadyPage();
	prevRespTime=0;
	sendEvent("cntr", "testStarted", "");
}

function pressButtonFromCntr(event) {
	//console.log("pressButtonFromCntr");
	var dataItems, i;
	dataItems=event.data.split(",");
	i=0;
	buttonName=dataItems[i++];
	buttonPressed(buttonName);
}

/*
 function gameActiveOkFromCntr(event) {
 //console.log("gameActiveOkFromCntr");
 var dataItems, i, gameName;
 dataItems=event.data.split(",");
 i=0;
 gameName=dataItems[i++];
 }
 */

function endGameFromCntr(event) {
	//console.log("endGameFromCntr");
	endGame()
	sendEvent("cntr", "gameEnded", "");
}

function endGame() {
	//console.log("endGame");
	if (curGameInstance) {
		curGameInstance.finalize();
		curGameInstance=null;
	}
	clearReadyMessage();
	showReadyPage();
}

function touchGameFromCntr(event) {
	//console.log("touchGameFromCntr");
	if (curGameInstance) {
		curGameInstance.touch();
	}
}

function showRespElem(pageId, name, elemType) {
	console.log("showRespElem, pageId: "+pageId+", name: "+name);
	// Track when feedback/animation is shown
	if (pageId === "feedback" || pageId === "feedback1" || pageId === "feedback2" || elemType === "anim") {
		curSection = "FeedbackScreen";
		curStimuliShown = curAnim;  // Animation is showing
		logTelemetryEvent("FeedbackScreen", curAnim, "Responder_FeedbackShown", "n/a");  // Log feedback (Task 3)
	}
	var respCellId, respCell, respId, respElem;
	respCellId=pageId+"_"+name+"_respCell";
	respCell=allRespCellElems[respCellId];
	respId=pageId+"_"+name+"_"+elemType;
	respElem=allRespElems[respId];
	replaceChildren(respCell, respElem);
}

function setReadyMessageFromCntr(event) {
	//console.log("setReadyMessageFromCntr", "curTestName: "+curTestName, "event.data: "+event.data);
	if (trialPending) {
		pendingReadyMessageData = event.data;
		console.log("[RESPONDER] setReadyMessageFromCntr deferred until current trial completes");
		return;
	}
	applyReadyMessage(event.data);
}

function applyReadyMessage(dataStr) {
	var dataItems, i, readyMessageTop1Id, readyMessageTop2Id, readyImageMdlId, readyMessageBtm1Id, readyMessageBtm2Id;
	var readyMessageTop1, readyMessageTop2, readyImageMdl, readyMessageBtm1, readyMessageBtm2;
	dataItems=dataStr.split(",");
	i=0;
	readyMessageTop1Id=dataItems[i++];
	readyMessageTop2Id=dataItems[i++];
	readyImageMdlId=dataItems[i++];
	readyMessageBtm1Id=dataItems[i++];
	readyMessageBtm2Id=dataItems[i++];
	curTestName=dataItems[i++];

	clearReadyMessage();

	if (readyMessageTop1Id) {
		readyMessageTop1=locsDoc.getElementById(readyMessageTop1Id).getAttribute("text");
		replaceTextInElemWithId("readyMessagePara1Top", readyMessageTop1);
	}
	if (readyMessageTop2Id) {
		readyMessageTop2=locsDoc.getElementById(readyMessageTop2Id).getAttribute("text");
		replaceTextInElemWithId("readyMessagePara2Top", readyMessageTop2);
	}
	if (readyImageMdlId) {
		readyImageMdl=getImageElem("buttons", "button_"+readyImageMdlId, "info");
		replaceChildrenInElemWithId("ready_mdl_readyCell", readyImageMdl);
		requireReadyHold = (readyImageMdlId === "dot");
	}
	if (readyMessageBtm1Id) {
		readyMessageBtm1=locsDoc.getElementById(readyMessageBtm1Id).getAttribute("text");
		replaceTextInElemWithId("readyMessagePara1Btm", readyMessageBtm1);
	}
	if (readyMessageBtm2Id) {
		readyMessageBtm2=locsDoc.getElementById(readyMessageBtm2Id).getAttribute("text");
		replaceTextInElemWithId("readyMessagePara2Btm", readyMessageBtm2);
	}
	readyMessageShown = true;
	showReadyPage();
	attachReadyHoldHandlers();
}

function attachReadyHoldHandlers() {
	var readyCell = document.getElementById("ready_mdl_readyCell");
	if (!readyCell || readyCell.dataset.holdHandlersAttached === "true") {
		return;
	}
	readyCell.dataset.holdHandlersAttached = "true";
	readyCell.addEventListener("touchstart", readyHoldStart, { passive: false });
	readyCell.addEventListener("mousedown", readyHoldStart);
	readyCell.addEventListener("touchend", readyHoldEnd, { passive: false });
	readyCell.addEventListener("mouseup", readyHoldEnd);
	readyCell.addEventListener("mouseleave", readyHoldEnd);
	readyCell.addEventListener("touchcancel", readyHoldEnd);
}

function readyHoldStart(event) {
	if (event) {
		event.preventDefault();
	}
	if (!requireReadyHold || !waitingForHoldToStart) {
		return;
	}
	if (holdToStartTimer) {
		clearTimeout(holdToStartTimer);
	}
	holdToStartTimer = setTimeout(function() {
		holdToStartTimer = null;
		if (!requireReadyHold || !waitingForHoldToStart) {
			return;
		}
		waitingForHoldToStart = false;
		startQueuedTrialFromHold();
	}, holdToStartMs);
}

function readyHoldEnd(event) {
	if (event) {
		event.preventDefault();
	}
	if (holdToStartTimer) {
		clearTimeout(holdToStartTimer);
		holdToStartTimer = null;
	}
}

function startQueuedTrialFromHold() {
	if (trialQueue.length > 0 && !trialPending) {
		console.log("[RESPONDER] Hold complete - starting first trial");
		trialPending = true;
		prevRespTime = Date.now();
		eventData = trialQueue.shift();
		startTrial(eventData);
	}
}

function clearReadyMessageFromCntr(event) {
	//console.log("clearReadyMessageFromCntr")
	clearReadyMessage();
}

function clearReadyMessage() {
	//console.log("clearReadyMessage")
	removeChildrenInElemWithId("readyMessagePara1Top");
	removeChildrenInElemWithId("readyMessagePara2Top");
	removeChildrenInElemWithId("ready_mdl_readyCell");
	removeChildrenInElemWithId("readyMessagePara1Btm");
	removeChildrenInElemWithId("readyMessagePara2Btm");
}

function clearEndMessage() {
	//console.log("clearEndMessage")
	removeChildrenInElemWithId("endMessagePara1Top");
	removeChildrenInElemWithId("endMessagePara2Top");
	removeChildrenInElemWithId("end_mdl_readyCell");
	removeChildrenInElemWithId("end_btm_readyCell");
}

function hideRespElem(pageId, name, elemType) {
	console.log("hideRespElem, pageId: "+pageId+", name: "+name)
	var respCell;
	respCell=allRespCellElems[pageId+"_"+name+"_respCell"]
	removeChildren(respCell);
}

function hideAllRespElems() {
	//console.log("hideAllRespElems")
	allRespElemArray.forEach(showIfEmpty);
}

function showIfEmpty(respElem) {
	var elemId, pageId, elemPos;
	elemId=respElem.getAttribute("id");
	pageId=respElem.dataset.page;
	elemPos=respElem.dataset.name;
	if (elemId==pageId+"_"+elemPos+"_empty") {
		showRespElem(pageId, elemPos, "empty");
	}
}

function startTrialFromCntr(event) {
	//console.log("startTrialFromCntr data:"+event.data, "trialPending: "+trialPending, "trialQueue.length: "+trialQueue.length);
	if (trialPending || trialQueue.length>0) {
		trialQueue.push(event.data);
	}
	else {
		trialPending=true;
		startTrial(event.data);
	}
}

function startMultiTrialsFromCntr(event) {
	console.log("[RESPONDER] startMultiTrialsFromCntr received:", event.data);
	// Initialize local CSV backup when test starts (Task 4)
	initializeLocalTestCSV();
	
	var i, dataItems, testName, trialType, trialPhase, totalTrials, projectNo, testSetNo, partNo, repeat, trialVar, trialPeriod, controllerName;
	if (pendingReadyMessageData && !readyMessageShown) {
		applyReadyMessage(pendingReadyMessageData);
		pendingReadyMessageData = null;
	}
	i=0;
	dataItems=event.data.split(",");
	testName=dataItems[i++];
	trialType=dataItems[i++];
	trialPhase=dataItems[i++];
	i++;
	//totalTrials=parseInt(dataItems[i++]);
	projectNo=dataItems[i++];
	testSetNo=dataItems[i++];
	partNo=dataItems[i++];
	repeat=dataItems[i++];
	// Optional: controller name (Task 6)
	controllerName=dataItems[i++];
	if (controllerName && controllerName.length > 0) {
		curControllerName = controllerName;
		console.log("[RESPONDER] Controller name set to:", curControllerName);
	}
	
	var trialId = testName+"_"+trialType+"_"+trialPhase+"_"+repeat;
	
	if (repeat > 1 || trialId != prevTrialId) {
		initTrialQueue();
	}
	
	prevTrialId = trialId;
	
	trialPeriod = getTrialPeriod(testName, trialType);
	totalTrials = trialQueue.length;
	
	for (i = 0; i < repeat; i++) {
		trialVar = getTrialVar(testName, trialType, trialPhase, totalTrials + i);
		trialQueue.push(testName+","+trialType+","+trialPhase+","+trialVar+","+(totalTrials + i)+","+projectNo+","+testSetNo+","+partNo+","+(repeat-i));
	}
	
	console.log("[RESPONDER] Built trial queue with", trialQueue.length, "trials. trialPending:", trialPending);
	if (!trialPending) {
		if (requireReadyHold) {
			console.log("[RESPONDER] Waiting for 1s hold on red dot to start trials");
			waitingForHoldToStart = true;
			showReadyPage();
			attachReadyHoldHandlers();
			return;
		}
		console.log("[RESPONDER] Starting first trial from queue");
		trialPending = true;
		prevRespTime = Date.now();
		eventData = trialQueue.shift();
		startTrial(eventData);
	} else {
		console.log("[RESPONDER] Trial already pending, queued for later");
	}
}

function startTrial(eventData) {
	console.log("[RESPONDER] startTrial:", eventData);
	
	// Clear any lingering timers from previous trials to prevent race conditions
	resp_stopTimers();
	
	var i, dataItems, imageIndex;
	var trialVariantStr, trialVariantList, videoList;
	var imagePairsList, imagePairStr, videoStr;
	
	
	dataItems=eventData.split(",");
	i=0;
	curTestName=dataItems[i++];
	curTrialType=dataItems[i++];
	curTrialPhase=dataItems[i++];
	trialVariantStr=dataItems[i++];
	curTotalTrials=parseInt(dataItems[i++]);
	curProjectNo=dataItems[i++];
	curTestSetNo=dataItems[i++];
	curPartNo=dataItems[i++];
	curRepeat=dataItems[i++];
	
	firstTouchTime = null;
	waitForSuccess = false;
	curVideoName = null;
	
	if (trialVariantStr && trialVariantStr != "") {
		trialVariantList=trialVariantStr.split("_");
		curTrialVar=trialVariantList[0];
		if (trialVariantList.length>0) {
			curTrialVarData=trialVariantList[1];
		}
		else {
			curTrialVarData="";
		}
	}
	else {
		curTrialVar="";
		curTrialVarData="";
	}
	var configElem;
	var animDistrStr, animDistrList, animKeepSepStr, animKeepSepList, animMaxDupsStr, animMaxDupsList, animSeqMethod, noOfAnims, animIndex, maxDups, keepSepIndex;
		
	configElem=getConfigElem(curTestName, curTrialType, "");
	variantConfigElem = getConfigElem(curTestName, curTrialType, curTrialVar);
	if (!variantConfigElem) {
		variantConfigElem=configElem;
	}
	console.log(configElem);
	console.log(variantConfigElem);
	
	curRewarded=variantConfigElem.getAttribute("rew");
	curReadyList=getCSVAttribute(variantConfigElem, "ready");
	curButtonTypeList=getCSVAttribute(variantConfigElem, "buttonTypes");
	if (curButtonTypeList.length<curReadyList.length) {
		for (i=0; i<=curReadyList.length-curButtonTypeList.length; i++) {
			curButtonTypeList.push("resp");
		}
	}
	
	//console.log(curButtonTypeList);
	
	curEmp = variantConfigElem.getAttribute("emp");
	curEmpType = variantConfigElem.getAttribute("empType");
	curLayout = variantConfigElem.getAttribute("layout");
	
	curTransTrialType=variantConfigElem.getAttribute("transType");
	if (!curTransTrialType) {
		curTransTrialType=curTrialType;
	}
	curTransTrialVar=variantConfigElem.getAttribute("transVar");
	if (!curTransTrialVar) {
		curTransTrialVar=curTrialVar;
	}
	switch (testType(curTestName)) {
		case "9m":
		case "24m":
		case "48m":
		case "adt":
		case "nirs":
		case "dev":
			//console.log("trialTypeCat: "+trialTypeCat(curTrialType))
			switch (trialTypeCat(curTrialType)) {
				case "tbv":
					videoStr = configElem.getAttribute("videos");
					//console.log("videoStr: "+videoStr);
					if (videoStr) {
						videoList = videoStr.split(",");
						//console.log("videoList: "+videoList);
						if (videoList) {
							if (videoList.length > 0) {
								curVideoNo = (curVideoNo + 1) % videoList.length;
								curVideoName = videoList[curVideoNo];
								//console.log("curVideoName: "+curVideoName);
							}
						}
					}
					curTrialStartedTime=Date.now();
					sendEvent("cntr", "trialStarted", curTestName+","+curTransTrialType+","+curTransTrialVar+","+curTrialStartedTime);
					
					curMinDt = parseInt(variantConfigElem.getAttribute("minDt"), 10);
					curMaxDt = parseInt(variantConfigElem.getAttribute("maxDt"), 10);
					

					if (!curMinDt) {
						curMinDt = 12000;
					}
					
					if (!curMaxDt) {
						curMaxDt = 17000;
					}
					
					if (curMaxDt > curMinDt) {
						curRndAddDt = curMaxDt - curMinDt;
						console.log("curMinDt: "+curMinDt+", curMaxDt: "+curMaxDt+", curRndAddDt: "+curRndAddDt);
						resetTimeoutTimer("trialSuccessTimer", trialSuccess, 12000 + Math.floor(Math.random() * curRndAddDt));
					}
					else {
						console.log("curMinDt: "+curMinDt);
						resetTimeoutTimer("trialSuccessTimer", trialSuccess, curMinDt);
					}
					break;
				case "tbgt":
				case "tbgb":
				case "tbgl":
				case "tbgr":
				case "tbgr2":
					curGame=configElem.getAttribute("game");
					startGame(curGame);
					curTrialStartedTime=Date.now();
					sendEvent("cntr", "trialStarted", curTestName+","+curTransTrialType+","+curTransTrialVar+","+curTrialStartedTime);
					resetTimeoutTimer("trialSuccessTimer", trialSuccess, 10000 + Math.floor(Math.random() * 5000));
					break;
				default:
					animDistrStr=configElem.getAttribute("animDistr");
					animDistrList=animDistrStr.split(",");
					animKeepSepStr=configElem.getAttribute("animKeepSep");
					if (animKeepSepStr) {
						animKeepSepList=animKeepSepStr.split(",");
					}
					else {
						animKeepSepList=animDistrList;
					}
					animMaxDupsStr=configElem.getAttribute("animMaxDups");
					animMaxDupsList=animMaxDupsStr.split(",");
					if (prevAnim) {
						keepSepIndex=animKeepSepList.indexOf(prevAnim);
						if (keepSepIndex>=0) {
							maxDups=parseInt(animMaxDupsList[keepSepIndex]);
							if (!maxDups)
								maxDups=0;
							if (curAnimDups>=maxDups)
								animDistrList=animDistrList.filter(removePrevAnim);
							
						}
					}
					else {
						maxDups=0;
					}
					animSeqMethod=configElem.getAttribute("animSeqMethod");
					noOfAnims=animDistrList.length;
					if (animSeqMethod=="random") {
						animIndex=Math.floor(Math.random()*noOfAnims);
					}
					else {
						animIndex=curTotalTrials%noOfAnims;
					}
					curAnim=animDistrList[animIndex];
					break;
			}
			showTrial();
			break;
		case "spc":
			imagePairsList=getCSVAttribute(configElem, "imagePairs");
			//console.log(imagePairsList);
			imagePairIndex=parseInt(curTrialVarData)-1;
			imagePairStr=imagePairsList[imagePairIndex];
			curSpcImagePairList=imagePairStr.split("_");
			//console.log(curSpcImagePairList);
			curSpcImageIndexList=Object();
			//console.log("allSpcImageIndices.length:"+allSpcImageIndices.length);
			for (i=0; i<allSpcImageIndices.length; i++) {
				imageIndex=allSpcImageIndices[i];
				//console.log("i:"+i+" imageIndex:"+imageIndex);
				curSpcImageIndexList[imageIndex]=parseInt(variantConfigElem.getAttribute(imageIndex));
			}
			curAnim=curSpcImagePairList[curSpcImageIndexList["button_"+curRewarded]-1];
			curSpcStimsShown=false;
			playSound("pop", 1, null, spcSoundPlaying);
			forceSpcStims()
			//resetTimeoutTimer("showSpcStimsTimer", forceSpcStims, 100);
			break;
		case "phb":
			//console.log("phb");
			curGame=configElem.getAttribute("game");
			startGame(curGame);
			if (curGameInstance) {
				curGameInstance.touchReporter = phbTrialEnd;
			}
			curTrialStartedTime=Date.now();
			sendEvent("cntr", "trialStarted", curTestName+","+curTransTrialType+","+curTransTrialVar+","+curTrialStartedTime);
			break;
	}
}

function phbTrialEnd(buttonPressed = true) {
	var now = Date.now()
	//console.log("phbTrialEnd 1", "now: "+ now, "firstTouchTime: "+firstTouchTime, "curTrialStartedTime: "+curTrialStartedTime, "buttonPressed: "+buttonPressed);
	var accuracy, touchTime, reactionTime, trialTime, button;
	if (buttonPressed && firstTouchTime == null) {
		firstTouchTime = now;
	}
	if (firstTouchTime != null) {
		touchTime = firstTouchTime - curTrialStartedTime;
	}
	else {
		touchTime = null;
	}
	trialTime = now - curTrialStartedTime;
	//console.log("phbTrialEnd 2", "firstTouchTime: "+firstTouchTime, "touchTime: "+touchTime, "reactionTime: "+reactionTime);
	button = curGame;
	accuracy = (buttonPressed && curTransTrialType == "app") || (!buttonPressed && curTransTrialType == "rst");
	if (buttonPressed) {
		reactionTime = trialTime;
	}
	else {
		reactionTime = null;
	}
	console.log("[RESPONDER] phbTrialEnd - calling recordAndReport");
	recordAndReport(curProjectNo, curTestSetNo, curTestName, curPartNo, prevRespTime, curTrialStartedTime, curTransTrialType, curTrialPhase, curTotalTrials+1, curTransTrialVar, accuracy, touchTime, reactionTime, trialTime, button, curAnim, 0, moveEvents, trialQueue.length);
	if (curGameInstance) {
		curGameInstance.touchReporter = null;
	}
	reInitTrialState();
}

function showTrial() {
	console.log("showTrial");
	curSection = "PromptScreen";  // Track section change
	curStimuliShown = curAnim;  // Track stimulus being shown
	logTelemetryEvent("PromptScreen", curAnim, "Responder_TrialStarted", "n/a");  // Log trial start (Task 3)
	reflectCurTrialState();
	showPage(curLayout);
	curTrialStartedTime=Date.now();
}

function spcSoundPlaying() {
	console.log("spcSoundPlaying", "curSpcStimsShown:"+curSpcStimsShown);
	if (!curSpcStimsShown) {
		curSpcStimsShown=true;
		showSpcStims();
		stopTimeoutTimer("showSpcStimsTimer");
	}
}

function forceSpcStims() {
	console.log("forceSpcStims, curSpcStimsShown: "+curSpcStimsShown);
	if (!curSpcStimsShown) {
		curSpcStimsShown=true;
		showSpcStims();
	}
}

function hideAllSpcStims() {
	console.log("hideAllSpcStims, curSpcStimsShown:"+curSpcStimsShown);
	allStimCellElemArray.forEach(hideSpcStim);
}

function hideSpcStim(elem) {
	console.log("hideSpcStim");
	removeChildren(elem);
}

function showSpcStims() {
	console.log("showSpcStims, curSpcStimsShown: "+curSpcStimsShown);
	showPage(curLayout);
	hideAllRespElems();
	allStimCellElemArray.forEach(setStimCellImage);
	showTrial();
	//resetTimeoutTimer("showTrialTimer", showTrial, 100);
}

// DNF (Did Not Finish) Record Creation (Task 1)

function createAndStoreDNFRecords() {
	console.log("[RESPONDER] Creating DNF records for remaining", trialQueue.length, "trials");
	var remainingCount = trialQueue.length;
	
	if (remainingCount === 0) {
		console.log("[RESPONDER] No remaining trials to mark as DNF");
		return;
	}
	
	// Get the next trial number from the first remaining trial
	var nextTrialNo = curTotalTrials + 1;
	
	// Create a DNF record for each remaining trial
	for (var i = 0; i < remainingCount; i++) {
		var trialNo = nextTrialNo + i;
		var dnfTimestamp = Date.now() + i;  // Slightly offset timestamps to differentiate records
		
		// Create DNF record with same format as recordAndReport CSV
		var dnfDataStr = curUserName + "," + 
			curProjectNo + "," + 
			curTestSetNo + "," + 
			curTestName + "," + 
			curPartNo + "," + 
			"DNF" + "," +  // prevRespTime
			dnfTimestamp + "," + 
			curTransTrialType + "," + 
			curTrialPhase + "," + 
			trialNo + "," + 
			"DNF" + "," +  // trialVariant
			"DNF" + "," +  // accuracy
			"DNF" + "," +  // touchTime
			"DNF" + "," +  // reactionTime
			"DNF" + "," +  // trialTime
			"DNF" + "," +  // buttonPressed
			"DNF" + "," +  // animationShowed
			"DNF" + "," +  // dotPressed
			"DNF" + "," +  // moveEvents
			curPosLat + "," +
			curPosLng + "," +
			(remainingCount - i - 1);  // trialQueueLength decreasing
		
		// Store in localStorage with unique key
		var storageKey = curUserName + "_" + dnfTimestamp;
		localStorage.setItem(storageKey, dnfDataStr);
		console.log("[DNF] Stored DNF record:", storageKey, "- Trial", trialNo, 'of', remainingCount);
	}
	
	console.log("[RESPONDER] Created and stored", remainingCount, 'DNF records');
}

function cancelTrialFromCntr(event) {
	console.log("[RESPONDER] cancelTrialFromCntr received");
	switch (testType(curTestName)) {
		case "phb":
			phbTrialEnd(false);
			break;
		default:
			console.log("[RESPONDER] Cancelling test - creating DNF records for remaining trials");
			// Create DNF records for all remaining trials BEFORE clearing queue
			if (trialQueue.length > 0) {
				createAndStoreDNFRecords();
			}
			// Send all records (valid + DNF) to server
			if (typeof batchSendAllRecords === "function") {
				batchSendAllRecords(function() {
					console.log("[RESPONDER] Batch send complete, resetting state");
					initTrialQueue();
					reInitTrialState();
					hideAllRespElems();
					clearReadyMessage();
					showReadyPage();
					sendEvent("cntr", "trialCancelled", "");
					console.log("[RESPONDER] Cancel complete, notified controller");
				});
			} else {
				console.warn("[RESPONDER] batchSendAllRecords not available");
				initTrialQueue();
				reInitTrialState();
				hideAllRespElems();
				clearReadyMessage();
				showReadyPage();
				sendEvent("cntr", "trialCancelled", "");
			}
			break;
	}
}

function endTrialsFromCntr(event) {
	console.log("[RESPONDER] endTrialsFromCntr received");
	switch (testType(curTestName)) {
		case "phb":
			phbTrialEnd(false);
			endGame();
			break;
		default:
			// Handle remaining trials as DNF if any exist
			if (trialQueue.length > 0) {
				console.log("[RESPONDER] Creating DNF records for remaining trials on test end");
				createAndStoreDNFRecords();
			}
			break;
	}
	console.log("[RESPONDER] Ending trials - sending batch records to server");
	// Send all accumulated records (valid + DNF) to server before resetting
	if (typeof batchSendAllRecords === "function") {
		batchSendAllRecords(function() {
			console.log("[RESPONDER] Batch send complete, saving local backup and finalizing");
			// Save local backup after batch send completes (Task 4)
			if (typeof saveLocalTestCSV === "function") {
				saveLocalTestCSV();
			}
			initTrialQueue();
			reInitTrialState();
			hideAllRespElems();
			clearReadyMessage();
			showReadyPage();
			// Restart event polling so responder can receive subsequent tasks
			if (typeof startEventPolling === "function" && curUserName) {
				startEventPolling("resp", curUserName);
			}
			sendEvent("cntr", "trialsEnded", "");
			console.log("[RESPONDER] End complete, notified controller");
		});
	} else {
		console.warn("[RESPONDER] batchSendAllRecords not available");
		if (typeof saveLocalTestCSV === "function") {
			saveLocalTestCSV();
		}
		initTrialQueue();
		reInitTrialState();
		hideAllRespElems();
		clearReadyMessage();
		showReadyPage();
		if (typeof startEventPolling === "function" && curUserName) {
			startEventPolling("resp", curUserName);
		}
		sendEvent("cntr", "trialsEnded", "");
	}
}

function endTestFromCntr(event) {
	//console.log("endTestFromCntr");
	switch (testType(curTestName)) {
		case "phb":
			phbTrialEnd(false);
			endGame();
			break;
		case "nirs":
			endGame();
		default:
			clearReadyMessage();
			break;
	}
	curTestName = "";
	reInitTrialState();
	// Restart polling so responder can receive events for the next test
	if (typeof startEventPolling === "function") {
		startEventPolling("resp", curUserName);
	}
	showReadyPage();
	sendEvent("cntr", "testEnded", "");
}

function disconnectFromCntr() {
	//console.log("disconnectFromCntr", "connectState: "+connectState);
	//sendEvent("cntr", "disconnected", "");
	connectState = connectStateNotConnected;
	//console.log("connectState: "+connectState);
	setTimeout(abort, 500);
	//abort();
}

function resp_stopTimers() {
	//console.log("resp_stopTimers");
	stopTimeoutTimer("trialEndedTimer");
	stopTimeoutTimer("trialSuccessTimer");
	stopTimeoutTimer("showSpcStimsTimer");
	stopTimeoutTimer("clockTimer");
	stopTimeoutTimer("showTrialTimer");
	clearAnimFrameTimer();
	// Stop event polling
	if (typeof stopEventPolling === "function") {
		stopEventPolling();
	}
}

function reflectCurTrialState() {
	console.log("reflectCurTrialState, curTestName: "+curTestName);
	switch (testType(curTestName)) {
		case "9m":
		case "24m":
		case "48m":
		case "adt":
		case "spc":
		case "nirs":
		case "dev":
			//console.log("trialTypeCat: "+trialTypeCat(curTrialType))
			switch (trialTypeCat(curTrialType)) {
				case "tbv":
					curVideoElem=document.getElementById(curLayout+"_video");
					if (curVideoName) {
						var videoUrl = "../video/nirs/"+curVideoName+".mp4";
						//console.log("videoUrl: "+videoUrl);
						curVideoElem.setAttribute("src", videoUrl);
						playSound("nirs/"+curVideoName, true);
						//videoElem.play()
					}
					else {
						videoElem.setAttribute("src", "")
					}
					break;
				default:
					allRespElemArray.forEach(reflectCurReadyList);
					break;
			}
		default:
			break;
	}
	console.log("reflectCurTrialState exit");
}

function reflectCurReadyList(respElem) {
	console.log("reflectCurReadyList")
	var readyIndex, isReady, buttonName, buttonType, buttonId, imageId, imageElem, imagePairIndex;
	buttonId=respElem.getAttribute("id");
	pageId=respElem.dataset.page;
	buttonName=respElem.dataset.name;
	readyIndex=curReadyList.indexOf(buttonName);
	//console.log("readyIndex:"+readyIndex)
	isReady=(curReadyList.indexOf(buttonName)>=0)
	if (isReady) {
		buttonType=curButtonTypeList[readyIndex];
		if (buttonId == curLayout+"_"+buttonName+"_button_"+buttonType) {
			//console.log("buttonId:"+buttonId+" buttonName:"+buttonName+" buttonType:"+buttonType+" curLayout:"+curLayout+" isReady:"+isReady+" curTestName:"+curTestName);
			switch (testType(curTestName)) {
				case "9m":
				case "24m":
				case "48m":
				case "adt":
				case "nirs":
					showRespElem(pageId, buttonName, "button_"+buttonType);
					if (buttonType=="resp") {
						if (buttonName==curEmp)
							imageId="button_"+buttonName+"_"+curEmpType;
						else
							imageId="button_"+buttonName;
					}
					else {
						imageId="button_"+buttonType;
					}
					imageElem=getImageElem("buttons", imageId, "ecittButton");
					replaceChildren(respElem, imageElem);
					break;
				case "spc":
					imagePairIndex=curSpcImageIndexList["button_"+buttonName]-1;
					if (imagePairIndex>=0) {
						imageId=curSpcImagePairList[imagePairIndex]+"-01";
						imageElem=getImageElem("frames", imageId, "spcButton");
						console.log(imageElem);
						replaceChildren(respElem, imageElem);
						showRespElem(pageId, buttonName, "button_resp");
					}
					else
						hideRespElem(pageId, buttonName, "button_resp");
					break;
				default:
					break;
			}
		}
	}
	//console.log("reflectCurReadyList exit")
}

function setStimCellImage(stimCellElem) {
	console.log("setStimCellImage");
	console.log(stimCellElem);
	var stimCellId, stimCellName, imageId, imageElem, imagePairIndex, active;
	stimCellId=stimCellElem.getAttribute("id");
	stimCellName=stimCellElem.dataset.name;
	//console.log("stimCellId:"+stimCellId+" stimCellName:"+stimCellName+" curLayout:"+curLayout);
	active=false;
	if (stimCellId==curLayout+"_"+stimCellName+"_stimCell") {
		switch (testType(curTestName)) {
			case "spc":
				imagePairIndex=curSpcImageIndexList["stim_"+stimCellName]-1;
				//console.log("imagePairIndex:"+imagePairIndex);
				if (imagePairIndex>=0) {
					imageId=curSpcImagePairList[imagePairIndex]+"-01";
					imageElem=getImageElem("frames", imageId, "spcStim").cloneNode();
					console.log("imageId: "+imageId);
					console.log(imageElem);
					active=true;
				}
				break;
			default:
				break;
		}
	}
	if (active) {
		replaceChildren(stimCellElem, imageElem);
	}
	else {
		removeChildren(stimCellElem);
	}
}

function rotatePageElemWithId(id) {
	var elem = document.getElementById(id);
	rotatePageElem(elem);
}

function rotatePageElem(elem) {
	//console.log("elem: "+elem.getAttribute("id"))
	if (elem) {
		if (elem.style) {
			var width = document.body.clientWidth;
			var height = document.body.clientHeight;
			elem.style.width = height+"px";
			elem.style.height = width+"px";
			var offset = (width - height) / 2;
			elem.style.transform = "rotate(90deg) translate("+(-offset)+"px, "+(-offset)+"px)";
			//console.log("elem.style.transform: "+elem.style.transform)
		}
		else {
			console.warn("ignored, no style elem");
		}
	}
	else {
		console.warn("ignored, no elem");
	}
}

function straightenPageElemWithId(id) {
	var elem = document.getElementById(id);
	straightenPageElem(elem);
}

function straightenPageElem(elem) {
	if (elem) {
		if (elem.style) {
			elem.style.transform = "";
		}
		else {
			console.warn("ignored, no style elem");
		}
	}
	else {
		console.warn("ignored, no elem");
	}
}


function getTrialVar(testName, trialType, trialPhase, totalTrials) {
	var configElem, varDistrList, varLeadingList, varKeepSepList, varMaxDupsList, varIndexList, varSeqMethod, imagePairsList, spcImagePairCount, trialVarIndex;
	var trialVar;
	
	//console.log("getTrialVar");
	
	configElem=getConfigElem(testName, trialType, "");
	//console.log("configElem:"+configElem);
	
	varDistrList=getCSVAttribute(configElem, "varDistr");
	varLeadingList=getCSVAttribute(configElem, "varLeading");
	varKeepSepList=getCSVAttribute(configElem, "varKeepSep");
	varMaxDupsList=getCSVAttribute(configElem, "varMaxDups");
	varIndexList=getCSVAttribute(configElem, "varIndices");
	/*
	 console.log("varDistrList:"+varDistrList);
	 console.log("varLeadingList:"+varLeadingList);
	 console.log("varKeepSepList:"+varKeepSepList);
	 console.log("varMaxDupsList:"+varMaxDupsList);
	 console.log("varIndexList:"+varIndexList);
	 */
	if (testType(testName)=="spc") {
		imagePairsList=getCSVAttribute(configElem, "imagePairs");
		spcImagePairCount=imagePairsList.length;
	}
	
	varPeriod=parseInt(configElem.getAttribute("varPeriod"));
	if (!varPeriod) {
		varPeriod=varDistrList.length;
	}
	
	//console.log("varPeriod:"+varPeriod);
	
	varSeqMethod=configElem.getAttribute("varSeqMethod");
	if (!varSeqMethod) {
		varSeqMethod="static";
	}
	
	//console.log("varSeqMethod:"+varSeqMethod);
	
	switch (varSeqMethod) {
		case "random":
			if (curRandomVarList.length == 0) {
				curRandomVarList = genSeq(varDistrList, varLeadingList, varKeepSepList, varMaxDupsList, varPeriod);
			}
			trialVar = curRandomVarList.shift();
			break;
		case "indexed":
			varIndex=totalTrials%varPeriod;
			trialVarIndex=parseInt(varIndexList[varIndex]-1);
			trialVar=varDistrList[trialVarIndex];
			break;
		case "spcSingle":
			if (curSpcSingleVarList.length == 0) {
				curSpcSingleVarList=genSpcSeqP(spcImagePairCount, 1);
				//console.log("curSpcSingleVarList: "+curSpcSingleVarList);
			}
			trialVar=curSpcSingleVarList.shift();
			break;
		case "spcDouble":
			if (curSpcDoubleVarList.length == 0) {
				curSpcDoubleVarList=genSpcSeqT(spcImagePairCount, 2, 2);
				//console.log("curSpcDoubleVarList: "+curSpcDoubleVarList);
			}
			trialVar=curSpcDoubleVarList.shift();
			break;
		default:
			break;
	}
	if (!trialVar) {
		trialVar="";
	}
	//console.log("testName:"+testName, "trialType:"+trialType, "trialPhase:"+trialPhase, "totalTrials:"+totalTrials, "trialVar:"+trialVar);
	return trialVar;
}
