function commDeclareGlobals() {
	connectStateNotConnected = 0;
	connectStateConnecting = 1;
	connectStateReconnecting= 2;
	connectStateConnected = 3;
	
	eventSources=new Array();
	eventRequests = new Array();
	partner="";
	eventFailuresInARow=0;
	prevRespDataStr="";
	connectState = connectStateNotConnected;
	// Windows compatibility mode flag - prevents restart loops when EventSource fails
	compatibilityMode = false;
}

function initEventSource(role, pairingCode, onOpen) {
	console.log("initEventSource", "role:", role, "pairingCode:", pairingCode);
	var eventSource, requestStr;
	requestStr="../eventsource/?role="+role+"&pc="+pairingCode;
	console.log("initEventSource requestStr:", requestStr);
	if (!onOpen) {
		onOpen=eventSourceOpen;
	}
	try {
		eventSource=new EventSource(requestStr);
		console.log("EventSource created, readyState:", eventSource.readyState);
		eventSource.addEventListener("notify", showNote, false);
		eventSource.addEventListener("hello", hello, false);
		//eventSource.addEventListener("ping", ping, false);
		eventSource.addEventListener("goodbye", goodbye, false);
		eventSource.addEventListener("readyStateChanged", eventSourceReadyStateChanged, false);
		eventSource.addEventListener("error", eventSourceError, false);
		eventSource.addEventListener("close", eventSourceClose, false);
		eventSource.addEventListener("cancel", eventSourceCancel, false);
		eventSource.addEventListener("message", eventSourceMessage, false);
		eventSource.addEventListener("timeout", eventSourceTimeout, false);
		eventSource.addEventListener("open", onOpen, false);
		eventSources.push(eventSource);
		console.log("EventSource listeners added, readyState:", eventSource.readyState);
		
		// On Windows, EventSource often fails immediately - add a timeout fallback
		if (role == "resp") {
			setTimeout(function() {
				if (eventSource.readyState == EventSource.CLOSED || eventSource.readyState == EventSource.CONNECTING) {
					console.log("EventSource still connecting/closed after 500ms, triggering error handler");
					var errorEvent = {target: eventSource};
					eventSourceError(errorEvent);
				}
			}, 500);
		}
		
		return eventSource;
	} catch (e) {
		console.error("Failed to create EventSource:", e);
		// If EventSource creation fails, trigger error handler manually
		if (role == "resp" && typeof eventSourceError !== 'undefined') {
			console.log("EventSource creation failed, manually triggering error handler");
			var fakeEvent = {target: null};
			eventSourceError(fakeEvent);
		}
		throw e;
	}
}

function closeEventSources() {
	//console.log("closeEventSources");
	var eventSource;
	while (eventSources.length>0) {
		eventSource=eventSources.pop();
		//console.log(eventSource);
		eventSource.close();
	}
	// Windows workaround: Don't send goodbye event during initialization
	// This causes unnecessary requests and errors when EventSource isn't working
	// Only send goodbye if we actually had a connection
	if (connectState == connectStateConnected && !compatibilityMode) {
		sendEvent(curRole, "goodbye", "");
	}
}

// Event Source Handlers

function showNote(event) {
	//console.log("Notification");
	//console.log(event);
}

function hello(event) {
	console.log("hello event received in comm.js");
	//console.log(event);
	// If there's a controller-specific hello handler, it will also be called
	// This generic handler is here for compatibility
}

function goodbye(event) {
	//console.log("goodbye");
	var eventSource, i;
	eventSource=event.target;
	console.warn("Connection closed by server");
	eventSource.close();
	i=eventSources.indexOf(eventSource);
	if (i >= 0) {
		eventSources.splice(i, 1);
	}
	// Windows workaround: Don't restart on goodbye if we're in compatibility mode
	// This allows the app to continue working even when EventSource fails
	if (compatibilityMode || connectState == connectStateConnected || connectState == connectStateConnecting) {
		console.log("Connection closed but staying in compatibility mode (Windows)");
		// If we were connecting, mark as connected now
		if (connectState == connectStateConnecting) {
			connectState = connectStateConnected;
			compatibilityMode = true;
		}
		return; // Don't restart - just return
	}
	//if (eventSources.length==0) {
	restart();
	//}
}

function eventSourceMessage(event) {
	//console.log("eventSourceMessage");
	//console.log(event);
}

function eventSourceOpen(event) {
	//console.log("EventSourceOpen");
	//console.log(event);
}

function eventSourceClose(event) {
	//console.log("eventSourceClose", event);
}

function eventSourceCancel(event) {
	//console.log("eventSourceCancel", event);
}

function eventSourceTimeout(event) {
	console.warn("eventSourceTimeout", event);
	connectState = connectStateReconnecting;
	//setTimeout(reInitConnection, 100);
}

function eventSourceError(event) {
	console.warn("eventSourceError", event);
	console.warn("EventSource readyState:", event.target.readyState);
	console.warn("EventSource URL:", event.target.url);
	// Windows workaround: EventSource fails on Windows due to Unix socket limitations
	// Set state to "connected" anyway so the app can function without real-time EventSource
	if (navigator.online) {
		// On Windows, EventSource will fail but we can still use the app
		// Set connected state so buttons and functions work
		console.log("EventSource failed (expected on Windows), enabling compatibility mode");
		
		// Check if we're responder or controller BEFORE changing state
		var startPairingButt = document.getElementById("startPairingButt");
		var connectButt = document.getElementById("connectButt");
		var isResponder = (startPairingButt !== null);
		var isController = (connectButt !== null);
		var wasConnecting = (connectState == connectStateConnecting);
		
		console.log("eventSourceError: isResponder="+isResponder+", isController="+isController+", connectState="+connectState+", connectStateConnecting="+connectStateConnecting+", wasConnecting="+wasConnecting);
		
		// Update responder UI if we were connecting (or always update if responder)
		if (isResponder && typeof replaceTextInElemWithId !== 'undefined') {
			var connectPageTitle = document.getElementById("connectPageTitle");
			if (connectPageTitle) {
				console.log("eventSourceError: updating responder UI to 'Available for Connection'");
				replaceTextInElemWithId("connectPageTitle", "Available for Connection");
			} else {
				console.warn("eventSourceError: connectPageTitle element not found!");
			}
			if (startPairingButt && typeof highlightClassOfElemWithId !== 'undefined') {
				highlightClassOfElemWithId("startPairingButt");
			}
		}
		
		connectState = connectStateConnected;
		compatibilityMode = true; // Set flag to prevent restart loops
		
		// Update controller UI to show compatibility mode
		if (isController && typeof normalizeClassOfElemWithId !== 'undefined' && typeof replaceTextInElemWithId !== 'undefined') {
			if (connectButt) {
				normalizeClassOfElemWithId("connectButt");
			}
			var connectPageTitle = document.getElementById("connectPageTitle");
			if (connectPageTitle) {
				replaceTextInElemWithId("connectPageTitle", "Connected (Compatibility Mode)");
			}
			// If we're in controller mode, show the app type page (same as successful connection)
			if (typeof showPage !== 'undefined') {
				var appTypePage = document.getElementById("appType_page");
				if (appTypePage) {
					showPage("appType");
				}
			}
		}
		// Don't call goodbye() - it will restart and reset everything
		// Just close the event source and continue
		var eventSource = event.target;
		if (eventSource) {
			eventSource.close();
			var i = eventSources.indexOf(eventSource);
			if (i >= 0) {
				eventSources.splice(i, 1);
			}
		}
	}
	else {
		goodbye(event)
	}
}

function eventSourceReadyStateChanged(event) {
	//console.log("eventSourceReadyStateChanged");
	//source=event.target;
	//console.log(event);
}

// Request Utils

/** Strip BOM, PHP warnings, etc. before <?xml or < so we can parse XML from responseText. */
function stripLeadingGarbageBeforeXml(text) {
	if (!text || typeof text !== "string") return text;
	var s = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
	var i = s.indexOf("<?xml");
	if (i < 0) i = s.indexOf("<");
	if (i > 0) s = s.slice(i);
	return s;
}

function sendEvent(target, type, data) {
	var requestStr;
	requestStr="../sendevent/?av="+appVersion+"&target="+target+"&pc="+curUserName+"&type="+type+"&data="+data;
	//console.log(requestStr);
	// Windows workaround: Always send events since EventSource doesn't work on Windows
	// The /sendevent/ endpoint will handle the event even without active EventSource connection
	sendXmlOp(requestStr, eventSent);
	// Original code (commented out for Windows compatibility):
	// switch (connectState) {
	// 	case connectStateConnected:
	// 	case connectStateConnecting:
	// 		sendXmlOp(requestStr, eventSent);
	// 		break;
	// 	case connectStateReconnecting:
	// 		//console.log("queued", "request: "+requestStr);
	// 		eventRequests.push(requestStr);
	// 		break;
	// 	default:
	// 		//console.log("ignored", "connectState: "+connectState, "request: "+requestStr);
	// }
}

function flushEventRequestQueue() {
	var requestStr;
	while (eventRequests.length>0) {
		requestStr = eventRequests.pop();
		//console.log("sent", "request: "+requestStr);
		sendXmlOp(requestStr, eventSent);
	}
}

function eventSent(statusElem) {
	//console.log("eventSent", "statusElem: "+statusElem);
	var serverAppVersion;
	if (statusElem) {
		if (statusElem.getAttribute("code")=="error") {
			eventFailuresInARow++;
			console.warn("eventSent", "error:"+statusElem.getAttribute("msg"), "eventFailuresInARow:"+eventFailuresInARow);
			if (eventFailuresInARow > 10 && connected) {
				eventFailuresInARow=0;
				abort();
			}
		}
		else {
			eventFailuresInARow=0;
			serverAppVersion=statusElem.getAttribute("appVersion");
			if (appVersion!=serverAppVersion) {
				newAppVersionDetected();
			}
		}
	}
	else {
		eventFailuresInARow=0;
	}
}

function getInfo(type, data, docName, endHandler) {
	getXmlDoc("../getinfo/?av="+appVersion+"&sender="+curRole+"&pc="+curUserName+"&type="+type+"&data="+data, docName, endHandler);
}

function recordResponse(projectNo, testSetNo, testName, partNo, prevRespTime, trialStartTime, trialType, trialPhase, trialNo, trialVariant, accuracy, touchTime, reactionTime, trialTime, buttonPressed, animationShowed, dotPressed, moveEvents, trialQueueLength) {
	var dataStr=curUserName+","+projectNo+","+testSetNo+","+testName+","+partNo+","+prevRespTime+","+trialStartTime+","+trialType+","+trialPhase+","+trialNo+","+trialVariant+","+accuracy+","+touchTime+","+reactionTime+","+trialTime+","+buttonPressed+","+animationShowed+","+dotPressed+","+moveEvents+","+curPosLat+","+curPosLng+","+trialQueueLength;
	//console.log("recordAndReport, dataStr: "+dataStr);
	localStorage.setItem(curUserName+"_"+trialStartTime, dataStr);
	prevRespDataStr=dataStr;
	var requestStr="../dbacc/?type=respInsert&data="+dataStr;
	//console.log("recordResponse, requestStr:"+requestStr);
	sendXmlOp(requestStr, responseRecorded);
}

function recordAndReport(projectNo, testSetNo, testName, partNo, prevRespTime, trialStartTime, trialType, trialPhase, trialNo, trialVariant, accuracy, touchTime, reactionTime, trialTime, buttonPressed, animationShowed, dotPressed, moveEvents, trialQueueLength) {
	var dataStr=curUserName+","+projectNo+","+testSetNo+","+testName+","+partNo+","+prevRespTime+","+trialStartTime+","+trialType+","+trialPhase+","+trialNo+","+trialVariant+","+accuracy+","+touchTime+","+reactionTime+","+trialTime+","+buttonPressed+","+animationShowed+","+dotPressed+","+moveEvents+","+curPosLat+","+curPosLng+","+trialQueueLength;
	//console.log("recordAndReport, dataStr: "+dataStr);
	localStorage.setItem(curUserName+"_"+trialStartTime, dataStr);
	//console.log("#localStorageItems: "+localStorage.length)
	prevRespDataStr=dataStr;
	var requestStr="../dbacc/?av="+appVersion+"&target=cntr&pc="+curUserName+"&type=trialResult&data="+dataStr;
	//console.log("recordAndReport, requestStr:"+requestStr);
	sendXmlOp(requestStr, recordedAndReported);
}

function responseRecorded(statusElem) {
	//console.log("responseRecorded");
	if (statusElem) {
		if (statusElem.tagName == "ok") {
			//console.log(statusElem);
			var id = statusElem.getAttribute("msg");
			localStorage.removeItem(id);
			flushRecordQueue();
		}
	}
	else {
		console.warn("NO STATUS ELEM")
	}
}

function recordedAndReported(statusElem) {
	//console.log("recordedAndReported");
	if (statusElem) {
		if (statusElem.tagName == "ok") {
			//console.log(statusElem);
			var id = statusElem.getAttribute("msg");
			localStorage.removeItem(id);
			flushRecordQueue();
		}
	}
	else {
		console.warn("NO STATUS ELEM")
	}
}

function flushRecordQueue() {
	//console.log("flushRecordQueue");
	var key;
	var i = 0;
	var found = false;
	while (i < localStorage.length && !found) {
		key = localStorage.key(i);
		//console.log("i: "+i+", key: "+key);
		if (key.match(respKeyRE)) {
			dataStr = localStorage.getItem(key);
			found = true;
			var requestStr="../dbacc/?type=respInsert&data="+dataStr;
			console.log("flushRecordQueue, requestStr:"+requestStr);
			sendXmlOp(requestStr, responseRecorded);
		}
		i += 1;
	}
	//console.log("flushRecordQueue exit");
}

function deleteLastResponse() {
	if (prevRespDataStr) {
		requestStr="../respdeldb/?data="+prevRespDataStr;
		//console.log("deleteLastResponse requestStr:"+requestStr);
		sendXmlOp(requestStr, responseDeleted);
		prevRespDataStr="";
	}
}

function fixLastResponse() {
	//console.log("fixLastResponse");
	prevRespDataStr="";
}

function responseDeleted(statusElem) {
	//console.log("responseDeleted");
	//console.log(statusElem);
}

function abortConn() {
	//console.log("abortConn");
	var requestStr;
	requestStr="../abortconn/?pc="+curUserName;
	//console.log(requestStr);
	sendXmlOp(requestStr, null);
}

function eventSourceKilled(statusElem) {
	//console.log("eventSourceKilled");
	//console.log(statusElem);
}

function sendXmlOp(requestStr, endHandler) {
	var request;
	request=new XMLHttpRequest();
	request.onreadystatechange=xmlOpRequestReadyStateChanged;
	request.endHandler=endHandler;
	request.requestStr=requestStr;
	request.sendTime=Date.now();
	// Don't set responseType - let browser auto-detect
	request.open("GET", requestStr, true);
	request.send();
	//var now=new Date();
	//console.log("sendXmlOp:"+now.toUTCString()+" requestStr:"+requestStr);
}

function xmlOpRequestReadyStateChanged(event) {
	var request, responseDoc, timeSinceRequested, endHandler;
	request=event.target;
	if (request) {
		var readyState = request.readyState;
		//console.log("xmlOpRequestReadyStateChanged, readyState: "+readyState)
		if (readyState == 4) {
			var now=new Date();
			responseDoc=request.responseXML;
			requestStr=request.requestStr;
			endHandler=request.endHandler;
			timeSinceRequested=Date.now()-request.sendTime;
			if (responseDoc) {
				removeEmptyChildNodes(responseDoc.documentElement);
				if (endHandler) {
					endHandler(responseDoc.documentElement);
				}
			}
			else {
				// Try to parse responseText as XML if responseXML is null (e.g. wrong Content-Type or leading PHP output)
				if (request.responseText && request.status === 200) {
					try {
						var parser = new DOMParser();
						var toParse = stripLeadingGarbageBeforeXml(request.responseText);
						responseDoc = parser.parseFromString(toParse, "text/xml");
						if (responseDoc && responseDoc.documentElement && !responseDoc.querySelector("parsererror")) {
							removeEmptyChildNodes(responseDoc.documentElement);
							if (endHandler) {
								endHandler(responseDoc.documentElement);
							}
							return;
						}
					} catch(e) {
						console.warn("xmlOpRequestReadyStateChanged", "Failed to parse XML:", e);
					}
				}
				console.warn("xmlOpRequestReadyStateChanged", "NO RESPONSE DOC", "Status:", request.status, "ResponseText length:", request.responseText ? request.responseText.length : 0);
				if (endHandler) {
					endHandler(null);
				}
			}
		}
	}
	else {
		console.warn("xmlDocRequestReadyStateChanged, NO REQUEST")
	}
}

function getXmlDoc(requestStr, docName, endHandler) {
	console.log("getXmlDoc START, requestStr: "+requestStr+", docName: "+docName);
	var request;
	try {
		request=new XMLHttpRequest();
		console.log("getXmlDoc: XMLHttpRequest created successfully");
	} catch(e) {
		console.error("getXmlDoc: Failed to create XMLHttpRequest:", e);
		if (endHandler) endHandler(null);
		return;
	}
	request.onreadystatechange=xmlDocRequestReadyStateChanged;
	request.docName=docName;
	request.endHandler=endHandler;
	request.requestStr=requestStr;
	request.sendTime=Date.now();
	request.handled = false; // Flag to prevent multiple handler calls
	
	// Add timeout to prevent indefinite hanging (30 seconds)
	request.timeout = 30000;
	
	// Handle timeout
	request.ontimeout = function() {
		if (request.handled) return; // Already handled
		request.handled = true;
		console.error("getXmlDoc TIMEOUT", "requestStr:", requestStr, "docName:", docName, "timeSinceRequested:", Date.now() - request.sendTime);
		request.abort(); // Abort to prevent readyState 4 from firing
		if (request.endHandler) {
			request.endHandler(null);
		}
	};
	
	// Handle network errors
	request.onerror = function() {
		if (request.handled) return; // Already handled
		request.handled = true;
		console.error("getXmlDoc ERROR", "requestStr:", requestStr, "docName:", docName, "status:", request.status, "timeSinceRequested:", Date.now() - request.sendTime);
		request.abort(); // Abort to prevent readyState 4 from firing
		if (request.endHandler) {
			request.endHandler(null);
		}
	};
	
	// Try to let browser auto-detect, but if that fails, we'll parse responseText
	// Some browsers need explicit responseType for XML
	try {
		request.responseType = "document"; // Try document first for better XML parsing
	} catch(e) {
		// Some browsers don't support "document", fall back to auto-detect
		console.log("getXmlDoc: responseType='document' not supported, using auto-detect");
	}
	
	// Add logging for request lifecycle
	console.log("getXmlDoc: Opening request for", docName, "URL:", requestStr);
	request.open("GET", requestStr, true);
	
	// Prevent caching
	request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
	request.setRequestHeader("Pragma", "no-cache");
	request.setRequestHeader("Expires", "0");
	
	console.log("getXmlDoc: Sending request for", docName);
	request.send();
	console.log("getXmlDoc: Request sent for", docName);
	var now=new Date();
	//console.log("getXmlDoc:"+now.toUTCString()+" docName:"+docName);
}

function xmlDocRequestReadyStateChanged(event) {
	var request, responseDoc, docName, timeSinceRequested, endHandler;
	request=event.target;
	if (request) {
		timeSinceRequested=Date.now()-request.sendTime;
		var readyState = request.readyState;
		console.log("xmlDocRequestReadyStateChanged", "docName:", request.docName, "readyState:", readyState, "status:", request.status, "timeSinceRequested:", timeSinceRequested);
		if (readyState == 4) {
			// Skip if already handled by timeout/error handler
			if (request.handled) {
				return;
			}
			request.handled = true; // Mark as handled
			
			var now=new Date();
			responseDoc=request.responseXML;
			docName=request.docName;
			endHandler=request.endHandler;
			
			// Check for timeout or error status
			if (request.status === 0) {
				console.error("xmlDocRequestReadyStateChanged: Request failed (status 0)", "docName:", docName, "timeSinceRequested:", timeSinceRequested);
				if (endHandler) {
					endHandler(null);
				}
				return;
			}
			
			if (responseDoc) {
				console.log("xmlDocRequestReadyStateChanged: SUCCESS", "docName:", docName, "timeSinceRequested:", timeSinceRequested, "status:", request.status);
				//console.log(responseDoc);
				removeEmptyChildNodes(responseDoc.documentElement);
				if (docName) {
					window[docName]=responseDoc;
					console.log("Set window." + docName + " = responseDoc");
				}
				if (endHandler) {
					endHandler(responseDoc);
					console.log("Called endHandler for", docName);
				}
			}
			else {
				// Try to parse responseText as XML if responseXML is null (e.g. wrong Content-Type or leading PHP output)
				if (request.responseText && request.status === 200) {
					try {
						var parser = new DOMParser();
						var toParse = stripLeadingGarbageBeforeXml(request.responseText);
						responseDoc = parser.parseFromString(toParse, "text/xml");
						var parserError = responseDoc && responseDoc.querySelector("parsererror");
						if (parserError) {
							console.warn("xmlDocRequestReadyStateChanged", "XML Parse Error:", parserError.textContent);
							console.warn("ResponseText preview:", request.responseText.substring(0, 500));
						} else if (responseDoc && responseDoc.documentElement) {
							console.log("xmlDocRequestReadyStateChanged: PARSED FROM TEXT", "docName:", docName);
							removeEmptyChildNodes(responseDoc.documentElement);
							if (docName) {
								window[docName]=responseDoc;
								console.log("Set window." + docName + " = parsed responseDoc");
							}
							if (endHandler) {
								endHandler(responseDoc);
								console.log("Called endHandler for", docName);
							}
							return;
						}
					} catch(e) {
						console.warn("xmlDocRequestReadyStateChanged", "Failed to parse XML:", e);
						console.warn("ResponseText preview:", request.responseText ? request.responseText.substring(0, 500) : "null");
					}
				}
				console.warn("xmlDocRequestReadyStateChanged, NO RESPONSE DOC", "docName:", docName, "Status:", request.status, "ResponseText length:", request.responseText ? request.responseText.length : 0, "ResponseType:", request.responseType);
				if (request.responseText) {
					console.warn("ResponseText preview:", request.responseText.substring(0, 200));
				}
				// Don't set window[docName] if response is invalid - let handler decide what to do
				if (endHandler) {
					endHandler(null);
				}
			}
		}
	}
	else {
		console.warn("xmlDocRequestReadyStateChanged, NO REQUEST")
	}
}
