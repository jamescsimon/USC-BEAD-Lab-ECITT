// Initialization

function clockDeclareGlobals() {
}

function clockInit(scrolling, cached, preload, environment, offline, offlineApp, remote, recLoc) {
	console.log("clockInit");
	libDeclareGlobals();
	getInitialGlobalKeys();
	initWindow("clock", scrolling, cached, preload, environment);
	showPage("clock");
	resetTimeoutTimer("clockTimer", updateClock, 1);
}

function updateClock() {
	replaceText(window["clockCell"], genCalTimeStr());
	resetTimeoutTimer("clockTimer", updateClock, 1);
}

function clockFinalize() {
	console.log("clockFinalize");
	stopTimeoutTimer("clockTimer");
	hidePage("clock");
}

function genCalTimeStr() {
	var ts = Date.now();
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
