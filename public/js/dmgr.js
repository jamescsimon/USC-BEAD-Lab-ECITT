// Initialization

function dmgrDeclareGlobals() {
	syncPointsDoc = null;
}

function dmgrInit(scrolling, cached, preload, environment, offline, offlineApp, remote, recLoc) {
	libDeclareGlobals();
	commDeclareGlobals();
	dmglibDeclareGlobals();
	dmgrDeclareGlobals();
	//curRemote=remote;
	getInitialGlobalKeys();
	initWindow("dmgr", scrolling, cached, preload, environment);
	entityAddYearSelectOptions("part", "Part", "birth", "Birth")
	entityAddMonthSelectOptions("part", "Part", "birth", "Birth")
	entityAddDaySelectOptions("part", "Part", "birth", "Birth")
	testEnterCurButton.hidden = true;
	authenticate();
}

function authOk() {
	showHtmlElemWithId("signOutRow");
	showPage("appType");
}

function enterTestsApp() {
	if (buttonsEnabled()) {
		projectsSelect(projectCurNo, projectsDocReceived);
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

function 	testSetSelectChangedHook() {
	//console.log("testSetSelectChangedHook");
	if (entitySelectValid("project", "Project")) {
		if (entitySelectValid("testSet", "TestSet")) {
			var dataStr = curUserName+","+projectCurName+","+testSetCurName+",null,null,"+projectCurNo+","+testSetCurNo+",null,null&tzOffset="+tzOffset+"&tzName="+tzName;
			var filePrefix = projectCurName+"_"+testSetCurName;
			var idLc = "testSet";
			var idUc = "TestSet";
			updateDownloadLinks(dataStr, filePrefix, idLc, idUc)
		}
		else {
			testSetDownloadResultsRow.hidden = true;
		}
	}
	else {
		testSetDownloadResultsRow.hidden = true;
	}
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

function testSetExitSelect() {
	if (buttonsEnabled()) {
		projectsSelect(projectCurNo, projectsDocReceived);
	}
}

/*
function testSetShowSummary() {
	location.assign("../resplist/?type=summarySelect&data="+curUserName+","+projectCurName+","+testSetCurName+","+projectCurNo+","+testSetCurNo+"&tzOffset="+tzOffset+"&tzName="+tzName);
}

function testSetShowAccuracy() {
	location.assign("../resplist/?type=accuracySelect&data="+curUserName+","+projectCurName+","+testSetCurName+","+projectCurNo+","+testSetCurNo+"&tzOffset="+tzOffset+"&tzName="+tzName);
}
*/

// parts

function partEnterCur() {
	console.log("partEnterCur");
	if (buttonsEnabled()) {
		if (entitySelectValid("part", "Part")) {
			testsSelect(testCurValue, testsDocReceived);
		}
		else {
			entityShowSelectInvalidAlert("part", "Part");
		}
	}
}

function updateDownloadLinks(dataStr, filePrefix, idLc, idUc) {
	window[idLc+"DownloadRespLink"].href = "../resplist/?type=respSelect&data="+dataStr;
	window[idLc+"DownloadRespLink"].download = filePrefix+"_responses.csv";
	window[idLc+"DownloadAccuracyLink"].href = "../resplist/?type=accuracySelect&data="+dataStr;
	window[idLc+"DownloadAccuracyLink"].download = filePrefix+"_accuracy.csv";
	window[idLc+"DownloadNtsMarkersLink"].href = "../resplist/?type=ntsMarkersSelect&data="+dataStr;
	window[idLc+"DownloadNtsMarkersLink"].download = filePrefix+"_ntsMarkers.csv";
	window[idLc+"DownloadTrialBlocksLink"].href = "../resplist/?type=trialBlocksSelect&data="+dataStr;
	window[idLc+"DownloadTrialBlocksLink"].download = filePrefix+"_trialBlocks.csv";
	window[idLc+"DownloadResultsRow"].hidden = false;
}

function 	partSelectChangedHook() {
	console.log("partCurRef: "+partCurRef);
	if (entitySelectValid("project", "Project")) {
		if (entitySelectValid("testSet", "TestSet")) {
			if (entitySelectValid("part", "Part")) {
				let partCurName = getName("part", partCurRef, partCurNo);
				var dataStr = curUserName+","+projectCurName+","+testSetCurName+","+partCurName+",null,"+projectCurNo+","+testSetCurNo+","+partCurNo+",null&tzOffset="+tzOffset+"&tzName="+tzName;
				var filePrefix = projectCurName+"_"+testSetCurName+"_"+partCurName;
				var idLc = "part";
				var idUc = "Part";
				updateDownloadLinks(dataStr, filePrefix, idLc, idUc)
			}
			else {
				partDownloadResultsRow.hidden = true;
			}
		}
		else {
			partDownloadResultsRow.hidden = true;
		}
	}
	else {
		partDownloadResultsRow.hidden = true;
	}
}

function testSelectChangedHook() {
	if (entitySelectValid("project", "Project")) {
		if (entitySelectValid("testSet", "TestSet")) {
			if (entitySelectValid("part", "Part")) {
				if (entitySelectValid("test", "Test")) {
					let partCurName = getName("part", partCurRef, partCurNo);
					var dataStr = curUserName+","+projectCurName+","+testSetCurName+","+partCurName+","+testCurValue+","+projectCurNo+","+testSetCurNo+","+partCurNo+","+testCurValue+"&tzOffset="+tzOffset+"&tzName="+tzName;
					var filePrefix = projectCurName+"_"+testSetCurName+"_"+partCurName+"_"+testCurValue;
					var idLc = "test";
					var idUc = "Test";
					updateDownloadLinks(dataStr, filePrefix, idLc, idUc)
				}
				else {
					testDownloadResultsRow.hidden = true;
				}
			}
			else {
				testDownloadResultsRow.hidden = true;
			}
		}
		else {
			testDownloadResultsRow.hidden = true;
		}
	}
	else {
		testDownloadResultsRow.hidden = true;
	}
}

/*
function partEnterCur() {
	//console.log("partEnterCur", "tzOffset: "+tzOffset);
		if (buttonsEnabled()) {
		if (entitySelectValid("part", "Part")) {
			ntsMarkersLink.href = "../resplist/?type=ntsMarkersSelect&data="+curUserName+","+projectCurName+","+testSetCurName+","+partCurRef+","+projectCurNo+","+testSetCurNo+","+partCurNo+"&tzOffset="+tzOffset+"&tzName="+tzName;
			ntsMarkersLink.download = projectCurName+"_"+testSetCurName+"_"+partCurRef+"_ntsMarkers.csv";
			console.log("ntsMarkersLink:"+ntsMarkersLink);
			showPage("partInfo");
		}
		else {
			entityShowSelectInvalidAlert("part", "Part");
		}
	}
}
*/

// tests

function testExitSelect() {
	if (buttonsEnabled()) {
		partsSelect(projectCurNo, testSetCurNo, partCurNo, partsDocReceived);
	}
}

function testEnterCur() {
	if (buttonsEnabled()) {
	}
}


function partExitSelect() {
	if (buttonsEnabled()) {
		testSetsSelect(projectCurNo, testSetCurNo, testSetsDocReceived);
	}
}

function exitPartInfo() {
	if (buttonsEnabled()) {
		partsSelect(projectCurNo, testSetCurNo, 0, partsDocReceived);
	}
}

// Sync info

function enterSyncPoints() {
	if (buttonsEnabled()) {
		if (entitySelectValid("part", "Part")) {
			syncPointsSelect(projectCurNo, testSetCurNo, partCurNo, syncPointsDocReceived)
		}
		else {
			entityShowSelectInvalidAlert("part", "Part");
		}
	}
}

function exitSyncPoints() {
	var syncPointsTable = window["syncPointsTable"];
	removeChildren(syncPointsTable);
	syncPointsDoc = null;
	showPage("partInfo");
}

function syncPointsSelect(projectNo, testSetNo, partNo, endHandler) {
	getXmlDoc("../csvdata/?type=syncPointsSelect&data="+curUserName+","+projectNo+","+testSetNo+","+partNo, "syncPointsDoc", endHandler);
}

function syncPointsDocReceived() {
	if (syncPointsDoc) {
		console.log("syncPointsDoc", syncPointsDoc);
		var syncPointsTable = window["syncPointsTable"];
		var headerRow = createTr(null, null);
		headerRow.appendChild(createTd("trialStart", "page"));
		headerRow.appendChild(createTd("reaction", "page"));
		headerRow.appendChild(createTd("reactionTime", "page"));
		headerRow.appendChild(createTd("test", "page"));
		headerRow.appendChild(createTd("trialName", "page"));
		headerRow.appendChild(createTd("trialNo", "page"));
		headerRow.appendChild(createTd("animShown", "page"));
		syncPointsTable.appendChild(headerRow);
		var syncPointElem = syncPointsDoc.documentElement.firstChild;
		var dataRow;
		var trialStartTs;
		var trialType;
		var trialVariant;
		var trialName;
		while (syncPointElem != null) {
			dataRow = createTr(null, null);
			trialStartTs = parseInt(syncPointElem.getAttribute("trialStartTime"));
			dataRow.appendChild(createTd(genClockDescr(trialStartTs), "page"));
			reactionTime = parseInt(syncPointElem.getAttribute("reactionTime"));
			reactionTs = trialStartTs + reactionTime;
			dataRow.appendChild(createTd(genClockDescrTime(reactionTs), "page"))
			dataRow.appendChild(createTd(""+reactionTime, "page"));
			dataRow.appendChild(createTd(syncPointElem.getAttribute("testName"), "page"));
			trialType = syncPointElem.getAttribute("trialType");
			trialVariant = syncPointElem.getAttribute("trialVariant");
			if (trialVariant == "") {
				trialName = trialType;
			}
			else {
				trialName = trialType+"_"+trialVariant;
			}
			dataRow.appendChild(createTd(trialName, "page"));
			dataRow.appendChild(createTd(syncPointElem.getAttribute("trialNo"), "page"));
			dataRow.appendChild(createTd(syncPointElem.getAttribute("animationShown"), "page"));
			syncPointsTable.appendChild(dataRow);
			syncPointElem = syncPointElem.nextSibling;
		}
		showPage("syncPoints");
	}
}

function dmgrFinalize() {
	//console.log("resultsFinalize");
}
