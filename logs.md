# Controller
[DOM] Password field is not contained in a form: (More info: https://www.chromium.org/developers/design-documents/create-amazing-password-forms) <input type=​"password" id=​"passwordInput" class=​"textField medium" value placeholder=​"Password" autocapitalize=​"none" autocorrect=​"off" autocomplete=​"off" spellcheck=​"false" onfocus onblur>​
cntr.js?v=8.19:98 authOk - starting configs load
comm.js?v=8.19:684 Set window.configsDoc = responseDoc
cntr.js?v=8.19:101 getConfigsDoc callback called, doc: exists
cntr.js?v=8.19:103 configsDoc loaded successfully, calling cntrInit2
cntr.js?v=8.19:125 cntr_reinit called
cntr.js?v=8.19:136 cntr_reinit: set connectState to NotConnected
cntr.js?v=8.19:151 cntr_reinit: showing connect page
lib.js?v=8.19:482 [UI] showPage: connect
cntr.js?v=8.19:153 cntr_reinit: connect page should be visible now
lib.js?v=8.19:493 [UI] setActionAttrs for page: connect
comm.js?v=8.19:684 Set window.updateStateDoc = responseDoc
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
comm.js?v=8.19:684 Set window.updateStateDoc = responseDoc
10comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:246 EventSource disabled - using polling instead
lib.js?v=8.19:482 [UI] showPage: appType
cntr.js?v=8.19:259 Compatibility mode UI updated
lib.js?v=8.19:493 [UI] setActionAttrs for page: appType
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:361 enterTestsApp called, projectCurNo: 1
cntr.js?v=8.19:364 enterTestsApp: about to call projectsSelect with projectCurNo: 1
dmglib.js?v=8.19:48 projectsSelect ENTRY: projectNo=1, pending=false, retryCount=0
dmglib.js?v=8.19:54 projectsSelect: Set pending=true, about to call getXmlDoc
dmglib.js?v=8.19:67 projectsSelect: About to call getXmlDoc with URL: ../gsheetsacc/?type=projectsSelect&data=admin,1&_t=1770247342999
dmglib.js?v=8.19:77 projectsSelect: getXmlDoc called, function returning
cntr.js?v=8.19:366 enterTestsApp: projectsSelect called, returning
comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:684 Set window.projectsDoc = responseDoc
dmglib.js?v=8.19:69 projectsSelect: getXmlDoc callback fired, doc: exists
dmglib.js?v=8.19:73 projectsSelect: Calling endHandler
dmglib.js?v=8.19:115 projectsDocReceived called, doc parameter: #document (http://localhost:8000/gsheetsacc/?type=projectsSelect&data=admin,1&_t=1770247342999) global projectsDoc: #document (http://localhost:8000/gsheetsacc/?type=projectsSelect&data=admin,1&_t=1770247342999)
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
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:684 Set window.testSetsDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: testSetSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: testSetSelect
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:684 Set window.partsDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: partSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: partSelect
6comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
dmglib.js?v=8.19:582 partCurRef: Santiago_Morales
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
comm.js?v=8.19:684 Set window.testsDoc = responseDoc
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
7comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: adt_index
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
5comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
2lib.js?v=8.19:482 [UI] showPage: adt_tspt_trials
2lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_tspt_trials
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:679 [CONTROLLER] flipTrial CLICKED: adt ppt trial x4 trialRunning: false
cntr.js?v=8.19:680 [CONTROLLER] flipTrial call stack
cntr.js?v=8.19:681 console.trace
flipTrial @ cntr.js?v=8.19:681
onclick @ controller/:1
cntr.js?v=8.19:684 [CONTROLLER] Starting new trial
cntr.js?v=8.19:698 [CONTROLLER] startTrial called - buttonsEnabled: true startTrialPending: false clockShowing: false
cntr.js?v=8.19:700 [CONTROLLER] startTrial proceeding, setting trialRunning=true
cntr.js?v=8.19:778 [CONTROLLER] About to call nextTrial with repeat: 4
cntr.js?v=8.19:790 [CONTROLLER] nextTrial called with repeat: 4 testType: adt
9comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770247360616,1770247360617,ppt,trial,1,,1,991,991,991,top,,0,0,0,0,3
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770247361608,1770247362616,ppt,trial,2,,1,1023,1023,1023,top,,0,0,0,0,2
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770247363639,1770247364642,ppt,trial,3,,1,605,605,605,top,,0,0,0,0,1
3comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770247365247,1770247366257,ppt,trial,4,,1,678,678,678,top,,0,0,0,0,0
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialEnded data=
cntr.js?v=8.19:961 [CONTROLLER] trialEndedFromResp - resetting trial state
cntr.js?v=8.19:966 [CONTROLLER] trialEndedFromResp complete - trialRunning: false
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:908 [CONTROLLER] endTrials CALLED - buttonsEnabled: true testType: adt trialRunning: false
cntr.js?v=8.19:909 [CONTROLLER] endTrials call stack
cntr.js?v=8.19:910 console.trace
endTrials @ cntr.js?v=8.19:910
onclick @ controller/:1
cntr.js?v=8.19:911 [CONTROLLER] endTrials context curTestName: adt curConfigName: tspt curUserName: admin
cntr.js?v=8.19:932 [CONTROLLER] endTrials sending initial request
cntr.js?v=8.19:60 [CONTROLLER] Sending endTrials attempt 1
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialsEnded data=
cntr.js?v=8.19:942 [CONTROLLER] trialsEndedFromResp - resetting and returning to index
comm.js?v=8.19:354 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:369 [COMM] No records to send
lib.js?v=8.19:482 [UI] showPage: adt_index
cntr.js?v=8.19:957 [CONTROLLER] trialsEndedFromResp complete
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialsEnded data=
cntr.js?v=8.19:942 [CONTROLLER] trialsEndedFromResp - resetting and returning to index
comm.js?v=8.19:354 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:369 [COMM] No records to send
lib.js?v=8.19:482 [UI] showPage: adt_index
cntr.js?v=8.19:957 [CONTROLLER] trialsEndedFromResp complete
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
2lib.js?v=8.19:482 [UI] showPage: adt_tspb_trials
2lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_tspb_trials
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:679 [CONTROLLER] flipTrial CLICKED: adt ppb trial x4 trialRunning: false
cntr.js?v=8.19:680 [CONTROLLER] flipTrial call stack
cntr.js?v=8.19:681 console.trace
flipTrial @ cntr.js?v=8.19:681
onclick @ controller/:1
cntr.js?v=8.19:684 [CONTROLLER] Starting new trial
cntr.js?v=8.19:698 [CONTROLLER] startTrial called - buttonsEnabled: true startTrialPending: false clockShowing: false
cntr.js?v=8.19:700 [CONTROLLER] startTrial proceeding, setting trialRunning=true
cntr.js?v=8.19:778 [CONTROLLER] About to call nextTrial with repeat: 4
cntr.js?v=8.19:790 [CONTROLLER] nextTrial called with repeat: 4 testType: adt
7comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770247376723,1770247376724,ppb,trial,1,,1,940,940,940,btm,,0,0,0,0,3
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770247377664,1770247378668,ppb,trial,2,,1,716,716,716,btm,,0,0,0,0,2
3comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770247379384,1770247380389,ppb,trial,3,,1,818,818,818,btm,,0,0,0,0,1
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialResult data=admin,1,2,adt,1,1770247381207,1770247382210,ppb,trial,4,,1,717,717,717,btm,,0,0,0,0,0
5comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialEnded data=
cntr.js?v=8.19:961 [CONTROLLER] trialEndedFromResp - resetting trial state
cntr.js?v=8.19:966 [CONTROLLER] trialEndedFromResp complete - trialRunning: false
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:908 [CONTROLLER] endTrials CALLED - buttonsEnabled: true testType: adt trialRunning: false
cntr.js?v=8.19:909 [CONTROLLER] endTrials call stack
cntr.js?v=8.19:910 console.trace
endTrials @ cntr.js?v=8.19:910
onclick @ controller/:1
cntr.js?v=8.19:911 [CONTROLLER] endTrials context curTestName: adt curConfigName: tspb curUserName: admin
cntr.js?v=8.19:932 [CONTROLLER] endTrials sending initial request
cntr.js?v=8.19:60 [CONTROLLER] Sending endTrials attempt 1
comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:60 [CONTROLLER] Sending endTrials attempt 2
comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialsEnded data=
cntr.js?v=8.19:942 [CONTROLLER] trialsEndedFromResp - resetting and returning to index
comm.js?v=8.19:354 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:369 [COMM] No records to send
lib.js?v=8.19:482 [UI] showPage: adt_index
cntr.js?v=8.19:957 [CONTROLLER] trialsEndedFromResp complete
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
polling.js?v=8.19:87 handlePolledEvent: type=trialsEnded data=
cntr.js?v=8.19:942 [CONTROLLER] trialsEndedFromResp - resetting and returning to index
comm.js?v=8.19:354 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:369 [COMM] No records to send
lib.js?v=8.19:482 [UI] showPage: adt_index
cntr.js?v=8.19:957 [CONTROLLER] trialsEndedFromResp complete
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=trialsEnded data=
cntr.js?v=8.19:942 [CONTROLLER] trialsEndedFromResp - resetting and returning to index
comm.js?v=8.19:354 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:369 [COMM] No records to send
lib.js?v=8.19:482 [UI] showPage: adt_index
cntr.js?v=8.19:957 [CONTROLLER] trialsEndedFromResp complete
lib.js?v=8.19:493 [UI] setActionAttrs for page: adt_index
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=showingClock data=
polling.js?v=8.19:170  Unknown event type: showingClock
handlePolledEvent @ polling.js?v=8.19:170
5comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: testSelect
lib.js?v=8.19:493 [UI] setActionAttrs for page: testSelect
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=testEnded data=
5comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
lib.js?v=8.19:482 [UI] showPage: adth_index
lib.js?v=8.19:493 [UI] setActionAttrs for page: adth_index
3comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
2lib.js?v=8.19:482 [UI] showPage: adth_tspl_trials
2lib.js?v=8.19:493 [UI] setActionAttrs for page: adth_tspl_trials
3comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:679 [CONTROLLER] flipTrial CLICKED: adth ppl trial x4 trialRunning: false
cntr.js?v=8.19:680 [CONTROLLER] flipTrial call stack
cntr.js?v=8.19:681 console.trace
flipTrial @ cntr.js?v=8.19:681
onclick @ controller/:1
cntr.js?v=8.19:684 [CONTROLLER] Starting new trial
cntr.js?v=8.19:698 [CONTROLLER] startTrial called - buttonsEnabled: true startTrialPending: false clockShowing: false
cntr.js?v=8.19:700 [CONTROLLER] startTrial proceeding, setting trialRunning=true
cntr.js?v=8.19:778 [CONTROLLER] About to call nextTrial with repeat: 4
cntr.js?v=8.19:790 [CONTROLLER] nextTrial called with repeat: 4 testType: adt
7comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:679 [CONTROLLER] flipTrial CLICKED: adth ppl trial x4 trialRunning: true
cntr.js?v=8.19:680 [CONTROLLER] flipTrial call stack
cntr.js?v=8.19:681 console.trace
flipTrial @ cntr.js?v=8.19:681
onclick @ controller/:1
cntr.js?v=8.19:689 [CONTROLLER] Trial already running, calling cancelTrial
cntr.js?v=8.19:854 [CONTROLLER] cancelTrial CALLED - trialRunning: true
cntr.js?v=8.19:855 [CONTROLLER] cancelTrial call stack
cntr.js?v=8.19:856 console.trace
cancelTrial @ cntr.js?v=8.19:856
flipTrial @ cntr.js?v=8.19:690
onclick @ controller/:1
comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:679 [CONTROLLER] flipTrial CLICKED: adth ppl trial x4 trialRunning: true
cntr.js?v=8.19:680 [CONTROLLER] flipTrial call stack
cntr.js?v=8.19:681 console.trace
flipTrial @ cntr.js?v=8.19:681
onclick @ controller/:1
cntr.js?v=8.19:689 [CONTROLLER] Trial already running, calling cancelTrial
cntr.js?v=8.19:854 [CONTROLLER] cancelTrial CALLED - trialRunning: true
cntr.js?v=8.19:855 [CONTROLLER] cancelTrial call stack
cntr.js?v=8.19:856 console.trace
cancelTrial @ cntr.js?v=8.19:856
flipTrial @ cntr.js?v=8.19:690
onclick @ controller/:1
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:854 [CONTROLLER] cancelTrial CALLED - trialRunning: true
cntr.js?v=8.19:855 [CONTROLLER] cancelTrial call stack
cntr.js?v=8.19:856 console.trace
cancelTrial @ cntr.js?v=8.19:856
onclick @ controller/:1
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:679 [CONTROLLER] flipTrial CLICKED: adth ppl trial x4 trialRunning: true
cntr.js?v=8.19:680 [CONTROLLER] flipTrial call stack
cntr.js?v=8.19:681 console.trace
flipTrial @ cntr.js?v=8.19:681
onclick @ controller/:1
cntr.js?v=8.19:689 [CONTROLLER] Trial already running, calling cancelTrial
cntr.js?v=8.19:854 [CONTROLLER] cancelTrial CALLED - trialRunning: true
cntr.js?v=8.19:855 [CONTROLLER] cancelTrial call stack
cntr.js?v=8.19:856 console.trace
cancelTrial @ cntr.js?v=8.19:856
flipTrial @ cntr.js?v=8.19:690
onclick @ controller/:1
25comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
cntr.js?v=8.19:908 [CONTROLLER] endTrials CALLED - buttonsEnabled: true testType: adt trialRunning: true
cntr.js?v=8.19:909 [CONTROLLER] endTrials call stack
cntr.js?v=8.19:910 console.trace
endTrials @ cntr.js?v=8.19:910
onclick @ controller/:1
cntr.js?v=8.19:911 [CONTROLLER] endTrials context curTestName: adth curConfigName: tspl curUserName: admin
cntr.js?v=8.19:914 [CONTROLLER] endTrials blocked - trials are still running
71comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc

# Responder
reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_top_happy.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
7resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
4resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_btm.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
64resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:1613 reflectCurTrialState exit
lib.js?v=8.19:482 [UI] showPage: ecittTriple
lib.js?v=8.19:493 [UI] setActionAttrs for page: ecittTriple
comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:617 [RESPONDER] buttonPressed CLICKED: top curTestName: adt curTrialType: ppt
resp.js?v=8.19:642 [RESPONDER] buttonPressed - calling recordAndReport, button: top accuracy: 1
comm.js?v=8.19:307 [COMM] Stored trial record in localStorage: admin_1770247364642
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
3comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:742 [RESPONDER] trialEnded - queue length: 1
resp.js?v=8.19:745 [RESPONDER] More trials in queue, starting next
resp.js?v=8.19:1213 [RESPONDER] startTrial: adt,ppt,trial,,3,1,2,1,1
resp.js?v=8.19:1261 <config id=​"adt_ppt" name=​"Practice Top" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"top" empType=​"happy" rew=​"top" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1262 <config id=​"adt_ppt" name=​"Practice Top" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"top" empType=​"happy" rew=​"top" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1450 showTrial
resp.js?v=8.19:1582 reflectCurTrialState, curTestName: adt
resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_top_happy.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
7resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
4resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_btm.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
64resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:1613 reflectCurTrialState exit
lib.js?v=8.19:482 [UI] showPage: ecittTriple
lib.js?v=8.19:493 [UI] setActionAttrs for page: ecittTriple
resp.js?v=8.19:617 [RESPONDER] buttonPressed CLICKED: top curTestName: adt curTrialType: ppt
resp.js?v=8.19:642 [RESPONDER] buttonPressed - calling recordAndReport, button: top accuracy: 1
comm.js?v=8.19:307 [COMM] Stored trial record in localStorage: admin_1770247366257
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
3comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:742 [RESPONDER] trialEnded - queue length: 0
resp.js?v=8.19:750 [RESPONDER] All trials complete, resetting and notifying controller
resp.js?v=8.19:762 [RESPONDER] Restarting polling
polling.js?v=8.19:57 startEventPolling: role=resp pc=admin
resp.js?v=8.19:768 [RESPONDER] Uploading trial data after natural completion
comm.js?v=8.19:354 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:374 [COMM] Sending 4 records in batch
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
comm.js?v=8.19:382 [COMM] Batch insert successful, clearing 4 records
comm.js?v=8.19:386 [COMM] Removed: admin_1770247366257
comm.js?v=8.19:386 [COMM] Removed: admin_1770247360617
comm.js?v=8.19:386 [COMM] Removed: admin_1770247362616
comm.js?v=8.19:386 [COMM] Removed: admin_1770247364642
resp.js?v=8.19:770 [RESPONDER] Upload complete, sending trialEnded event to controller
7comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
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
polling.js?v=8.19:57 startEventPolling: role=resp pc=admin
resp.js?v=8.19:1532 [RESPONDER] End complete, notified controller
lib.js?v=8.19:493 [UI] setActionAttrs for page: ready
comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
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
polling.js?v=8.19:57 startEventPolling: role=resp pc=admin
resp.js?v=8.19:1532 [RESPONDER] End complete, notified controller
lib.js?v=8.19:493 [UI] setActionAttrs for page: ready
5comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=setReadyMessage data=msg_adtIntro1,msg_adtIntro2,dot,msg_adtReady,,adt
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
lib.js?v=8.19:482 [UI] showPage: ready
polling.js?v=8.19:87 handlePolledEvent: type=startMultiTrials data=adt,ppb,trial,0,1,2,1,4
resp.js?v=8.19:1159 [RESPONDER] startMultiTrialsFromCntr received: adt,ppb,trial,0,1,2,1,4
lib.js?v=8.19:804 getTrialPeriod, testName: adt, trialType: ppb
lib.js?v=8.19:812 trialPeriod:null
resp.js?v=8.19:1193 [RESPONDER] Built trial queue with 4 trials. trialPending: false
resp.js?v=8.19:1196 [RESPONDER] Waiting for 1s hold on red dot to start trials
lib.js?v=8.19:482 [UI] showPage: ready
2lib.js?v=8.19:493 [UI] setActionAttrs for page: ready
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:1095 [RESPONDER] Hold complete - starting first trial
resp.js?v=8.19:1213 [RESPONDER] startTrial: adt,ppb,trial,,0,1,2,1,4
polling.js?v=8.19:69 Event polling stopped
resp.js?v=8.19:1261 <config id=​"adt_ppb" name=​"Practice Btm" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"btm" empType=​"happy" rew=​"btm" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1262 <config id=​"adt_ppb" name=​"Practice Btm" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"btm" empType=​"happy" rew=​"btm" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1450 showTrial
resp.js?v=8.19:1582 reflectCurTrialState, curTestName: adt
resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_top.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
7resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
4resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_btm_happy.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
64resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:1613 reflectCurTrialState exit
lib.js?v=8.19:482 [UI] showPage: ecittTriple
lib.js?v=8.19:493 [UI] setActionAttrs for page: ecittTriple
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:617 [RESPONDER] buttonPressed CLICKED: btm curTestName: adt curTrialType: ppb
resp.js?v=8.19:642 [RESPONDER] buttonPressed - calling recordAndReport, button: btm accuracy: 1
comm.js?v=8.19:307 [COMM] Stored trial record in localStorage: admin_1770247376724
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
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:742 [RESPONDER] trialEnded - queue length: 3
resp.js?v=8.19:745 [RESPONDER] More trials in queue, starting next
resp.js?v=8.19:1213 [RESPONDER] startTrial: adt,ppb,trial,,1,1,2,1,3
resp.js?v=8.19:1261 <config id=​"adt_ppb" name=​"Practice Btm" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"btm" empType=​"happy" rew=​"btm" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1262 <config id=​"adt_ppb" name=​"Practice Btm" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"btm" empType=​"happy" rew=​"btm" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1450 showTrial
resp.js?v=8.19:1582 reflectCurTrialState, curTestName: adt
resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_top.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
7resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
4resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_btm_happy.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
64resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:1613 reflectCurTrialState exit
lib.js?v=8.19:482 [UI] showPage: ecittTriple
lib.js?v=8.19:493 [UI] setActionAttrs for page: ecittTriple
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:617 [RESPONDER] buttonPressed CLICKED: btm curTestName: adt curTrialType: ppb
resp.js?v=8.19:642 [RESPONDER] buttonPressed - calling recordAndReport, button: btm accuracy: 1
comm.js?v=8.19:307 [COMM] Stored trial record in localStorage: admin_1770247378668
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
comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:742 [RESPONDER] trialEnded - queue length: 2
resp.js?v=8.19:745 [RESPONDER] More trials in queue, starting next
resp.js?v=8.19:1213 [RESPONDER] startTrial: adt,ppb,trial,,2,1,2,1,2
resp.js?v=8.19:1261 <config id=​"adt_ppb" name=​"Practice Btm" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"btm" empType=​"happy" rew=​"btm" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1262 <config id=​"adt_ppb" name=​"Practice Btm" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"btm" empType=​"happy" rew=​"btm" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1450 showTrial
resp.js?v=8.19:1582 reflectCurTrialState, curTestName: adt
resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_top.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
7resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
4resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_btm_happy.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
64resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:1613 reflectCurTrialState exit
lib.js?v=8.19:482 [UI] showPage: ecittTriple
lib.js?v=8.19:493 [UI] setActionAttrs for page: ecittTriple
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:617 [RESPONDER] buttonPressed CLICKED: btm curTestName: adt curTrialType: ppb
resp.js?v=8.19:642 [RESPONDER] buttonPressed - calling recordAndReport, button: btm accuracy: 1
comm.js?v=8.19:307 [COMM] Stored trial record in localStorage: admin_1770247380389
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
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:742 [RESPONDER] trialEnded - queue length: 1
resp.js?v=8.19:745 [RESPONDER] More trials in queue, starting next
resp.js?v=8.19:1213 [RESPONDER] startTrial: adt,ppb,trial,,3,1,2,1,1
resp.js?v=8.19:1261 <config id=​"adt_ppb" name=​"Practice Btm" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"btm" empType=​"happy" rew=​"btm" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1262 <config id=​"adt_ppb" name=​"Practice Btm" layout=​"ecittTriple" animDistr animKeepSep animMaxDups animSeqMethod=​"none" emp=​"btm" empType=​"happy" rew=​"btm" ready=​"top,mdl,btm" buttonTypes=​"resp,dot,resp" varPeriod=​"4">​</config>​
resp.js?v=8.19:1450 showTrial
resp.js?v=8.19:1582 reflectCurTrialState, curTestName: adt
resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: top
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_top.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
7resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: mdl
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_dot.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
4resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:990 showRespElem, pageId: ecittTriple, name: btm
media.js?v=8.19:81 imageElem <img src=​"../​graphics/​buttons/​button_btm_happy.png" alt=​"undefined" rel=​"preload" draggable=​"false" ontouchstart=​"event.preventDefault()​;​" class=​"ecittButton">​
64resp.js?v=8.19:1617 reflectCurReadyList
resp.js?v=8.19:1613 reflectCurTrialState exit
lib.js?v=8.19:482 [UI] showPage: ecittTriple
lib.js?v=8.19:493 [UI] setActionAttrs for page: ecittTriple
comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:617 [RESPONDER] buttonPressed CLICKED: btm curTestName: adt curTrialType: ppb
resp.js?v=8.19:642 [RESPONDER] buttonPressed - calling recordAndReport, button: btm accuracy: 1
comm.js?v=8.19:307 [COMM] Stored trial record in localStorage: admin_1770247382210
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
3comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
resp.js?v=8.19:742 [RESPONDER] trialEnded - queue length: 0
resp.js?v=8.19:750 [RESPONDER] All trials complete, resetting and notifying controller
resp.js?v=8.19:762 [RESPONDER] Restarting polling
polling.js?v=8.19:57 startEventPolling: role=resp pc=admin
resp.js?v=8.19:768 [RESPONDER] Uploading trial data after natural completion
comm.js?v=8.19:354 [COMM] batchSendAllRecords - collecting all trial records
comm.js?v=8.19:374 [COMM] Sending 4 records in batch
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
comm.js?v=8.19:382 [COMM] Batch insert successful, clearing 4 records
comm.js?v=8.19:386 [COMM] Removed: admin_1770247382210
comm.js?v=8.19:386 [COMM] Removed: admin_1770247376724
comm.js?v=8.19:386 [COMM] Removed: admin_1770247378668
comm.js?v=8.19:386 [COMM] Removed: admin_1770247380389
resp.js?v=8.19:770 [RESPONDER] Upload complete, sending trialEnded event to controller
8comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=endTrials data=adt,tspb
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
polling.js?v=8.19:57 startEventPolling: role=resp pc=admin
resp.js?v=8.19:1532 [RESPONDER] End complete, notified controller
lib.js?v=8.19:493 [UI] setActionAttrs for page: ready
polling.js?v=8.19:87 handlePolledEvent: type=endTrials data=adt,tspb
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
polling.js?v=8.19:57 startEventPolling: role=resp pc=admin
resp.js?v=8.19:1532 [RESPONDER] End complete, notified controller
lib.js?v=8.19:493 [UI] setActionAttrs for page: ready
2comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=endTrials data=adt,tspb
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
polling.js?v=8.19:57 startEventPolling: role=resp pc=admin
resp.js?v=8.19:1532 [RESPONDER] End complete, notified controller
lib.js?v=8.19:493 [UI] setActionAttrs for page: ready
4comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=flipClock data=1,Santiago_Morales,2026,1,1
lib.js?v=8.19:482 [UI] showPage: clock
lib.js?v=8.19:493 [UI] setActionAttrs for page: clock
6comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc
polling.js?v=8.19:87 handlePolledEvent: type=endTest data=
resp.js?v=8.19:368 [RESPONDER] reInitTrialState - clearing all trial state
polling.js?v=8.19:69 Event polling stopped
resp.js?v=8.19:405 [RESPONDER] reInitTrialState complete - queue cleared, trialPending: false
polling.js?v=8.19:57 startEventPolling: role=undefined pc=undefined
lib.js?v=8.19:482 [UI] showPage: ready
lib.js?v=8.19:493 [UI] setActionAttrs for page: ready
79comm.js?v=8.19:684 Set window.connectionStateDoc = responseDoc