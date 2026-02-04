/**
 * Connection polling for local testing (replaces EventSource)
 * Reads/writes connection state from shared JSON file
 */

var pollingInterval = null;
var pollingDelay = 500; // Poll every 500ms
var eventPollingInterval = null;
var eventPollingDelay = 300; // Poll for events every 300ms

function startConnectionPolling(role, onStateChange) {
	// Silent polling - logs removed to reduce console spam
	pollingInterval = setInterval(function() {
		pollConnectionState(role, onStateChange);
	}, pollingDelay);
	// Also poll immediately
	pollConnectionState(role, onStateChange);
}

function stopConnectionPolling() {
	if (pollingInterval) {
		clearInterval(pollingInterval);
		pollingInterval = null;
	}
}

function pollConnectionState(role, onStateChange) {
	getXmlDoc("../getinfo/?type=connectionState", "connectionStateDoc", function(doc) {
		if (doc && doc.documentElement) {
			var elem = doc.documentElement;
			var state = {
				connection_state: elem.getAttribute("connection_state"),
				controller_ready: elem.getAttribute("controller_ready"),
				responder_ready: elem.getAttribute("responder_ready"),
				last_event: elem.getAttribute("last_event")
			};
			// Silent polling - log removed to reduce console spam
			if (onStateChange) {
				onStateChange(state);
			}
		}
	});
}

function updateConnectionState(updates) {
	var data = JSON.stringify(updates);
	// Silent update - log removed to reduce console spam
	getXmlDoc("../getinfo/?type=updateConnectionState&data=" + encodeURIComponent(data), "updateStateDoc", function(doc) {
		if (doc && doc.documentElement) {
			// Silent confirmation
		}
	});
}

// Event polling for responder (gets test commands from controller)
function startEventPolling(role, pairingCode) {
	console.log("startEventPolling: role=" + role + " pc=" + pairingCode);
	eventPollingInterval = setInterval(function() {
		pollForEvents(role, pairingCode);
	}, eventPollingDelay);
	// Poll immediately
	pollForEvents(role, pairingCode);
}

function stopEventPolling() {
	if (eventPollingInterval) {
		clearInterval(eventPollingInterval);
		eventPollingInterval = null;
		console.log("Event polling stopped");
	}
}

function pollForEvents(role, pairingCode) {
	getXmlDoc("../getevents/?role=" + role + "&pc=" + pairingCode, "", function(doc) {
		if (doc && doc.documentElement) {
			var events = doc.getElementsByTagName("event");
			for (var i = 0; i < events.length; i++) {
				var type = events[i].getAttribute("type");
				var data = events[i].getAttribute("data");
				handlePolledEvent(type, data);
			}
		}
	});
}

function handlePolledEvent(type, data) {
	console.log("handlePolledEvent: type=" + type + " data=" + data);
	// Dispatch event to appropriate handler
	var event = {data: data};
	
	switch (type) {
		case "connect":
			if (typeof connectFromCntr === "function") connectFromCntr(event);
			break;
		case "disconnect":
			if (typeof disconnectFromCntr === "function") disconnectFromCntr(event);
			break;
		case "flipClock":
			if (typeof flipClockFromCntr === "function") flipClockFromCntr(event);
			break;
		case "hideClock":
			if (typeof hideClockFromCntr === "function") hideClockFromCntr(event);
			break;
		case "startGame":
			if (typeof startGameFromCntr === "function") startGameFromCntr(event);
			break;
		case "pressButton":
			if (typeof pressButtonFromCntr === "function") pressButtonFromCntr(event);
			break;
		case "endGame":
			if (typeof endGameFromCntr === "function") endGameFromCntr(event);
			break;
		case "touchGame":
			if (typeof touchGameFromCntr === "function") touchGameFromCntr(event);
			break;
		case "startTest":
			if (typeof startTestFromCntr === "function") startTestFromCntr(event);
			break;
		case "startTrial":
			if (typeof startTrialFromCntr === "function") startTrialFromCntr(event);
			break;
		case "startMultiTrials":
			if (typeof startMultiTrialsFromCntr === "function") startMultiTrialsFromCntr(event);
			break;
		case "cancelTrial":
			if (typeof cancelTrialFromCntr === "function") cancelTrialFromCntr(event);
			break;
		case "endTrials":
			if (typeof endTrialsFromCntr === "function") endTrialsFromCntr(event);
			break;
		case "endTest":
			if (typeof endTestFromCntr === "function") endTestFromCntr(event);
			break;
		case "setReadyMessage":
			if (typeof setReadyMessageFromCntr === "function") setReadyMessageFromCntr(event);
			break;
		case "clearReadyMessage":
			if (typeof clearReadyMessageFromCntr === "function") clearReadyMessageFromCntr(event);
			break;	// Controller-side events (FROM responder TO controller)
	case "connected":
		if (typeof connectedFromResp === "function") connectedFromResp(event);
		break;
	case "trialStarted":
		if (typeof trialStartedFromResp === "function") trialStartedFromResp(event);
		break;
	case "trialResult":
		if (typeof trialResultFromResp === "function") trialResultFromResp(event);
		break;
	case "trialEnded":
		if (typeof trialEndedFromResp === "function") trialEndedFromResp(event);
		break;
	case "trialCancelled":
		if (typeof trialCancelledFromResp === "function") trialCancelledFromResp(event);
		break;
	case "trialsEnded":
		if (typeof trialsEndedFromResp === "function") trialsEndedFromResp(event);
		break;
	case "testStarted":
		if (typeof testStartedFromResp === "function") testStartedFromResp(event);
		break;
	case "testEnded":
		if (typeof testEndedFromResp === "function") testEndedFromResp(event);
		break;
	case "proceed":
		if (typeof proceedFromResp === "function") proceedFromResp(event);
		break;
	case "gameActive":
		if (typeof gameActiveFromResp === "function") gameActiveFromResp(event);
		break;		default:
			console.warn("Unknown event type: " + type);
	}
}
