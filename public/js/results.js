// Initialization

function resultsInit() {
	//console.log("resultsInit");
}

function resultsFinalize() {
	//console.log("resultsFinalize");
}

function deletionComplete(statusElem) {
	//console.log(statusElem);
	reloadPage();
}

function download(reportName, filter) {
	location.href=("../respdumpdb/?reportName="+reportName+filter);
}
