# Controller
[DOM] Password field is not contained in a form: (More info: https://www.chromium.org/developers/design-documents/create-amazing-password-forms) <input type=​"password" id=​"passwordInput" class=​"textField medium" value placeholder=​"Password" autocapitalize=​"none" autocorrect=​"off" autocomplete=​"off" spellcheck=​"false" onfocus onblur>​
cntr.js?v=8.19:98 authOk - starting configs load
comm.js?v=8.19:682 Set window.configsDoc = responseDoc
cntr.js?v=8.19:101 getConfigsDoc callback called, doc: exists
cntr.js?v=8.19:103 configsDoc loaded successfully, calling cntrInit2
cntr.js?v=8.19:125 cntr_reinit called
cntr.js?v=8.19:136 cntr_reinit: set connectState to NotConnected
cntr.js?v=8.19:151 cntr_reinit: showing connect page
lib.js?v=8.19:482 [UI] showPage: connect
cntr.js?v=8.19:153 cntr_reinit: connect page should be visible now
lib.js?v=8.19:493 [UI] setActionAttrs for page: connect
comm.js?v=8.19:682 Set window.updateStateDoc = responseDoc
cntr.js?v=8.19:170 flipConnect called connectState: 0 buttonsEnabled: true
cntr.js?v=8.19:178 flipConnect: starting connection
cntr.js?v=8.19:191 connect called connectState: 0
cntr.js?v=8.19:193 connect: scheduling initConnection
cntr.js?v=8.19:203 initConnection called connectState: 0
cntr.js?v=8.19:205 initConnection: set state to Connecting, calling initEventSourceCntr
cntr.js?v=8.19:480 initEventSourceCntr - starting polling
cntr.js?v=8.19:486 initEventSourceCntr - starting event polling for role: cntr
polling.js?v=8.19:57 startEventPolling: role=cntr pc=admin
cntr.js?v=8.19:223 initEventSourceCntr called successfully
comm.js?v=8.19:682 Set window.updateStateDoc = responseDoc
10comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:246 EventSource disabled - using polling instead
lib.js?v=8.19:482 [UI] showPage: appType
cntr.js?v=8.19:259 Compatibility mode UI updated
lib.js?v=8.19:493 [UI] setActionAttrs for page: appType
comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:361 enterTestsApp called, projectCurNo: 1
cntr.js?v=8.19:364 enterTestsApp: about to call projectsSelect with projectCurNo: 1
dmglib.js?v=8.19:48 projectsSelect ENTRY: projectNo=1, pending=false, retryCount=0
dmglib.js?v=8.19:54 projectsSelect: Set pending=true, about to call getXmlDoc
dmglib.js?v=8.19:67 projectsSelect: About to call getXmlDoc with URL: ../gsheetsacc/?type=projectsSelect&data=admin,1&_t=1770244270383
dmglib.js?v=8.19:77 projectsSelect: getXmlDoc called, function returning
cntr.js?v=8.19:366 enterTestsApp: projectsSelect called, returning
comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:682 Set window.projectsDoc = responseDoc
dmglib.js?v=8.19:69 projectsSelect: getXmlDoc callback fired, doc: exists
dmglib.js?v=8.19:73 projectsSelect: Calling endHandler
dmglib.js?v=8.19:115 projectsDocReceived called, doc parameter: #document (http://localhost:8000/gsheetsacc/?type=projectsSelect&data=admin,1&_t=1770244270383) global projectsDoc: #document (http://localhost:8000/gsheetsacc/?type=projectsSelect&data=admin,1&_t=1770244270383)
dmglib.js?v=8.19:121 projectsDocReceived: doc is valid, documentElement exists
dmglib.js?v=8.19:148 projectsDocReceived: about to call entityUpdateSelectElem
dmglib.js?v=8.19:151 projectsDocReceived: entityUpdateSelectElem completed successfully
dmglib.js?v=8.19:157 projectsDocReceived: about to call projectUpdateCurInfo
dmglib.js?v=8.19:160 projectsDocReceived: projectUpdateCurInfo completed successfully
dmglib.js?v=8.19:166 projectsDocReceived: about to call projectEnterSelectPage
dmglib.js?v=8.19:240 projectEnterSelectPage called
dmglib.js?v=8.19:242 projectEnterSelectPage: projectEditable set to false
dmglib.js?v=8.19:245 projectEnterSelectPage: context replaced with User: admin
dmglib.js?v=8.19:248 projectEnterSelectPage: buttons updated
dmglib.js?v=8.19:251 projectEnterSelectPage: projectSelectChanged called
dmglib.js?v=8.19:253 projectEnterSelectPage: about to call showPage('projectSelect')
lib.js?v=8.19:482 [UI] showPage: projectSelect
dmglib.js?v=8.19:255 projectEnterSelectPage: showPage completed
dmglib.js?v=8.19:169 projectsDocReceived: projectEnterSelectPage completed successfully
dmglib.js?v=8.19:174 projectsDocReceived completed successfully
lib.js?v=8.19:493 [UI] setActionAttrs for page: projectSelect
3comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:682 Set window.testSetsDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: testSetSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: testSetSelect
2comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:682 Set window.partsDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: partSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: partSelect
4comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
dmglib.js?v=8.19:582 partCurRef: Santiago_Morales
2comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:682 Set window.testsDoc = responseDoc
dmglib.js?v=8.19:616 testsDocReceived: testsDoc exists: true
dmglib.js?v=8.19:619 testsDocReceived: root element: tests current: null
dmglib.js?v=8.19:624 testsDocReceived: test 0 no: null name: Adult value: adt
dmglib.js?v=8.19:624 testsDocReceived: test 1 no: null name: Adult Hor value: adth
dmglib.js?v=8.19:624 testsDocReceived: test 2 no: null name: 9 Months value: 9m
dmglib.js?v=8.19:624 testsDocReceived: test 3 no: null name: 24 Months 1 value: 24m1
dmglib.js?v=8.19:624 testsDocReceived: test 4 no: null name: 24 Months 2 value: 24m2
dmglib.js?v=8.19:624 testsDocReceived: test 5 no: null name: 24 Months 2 Hor value: 24m2h
dmglib.js?v=8.19:624 testsDocReceived: test 6 no: null name: 48 Months value: 48m
dmglib.js?v=8.19:624 testsDocReceived: test 7 no: null name: Box Test value: box
dmglib.js?v=8.19:624 testsDocReceived: test 8 no: null name: Box Test 3-1 value: box31
dmglib.js?v=8.19:624 testsDocReceived: test 9 no: null name: Prohibition value: phb
dmglib.js?v=8.19:624 testsDocReceived: test 10 no: null name: NIRS Ver value: nirsv
dmglib.js?v=8.19:624 testsDocReceived: test 11 no: null name: Nirs Hor value: nirsh
dmglib.js?v=8.19:624 testsDocReceived: test 12 no: null name: 48 Months Nirs value: 48mn
dmglib.js?v=8.19:624 testsDocReceived: test 13 no: null name: Spatial Confl value: spc
dmglib.js?v=8.19:624 testsDocReceived: test 14 no: null name: Dev value: dev
dmglib.js?v=8.19:629 testsDocReceived: total tests: 15
lib.js?v=8.19:482 [UI] showPage: testSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: testSelect
4comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: adt_index
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
2lib.js?v=8.19:482 [UI] showPage: adt_tspt_trials
2lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_tspt_trials
4comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:679 [CONTROLLER] flipTrial CLICKED: adt ppt trial x4 trialRunning: false
cntr.js?v=8.19:680 [CONTROLLER] flipTrial call stack
cntr.js?v=8.19:681 console.trace
flipTrial @ cntr.js?v=8.19:681
onclick @ controller/:1
cntr.js?v=8.19:684 [CONTROLLER] Starting new trial
cntr.js?v=8.19:698 [CONTROLLER] startTrial called - buttonsEnabled: true startTrialPending: false clockShowing: false
cntr.js?v=8.19:700 [CONTROLLER] startTrial proceeding, setting trialRunning=true
cntr.js?v=8.19:755 [CONTROLLER] About to call nextTrial with repeat: 4
cntr.js?v=8.19:767 [CONTROLLER] nextTrial called with repeat: 4 testType: adt
27comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialEnded data=
cntr.js?v=8.19:938 [CONTROLLER] trialEndedFromResp - resetting trial state
cntr.js?v=8.19:943 [CONTROLLER] trialEndedFromResp complete - trialRunning: false
3comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:885 [CONTROLLER] endTrials CALLED - buttonsEnabled: true testType: adt trialRunning: false
cntr.js?v=8.19:886 [CONTROLLER] endTrials call stack
cntr.js?v=8.19:887 console.trace
endTrials @ cntr.js?v=8.19:887
onclick @ controller/:1
cntr.js?v=8.19:888 [CONTROLLER] endTrials context curTestName: adt curConfigName: tspt curUserName: admin
cntr.js?v=8.19:909 [CONTROLLER] endTrials sending initial request
cntr.js?v=8.19:60 [CONTROLLER] Sending endTrials attempt 1
2comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialsEnded data=
cntr.js?v=8.19:919 [CONTROLLER] trialsEndedFromResp - resetting and returning to index
comm.js?v=8.19:352 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:367 [COMM] No records to send
lib.js?v=8.19:482 [UI] showPage: adt_index
cntr.js?v=8.19:934 [CONTROLLER] trialsEndedFromResp complete
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
polling.js?v=8.19:87 handlePolledEvent: type=trialsEnded data=
cntr.js?v=8.19:919 [CONTROLLER] trialsEndedFromResp - resetting and returning to index
comm.js?v=8.19:352 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:367 [COMM] No records to send
lib.js?v=8.19:482 [UI] showPage: adt_index
cntr.js?v=8.19:934 [CONTROLLER] trialsEndedFromResp complete
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
7comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
2lib.js?v=8.19:482 [UI] showPage: adt_tspb_trials
2lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_tspb_trials
3comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:679 [CONTROLLER] flipTrial CLICKED: adt ppb trial x4 trialRunning: false
cntr.js?v=8.19:680 [CONTROLLER] flipTrial call stack
cntr.js?v=8.19:681 console.trace
flipTrial @ cntr.js?v=8.19:681
onclick @ controller/:1
cntr.js?v=8.19:684 [CONTROLLER] Starting new trial
cntr.js?v=8.19:698 [CONTROLLER] startTrial called - buttonsEnabled: true startTrialPending: false clockShowing: false
cntr.js?v=8.19:700 [CONTROLLER] startTrial proceeding, setting trialRunning=true
cntr.js?v=8.19:755 [CONTROLLER] About to call nextTrial with repeat: 4
cntr.js?v=8.19:767 [CONTROLLER] nextTrial called with repeat: 4 testType: adt
19comm.js?v=8.19:682 

# Responder
resp_reinit called
resp.js?v=8.19:368 [RESPONDER] reInitTrialState - clearing all trial state
resp.js?v=8.19:405 [RESPONDER] reInitTrialState complete - queue cleared, trialPending: false
comm.js?v=8.19:475 [COMM] Clearing server-side event queue for pairing code: admin
comm.js?v=8.19:352 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:367 [COMM] No records to send
comm.js?v=8.19:450 [COMM] Clearing ALL localStorage records
comm.js?v=8.19:470 [COMM] No records found in localStorage
lib.js?v=8.19:482 [UI] showPage: connect
lib.js?v=8.19:493 [UI] setActionAttrs for page: connect
resp.js?v=8.19:320 resp_reinit: Ensuring startPairingButt is enabled
resp.js?v=8.19:324 resp_reinit: startPairingButt onclick attribute: event.preventDefault(); flipPairing()
comm.js?v=8.19:682 Set window.updateStateDoc = responseDoc
comm.js?v=8.19:479 [COMM] Server event queue cleared successfully
resp.js?v=8.19:421 flipPairing called connectState: 0 buttonsEnabled: true
resp.js?v=8.19:431 flipPairing: Immediately updating UI to 'Connecting...'
resp.js?v=8.19:438 flipPairing, buttonsEnabled
resp.js?v=8.19:445 flipPairing, startPairing
resp.js?v=8.19:468 initConnection called connectState: 0
resp.js?v=8.19:470 initConnection: set connectState to Connecting
resp.js?v=8.19:529 initEventSourceResp - starting polling
polling.js?v=8.19:57 startEventPolling: role=resp pc=admin
resp.js?v=8.19:486 initConnection: initEventSourceResp called, connectState: 1
comm.js?v=8.19:682 Set window.updateStateDoc = responseDoc
comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
lib.js?v=8.19:616 normalizeClassOfElemWithId ignored id:pairingButt
normalizeClassOfElemWithId @ lib.js?v=8.19:616Understand this warning
xmllib.js?v=8.19:308 replaceTextInElemWithId ignored id:pairingMsg text:Connected to Controller
replaceTextInElemWithId @ xmllib.js?v=8.19:308Understand this warning
resp.js?v=8.19:550 Responder connected - event polling active
comm.js?v=8.19:682 Set window.updateStateDoc = responseDoc
35comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=setReadyMessage data=msg_adtIntro1,msg_adtIntro2,dot,msg_adtReady,,adt
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
lib.js?v=8.19:482 [UI] showPage: ready
polling.js?v=8.19:87 handlePolledEvent: type=startMultiTrials data=adt,ppt,trial,0,1,2,1,4
resp.js?v=8.19:1159 [RESPONDER] startMultiTrialsFromCntr received: adt,ppt,trial,0,1,2,1,4
lib.js?v=8.19:804 getTrialPeriod, testName: adt, trialType: ppt
lib.js?v=8.19:808 trialPeriod:null
resp.js?v=8.19:1193 [RESPONDER] Built trial queue with 4 trials. trialPending: false
resp.js?v=8.19:1196 [RESPONDER] Waiting for 1s hold on red dot to start trials
lib.js?v=8.19:482 [UI] showPage: ready
2lib.js?v=8.19:493 [UI] setActionAttrs for page: ready
8comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:1095 [RESPONDER] Hold complete - starting first trial
resp.js?v=8.19:1213 [RESPONDER] startTrial: adt,ppt,trial,,0,1,2,1,4
polling.js?v=8.19:69 Event polling stopped
resp.js?v=8.19:1261 <config id=​"adt_ppt" name=​"Practice Top" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"top" empType=​"happy" rew=​"top" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1262 <config id=​"adt_ppt" name=​"Practice Top" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"top" empType=​"happy" rew=​"top" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1450 showTrial
resp.js?v=8.19:1574 reflectCurTrialState, curTestName: adt
resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_top_happy.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
7resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
4resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_btm.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
64resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:1605 reflectCurTrialState exit
lib.js?v=8.19:482 [UI] showPage: ecittTriple
lib.js?v=8.19:493 [UI] setActionAttrs for page: ecittTriple
4comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:617 [RESPONDER] buttonPressed CLICKED: top curTestName: adt curTrialType: ppt
resp.js?v=8.19:642 [RESPONDER] buttonPressed - calling recordAndReport, button: top accuracy: 1
comm.js?v=8.19:307 [COMM] Stored trial record in localStorage: admin_1770244285505
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittSingle, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittSingleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: R
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: R
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
2comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:742 [RESPONDER] trialEnded - queue length: 3
resp.js?v=8.19:745 [RESPONDER] More trials in queue, starting next
resp.js?v=8.19:1213 [RESPONDER] startTrial: adt,ppt,trial,,1,1,2,1,3
resp.js?v=8.19:1261 <config id=​"adt_ppt" name=​"Practice Top" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"top" empType=​"happy" rew=​"top" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1262 <config id=​"adt_ppt" name=​"Practice Top" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"top" empType=​"happy" rew=​"top" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1450 showTrial
resp.js?v=8.19:1574 reflectCurTrialState, curTestName: adt
resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_top_happy.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
7resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
4resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_btm.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
64resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:1605 reflectCurTrialState exit
lib.js?v=8.19:482 [UI] showPage: ecittTriple
lib.js?v=8.19:493 [UI] setActionAttrs for page: ecittTriple
comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:617 [RESPONDER] buttonPressed CLICKED: top curTestName: adt curTrialType: ppt
resp.js?v=8.19:642 [RESPONDER] buttonPressed - calling recordAndReport, button: top accuracy: 1
comm.js?v=8.19:307 [COMM] Stored trial record in localStorage: admin_1770244288082
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittSingle, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittSingleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: R
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: R
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
2comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:742 [RESPONDER] trialEnded - queue length: 2
resp.js?v=8.19:745 [RESPONDER] More trials in queue, starting next
resp.js?v=8.19:1213 [RESPONDER] startTrial: adt,ppt,trial,,2,1,2,1,2
resp.js?v=8.19:1261 <config id=​"adt_ppt" name=​"Practice Top" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"top" empType=​"happy" rew=​"top" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1262 <config id=​"adt_ppt" name=​"Practice Top" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"top" empType=​"happy" rew=​"top" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1450 showTrial
resp.js?v=8.19:1574 reflectCurTrialState, curTestName: adt
resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_top_happy.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
7resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
4resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_btm.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
64resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:1605 reflectCurTrialState exit
lib.js?v=8.19:482 [UI] showPage: ecittTriple
lib.js?v=8.19:493 [UI] setActionAttrs for page: ecittTriple
comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:617 [RESPONDER] buttonPressed CLICKED: top curTestName: adt curTrialType: ppt
resp.js?v=8.19:642 [RESPONDER] buttonPressed - calling recordAndReport, button: top accuracy: 1
comm.js?v=8.19:307 [COMM] Stored trial record in localStorage: admin_1770244289878
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittSingle, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittSingleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: R
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: R
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
2comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:742 [RESPONDER] trialEnded - queue length: 1
resp.js?v=8.19:745 [RESPONDER] More trials in queue, starting next
resp.js?v=8.19:1213 [RESPONDER] startTrial: adt,ppt,trial,,3,1,2,1,1
resp.js?v=8.19:1261 <config id=​"adt_ppt" name=​"Practice Top" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"top" empType=​"happy" rew=​"top" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1262 <config id=​"adt_ppt" name=​"Practice Top" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"top" empType=​"happy" rew=​"top" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1450 showTrial
resp.js?v=8.19:1574 reflectCurTrialState, curTestName: adt
resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_top_happy.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
7resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
4resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_btm.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
64resp.js?v=8.19:1609 reflectCurReadyList
resp.js?v=8.19:1605 reflectCurTrialState exit
lib.js?v=8.19:482 [UI] showPage: ecittTriple
lib.js?v=8.19:493 [UI] setActionAttrs for page: ecittTriple
comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:617 [RESPONDER] buttonPressed CLICKED: top curTestName: adt curTrialType: ppt
resp.js?v=8.19:642 [RESPONDER] buttonPressed - calling recordAndReport, button: top accuracy: 1
comm.js?v=8.19:307 [COMM] Stored trial record in localStorage: admin_1770244291386
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittSingle, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittSingleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: R
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: R
lib.js?v=8.19:482 [UI] showPage: end
lib.js?v=8.19:493 [UI] setActionAttrs for page: end
2comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:742 [RESPONDER] trialEnded - queue length: 0
resp.js?v=8.19:750 [RESPONDER] All trials complete, resetting and notifying controller
resp.js?v=8.19:762 [RESPONDER] Restarting polling
polling.js?v=8.19:57 startEventPolling: role=resp pc=admin
resp.js?v=8.19:768 [RESPONDER] Uploading trial data after natural completion
comm.js?v=8.19:352 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:372 [COMM] Sending 4 records in batch
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittSingle, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittSingleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: R
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: R
lib.js?v=8.19:482 [UI] showPage: ready
resp.js?v=8.19:784 [RESPONDER] trialEnded complete
lib.js?v=8.19:493 [UI] setActionAttrs for page: ready
comm.js?v=8.19:380 [COMM] Batch insert successful, clearing 4 records
comm.js?v=8.19:384 [COMM] Removed: admin_1770244285505
comm.js?v=8.19:384 [COMM] Removed: admin_1770244291386
comm.js?v=8.19:384 [COMM] Removed: admin_1770244289878
comm.js?v=8.19:384 [COMM] Removed: admin_1770244288082
resp.js?v=8.19:770 [RESPONDER] Upload complete, sending trialEnded event to controller
6comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=endTrials data=adt,tspt
resp.js?v=8.19:1512 [RESPONDER] endTrialsFromCntr received
resp.js?v=8.19:1521 [RESPONDER] Clearing queue and resetting state
resp.js?v=8.19:368 [RESPONDER] reInitTrialState - clearing all trial state
polling.js?v=8.19:69 Event polling stopped
resp.js?v=8.19:405 [RESPONDER] reInitTrialState complete - queue cleared, trialPending: false
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittSingle, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittSingleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: R
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: R
lib.js?v=8.19:482 [UI] showPage: ready
resp.js?v=8.19:1528 [RESPONDER] End complete, notified controller
lib.js?v=8.19:493 [UI] setActionAttrs for page: ready
comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=endTrials data=adt,tspt
resp.js?v=8.19:1512 [RESPONDER] endTrialsFromCntr received
resp.js?v=8.19:1521 [RESPONDER] Clearing queue and resetting state
resp.js?v=8.19:368 [RESPONDER] reInitTrialState - clearing all trial state
resp.js?v=8.19:405 [RESPONDER] reInitTrialState complete - queue cleared, trialPending: false
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: top
resp.js?v=8.19:990 showRespElem, pageId: ecittDouble, name: btm
resp.js?v=8.19:990 showRespElem, pageId: ecittSingle, name: mdl
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: ecittTripleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: lft
resp.js?v=8.19:990 showRespElem, pageId: ecittDoubleHor, name: rgt
resp.js?v=8.19:990 showRespElem, pageId: ecittSingleHor, name: ctr
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcDouble, name: R
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: L
resp.js?v=8.19:990 showRespElem, pageId: spcSingle, name: R
lib.js?v=8.19:482 [UI] showPage: ready
resp.js?v=8.19:1528 [RESPONDER] End complete, notified controller
lib.js?v=8.19:493 [UI] setActionAttrs for page: ready
32comm.js?v=8.19:682 Set window.connectionStateDoc = responseDoc