# Controller
[DOM] Password field is not contained in a form: (More info: https://www.chromium.org/developers/design-documents/create-amazing-password-forms) <input type=​"password" id=​"passwordInput" class=​"textField medium" value placeholder=​"Password" autocapitalize=​"none" autocorrect=​"off" autocomplete=​"off" spellcheck=​"false" onfocus onblur>​
cntr.js?v=8.19:99 authOk - starting configs load
comm.js?v=8.19:688 Set window.configsDoc = responseDoc
cntr.js?v=8.19:102 getConfigsDoc callback called, doc: exists
cntr.js?v=8.19:104 configsDoc loaded successfully, calling cntrInit2
cntr.js?v=8.19:126 cntr_reinit called
cntr.js?v=8.19:137 cntr_reinit: set connectState to NotConnected
cntr.js?v=8.19:152 cntr_reinit: showing connect page
lib.js?v=8.19:482 [UI] showPage: connect
cntr.js?v=8.19:154 cntr_reinit: connect page should be visible now
lib.js?v=8.19:493 [UI] setActionAttrs for page: connect
comm.js?v=8.19:688 Set window.updateStateDoc = responseDoc
cntr.js?v=8.19:171 flipConnect called connectState: 0 buttonsEnabled: true
cntr.js?v=8.19:179 flipConnect: starting connection
cntr.js?v=8.19:192 connect called connectState: 0
cntr.js?v=8.19:194 connect: scheduling initConnection
cntr.js?v=8.19:204 initConnection called connectState: 0
cntr.js?v=8.19:206 initConnection: set state to Connecting, calling initEventSourceCntr
cntr.js?v=8.19:481 initEventSourceCntr - starting polling
cntr.js?v=8.19:487 initEventSourceCntr - starting event polling for role: cntr
polling.js?v=8.19:57 startEventPolling: role=cntr pc=admin
cntr.js?v=8.19:224 initEventSourceCntr called successfully
comm.js?v=8.19:688 Set window.updateStateDoc = responseDoc
10comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:247 EventSource disabled - using polling instead
lib.js?v=8.19:482 [UI] showPage: appType
cntr.js?v=8.19:260 Compatibility mode UI updated
lib.js?v=8.19:493 [UI] setActionAttrs for page: appType
4comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:362 enterTestsApp called, projectCurNo: 1
cntr.js?v=8.19:365 enterTestsApp: about to call projectsSelect with projectCurNo: 1
dmglib.js?v=8.19:48 projectsSelect ENTRY: projectNo=1, pending=false, retryCount=0
dmglib.js?v=8.19:54 projectsSelect: Set pending=true, about to call getXmlDoc
dmglib.js?v=8.19:67 projectsSelect: About to call getXmlDoc with URL: ../csvdata/?type=projectsSelect&data=admin,1&_t=1770852800190
dmglib.js?v=8.19:77 projectsSelect: getXmlDoc called, function returning
cntr.js?v=8.19:367 enterTestsApp: projectsSelect called, returning
comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:688 Set window.projectsDoc = responseDoc
dmglib.js?v=8.19:69 projectsSelect: getXmlDoc callback fired, doc: exists
dmglib.js?v=8.19:73 projectsSelect: Calling endHandler
dmglib.js?v=8.19:115 projectsDocReceived called, doc parameter: #document (http://localhost:8000/csvdata/?type=projectsSelect&data=admin,1&_t=1770852800190) global projectsDoc: #document (http://localhost:8000/csvdata/?type=projectsSelect&data=admin,1&_t=1770852800190)
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
3comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:688 Set window.testSetsDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: testSetSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: testSetSelect
2comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:688 Set window.partsDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: partSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: partSelect
3comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
dmglib.js?v=8.19:582 partCurRef: Santiago_Morales
comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:688 Set window.testsDoc = responseDoc
dmglib.js?v=8.19:616 testsDocReceived: testsDoc exists: true
dmglib.js?v=8.19:619 testsDocReceived: root element: tests current: 0
dmglib.js?v=8.19:624 testsDocReceived: test 0 no: 5 name: 24 Months 1 value: 24m1
dmglib.js?v=8.19:624 testsDocReceived: test 1 no: 6 name: 24 Months 2 value: 24m2
dmglib.js?v=8.19:624 testsDocReceived: test 2 no: 7 name: 24 Months 2 Hor value: 24m2h
dmglib.js?v=8.19:624 testsDocReceived: test 3 no: 1 name: 24m2 value: 24-Month Test v2
dmglib.js?v=8.19:624 testsDocReceived: test 4 no: 8 name: 48 Months value: 48m
dmglib.js?v=8.19:624 testsDocReceived: test 5 no: 12 name: 48 Months Nirs value: 48mn
dmglib.js?v=8.19:624 testsDocReceived: test 6 no: 3 name: 48m value: 48-Month Test
dmglib.js?v=8.19:624 testsDocReceived: test 7 no: 2 name: 9 Months value: 9m
dmglib.js?v=8.19:624 testsDocReceived: test 8 no: 2 name: adt value: Adult Test
dmglib.js?v=8.19:624 testsDocReceived: test 9 no: 13 name: Adult value: adt
dmglib.js?v=8.19:624 testsDocReceived: test 10 no: 14 name: Adult Hor value: adth
dmglib.js?v=8.19:624 testsDocReceived: test 11 no: 3 name: Box Test value: box
dmglib.js?v=8.19:624 testsDocReceived: test 12 no: 4 name: Box Test 3-1 value: box31
dmglib.js?v=8.19:624 testsDocReceived: test 13 no: 9 name: Dev value: dev
dmglib.js?v=8.19:624 testsDocReceived: test 14 no: 11 name: Nirs Hor value: nirsh
dmglib.js?v=8.19:624 testsDocReceived: test 15 no: 10 name: NIRS Ver value: nirsv
dmglib.js?v=8.19:624 testsDocReceived: test 16 no: 1 name: Prohibition value: phb
dmglib.js?v=8.19:624 testsDocReceived: test 17 no: 15 name: Spatial Confl value: spc
dmglib.js?v=8.19:629 testsDocReceived: total tests: 18
lib.js?v=8.19:482 [UI] showPage: testSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: testSelect
7comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: adt_index
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
4comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
2lib.js?v=8.19:482 [UI] showPage: adt_tspb_trials
2lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_tspb_trials
2comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:680 [CONTROLLER] flipTrial CLICKED: adt ppb trial x4 trialRunning: false
cntr.js?v=8.19:681 [CONTROLLER] flipTrial call stack
cntr.js?v=8.19:682 console.trace
flipTrial @ cntr.js?v=8.19:682
onclick @ controller/:1
cntr.js?v=8.19:685 [CONTROLLER] Starting new trial
cntr.js?v=8.19:699 [CONTROLLER] startTrial called - buttonsEnabled: true startTrialPending: false clockShowing: false
cntr.js?v=8.19:701 [CONTROLLER] startTrial proceeding, setting trialRunning=true
cntr.js?v=8.19:788 [CONTROLLER] About to call nextTrial with repeat: 4
cntr.js?v=8.19:800 [CONTROLLER] nextTrial called with repeat: 4 testType: adt
10comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770852814561,1770852814564,ppb,trial,1,,1,1725,1725,1725,btm,,0,0,0,0,3
8comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770852816289,1770852817308,ppb,trial,2,,1,2882,2883,2883,btm,,0,0,0,0,2
5comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770852820191,1770852821198,ppb,trial,3,,1,1112,1112,1112,btm,,0,0,0,0,1
3comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770852822311,1770852823320,ppb,trial,4,,1,910,910,910,btm,,0,0,0,0,0
3comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialEnded data=
cntr.js?v=8.19:1002 [CONTROLLER] trialEndedFromResp - resetting trial state
cntr.js?v=8.19:1007 [CONTROLLER] trialEndedFromResp complete - trialRunning: false
13comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:941 [CONTROLLER] endTrials CALLED - buttonsEnabled: true testType: adt curTestName: adt
cntr.js?v=8.19:942 [CONTROLLER] endTrials call stack
cntr.js?v=8.19:943 console.trace
endTrials @ cntr.js?v=8.19:943
onclick @ controller/:1
cntr.js?v=8.19:944 [CONTROLLER] endTrials context curTestName: adt curConfigName: tspb curUserName: admin
cntr.js?v=8.19:966 [CONTROLLER] endTrials sending end request (test active)
cntr.js?v=8.19:61 [CONTROLLER] Sending endTrials attempt 1
2comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:61 [CONTROLLER] Sending endTrials attempt 2
comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialsEnded data=
cntr.js?v=8.19:983 [CONTROLLER] trialsEndedFromResp - resetting and returning to index
comm.js?v=8.19:358 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:378 [COMM] Sending 10 records in batch
lib.js?v=8.19:482 [UI] showPage: adt_index
cntr.js?v=8.19:998 [CONTROLLER] trialsEndedFromResp complete
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
polling.js?v=8.19:87 handlePolledEvent: type=trialsEnded data=
cntr.js?v=8.19:983 [CONTROLLER] trialsEndedFromResp - resetting and returning to index
comm.js?v=8.19:358 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:378 [COMM] Sending 10 records in batch
lib.js?v=8.19:482 [UI] showPage: adt_index
cntr.js?v=8.19:998 [CONTROLLER] trialsEndedFromResp complete
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
comm.js?v=8.19:386 [COMM] Batch insert successful, clearing 10 records
comm.js?v=8.19:390 [COMM] Removed: admin_1770747882423
comm.js?v=8.19:390 [COMM] Removed: admin_1770747893581
comm.js?v=8.19:390 [COMM] Removed: admin_1770747901853
comm.js?v=8.19:390 [COMM] Removed: admin_1770747899734
comm.js?v=8.19:390 [COMM] Removed: admin_1770747888175
comm.js?v=8.19:390 [COMM] Removed: admin_1770747885771
comm.js?v=8.19:390 [COMM] Removed: admin_1770747897854
comm.js?v=8.19:390 [COMM] Removed: admin_1770747891814
comm.js?v=8.19:390 [COMM] Removed: admin_1770747895728
comm.js?v=8.19:390 [COMM] Removed: admin_1770747890046
comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:386 [COMM] Batch insert successful, clearing 10 records
comm.js?v=8.19:390 [COMM] Removed: admin_1770747882423
comm.js?v=8.19:390 [COMM] Removed: admin_1770747893581
comm.js?v=8.19:390 [COMM] Removed: admin_1770747901853
comm.js?v=8.19:390 [COMM] Removed: admin_1770747899734
comm.js?v=8.19:390 [COMM] Removed: admin_1770747888175
comm.js?v=8.19:390 [COMM] Removed: admin_1770747885771
comm.js?v=8.19:390 [COMM] Removed: admin_1770747897854
comm.js?v=8.19:390 [COMM] Removed: admin_1770747891814
comm.js?v=8.19:390 [COMM] Removed: admin_1770747895728
comm.js?v=8.19:390 [COMM] Removed: admin_1770747890046
polling.js?v=8.19:87 handlePolledEvent: type=trialsEnded data=
cntr.js?v=8.19:983 [CONTROLLER] trialsEndedFromResp - resetting and returning to index
comm.js?v=8.19:358 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:373 [COMM] No records to send
lib.js?v=8.19:482 [UI] showPage: adt_index
cntr.js?v=8.19:998 [CONTROLLER] trialsEndedFromResp complete
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
2comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: testSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: testSelect
2comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=testEnded data=
comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:688 Set window.partsDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: partSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: partSelect
3comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:688 Set window.testSetsDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: testSetSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: testSetSelect
comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
dmglib.js?v=8.19:48 projectsSelect ENTRY: projectNo=1, pending=false, retryCount=0
dmglib.js?v=8.19:54 projectsSelect: Set pending=true, about to call getXmlDoc
dmglib.js?v=8.19:67 projectsSelect: About to call getXmlDoc with URL: ../csvdata/?type=projectsSelect&data=admin,1&_t=1770852839118
dmglib.js?v=8.19:77 projectsSelect: getXmlDoc called, function returning
comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:688 Set window.projectsDoc = responseDoc
dmglib.js?v=8.19:69 projectsSelect: getXmlDoc callback fired, doc: exists
dmglib.js?v=8.19:73 projectsSelect: Calling endHandler
dmglib.js?v=8.19:115 projectsDocReceived called, doc parameter: #document (http://localhost:8000/csvdata/?type=projectsSelect&data=admin,1&_t=1770852839118) global projectsDoc: #document (http://localhost:8000/csvdata/?type=projectsSelect&data=admin,1&_t=1770852839118)
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
comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: appType
lib.js?v=8.19:493 [UI] setActionAttrs for page: appType
4comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
lib.js?v=8.19:514  abort
abort @ lib.js?v=8.19:514
lib.js?v=8.19:522 Restart prevented - compatibility mode active (Windows)
8comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
lib.js?v=8.19:514  abort
abort @ lib.js?v=8.19:514
lib.js?v=8.19:522 Restart prevented - compatibility mode active (Windows)
8comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc
lib.js?v=8.19:514  abort
abort @ lib.js?v=8.19:514
lib.js?v=8.19:522 Restart prevented - compatibility mode active (Windows)
53comm.js?v=8.19:688 Set window.connectionStateDoc = responseDoc

# Responder
lib.js?v=8.19:482 [UI] showPage: auth
lib.js?v=8.19:493 [UI] setActionAttrs for page: auth
