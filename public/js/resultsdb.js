// Initialization

function resultsInit() {
	//console.log("resultsInit");
}

function resultsFinalize() {
	//console.log("resultsFinalize");
}

function confirmDelete(searchStr, noOfTrials) {
	var subject;
	if (noOfTrials==1) {
		subject="trial";
	}
	else {
		subject="trials";
	}
	if (confirm("Are you sure you want to delete "+noOfTrials+" "+subject+"?")) {
		sendXmlOp("../respdel?mode=filtered"+searchStr, deletionComplete);
	}
}

function deletionComplete(statusElem) {
	reloadPage();
}

function download(reportName, filter) {
	location.href=("../respdump/?reportName="+reportName+filter);
}
