// Initialization

function indexInit(scrolling) {
	//console.log("indexInit");
	libDeclareGlobals();
	initWindow(scrolling);
	getInitialGlobalKeys();
	authenticate();
}

function authOk() {
	showFirstPage();
}

function indexFinalize() {
	//console.log("indexFinalize");
	finalizeWindow();
	logNewGlobalKeys();
}
