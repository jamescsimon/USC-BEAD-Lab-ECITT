// Initialization

function dmglibDeclareGlobals() {
	
	projectsDoc = null;
	
	projectCurNo = localStorage.getItem("projectCurNo");
	if (!projectCurNo) {
		projectCurNo = 0;
	}
	
	projectCurPerm=""
	projectCurName=""
	projectEditable = false;
	
	testSetsDoc = null;
	
	testSetCurNo = localStorage.getItem("testSetCurNo");
	if (!testSetCurNo) {
		testSetCurNo = 0;
	}
	
	testSetCurPerm=""
	testSetCurName=""
	testSetEditable = false;
	
	partsDoc = null
	partCurNo=0;
	partCurPerm="";
	partCurRef="";
	partCurBirthYear=0;
	partCurBirthMonth=0;
	partCurBirthDay=0;
	partCurGender="";
	partEditable = false;
	
	testsDoc = null;
	testCurValue = "";
}

// Project db access

var projectsSelectPending = false;
var projectsSelectRetryCount = 0;
var projectsSelectMaxRetries = 3;

function projectsSelect(projectNo, endHandler) {
	console.log("projectsSelect ENTRY: projectNo="+projectNo+", pending="+projectsSelectPending+", retryCount="+projectsSelectRetryCount);
	if (projectsSelectPending) {
		console.warn("projectsSelect already pending, ignoring duplicate call");
		return;
	}
	projectsSelectPending = true;
	console.log("projectsSelect: Set pending=true, about to call getXmlDoc");
	
	// Safety timeout: reset flag after 35 seconds even if callback never fires
	var safetyTimeout = setTimeout(function() {
		if (projectsSelectPending) {
			console.error("projectsSelect: Safety timeout - resetting pending flag");
			projectsSelectPending = false;
		}
	}, 35000);
	
	// Add timestamp to prevent caching
	var timestamp = Date.now();
	var requestUrl = "../csvdata/?type=projectsSelect&data="+curUserName+","+projectNo+"&_t="+timestamp;
	console.log("projectsSelect: About to call getXmlDoc with URL:", requestUrl);
	getXmlDoc(requestUrl, "projectsDoc", function(doc) {
		console.log("projectsSelect: getXmlDoc callback fired, doc:", doc ? "exists" : "null");
		clearTimeout(safetyTimeout); // Clear safety timeout since callback fired
		projectsSelectPending = false; // Always reset flag, even on error/timeout
		if (endHandler) {
			console.log("projectsSelect: Calling endHandler");
			endHandler(doc);
		}
	});
	console.log("projectsSelect: getXmlDoc called, function returning");
}

function projectInsert(projectName, endHandler) {
	getXmlDoc("../csvdata/?type=projectInsert&data="+curUserName+","+projectName, "projectsDoc", endHandler);
}

function projectUpdate(projectNo, projectName, endHandler) {
	getXmlDoc("../csvdata/?type=projectUpdate&data="+curUserName+","+projectNo+","+projectName, "projectsDoc", endHandler);
}

function projectDelete(projectNo, endHandler) {
	getXmlDoc("../csvdata/?type=projectDelete&data="+curUserName+","+projectNo, "projectsDoc", endHandler);
}

// Project event handlers

function searchChanged(idLc) {
	var searchElem = window[idLc+"Search"];
	var selectElem = window[idLc+"Select"];
	var childElem = selectElem.firstChild;
	var found = false;
	var regExp = new RegExp(searchElem.value, "i");
	while (childElem != null && !found) {
		if (childElem.tagName == "option" || childElem.tagName == "OPTION") {
			if (regExp.test(childElem.firstChild.textContent)) {
				selectElem.value = childElem.value;
				found = true;
				window[idLc+"SelectChanged"]();
			}
		}
		childElem = childElem.nextSibling;
	}
}

function projectsDocReceived(doc) {
	// Use the parameter if provided, otherwise fall back to global variable
	var docToUse = doc !== undefined ? doc : projectsDoc;
	console.log("projectsDocReceived called, doc parameter:", doc, "global projectsDoc:", projectsDoc);
	
	// Update global variable if we got a valid doc
	if (docToUse && docToUse.documentElement) {
		projectsDoc = docToUse;
		projectsSelectRetryCount = 0; // Reset retry count on success
		console.log("projectsDocReceived: doc is valid, documentElement exists");
	} else {
		console.error("projectsDocReceived: invalid document, retryCount:", projectsSelectRetryCount);
		console.error("docToUse:", docToUse);
		if (docToUse) {
			console.error("docToUse.documentElement:", docToUse.documentElement);
		}
		
		// Check retry limit
		if (projectsSelectRetryCount >= projectsSelectMaxRetries) {
			console.error("projectsDocReceived: max retries reached, giving up");
			alert("Failed to load projects after " + projectsSelectMaxRetries + " attempts. Please check your connection and try again.");
			projectsSelectRetryCount = 0;
			return;
		}
		
		// Reset pending flag before retrying (in case previous request timed out)
		projectsSelectPending = false;
		// Increment retry count and retry after a delay
		projectsSelectRetryCount++;
		setTimeout(function() {
			console.log("projectsDocReceived: retrying (attempt " + projectsSelectRetryCount + "/" + projectsSelectMaxRetries + ")");
			projectsSelect(projectCurNo || 0, projectsDocReceived);
		}, 1000);
		return;
	}
	
	console.log("projectsDocReceived: about to call entityUpdateSelectElem");
	try {
		entityUpdateSelectElem("project", "Project", "project", "Project", "name", projectsDoc);
		console.log("projectsDocReceived: entityUpdateSelectElem completed successfully");
	} catch (e) {
		console.error("projectsDocReceived: entityUpdateSelectElem threw exception:", e);
		return;
	}
	
	console.log("projectsDocReceived: about to call projectUpdateCurInfo");
	try {
		projectUpdateCurInfo();
		console.log("projectsDocReceived: projectUpdateCurInfo completed successfully");
	} catch (e) {
		console.error("projectsDocReceived: projectUpdateCurInfo threw exception:", e);
		return;
	}
	
	console.log("projectsDocReceived: about to call projectEnterSelectPage");
	try {
		projectEnterSelectPage();
		console.log("projectsDocReceived: projectEnterSelectPage completed successfully");
	} catch (e) {
		console.error("projectsDocReceived: projectEnterSelectPage threw exception:", e);
		return;
	}
	console.log("projectsDocReceived completed successfully");
}

function projectSelectChanged() {
	projectUpdateCurInfo();
	entityUpdateSelectPageButtons("project", "Project", projectCurPerm, curGlobalPerm, false);
}

function projectFormInfoChanged() {
	projectSaveCurButton.disabled = !projectFormInfoValid();
}

// Project button responders

function projectFlipEditable() {
	projectEditable = !projectEditable;
	entityUpdateSelectPageButtons("project", "Project", projectCurPerm, curGlobalPerm, false);
}

function projectCreateNew() {
	if (buttonsEnabled()) {
		projectResetCurInfo();
		projectEnterEditPage();
	}
}

function projectUpdateCur() {
	if (buttonsEnabled()) {
		projectUpdateCurInfo();
		projectEnterEditPage();
	}
}

function projectDeleteCur() {
	if (buttonsEnabled()) {
		if (entitySelectValid("project", "Project")) {
			projectDelete(projectCurNo, projectsDocReceived);
		}
	}
}

function projectCancelEdit() {
	if (buttonsEnabled()) {
		projectEnterSelectPage();
	}
}

function projectSaveCur() {
	if (buttonsEnabled()) {
		if (projectFormInfoValid()) {
			if (projectCurNo > 0 && entitySelectValid("project", "Project")) {
				projectUpdate(projectCurNo, projectNameInput.value, projectsDocReceived);
			}
			else {
				projectInsert(projectNameInput.value, projectsDocReceived);
			}
		}
		else {
			entityShowFormInfoInvalidAlert("project", "Project");
		}
	}
}

// Project utilities

function projectEnterSelectPage() {
	console.log("projectEnterSelectPage called");
	projectEditable = false;
	console.log("projectEnterSelectPage: projectEditable set to false");
	
	replaceText(projectContextPara, "User: "+curUserName);
	console.log("projectEnterSelectPage: context replaced with User:", curUserName);
	
	entityUpdateSelectPageButtons("project", "Project", projectCurPerm, curGlobalPerm, false);
	console.log("projectEnterSelectPage: buttons updated");
	
	projectSelectChanged();
	console.log("projectEnterSelectPage: projectSelectChanged called");
	
	console.log("projectEnterSelectPage: about to call showPage('projectSelect')");
	showPage("projectSelect");
	console.log("projectEnterSelectPage: showPage completed");
}

function projectEnterEditPage() {
	projectNameInput.value = projectCurName;
	projectFormInfoChanged();
	showPage("projectEdit");
}

function projectUpdateCurInfo() {
	var elem = entityGetCurElem("project", "Project", projectsDoc);
	if (elem) {
		projectCurNo = parseInt(elem.getAttribute("no"));
		localStorage.setItem("projectCurNo", projectCurNo);
		projectCurPerm = elem.getAttribute("perm");
		projectCurName = elem.getAttribute("name");
	}
	else {
		projectResetCurInfo();
	}
}

function projectResetCurInfo() {
	projectCurNo = 0;
	projectCurPerm = "";
	projectCurName = "";
}

function projectFormInfoValid() {
	return projectNameInput.value != "";
}

// TestSet db access

function testSetsSelect(projectNo, testSetNo, endHandler) {
	getXmlDoc("../csvdata/?type=testSetsSelect&data="+curUserName+","+projectNo+","+testSetNo, "testSetsDoc", endHandler);
}

function testSetInsert(projectNo, testSetName, endHandler) {
	getXmlDoc("../csvdata/?type=testSetInsert&data="+curUserName+","+projectNo+","+testSetName, "testSetsDoc", endHandler);
}

function testSetUpdate(projectNo, testSetNo, testSetName, endHandler) {
	getXmlDoc("../csvdata/?type=testSetUpdate&data="+curUserName+","+projectNo+","+testSetNo+","+testSetName, "testSetsDoc", endHandler);
}

function testSetDelete(projectNo, testSetNo, endHandler) {
	getXmlDoc("../csvdata/?type=testSetDelete&data="+curUserName+","+projectNo+","+testSetNo, "testSetsDoc", endHandler);
}

// TestSet event handlers

function testSetsDocReceived() {
	//console.log(testSetsDoc);
	entityUpdateSelectElem("testSet", "TestSet", "testSet", "TestSet", "name", testSetsDoc);
	testSetUpdateCurInfo();
	testSetEnterSelectPage();
}

function testSetSelectChanged() {
	testSetUpdateCurInfo();
	entityUpdateSelectPageButtons("testSet", "TestSet", testSetCurPerm, projectCurPerm, false);
	testSetSelectChangedHook();
}

function testSetFormInfoChanged() {
	testSetSaveCurButton.disabled = !testSetFormInfoValid();
}

// TestSet button responders

function testSetFlipEditable() {
	testSetEditable = !testSetEditable;
	entityUpdateSelectPageButtons("testSet", "TestSet", testSetCurPerm, projectCurPerm, false);
}

function testSetCreateNew() {
	if (buttonsEnabled()) {
		testSetResetCurInfo();
		testSetEnterEditPage();
	}
}

function testSetUpdateCur() {
	if (buttonsEnabled()) {
		testSetUpdateCurInfo();
		testSetEnterEditPage();
	}
}

function testSetDeleteCur() {
	if (buttonsEnabled()) {
		if (entitySelectValid("project", "Project")) {
			if (entitySelectValid("testSet", "TestSet")) {
				testSetDelete(projectCurNo, testSetCurNo, testSetsDocReceived);
			}
		}
		else {
			entityShowFormInfoInvalidAlert("project", "Project");
		}
	}
}

function testSetCancelEdit() {
	if (buttonsEnabled()) {
		testSetEnterSelectPage();
	}
}

function testSetSaveCur() {
	if (buttonsEnabled()) {
		if (projectCurNo > 0 && entitySelectValid("project", "Project")) {
			if (testSetFormInfoValid()) {
				if (testSetCurNo > 0 && entitySelectValid("testSet", "TestSet")) {
					testSetUpdate(projectCurNo, testSetCurNo, testSetNameInput.value, testSetsDocReceived);
				}
				else {
					testSetInsert(projectCurNo, testSetNameInput.value, testSetsDocReceived);
				}
			}
			else {
				entityShowFormInfoInvalidAlert("testSet", "TestSet");
			}
		}
		else {
			entityShowFormInfoInvalidAlert("project", "Project");
		}
		
	}
}

// TestSet utilities

function testSetEnterSelectPage() {
	replaceText(testSetContextPara, projectCurName);
	testSetEditable = false;
	entityUpdateSelectPageButtons("testSet", "TestSet", testSetCurPerm, projectCurPerm, false);
	testSetSelectChanged();
	showPage("testSetSelect");
}

function testSetEnterEditPage() {
	testSetNameInput.value = testSetCurName;
	testSetFormInfoChanged();
	showPage("testSetEdit");
}

function testSetUpdateCurInfo() {
	var elem = entityGetCurElem("testSet", "TestSet", testSetsDoc, testSetCurPerm, projectCurPerm);
	if (elem) {
		testSetCurNo = parseInt(elem.getAttribute("no"));
		localStorage.setItem("testSetCurNo", testSetCurNo);
		testSetCurPerm = elem.getAttribute("perm");
		testSetCurName = elem.getAttribute("name");
	}
	else {
		testSetResetCurInfo();
	}
}

function testSetResetCurInfo() {
	testSetCurNo = 0;
	testSetCurPerm = "";
	testSetCurName = "";
}

function testSetFormInfoValid() {
	return testSetNameInput.value != "";
}



// Part db access

function partsSelect(projectNo, testSetNo, partNo, endHandler) {
	getXmlDoc("../csvdata/?type=partsSelect&data="+curUserName+","+projectNo+","+testSetNo+","+partNo, "partsDoc", endHandler);
}

function partInsert(projectNo, testSetNo, partRef, partBirthYear, partBirthMonth, partBirthDay, partGender, endHandler) {
	getXmlDoc("../csvdata/?type=partInsert2&data="+curUserName+","+projectNo+","+testSetNo+","+partRef+","+partBirthYear+","+partBirthMonth+","+partBirthDay+","+partGender, "partsDoc", endHandler);
}

function partUpdate(projectNo, testSetNo, partNo, partRef, partBirthYear, partBirthMonth, partBirthDay, partGender, endHandler) {
	getXmlDoc("../csvdata/?type=partUpdate2&data="+curUserName+","+projectNo+","+testSetNo+","+partNo+","+partRef+","+partBirthYear+","+partBirthMonth+","+partBirthDay+","+partGender, "partsDoc", endHandler);
}

function partDelete(projectNo, testSetNo, partNo, endHandler) {
	getXmlDoc("../csvdata/?type=partDelete&data="+curUserName+","+projectNo+","+testSetNo+","+partNo, "partsDoc", endHandler);
}

// Part event handlers

function partsDocReceived() {
	var partElem = partsDoc.documentElement.firstChild;
	while (partElem) {
		if (partElem.getAttribute("owner") == "1") {
			partElem.setAttribute("perm", "adm");
		}
		else {
			partElem.setAttribute("perm", "use");
		}
		partElem = partElem.nextSibling;
	}
	
	//console.log(partsDoc);
	entityUpdateSelectElem("part", "Part", "participant", "Participant", "ref", partsDoc);
	partUpdateCurInfo();
	partEnterSelectPage();
}

function partSelectChanged() {
	partUpdateCurInfo();
	partNoInfoRowSelect.hidden = partCurNo == 0;
	replaceText(partNoTextSelect, partCurNo);
	replaceText(partAgeTextSelect, genAgeDescr(partCurBirthYear, partCurBirthMonth, partCurBirthDay));
	replaceText(partGenderTextSelect, partCurGender);
	entityUpdateSelectPageButtons("part", "Part", partCurPerm, testSetCurPerm, true);
	partSelectChangedHook();
}

function partFormInfoChanged() {
	//console.log("partFormInfoChanged");
	partNoInfoRowForm.hidden = partCurNo == 0;
	replaceText(partNoTextForm, partCurNo);
	replaceText(partAgeTextForm, genAgeDescr(parseInt(partBirthYearSelect.value), parseInt(partBirthMonthSelect.value), parseInt(partBirthDaySelect.value)));
	replaceText(partGenderTextForm, partCurGender);
	partSaveCurButton.disabled = !partFormInfoValid();
}

// Part button responders

function partFlipEditable() {
	partEditable = !partEditable;
	entityUpdateSelectPageButtons("part", "Part", partCurPerm, testSetCurPerm, true);
}

function partCreateNew() {
	if (buttonsEnabled()) {
		partResetCurInfo();
		partEnterEditPage();
	}
}

function partUpdateCur() {
	if (buttonsEnabled()) {
		partUpdateCurInfo();
		partEnterEditPage();
	}
}

function partDeleteCur() {
	if (buttonsEnabled()) {
		if (entitySelectValid("project", "Project")) {
			if (entitySelectValid("testSet", "TestSet")) {
				if (entitySelectValid("part", "Part")) {
					partDelete(projectCurNo, testSetCurNo, partCurNo, partsDocReceived);
				}
			}
			else {
				entityShowFormInfoInvalidAlert("testSet", "TestSet");
			}
		}
		else {
			entityShowFormInfoInvalidAlert("project", "Project");
		}
	}
}

function partCancelEdit() {
	if (buttonsEnabled()) {
		partEnterSelectPage();
	}
}

function partSaveCur() {
	if (buttonsEnabled()) {
		if (entitySelectValid("project", "Project")) {
			if (entitySelectValid("testSet", "TestSet")) {
				if (partFormInfoValid()) {
					if (partCurNo > 0) {
						partUpdate(projectCurNo, testSetCurNo, partCurNo, partRefInput.value, partBirthYearSelect.value, partBirthMonthSelect.value, partBirthDaySelect.value, partCurGender, partsDocReceived);
					}
					else {
						partInsert(projectCurNo, testSetCurNo, partRefInput.value, partBirthYearSelect.value, partBirthMonthSelect.value, partBirthDaySelect.value, partCurGender, partsDocReceived);
					}
				}
				else {
					entityShowFormInfoInvalidAlert("part", "Part");
				}
			}
			else {
				entityShowFormInfoInvalidAlert("testSet", "TestSet");
			}
		}
		else {
			entityShowFormInfoInvalidAlert("project", "Project");
		}
	}
}

// Part utilities

function partEnterSelectPage() {
	replaceText(partContextPara, testSetCurName);
	partEditable = false;
	entityUpdateSelectPageButtons("part", "Part", partCurPerm, testSetCurPerm, true);
	partSelectChanged();
	showPage("partSelect");
}

function partEnterEditPage() {
	partRefInput.value = partCurRef;
	partBirthYearSelect.value = ""+partCurBirthYear
	partBirthMonthSelect.value = ""+partCurBirthMonth
	partBirthDaySelect.value = ""+partCurBirthDay
	genderButtonSelect("part", partCurGender, "female,male,other");
	partFormInfoChanged();
	partSaveCurButton.disabled = !partFormInfoValid();
	showPage("partEdit");
}

function partUpdateCurInfo() {
	var elem = entityGetCurElem("part", "Part", partsDoc);
	if (elem) {
		partCurNo = parseInt(elem.getAttribute("no"));
		partCurPerm = elem.getAttribute("perm");
		partCurRef = elem.getAttribute("ref");
		console.log("partCurRef: "+partCurRef)
		partCurBirthYear = parseInt(elem.getAttribute("birthYear"));
		partCurBirthMonth = parseInt(elem.getAttribute("birthMonth"));
		partCurBirthDay = parseInt(elem.getAttribute("birthDay"));
		partCurGender = elem.getAttribute("gender");
	}
	else {
		partResetCurInfo();
	}
}

function partResetCurInfo() {
	partCurNo = 0;
	partCurPerm = "";
	partCurRef = "";
	partCurBirthYear = 0;
	partCurBirthMonth = 0;
	partCurBirthDay = 0;
	partCurGender = "";
}

function partFormInfoValid() {
	//console.log("partFormInfoValid", "partCurGender: "+partCurGender);
	return partBirthYearSelect.value != "0" && partBirthMonthSelect.value != "0" && partBirthDaySelect.value != "0" && partCurGender != "";
}


// Test db access

function testsSelect(curValue, endHandler) {
	getXmlDoc("../csvdata/?type=testsSelect&data="+curUserName+","+curValue, "testsDoc", endHandler);
}

function testsDocReceived() {
	console.log("testsDocReceived: testsDoc exists:", testsDoc !== null);
	if (testsDoc) {
		var tests = testsDoc.documentElement;
		console.log("testsDocReceived: root element:", tests.tagName, "current:", tests.getAttribute("current"));
		var count = 0;
		var child = tests.firstChild;
		while (child) {
			if (child.nodeType === 1) { // ELEMENT_NODE
				console.log("testsDocReceived: test", count, "no:", child.getAttribute("no"), "name:", child.getAttribute("name"), "value:", child.getAttribute("value"));
				count++;
			}
			child = child.nextSibling;
		}
		console.log("testsDocReceived: total tests:", count);
	}
	updateSelectElem("test", "Test", "test", "Test", curTestName, testsDoc);
	testUpdateCurInfo();
	testEnterSelectPage();
}

function testEnterSelectPage() {
	replaceText(testContextPara, partCurRef);
	showPage("testSelect");
	testSelectChanged();
}

function testSelectChanged() {
	setEnabled(window["testEnterCurButton"], (testSelect.value != ""));
	//window["testEnterCurButton"].disabled = (testSelect.value == "");
	testUpdateCurInfo();
	testSelectChangedHook();
}

function testUpdateCurInfo() {
	testCurValue = testSelect.value;
}

// Event handlers

function nameInputChanged(elem) {
	elem.value = elem.value.replace(/ /, "_");
	elem.value = elem.value.replace(/[^a-zA-Z0-9_]/, "");
}

// Utilities

function updateSelectElem(idLc, idUc, nameLc, nameUc, curValue, sourceDoc) {
	if (sourceDoc != null) {
		var selectElem = window[idLc+"Select"];
		removeChildren(selectElem);
		optElem = createOption("", "Select "+nameUc);
		selectElem.appendChild(optElem);
		var found = false;
		var sourceElem = sourceDoc.documentElement.firstChild;
		while (sourceElem) {
			optElem = createOption(sourceElem.getAttribute("value"), sourceElem.getAttribute("name"));
			selectElem.appendChild(optElem);
			if (sourceElem.getAttribute("value") == curValue) {
				selectElem.value = curValue;
				found = true;
			}
			sourceElem = sourceElem.nextSibling;
		}
		if (!found) {
			selectElem.value = "";
		}
	}
}

function entityAddYearSelectOptions(entIdLc, entIdUc, attrIdLc, attrIdUc) {
	var now = new Date();
	var optElem;
	var year = now.getFullYear();
	var selectElem = window[entIdLc+attrIdUc+"YearSelect"];
	optElem = createOption(0, "Year");
	selectElem.appendChild(optElem);
	while (year >= 1900) {
		optElem = createOption(year, ""+year);
		selectElem.appendChild(optElem);
		year -= 1;
	}
}

function entityAddMonthSelectOptions(entIdLc, entIdUc, attrIdLc, attrIdUc) {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var selectElem = window[entIdLc+attrIdUc+"MonthSelect"];
	optElem = createOption(0, "Month");
	selectElem.appendChild(optElem);
	var monthNo = 0
	while (monthNo < months.length) {
		optElem = createOption((monthNo + 1), months[monthNo]);
		selectElem.appendChild(optElem);
		monthNo += 1;
	}
}

function entityAddDaySelectOptions(entIdLc, entIdUc, attrIdLc, attrIdUc) {
	var selectElem = window[entIdLc+attrIdUc+"DaySelect"];
	optElem = createOption(0, "Day");
	selectElem.appendChild(optElem);
	var day = 1
	while (day <= 31) {
		optElem = createOption(day, ""+day);
		selectElem.appendChild(optElem);
		day += 1;
	}
}

function entityUpdateSelectPageButtons(idLc, idUc, thisPerm, parentPerm, canCreate) {
	//console.log("entityUpdateSelectPageButtons", "idLc: "+idLc, "thisPerm: "+thisPerm, "parentPerm: "+parentPerm);
	var updatePerm = (thisPerm == "adm" || parentPerm == "adm");
	var createPerm = (parentPerm == "adm" || canCreate);
	var selectElem = window[idLc+"Select"];
	//console.log("selectElem:", selectElem);
	//console.log("selectElem.value:", selectElem.value);
	var valueSelected = (parseInt(selectElem.value) > 0);
	//console.log("valueSelected:", valueSelected);
	var editable = window[idLc+"Editable"];
	window[idLc+"UpdateButtonsRow"].hidden = !valueSelected || !editable || !updatePerm;
	
	setEnabled(window[idLc+"CreateNewButton"], createPerm);
	setEnabled(document.getElementById(idLc+"EnterCurButton"), valueSelected);
	setEnabled(window[idLc+"UpdateCurButton"], (valueSelected && editable && updatePerm));
	setEnabled(window[idLc+"DeleteCurButton"], (valueSelected && editable && createPerm));
	setEnabled(window[idLc+"FlipEditableButton"], (valueSelected && updatePerm));
	if (window[idLc+"Editable"]) {
		replaceText(window[idLc+"FlipEditableButton"], "Lock");
	}
	else {
		replaceText(window[idLc+"FlipEditableButton"], "Edit");
	}
}

function getName(idLc, name, no) {
	if (name == "") {
		return ""+idLc+no;
	}
	else {
		return name;
	}
}

function entityUpdateSelectElem(idLc, idUc, nameLc, nameUc, nameAttr, sourceDoc) {
	if (sourceDoc != null) {
		var selectElem = window[idLc+"Select"];
		removeChildren(selectElem);
		optElem = createOption(0, "Select "+nameUc);
		selectElem.appendChild(optElem);
		var found = false;
		var currentNo = sourceDoc.documentElement.getAttribute("current");
		var sourceElem = sourceDoc.documentElement.firstChild;
		while (sourceElem) {
			var noValue = sourceElem.getAttribute("no");
			var nameValueRaw = sourceElem.getAttribute(nameAttr);
			var nameValue = getName(idLc, nameValueRaw, noValue)
			optElem = createOption(noValue, nameValue);
			selectElem.appendChild(optElem);
			if (sourceElem.getAttribute("no") == currentNo) {
				selectElem.value = currentNo;
				found = true;
			}
			sourceElem = sourceElem.nextSibling;
		}
		if (!found) {
			selectElem.value = "0";
		}
	}
}

function entityGetCurElem(idLc, idUc, sourceDoc) {
	var elem = null;
	if (sourceDoc != null) {
		var selectElem = window[idLc+"Select"];
		var valueSelected = (parseInt(selectElem.value) > 0);
		if (valueSelected) {
			elem = sourceDoc.documentElement.firstChild;
			while (elem.getAttribute("no") != selectElem.value && elem != null) {
				elem = elem.nextSibling;
			}
		}
		return elem;
	}
}

function entitySelectValid(idLc, idUc) {
	var selectElem = window[idLc+"Select"];
	return (parseInt(selectElem.value) > 0);
}

function entityShowSelectInvalidAlert(idLc, idUc) {
	if (curEnvironment == "nativeApp") {
		alert("warning "+idLc+"InvalidSelect");
	}
	else {
		alert("No "+idLc+" selected");
	}
}

function entityShowFormInfoInvalidAlert(idLc, idUc) {
	if (curEnvironment == "nativeApp") {
		alert("warning "+idLc+"InvalidFormInfo");
	}
	else {
		alert("Invalid "+idLc+" info");
	}
}

function genderButtonSelect(idLc, selValueLc, allValuesLcStr) {
	allValuesLc = allValuesLcStr.split(",");
	for (valueLc of allValuesLc) {
		var className = "radioOption";
		if (valueLc == selValueLc) {
			className = className + " radioSelected";
			window[idLc+"CurGender"] = valueLc;
			//console.log(window[idLc+"CurGender"], partCurGender);
		}
		window[idLc+"GenderButton"+valueLc.ucfirst()].setAttribute("class", className);
	}
}

function partGenAgeDescr(birthYear, birthMonth) {
	if (birthYear > 0) {
		var now = new Date();
		var totalMonths = (now.getFullYear() - birthYear) * 12;
		if (birthMonth > 0) {
			totalMonths += now.getMonth() + 1 - birthMonth;
		}
		if (totalMonths >= 0) {
			var ageYears = Math.floor(totalMonths / 12);
			var ageMonths = totalMonths % 12;
			if (ageYears > 0) {
				return ageYears+" years, "+ageMonths+" months";
			}
			else {
				return ageMonths+" months";
			}
		}
		else {
			return totalMonths+" months";
		}
	}
	else {
		return "";
	}
}
