
function cntrDeclareGlobals() {
	//console.log("cntrDeclareGlobals");
	//curRepeat=0;
	curRepeatOrigin=null;
	curResult="";
	//curVarSeqMethod="";
	//curVarDistrList=new Array();
	//curVarLeadingList=new Array();
	//curVarKeepSepList=new Array();
	//curVarMaxDupsList=new Array();
	//curVarIndexList=new Array();
	//curVarPeriods=0;
	curTotalTrials=0;
	//curVarDups=0;
	//curRemote="";
	//prevVar="";
	//curVar="";
	//curVarList=null;
	//curSpcSingleVarList=null;
	//curSpcDoubleVarList=null;
	curTestGame = null;
	
	allResRowElems=getElementsByTagNameClassName("tr", "res");
	allStartTrialButtonCellElems=getElementsByTagNameClassName("td", "startTrialButton");
	//allCancelTrialButtonCellElems=getElementsByTagNameClassName("td", "cancelTrialButton");
	allGameTrialButtonCellElems=getElementsByTagNameClassName("td", "startGameTrialButton");
	allUndoButtonElems=getElementsByTagNameDataItem("button", "type", "undoButton");
	allTotalRowElems=getElementsByTagNameDataItem("tr", "type", "totalRow");
	allClockButtonElems=getElementsByTagNameDataItem("button", "type", "clockButton");
	
	curPhbTrialButt = null;
	curPhbButtText = null;
	curPhbTimeout = null;
	
	//console.log("allClockButtonElems: "+allClockButtonElems.length);
	
	counters=new Object();
	prevTrialIdPrefix="";
	curTrialIdPrefix="";
	prevCscc=0;
	prevRscc=0;
	//prevRepeat=0;
	startTrialPending=false;
	curConfigName="";
	
	trialRunning = false;
	clockShowing = false;
	gameRunning = false;
	endTrialsPending = false;
	endTrialsTimeoutId = null;
	endTrialsAttempt = 0;
	
	connectAttempts = 0;
}

function sendEndTrialsWithRetry() {
	if (!endTrialsPending) return;
	endTrialsAttempt += 1;
	console.log("[CONTROLLER] Sending endTrials attempt", endTrialsAttempt);
	var endData = (curTestName || "") + "," + (curConfigName || "");
	sendEvent("resp", "endTrials", endData);
	if (endTrialsTimeoutId) {
		clearTimeout(endTrialsTimeoutId);
	}
	endTrialsTimeoutId = setTimeout(function() {
		if (!endTrialsPending) return;
		if (endTrialsAttempt >= 3) {
			console.warn("[CONTROLLER] endTrials failed after 3 attempts - responder did not acknowledge");
			return;
		}
		sendEndTrialsWithRetry();
	}, 1000);
}

// Average responstime
// Interrupt 9M trial

// Initialization

function cntrInit(scrolling, cached, preload, environment, offline, offlineApp, remote, rotateHor, recLoc) {
	libDeclareGlobals();
	commDeclareGlobals();
	dmglibDeclareGlobals();
	cntrDeclareGlobals();
	//curRemote=remote;
	partner="resp";
	getInitialGlobalKeys();
	initWindow("cntr", scrolling, cached, preload, environment);
	onbeforeunload = cntrFinalize;
	entityAddYearSelectOptions("part", "Part", "birth", "Birth")
	entityAddMonthSelectOptions("part", "Part", "birth", "Birth")
	entityAddDaySelectOptions("part", "Part", "birth", "Birth")
	authenticate();
}

function authOk() {
	console.log("authOk - starting configs load");
	showHtmlElemWithId("signOutRow");
	getConfigsDoc(function(doc) {
		console.log("getConfigsDoc callback called, doc:", doc ? "exists" : "null");
		if (doc) {
			console.log("configsDoc loaded successfully, calling cntrInit2");
			cntrInit2();
		} else {
			console.error("configsDoc failed to load!");
		}
	});
}

function cntrFinalize() {
	//console.log("cntrFinalize");
	cntr_stopTimers();
	closeEventSources();
	finalizeWindow();
	logNewGlobalKeys();
}

function cntrInit2() {
	//console.log("cntrInit2");
	cntr_reinit();
}

function cntr_reinit() {
	console.log("cntr_reinit called");
	//newAppVersionWarningIssued=false;
	resetErrorCount();
	//pairingCodeInput.value="";
	reInitTrialState();
	normalizeResRowElems();
	normalizeTrialButtonCellElems();
	resetResCounters();
	reflectAllResCounters();
	//disconnect();
	connectState = connectStateNotConnected;
	console.log("cntr_reinit: set connectState to NotConnected");
	if (typeof updateConnectionState === "function") {
		updateConnectionState({
			connection_state: "disconnected",
			controller_ready: "false",
			responder_ready: "false",
			last_event: "controller_reset"
		});
	}
	replaceTextInElemWithId("connectPageTitle", "Ready to Connect");
	normalizeClassOfElemWithId("connectButt");
	allClockButtonElems.forEach(normalizeClass);
	closeEventSources();
	abortConn();
	connectAttempts = 0;
	console.log("cntr_reinit: showing connect page");
	showPage("connect");
	console.log("cntr_reinit: connect page should be visible now");
}

function reInitTrialState() {
	//console.log("reInitTrialState");
	curTrialType="";
	curTrialPhase="";
	curNextTrialType = "";
	curNextTrialRepeat = null;
	//curRepeat=0;
	curResult="";
}

// Button responders

function flipConnect() {
	var enabled = buttonsEnabled();
	console.log("flipConnect called", "connectState: "+connectState, "buttonsEnabled:", enabled);
	if (enabled) {
		switch (connectState) {
			case connectStateConnecting:
				console.log("flipConnect: aborting connection");
				abort();
				break;
			case connectStateNotConnected:
				console.log("flipConnect: starting connection");
				connect();
				break;
			default:
				console.log("flipConnect: default case, connectState:", connectState);
				break;
		}
	} else {
		console.warn("flipConnect: buttons not enabled!");
	}
}

function connect() {
	console.log("connect called", "connectState: "+connectState);
	if (connectState == connectStateNotConnected) {
		console.log("connect: scheduling initConnection");
		setTimeout(initConnection, 100);
	} else {
		console.warn("connect: state is not NotConnected, current state:", connectState);
	}
}

var connectionTimeoutId = null;

function initConnection() {
	console.log("initConnection called", "connectState: "+connectState);
	connectState = connectStateConnecting;
	console.log("initConnection: set state to Connecting, calling initEventSourceCntr");
	if (typeof updateConnectionState === "function") {
		updateConnectionState({
			connection_state: "connecting",
			controller_ready: "true",
			responder_ready: "false",
			last_event: "controller_connect"
		});
	}
	
	// Clear any existing timeout
	if (connectionTimeoutId) {
		clearTimeout(connectionTimeoutId);
		connectionTimeoutId = null;
	}
	
	try {
		initEventSourceCntr();
		console.log("initEventSourceCntr called successfully");
	} catch (e) {
		console.error("initEventSourceCntr failed:", e);
		connectState = connectStateConnected;
		if (typeof compatibilityMode !== 'undefined') {
			compatibilityMode = true;
		}
		normalizeClassOfElemWithId("connectButt");
		replaceTextInElemWithId("connectPageTitle", "Connected (Compatibility Mode)");
		if (typeof showPage !== 'undefined') {
			var appTypePage = document.getElementById("appType_page");
			if (appTypePage) {
				showPage("appType");
			}
		}
		return;
	}
	
	// Windows workaround: Set a timeout to enable compatibility mode if EventSource fails
	// Increased timeout to 5 seconds to allow time for "hello" event to arrive
	connectionTimeoutId = setTimeout(function() {
		connectionTimeoutId = null;
		if (connectState == connectStateConnecting) {
			console.log("EventSource disabled - using polling instead");
			connectState = connectStateConnected;
			if (typeof compatibilityMode !== 'undefined') {
				compatibilityMode = true;
			}
			normalizeClassOfElemWithId("connectButt");
			replaceTextInElemWithId("connectPageTitle", "Connected (Polling)");
			if (typeof showPage !== 'undefined') {
				var appTypePage = document.getElementById("appType_page");
				if (appTypePage) {
					showPage("appType");
				}
			}
			console.log("Compatibility mode UI updated");
		} else {
			console.log("Timeout fired but connectState is", connectState, "- connection already established");
		}
	}, 5000); // 5 second timeout - allows time for "hello" event to arrive
}

/*
 function reInitConnection() {
 console.log("reInitConnection", "connectState: "+connectState);
 connectState = connectStateReConnecting;
 reInitEventSourceCntr();
 //console.log("connectState: "+connectState);
 }
 */

function eventSourceCntrOpen() {
	console.log("eventSourceCntrOpen", "connectState: "+connectState);
	switch (connectState) {
		case connectStateConnecting:
			// EventSource connection opened - wait for "hello" event to confirm
			// Don't set state to Connected yet - wait for "hello" event
			connectAttempts = 0;
			console.log("EventSource opened, waiting for 'hello' event...");
			// Note: "hello" event handler will set state to Connected
			break;
		case connectStateReconnecting:
			connectAttempts = 0;
			connectState = connectStateConnected
			flushEventRequestQueue();
			break;
		default:
			break;
	}
}

/*
 function eventSourceCntrReOpen() {
 console.log("eventSourceCntrReOpen", "connectState: "+connectState);
 }
 */

function sendConnect() {
	//console.log("sendConnect", "connectState: "+connectState, "connectAttempts: ", connectAttempts);
	switch (connectState) {
		case connectStateConnecting:
			if (connectAttempts < 10) {
				connectAttempts += 1;
				highlightClassOfElemWithId("connectButt");
				sendEvent("resp", "connect", "");
				setTimeout(sendConnect, 1000);
			}
			else {
				// Windows workaround: If EventSource fails after 10 attempts, 
				// set state to connected anyway so app can function
				console.log("EventSource connection failed (expected on Windows), enabling compatibility mode");
				connectState = connectStateConnected;
				normalizeClassOfElemWithId("connectButt");
				replaceTextInElemWithId("connectPageTitle", "Connected (Compatibility Mode)");
				abort();
			}
			break;
		default:
			break;
	}
}

function checkConnect() {
	//console.log("checkConnect", "connectState: "+connectState);
	if (connectState != connectStateConnected) {
		abort();
	}
}

function flipClock() {
	//console.log("flipClock");
	if (buttonsEnabled()) {
		if (!trialRunning) {
			sendEvent("resp", "flipClock", partCurNo+","+partCurRef+","+partCurBirthYear+","+partCurBirthMonth+","+partCurBirthDay);
		}
	}
}

function hideClock() {
	//console.log("hideClock");
	sendEvent("resp", "hideClock", "");
	clockShowing = false;
}

function showingClockFromResp(event) {
	//console.log("showingClockFromResp");
	allClockButtonElems.forEach(highlightClass);
	clockShowing = true;
}

function hidingClockFromResp(event) {
	//console.log("hidingClockFromResp");
	allClockButtonElems.forEach(normalizeClass);
	clockShowing = false;
}

function enterTestsApp() {
	console.log("enterTestsApp called, projectCurNo:", projectCurNo);
	if (buttonsEnabled()) {
		// Don't send hideClock here - it will be handled when actually needed during trials
		console.log("enterTestsApp: about to call projectsSelect with projectCurNo:", projectCurNo);
		projectsSelect(projectCurNo, projectsDocReceived);
		console.log("enterTestsApp: projectsSelect called, returning");
	} else {
		console.warn("enterTestsApp: buttons are not enabled, aborting");
	}
}

function enterGamesApp() {
	if (buttonsEnabled()) {
		hideClock();
		showPage("newGame");
	}
}

function projectExitSelect() {
	if (buttonsEnabled()) {
		showPage("appType");
	}
}

function projectEnterCur() {
	if (buttonsEnabled()) {
		if (entitySelectValid("project", "Project")) {
			testSetsSelect(projectCurNo, testSetCurNo, testSetsDocReceived);
		}
		else {
			entityShowSelectInvalidAlert("project", "Project");
		}
	}
}

function testSetExitSelect() {
	if (buttonsEnabled()) {
		projectsSelect(projectCurNo, projectsDocReceived);
	}
}

function testSetSelectChangedHook() {
	//console.log("testSetSelectChangedHook");
}

function partSelectChangedHook() {
	//console.log("testSetSelectChangedHook");
}

function testSelectChangedHook() {
	//console.log("testSetSelectChangedHook");
}

function testSetEnterCur() {
	if (buttonsEnabled()) {
		if (entitySelectValid("project", "Project")) {
			if (entitySelectValid("testSet", "TestSet")) {
				partsSelect(projectCurNo, testSetCurNo, partCurNo, partsDocReceived);
			}
			else {
				entityShowSelectInvalidAlert("testSet", "TestSet");
			}
		}
		else {
			entityShowSelectInvalidAlert("project", "Project");
		}
	}
}

function partEnterCur() {
	//console.log("partEnterCur");
	if (buttonsEnabled()) {
		if (entitySelectValid("part", "Part")) {
			testsSelect(testCurValue, testsDocReceived);
		}
		else {
			entityShowSelectInvalidAlert("part", "Part");
		}
	}
}

function partExitSelect() {
	if (buttonsEnabled()) {
		testSetsSelect(projectCurNo, testSetCurNo, testSetsDocReceived);
	}
}

function testExitSelect() {
	if (buttonsEnabled()) {
		partsSelect(projectCurNo, testSetCurNo, 0, partsDocReceived);
	}
}

function testEnterCur() {
	//console.log("testEnterCur");
	if (buttonsEnabled()) {
		if (!testCurValue) {
			alert("Please select a Test before continuing.");
			showPage("testSelect");
			return;
		}
		resetResCounters();
		reflectAllResCounters();
		showPage(testCurValue+"_index");
		curBlockTrialCtr=false;
	}
}

function showConnectionFailedAlert() {
	if (curEnvironment == "nativeApp") {
		alert("warning connectionFailed");
	}
	else {
		alert("Connection failed");
	}
}

function initEventSourceCntr() {
	// Using polling instead of EventSource for local testing
	console.log("initEventSourceCntr - starting polling");
	startConnectionPolling("controller", handleConnectionStateChange);
	
	// CRITICAL: Start event polling so controller can receive events from responder
	// This allows controller to receive trialEnded, trialResult, etc.
	if (typeof startEventPolling === "function" && curUserName) {
		console.log("initEventSourceCntr - starting event polling for role: cntr");
		startEventPolling("cntr", curUserName);
	}
}

function handleConnectionStateChange(state) {
	// Silent state change - log removed to reduce console spam
	// Check for responder ready event
	if (state.responder_ready == "true" && connectState == connectStateConnecting) {
		connectState = connectStateConnected;
		if (typeof updateConnectionState === "function") {
			updateConnectionState({
				connection_state: "connected",
				controller_ready: "true",
				last_event: "controller_connected"
			});
		}
		normalizeClassOfElemWithId("connectButt");
		replaceTextInElemWithId("connectPageTitle", "Connected (Responder paired)");
		if (typeof showPage !== 'undefined') {
			var appTypePage = document.getElementById("appType_page");
			if (appTypePage) {
				showPage("appType");
			}
		}
		// Send connect event to responder
		setTimeout(sendConnect, 100);
	}
}

function helloFromEventSource(event) {
	console.log("helloFromEventSource received, connectState: "+connectState);
	// When we receive "hello", the EventSource connection is confirmed working
	if (connectState == connectStateConnecting) {
		// Clear the compatibility mode timeout since connection is working
		if (connectionTimeoutId) {
			clearTimeout(connectionTimeoutId);
			connectionTimeoutId = null;
			console.log("Cleared compatibility mode timeout - connection established");
		}
		
		connectState = connectStateConnected;
		normalizeClassOfElemWithId("connectButt");
		replaceTextInElemWithId("connectPageTitle", "Connected");
		if (typeof showPage !== 'undefined') {
			var appTypePage = document.getElementById("appType_page");
			if (appTypePage) {
				showPage("appType");
			}
		}
		console.log("Connection established - hello received");
		
		// Now send "connect" event to Responder to establish the connection
		// This will change Responder from "Available for Connection" to "Ready"
		setTimeout(sendConnect, 100);
	}
}

function flipGame(gameName) {
	if (!gameRunning) {
		startNewGame(gameName);
	}
	else {
		if (curGame == gameName) {
			endGame();
		}
	}
	
}

function startNewGame(gameName) {
	if (buttonsEnabled()) {
		//console.log("startNewGame gameName:"+gameName);
		curGame=gameName;
		sendEvent("resp", "startGame", curGame);
		//showPage(curGame+"_index");
	}
}

function gameStartedFromResp(event) {
	var dataItems, i;
	dataItems=event.data.split(",");
	i=0;
	curGame=dataItems[i++];
	//console.log("gameStartedFromResp curGame:"+curGame);
	highlightClassOfElemWithId(curGame+"_newGameButt");
	gameRunning = true;
}

function endGame() {
	if (buttonsEnabled()) {
		//console.log("endGame");
		sendEvent("resp", "endGame", "");
	}
}

function gameEndedFromResp(Event) {
	//console.log("gameEndedFromResp");
	normalizeClassOfElemWithId(curGame+"_newGameButt");
	gameRunning = false;
}

function exitGames() {
	if (buttonsEnabled()) {
		sendEvent("resp", "endGame", "");
		showPage("appType");
	}
}

function startTestGame(testName, trialType) {
	var configElem;
	configElem = getConfigElem(testName, trialType, "");
	curGame=configElem.getAttribute("game");
	sendEvent("resp", "startGame", curGame);
}

function touchGame() {
	if (buttonsEnabled()) {
		sendEvent("resp", "touchGame", "");
	}
}

function endTestGame() {
	if (buttonsEnabled()) {
		sendEvent("resp", "endGame", "");
	}
}

function regResponse(testName, trialType, trialPhase, buttonName) {
	//console.log("regResponse");
	var result, accuracy, totalTrials, transTrialType, configElem;
	prevTrialIdPrefix=curTrialIdPrefix;
	curTrialIdPrefix=testName+"_"+trialType+"_"+trialPhase;
	configElem=getConfigElem(testName, trialType, "");
	transTrialType=configElem.getAttribute("transType");
	if (!transTrialType) {
		transTrialType=trialType;
	}
	transTrialVar=configElem.getAttribute("transVar");
	if (!transTrialVar) {
		transTrialVar=configElem.getAttribute("varDistr");
	}
	//console.log("regResponse", "testType: "+testType(testName));
	switch (testType(testName)) {
		case "box":
			normalizeResRowElems();
			if (configElem.getAttribute("rew")==buttonName) {
				result="succ";
				accuracy=1;
			}
			else {
				result="fail";
				accuracy=0;
			}
			
			curResult=result;
			
			transTrialType=configElem.getAttribute("transType");
			if (!transTrialType) {
				transTrialType=trialType;
			}
			transTrialVar=configElem.getAttribute("transVar");
			if (!transTrialVar) {
				transTrialVar=configElem.getAttribute("varDistr");
			}
			trialStartTime=Date.now();
			incrResCounter(testName, trialType, trialPhase, result);
			totalTrials=resCounterTotal(testName, trialType, trialPhase);
			recordResponse(projectCurNo, testSetCurNo, testName, partCurNo, 0, trialStartTime, transTrialType, trialPhase, totalTrials, transTrialVar, accuracy, null, null, null, "", "", null, null, null);
			reflectAllResCounters();
			highlightResCell(testName, trialType, trialPhase, result);
			enableHtmlElemWithId(testName+"_"+trialType+"_"+trialPhase+"_undoButton");
			break;
		default:
			break;
			
	}
}

function undoReg() {
	if (buttonsEnabled()) {
		if (prevRespDataStr) {
			//console.log("undoReg", "curTrialIdPrefix:"+curTrialIdPrefix, "curResult:"+curResult);
			deleteLastResponse();
			normalizeResRowElems();
			undoIncrResCounter(curTrialIdPrefix, curResult);
			reflectAllResCounters();
		}
		allUndoButtonElems.forEach(disableHtmlElem);
	}
}

function flipTrial(testName, trialType, trialPhase, repeat, nextTrialType, nextTrialRepeatStr) {
	console.log("[CONTROLLER] flipTrial CLICKED:", testName, trialType, trialPhase, "x"+repeat, "trialRunning:", trialRunning);
	console.log("[CONTROLLER] flipTrial call stack");
	console.trace();
	var nextTrialRepeat = parseInt(nextTrialRepeatStr);
	if (!trialRunning) {
		console.log("[CONTROLLER] Starting new trial");
		startTrial(testName, trialType, trialPhase, repeat, nextTrialType, nextTrialRepeat);
	}
	else {
		if (testName == curTestName && trialType == curTrialType && trialPhase == curTrialPhase) {
			console.log("[CONTROLLER] Trial already running, calling cancelTrial");
			cancelTrial();
		}
	}
}

function startTrial(testName, trialType, trialPhase, repeat, nextTrialType, nextTrialRepeat) {
	var totl, configElem, varPeriodStr, imagePairsList;
	var buttonsOk = buttonsEnabled();
	console.log("[CONTROLLER] startTrial called - buttonsEnabled:", buttonsOk, "startTrialPending:", startTrialPending, "clockShowing:", clockShowing);
	if (buttonsOk && !startTrialPending && !clockShowing) {
		console.log("[CONTROLLER] startTrial proceeding, setting trialRunning=true");
		startTrialPending = true;
		prevTrialIdPrefix=curTrialIdPrefix;
		curTrialIdPrefix=testName+"_"+trialType+"_"+trialPhase;
		configElem=getConfigElem(testName, trialType, "");
		//curVarDistrList=getCSVAttribute(configElem, "varDistr");
		//console.log(curVarDistrList);
		//curVarLeadingList=getCSVAttribute(configElem, "varLeading");
		//curVarKeepSepList=getCSVAttribute(configElem, "varKeepSep");
		//curVarMaxDupsList=getCSVAttribute(configElem, "varMaxDups");
		//curVarIndexList=getCSVAttribute(configElem, "varIndices");
		//curVarSeqMethod=configElem.getAttribute("varSeqMethod");
		curTestName=testName;
		//if (!curVarSeqMethod) {
		//	curVarSeqMethod="static";
		//}
		//curVarPeriod=parseInt(configElem.getAttribute("varPeriod"));
		//if (!curVarPeriod) {
		//	curVarPeriod=curVarDistrList.length;
		//}
		normalizeTrialButtonCellElems();
		curTrialType=trialType;
		curTrialPhase=trialPhase;
		//curRepeat=repeat;
		curRepeatOrigin = repeat;
		curNextTrialType = nextTrialType;
		curNextTrialRepeat = nextTrialRepeat;
		//console.log(curVarSeqMethod+", "+curVarPeriod+", "+curTestName+", "+curTrialType+", "+curTrialPhase);
		
		// Send ready message to responder when actually starting trials
		// Check testName directly instead of using testType() to avoid grouping issues
		switch (testName) {
			case "adt":
			case "adth":
				sendEvent("resp", "setReadyMessage", "msg_adtIntro1,msg_adtIntro2,dot,msg_adtReady,,"+testName);
				break;
			case "9m":
			case "24m1":
			case "24m2":
			case "24m2h":
			case "48m":
			case "48mn":
			case "nirsv":
			case "nirsh":
			case "spc":
				// Generic ready message for automated tests
				sendEvent("resp", "setReadyMessage", ",,dot,msg_adtReady,,"+testName);
				break;
			case "box":
			case "box31":
			case "phb":
			case "dev":
			default:
				// Tests without ready screens (manual start) - don't send message
				break;
		}
		
		switch (testType(testName)) {
			case "phb":
				highlightClassOfElemWithId(curTestName+"_"+curTrialType+"_"+curTrialPhase+"_startGameTrialButt");
				break;
			default:
				//switch (curTrialType) {
				//	case "tbvt":
				//	case "tbvb":
				//	case "tbvl":
				//	case "tbvr":
				//	case "tbgt":
				//	case "tbgb":
				//	case "tbgl":
				//	case "tbgr":
				//		highlightClassOfElemWithId(curTestName+"_"+curConfigName+"_"+curTrialType+"_"+curTrialPhase+"_startTrialButt");
				//		break;
				//	default:
				highlightResRow(testName, trialType, trialPhase, curRepeatOrigin);
				//		break;
				//}
		}
		console.log("[CONTROLLER] About to call nextTrial with repeat:", repeat);
		nextTrial(repeat);
	} else {
		console.log("[CONTROLLER] startTrial blocked - conditions not met");
	}
}

function removePrevVar(trialVar) {
	return (trialVar!=prevVar)
}

function nextTrial(repeat) {
	console.log("[CONTROLLER] nextTrial called with repeat:", repeat, "testType:", testType(curTestName));
	//var trialVarIndex, varIndex;
	switch (testType(curTestName)) {
		case "phb":
			//curVar = "";
			sendEvent("resp", "startMultiTrials", curTestName+","+curTrialType+","+curTrialPhase+","+curTotalTrials+","+projectCurNo+","+testSetCurNo+","+partCurNo+","+repeat);
			break;
		case "box":
			normalizeResRowElems();
			curTotalTrials=resCounterTotal(curTestName, curTrialType, curTrialPhase);
			break;
		default:
			//switch (curTrialType) {
			//	case "tbvt":
			//	case "tbvb":
			//	case "tbvl":
			//	case "tbvr":
			//	case "tbgt":
			//	case "tbgb":
			//	case "tbgl":
			//	case "tbgr":
			//		curTotalTrials = 0;
			//		curVar = "";
			//		sendEvent("resp", "startTrial", curTestName+","+curTrialType+","+curTrialPhase+","+curVar+","+curTotalTrials+","+projectCurNo+","+testSetCurNo+","+partCurNo+","+repeat);
			//		break;
			//	default:
			normalizeResRowElems();
			if (curTrialType == "nirs") {
				curTotalTrials = 0;
			}
			else {
				curTotalTrials = resCounterTotal(curTestName, curTrialType, curTrialPhase);
			}
			//console.log("nextTrial, repeat: "+repeat, "curTotalTrials: "+curTotalTrials);
			//if (repeat > 1) {
			sendEvent("resp", "startMultiTrials", curTestName+","+curTrialType+","+curTrialPhase+","+curTotalTrials+","+projectCurNo+","+testSetCurNo+","+partCurNo+","+repeat);
			//}
			//else {
			//	curVar=getTrialVar(curTestName, curTrialType, curTrialPhase, curTotalTrials);
			//	sendEvent("resp", "startTrial", curTestName+","+curTrialType+","+curTrialPhase+","+curVar+","+curTotalTrials+","+projectCurNo+","+testSetCurNo+","+partCurNo+","+repeat);
			//}
			//break;
			//}
			break;
	}
	startTrialPending=false;
	trialRunning = true;
}

function resetTrialState() {
	fixLastResponse();
	startTrialPending=false;
	curTrialIdPrefix="";
	curTrialType = "";
	curTrialPhase = "";
	curNextTrialType = "";
	curNextTrialRepeat = null;
	normalizeResRowElems();
	normalizeTrialButtonCellElems();
	prevTrialIdPrefix="";
	trialRunning = false;
}

function cancelTrial() {
	console.log("[CONTROLLER] cancelTrial CALLED - trialRunning:", trialRunning);
	console.log("[CONTROLLER] cancelTrial call stack");
	console.trace();
	if (buttonsEnabled()) {
		switch (testType(curTestName)) {
			case "box":
				resetTrialState();
				break;
			case "phb":
				sendEvent("resp", "cancelTrial", "");
				break;
			default:
				if (curTrialPhase != "") {
					highlightClassOfElemWithId(curTestName+"_"+curConfigName+"_"+curTrialType+"_"+curTrialPhase+"_cancelButt");
				}
				sendEvent("resp", "cancelTrial", "");
				break;
		}
	}
}

function trialCancelledFromResp(event) {
	console.log("[CONTROLLER] trialCancelledFromResp - resetting trial state");
	reflectAllResCounters();
	normalizeClassOfElemWithId(curTestName+"_"+curConfigName+"_"+curTrialType+"_"+curTrialPhase+"_cancelButt");
	resetTrialState();
	console.log("[CONTROLLER] trialCancelledFromResp complete - trialRunning:", trialRunning);
}

function gotoTrials(testName, trialType, configName) {
	//console.log("gotoTrials", "testName: "+testName, "trialType: "+trialType);
	if (buttonsEnabled()) {
		curTestName = testName;
		curConfigName=configName;
		//console.log("gotoTrials", "testName: "+testName);
		resetTrialState()
		allUndoButtonElems.forEach(disableHtmlElem);
		showPage(testName+"_"+configName+"_trials");
		switch (testType(testName)) {
			case "phb":
				startTestGame(testName, trialType);
				break;
			default:
				// Don't send setReadyMessage here - it will be sent when trial actually starts
				normalizeClassOfElemWithId(testName+"_"+configName+"_endTrialsButt");
				allUndoButtonElems.forEach(disableHtmlElem);
				showPage(testName+"_"+configName+"_trials");
				break;
		}
	}
}

function endTrials() {
	var buttonsOk = buttonsEnabled();
	console.log("[CONTROLLER] endTrials CALLED - buttonsEnabled:", buttonsOk, "testType:", testType(curTestName), "trialRunning:", trialRunning);
	console.log("[CONTROLLER] endTrials call stack");
	console.trace();
	console.log("[CONTROLLER] endTrials context", "curTestName:", curTestName, "curConfigName:", curConfigName, "curUserName:", curUserName);
	// Don't end trials if they're still running - wait for them to complete naturally
	if (trialRunning) {
		console.log("[CONTROLLER] endTrials blocked - trials are still running");
		return;
	}
	if (buttonsOk) {
		switch (testType(curTestName)) {
			case "box":
				resetTrialState();
				reflectAllResCounters();
				showPage(curTestName+"_index");
				break;
			case "phb":
				sendEvent("resp", "endTrials", "");
				finalizePhb();
				break;
			default:
				highlightClassOfElemWithId(curTestName+"_"+curConfigName+"_endTrialsButt");
				endTrialsPending = true;
				endTrialsAttempt = 0;
				console.log("[CONTROLLER] endTrials sending initial request");
				var endData = (curTestName || "") + "," + (curConfigName || "");
				sendEvent("resp", "endTrials", endData);
				sendEndTrialsWithRetry();
				break;
		}
	}
}

function trialsEndedFromResp(event) {
	console.log("[CONTROLLER] trialsEndedFromResp - resetting and returning to index");
	endTrialsPending = false;
	if (endTrialsTimeoutId) {
		clearTimeout(endTrialsTimeoutId);
		endTrialsTimeoutId = null;
	}
	endTrialsAttempt = 0;
	reflectAllResCounters();
	normalizeClassOfElemWithId(curTestName+"_"+curConfigName+"_endTrialsButt");
	resetTrialState();
	// Batch send all trial records before returning to index
	if (typeof batchSendAllRecords === "function") {
		batchSendAllRecords();
	}
	showPage(curTestName+"_index");
	console.log("[CONTROLLER] trialsEndedFromResp complete");
}

function trialEndedFromResp(event) {
	console.log("[CONTROLLER] trialEndedFromResp - resetting trial state");
	reflectAllResCounters();
	resetTrialState();
	// NOTE: Data upload now happens in responder, not here
	// Controller has no trial data (separate browser context/localStorage)
	console.log("[CONTROLLER] trialEndedFromResp complete - trialRunning:", trialRunning);
}

function endTest() {
	if (buttonsEnabled()) {
		switch (testType(curTestName)) {
			case "box":
				break;
			case "phb":
				sendEvent("resp", "endTest", "");
				finalizePhb();
				break;
			default:
				sendEvent("resp", "endTest", "");
				break;
		}
		showPage("testSelect");
	}
}

function testEndedFromResp(event) {
	//console.log("testEndedFromResp");
	//showPage("newTest");
}

function exitTests() {
	if (buttonsEnabled()) {
		//console.log("exitTests");
		showPage("appType");
	}
}

function disconnect() {
	if (buttonsEnabled()) {
		//console.log("disconnect");
		sendEvent("resp", "disconnect", "");
		setTimeout(abort, 500);
		//abort();
	}
}

function disconnectedFromResp() {
	//console.log("disconnectedFromResp");
	connectState = connectStateNotConnected;
	//abort();
}


// Event Source Handlers

function connectedFromResp(event) {
	//console.log("connectedFromResp");
	var dataItems, i, gameName;
	dataItems=event.data.split(",");
	i=0;
	curPosLat=parseFloat(dataItems[i++]);
	curPosLng=parseFloat(dataItems[i++]);
	normalizeClassOfElemWithId("connectButt");
	showPage("appType");
	connectState = connectStateConnected;
	//console.log("connectedFromResp", "connectState: "+connectState, "curPosLat: "+curPosLat, "curPosLng: "+curPosLng);
}

/*
 function gameActiveFromResp(Event) {
 //console.log("gameActiveFromResp");
 var dataItems, i, gameName;
 dataItems=event.data.split(",");
 i=0;
 gameName=dataItems[i++];
 //console.log("gameActiveFromResp gameName:"+gameName);
 sendEvent("resp", "gameActiveOk", gameName);
 }
 */

function testStartedFromResp(event) {
	console.log("testStartedFromResp");
}

function trialStartedFromResp(event) {
	var testName;
	var transTrialType;
	var transTrialVar;
	var trialStartTime;
	dataItems=event.data.split(",");
	i=0;
	testName=dataItems[i++];
	transTrialType=dataItems[i++];
	transTrialVar=dataItems[i++];
	trialStartTime=dataItems[i++];
	//console.log("trialStartedFromResp", "testName: "+testName, "transTrialType: "+transTrialType, "transTrialVar: "+transTrialVar, "trialStartTime: "+trialStartTime);
	switch (testName) {
		case "phb":
			var timeout;
			var configName;
			var buttonId;
			var elem;
			configElem = getConfigElem(testName, transTrialType, "");
			buttonId = curTestName+"_"+curTrialType+"_"+curTrialPhase+"_startGameTrialButt";
			curPhbButtText = configElem.getAttribute("buttonText");
			curPhbTimeout = parseInt(configElem.getAttribute("timeout"));
			//console.log("trialStartedFromResp", "curPhbTimeout: "+curPhbTimeout, "buttonId: "+buttonId);
			curPhbTrialButt = window[buttonId];
			if (curPhbTrialButt) {
				replaceText(curPhbTrialButt, curPhbTimeout);
				resetTimeoutTimer("phbTickTimer", phbTick, 1000);
			}
			else {
				//console.log("no curPhbTrialButt");
			}
			break;
		default:
			break;
	}
}

function phbTick() {
	//console.log("phbTick", "curTrialType: "+curTrialType);
	if (curPhbTimeout != null && curPhbTrialButt) {
		if (curPhbTimeout > 0) {
			curPhbTimeout--;
			replaceText(curPhbTrialButt, curPhbTimeout);
			resetTimeoutTimer("phbTickTimer", phbTick, 1000);
		}
		else {
			cancelTrial();
		}
	}
}

function finalizePhb() {
	//console.log("finalizePhb");
	if (curPhbTrialButt && curPhbButtText) {
		normalizeClass(curPhbTrialButt);
		replaceText(curPhbTrialButt, curPhbButtText);
		curPhbTimeout = null;
		curPhbTrialButt = null;
		curPhbButtText = null;
		stopTimeoutTimer("phbTickTimer");
		resetTrialState();
	}
	else {
		//console.log("ignored");
	}
}

function proceedFromResp(event) {
	//console.log("proceedFromResp");
}

function trialResultFromResp(event) {
	//console.log("trialResultFromResp");
	//console.log(event.data);
	var dataItems, i;
	var userName, projectNo, testSetNo, testName, partNo, prevRespTime, trialStartTime, transTrialType, trialPhase, totalTrials, transTrialVar, accuracy, touchTime, reactionTime, trialTime, button, anim, dotPressed, moveEvents, posLat, posLng, trialQueueLength;
	
	dataItems=event.data.split(",");
	i=0;
	
	userName=dataItems[i++];
	projectNo=dataItems[i++];
	testSetNo=dataItems[i++];
	testName=dataItems[i++];
	partNo=dataItems[i++];
	prevRespTime=dataItems[i++];
	trialStartTime=dataItems[i++];
	transTrialType=dataItems[i++];
	trialPhase=dataItems[i++];
	totalTrials=dataItems[i++];
	transTrialVar=dataItems[i++];
	accuracy=parseInt(dataItems[i++]);
	touchTime=dataItems[i++];
	reactionTime=dataItems[i++];
	trialTime=dataItems[i++];
	button=dataItems[i++];
	anim=dataItems[i++];
	dotPressed=dataItems[i++];
	moveEvents=dataItems[i++];
	posLat=dataItems[i++];
	posLng=dataItems[i++];
	trialQueueLength=dataItems[i++];
	
	//console.log("trialResultFromResp", "userName: "+userName, "accuracy: "+accuracy, "touchTime: "+touchTime, "reactionTime: "+reactionTime, "trialTime: "+trialTime, "trialQueueLength: "+trialQueueLength);
	
	if (accuracy)
		result="succ";
	else
		result="fail";
	
	switch (testType(curTestName)) {
		case "phb":
			finalizePhb();
			break;
		case "box":
			break;
		default:
			
			//switch (curTrialType) {
			//	case "tbvt":
			//	case "tbvb":
			//	case "tbvl":
			//	case "tbvr":
			//	case "tbgt":
			//	case "tbgb":
			//	case "tbgl":
			//	case "tbgr":
			//			break;
			//	default:
			incrResCounter(curTestName, curTrialType, curTrialPhase, result);
			reflectAllResCounters();
			highlightResCell(curTestName, curTrialType, curTrialPhase, result);
			updateTrialButton(curTestName, curTrialType, curTrialPhase, curRepeatOrigin, trialQueueLength);
			prevTrialIdPrefix=curTrialIdPrefix;
			break;
	}
	if (trialQueueLength == 0) {
		// Increment sets counter when a full task set completes
		counters[curTrialIdPrefix+"_sets"]++;
		normalizeTrialButtonCellElems();
		reflectAllResCounters();
		//console.log("finalizeTrialEnded", "curNextTrialType: "+curNextTrialType, "curNextTrialRepeat:"+curNextTrialRepeat);
		if (curNextTrialType != "" && curNextTrialRepeat) {
			var buttonElemId = curTestName+"_"+curNextTrialType+"_"+curTrialPhase+"_"+curNextTrialRepeat+"_startTrialButt";
			//console.log("buttonElemId: "+buttonElemId);
			var buttonElem = document.getElementById(buttonElemId);
			//console.log("buttonElem: "+buttonElem);
			if (buttonElem) {
				resetTrialState();
				buttonElem.click();
			}
		}
		else {
			resetTrialState();
		}
	}
}

// Utils

function cntr_stopTimers() {
	stopTimeoutTimer("phbTickTimer");
}

function highlightResCell(testName, trialType, trialPhase, result) {
	var idPrefix, resCell;
	idPrefix=testName+"_"+trialType+"_"+trialPhase;
	resCell=document.getElementById(idPrefix+"_"+result+"_resCell");
	if (resCell) {
		highlightClass(resCell);
	}
	else {
		console.warn("highlightResCell ignored", "testName: "+testName, "trialType: "+trialType, "trialPhase: "+trialPhase, "result: "+result);
	}
}

function highlightResCellByIdPrefix(idPrefix, result) {
	//console.log("highlightResCellByIdPrefix", "idPrefix:"+idPrefix);
	var resCell;
	resCell=document.getElementById(idPrefix+"_"+result+"_resCell");
	if (resCell)
		highlightClass(resCell);
	else
		console.warn("highlightResCell ignored", "testName: "+testName, "trialType: "+trialType, "trialPhase: "+trialPhase, "result :"+result);
}

function highlightResRow(testName, trialType, trialPhase, repeatOrigin) {
	var buttonId, buttonElem;
	highlightClass(document.getElementById(testName+"_"+trialType+"_"+trialPhase+"_frameCell"));
	highlightClass(document.getElementById(testName+"_"+trialType+"_"+trialPhase+"_name_resCell"));
	buttonId=testName+"_"+trialType+"_"+trialPhase+"_"+repeatOrigin+"_startTrialButt";
	//console.log("highlightResRow", "buttonId:"+buttonId, "repeatOrigin:"+repeatOrigin, "repeat:"+repeat);
	buttonElem=document.getElementById(buttonId);
	highlightClass(buttonElem);
	//disableHtmlElem(buttonElem);
	replaceText(buttonElem, repeatOrigin);
	//console.log("highlightResRow", buttonElem);
}

function updateTrialButton(testName, trialType, trialPhase, repeatOrigin, repeat) {
	var buttonId, buttonElem;
	buttonId=testName+"_"+trialType+"_"+trialPhase+"_"+repeatOrigin+"_startTrialButt";
	//console.log("updateTrialButton", "buttonId:"+buttonId, "repeatOrigin:"+repeatOrigin, "repeat:"+repeat);
	buttonElem=document.getElementById(buttonId);
	replaceText(buttonElem, repeat);
	//console.log("updateTrialButton", buttonElem);
}

function normalizeTrialButtonCellElems() {
	//console.log("normalizeTrialButtonCellElems");
	allStartTrialButtonCellElems.forEach(normalizeTrialButtonCellElem);
	//allCancelTrialButtonCellElems.forEach(normalizeTrialButtonCellElem);
	allGameTrialButtonCellElems.forEach(normalizeGameTrialButtonCellElem);
}

function normalizeTrialButtonCellElem(elem) {
	//console.log("normalizeTrialButtonCellElem");
	var buttonElem;
	buttonElem=elem.firstChild;
	normalizeClass(buttonElem);
	replaceText(buttonElem, buttonElem.dataset.text);
	enableHtmlElem(buttonElem);
}

function normalizeGameTrialButtonCellElem(elem) {
	var buttonElem;
	buttonElem=elem.firstChild;
	normalizeClass(buttonElem);
	replaceText(buttonElem, buttonElem.dataset.text);
	enableHtmlElem(buttonElem);
}

function normalizeResRowElems() {
	//console.log("normalizeResRowElems");
	allResRowElems.forEach(normalizeResRowElem);
}

function normalizeResRowElem(resRowElem) {
	//console.log("normalizeResRowElem");
	normalizeResRowElemCells(resRowElem.dataset.testname, resRowElem.dataset.trialtype, resRowElem.dataset.trialphase)
}

function normalizeResRowElemCells(testName, trialType, trialPhase) {
	normalizeRscc(testName, trialType, trialPhase);
	var idPrefix;
	idPrefix=testName+"_"+trialType+"_"+trialPhase;
	//console.log("normalizeResRowElemCells idPrefix:"+idPrefix);
	normalizeClass(document.getElementById(idPrefix+"_frameCell"));
	normalizeClass(document.getElementById(idPrefix+"_name_resCell"));
	normalizeClass(document.getElementById(idPrefix+"_succ_resCell"));
	normalizeClass(document.getElementById(idPrefix+"_fail_resCell"));
	normalizeClass(document.getElementById(idPrefix+"_totl_resCell"));
	normalizeClass(document.getElementById(idPrefix+"_rscc_resCell"));
}

function resetResCounters() {
	allResRowElems.forEach(resetResRowCounters);
}

function resetResRowCounters(resRowElem) {
	var idPrefix, countRscc;
	idPrefix=getIdPrefixPhase(resRowElem);
	countRscc=resRowElem.dataset.countrscc;
	//console.log("resetResRowCounters idPrefix:"+idPrefix+" countRscc:"+countRscc);
	//console.log(resRowElem);
	counters[idPrefix+"_succ"]=0;
	counters[idPrefix+"_fail"]=0;
	counters[idPrefix+"_sets"]=0;
	if (countRscc=="yes") {
		counters[idPrefix+"_rscc"]=0;
		counters[idPrefix+"_cscc"]=0;
	}
	else
		counters[idPrefix+"_rscc"]=null;
}

function getCountRscc(testName, trialType, trialPhase) {
	var idPrefix, resRowElem, countRscc;
	idPrefix=testName+"_"+trialType+"_"+trialPhase;
	resRowElem=document.getElementById(idPrefix+"_resRow");
	countRscc=resRowElem.dataset.countrscc;
	return countRscc;
}

function incrResCounter(testName, trialType, trialPhase, result) {
	//console.log("incrResCounter", "trialType: "+trialType, "trialPhase: "+trialPhase, "result: "+result)
	var idPrefix, resRowElem, countRscc, reqRscc;
	idPrefix=testName+"_"+trialType+"_"+trialPhase;
	counters[idPrefix+"_"+result]++;
	//console.log("resRowElemName: "+idPrefix+"_resRow");
	resRowElem=document.getElementById(idPrefix+"_resRow");
	//console.log("resRowElem: "+resRowElem);
	countRscc=resRowElem.dataset.countrscc;
	if (countRscc=="yes") {
		reqRscc=parseInt(resRowElem.dataset.reqrscc);
		//prevRepeat=curRepeat;
		prevCscc=counters[idPrefix+"_cscc"];
		prevRscc=counters[idPrefix+"_rscc"];
		if (result=="fail")
			counters[idPrefix+"_cscc"]=0;
		else {
			if (prevTrialIdPrefix==curTrialIdPrefix && counters[idPrefix+"_cscc"]<reqRscc)
				counters[idPrefix+"_cscc"]++;
			else
				counters[idPrefix+"_cscc"]=1;
			if (counters[idPrefix+"_cscc"]==reqRscc) {
				counters[idPrefix+"_rscc"]++;
				highlightResCellByIdPrefix(idPrefix, "rscc");
				//curRepeat=1;
			}
		}
		//console.log("incrResCounter", "cscc:"+counters[idPrefix+"_cscc"], "rscc:"+counters[idPrefix+"_rscc"], "prevCscc:"+prevCscc, "prevRscc:"+prevRscc);
	}
}

function undoIncrResCounter(idPrefix, result) {
	var resRowElem, countRscc, reqRscc;
	counters[idPrefix+"_"+result]--;
	resRowElem=document.getElementById(idPrefix+"_resRow");
	countRscc=resRowElem.dataset.countrscc;
	if (countRscc=="yes") {
		counters[idPrefix+"_cscc"]=prevCscc;
		counters[idPrefix+"_rscc"]=prevRscc;
		//curRepeat=prevRepeat;
		//console.log("undoIncrResCounter", "cscc:"+counters[idPrefix+"_cscc"], "rscc:"+counters[idPrefix+"_rscc"], "curRepeat:"+curRepeat);
		reqRscc=parseInt(resRowElem.dataset.reqrscc);
		if (counters[idPrefix+"_cscc"]>=reqRscc) {
			highlightResCellByIdPrefix(idPrefix, "rscc");
		}
	}
}

function normalizeRscc(testName, trialType, trialPhase) {
	var idPrefix, resRowElem, countRscc, reqRscc;
	idPrefix=testName+"_"+trialType+"_"+trialPhase;
	resRowElem=document.getElementById(idPrefix+"_resRow");
	countRscc=resRowElem.dataset.countrscc;
	//console.log("normalizeRscc idPrefix:"+idPrefix+" countRscc:"+countRscc);
	if (countRscc=="yes") {
		reqRscc=parseInt(resRowElem.dataset.reqrscc);
		if (prevTrialIdPrefix!=curTrialIdPrefix)
			counters[idPrefix+"_cscc"]=0;
	}
	reflectResRowCounters(resRowElem);
}

function resCounterTotal(testName, trialType, trialPhase) {
	return counters[testName+"_"+trialType+"_"+trialPhase+"_succ"]+counters[testName+"_"+trialType+"_"+trialPhase+"_fail"];
}

function reflectResCounters(testName, trialType, trialPhase) {
	var resRowElem;
	resRowElem=document.getElementById(testName+"_"+trialType+"_"+trialPhase+"_resRow");
	reflectResRowCounters(resRowElem);
}

function reflectAllResCounters() {
	allResRowElems.forEach(reflectResRowCounters);
	allTotalRowElems.forEach(updateTotalRow);
}

function reflectResRowCounters(resRowElem) {
	//console.log("reflectResRowCounters");
	var idPrefix;
	var succValue, failValue, csccValue, setsValue;
	idPrefix=getIdPrefixPhase(resRowElem);
	//console.log("idPrefix: "+idPrefix);
	succValue=counters[idPrefix+"_succ"];
	failValue=counters[idPrefix+"_fail"];
	setsValue=counters[idPrefix+"_sets"];
	csccValue=counters[idPrefix+"_cscc"];
	updateResCellValues(idPrefix, succValue, failValue, setsValue, csccValue);
	if (resRowElem.dataset.reflect != "") {
		//console.log("reflecting");
		updateResCellValues(getIdPrefixReflect(resRowElem), succValue, failValue, setsValue, csccValue);
	}
}

function updateTotalRow(totalRowElem) {
	var testName, totalName, trialTypeList, trialPhaseList, countRscc, idPrefix;
	var sumSucc, sumFail, sumTotl, sumRscc, ttIdPrefix, i;
	
	testName=totalRowElem.dataset.testname;
	totalName=totalRowElem.dataset.totalname;
	trialTypeList=totalRowElem.dataset.trialtypes.split(",");
	trialPhaseList=totalRowElem.dataset.trialphases.split(",");
	countRscc=totalRowElem.dataset.countrscc;
	idPrefix=testName+"_"+totalName+"_total";
	
	//console.log("updateTotalRow testName:"+testName+" totalName:"+totalName+" countRscc:"+countRscc+" idPrefix:"+idPrefix+" length:"+trialTypeList.length);
	//console.log(trialTypeList);
	//console.log(trialPhaseList);
	
	sumSucc=0;
	sumFail=0;
	sumTotl=0;
	if (countRscc=="yes")
		sumRscc=0;
	
	for (i=0; i<trialTypeList.length; i++) {
		ttIdPrefix=testName+"_"+trialTypeList[i]+"_"+trialPhaseList[i];
		sumSucc+=counters[ttIdPrefix+"_succ"];
		sumFail+=counters[ttIdPrefix+"_fail"];
		sumTotl+=counters[ttIdPrefix+"_sets"];
		if (countRscc=="yes")
			sumRscc+=counters[ttIdPrefix+"_rscc"];
		//console.log("i: "+i, "ttIdPrefix: "+ttIdPrefix, "sumSucc: "+sumSucc, "sumFail: "+sumFail, "sumRscc: ", sumRscc, "countRscc: "+countRscc);
	}
	
	replaceTextInElemWithId(idPrefix+"_succ_resCell", sumSucc);
	replaceTextInElemWithId(idPrefix+"_fail_resCell", sumFail);
	replaceTextInElemWithId(idPrefix+"_totl_resCell", sumTotl);
	if (countRscc=="yes")
		replaceTextInElemWithId(idPrefix+"_rscc_resCell", sumRscc);
	else
		removeChildrenInElemWithId(idPrefix+"_rscc_resCell");
	if (totalRowElem.dataset.reflect != "") {
		//console.log("reflecting total row");
		updateResCellValues(getIdPrefixReflect(totalRowElem), sumSucc, sumFail, sumRscc);
	}
}

function getIdPrefixPhase(resRowElem) {
	//console.log("getIdPrefixPhase");
	//console.log(resRowElem);
	return resRowElem.dataset.testname+"_"+resRowElem.dataset.trialtype+"_"+resRowElem.dataset.trialphase;
}

function getIdPrefixReflect(resRowElem) {
	//console.log("getIdPrefixReflect");
	//console.log(resRowElem);
	return resRowElem.dataset.testname+"_"+resRowElem.dataset.configname+"_"+resRowElem.dataset.reflect;
}

function updateResCellValues(idPrefix, succValue, failValue, setsValue, rsccValue) {
	//console.log("updateResCellValues idPrefix:"+idPrefix+" succValue:"+succValue+" failValue:"+failValue+" setsValue:"+setsValue+" rsccValue:"+rsccValue);
	replaceText(document.getElementById(idPrefix+"_succ_resCell"), succValue);
	replaceText(document.getElementById(idPrefix+"_fail_resCell"), failValue);
	replaceText(document.getElementById(idPrefix+"_totl_resCell"), setsValue != null && setsValue !== undefined ? setsValue : "");
	if (rsccValue!=null)
		replaceTextInElemWithId(idPrefix+"_rscc_resCell", rsccValue);
	else
		removeChildrenInElemWithId(idPrefix+"_rscc_resCell");
}
