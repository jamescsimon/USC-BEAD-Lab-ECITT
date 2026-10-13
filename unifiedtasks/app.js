/**
 * ECITT Adult Tasks - Main Application Logic
 * Single-screen PWA implementation
 */

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    console.log('[APP] Initializing ECITT Adult Tasks PWA');
    
    // Cache DOM elements
    elements = {
        ageSelectionScreen: document.getElementById('ageSelectionScreen'),
        participantScreen: document.getElementById('participantScreen'),
        readyScreen: document.getElementById('readyScreen'),
        promptScreen: document.getElementById('promptScreen'),
        endScreen: document.getElementById('endScreen'),
        dnfScreen: document.getElementById('dnfScreen'),
        
        participantIdInput: document.getElementById('participantIdInput'),
        startBtn: document.getElementById('startBtn'),
        cbLeftBtn: document.getElementById('cbLeftBtn'),
        cbRightBtn: document.getElementById('cbRightBtn'),
        
        readyMsg1: document.getElementById('readyMsg1'),
        readyMsg2: document.getElementById('readyMsg2'),
        readyMsg3: document.getElementById('readyMsg3'),
        dotButton: document.getElementById('dotButton'),
        
        leftButton: document.getElementById('leftButton'),
        mdlButton: document.getElementById('mdlButton'),
        rightButton: document.getElementById('rightButton'),
        promptDot: document.getElementById('promptDot'),
        
        buttonIndicator: document.getElementById('buttonIndicator'),
        
        endStats: document.getElementById('endStats'),
        endCsvDownloads: document.getElementById('endCsvDownloads'),
        downloadVideoBtn: document.getElementById('downloadVideoBtn'),
        restartBtn: document.getElementById('restartBtn'),

        dnfStats: document.getElementById('dnfStats'),
        dnfCsvDownloads: document.getElementById('dnfCsvDownloads'),
        dnfDownloadVideoBtn: document.getElementById('dnfDownloadVideoBtn'),
        dnfRestartBtn: document.getElementById('dnfRestartBtn'),

        choiceScreen: document.getElementById('choiceScreen'),
        choiceTitle: document.getElementById('choiceTitle'),
        choiceStats: document.getElementById('choiceStats'),
        choiceButtons: document.getElementById('choiceButtons'),

        recordingReminderScreen: document.getElementById('recordingReminderScreen'),
        recordingReminderContinueBtn: document.getElementById('recordingReminderContinueBtn'),

        waitScreen: document.getElementById('waitScreen')
    };
    
    // Event listeners
    const adultBtn = document.getElementById('adultBtn');

    if (adultBtn) {
        adultBtn.addEventListener('click', selectAdult);
    
        adultBtn.style.backgroundColor = '#2e7d32';
        adultBtn.style.borderColor = '#1b5e20';
        adultBtn.style.color = 'white';
    }
    const childBtn = document.getElementById('childBtn');
    if (childBtn) {
        childBtn.addEventListener('click', selectChild);

        childBtn.style.backgroundColor = '#f567d8';
        childBtn.style.borderColor = '#f060e4';
        childBtn.style.color = 'white';
    }
    
    const infantBtn = document.getElementById('infantBtn');
    
    if (infantBtn) {
        infantBtn.textContent = 'Infant/Toddler';
        infantBtn.addEventListener('click', selectInfant);
    }
    
    if (elements.startBtn) elements.startBtn.addEventListener('click', startTest);
    if (elements.cbLeftBtn) elements.cbLeftBtn.addEventListener('click', () => setCounterbalance('left'));
    if (elements.cbRightBtn) elements.cbRightBtn.addEventListener('click', () => setCounterbalance('right'));
    if (elements.dotButton) {
        elements.dotButton.addEventListener('pointerdown', handleDotPress);
    }
    
    if (elements.leftButton) {
        elements.leftButton.addEventListener('pointerdown', (event) => {
            handleButtonPress('left', event);
        });
    }
    
    if (elements.mdlButton) {
        elements.mdlButton.addEventListener('pointerdown', (event) => {
            handleButtonPress('mdl', event);
        });
    }
    
    if (elements.rightButton) {
        elements.rightButton.addEventListener('pointerdown', (event) => {
            handleButtonPress('right', event);
        });
    }
    if (elements.downloadVideoBtn) elements.downloadVideoBtn.addEventListener('click', downloadVideoOnly);
    if (elements.restartBtn) elements.restartBtn.addEventListener('click', restart);
    if (elements.dnfDownloadVideoBtn) elements.dnfDownloadVideoBtn.addEventListener('click', downloadVideoOnly);
    if (elements.dnfRestartBtn) elements.dnfRestartBtn.addEventListener('click', restart);
    if (elements.recordingReminderContinueBtn) elements.recordingReminderContinueBtn.addEventListener('click', continueAfterRecordingReminder);
    
    // Orientation-aware button positioning
    applyOrientationLayout();
    window.matchMedia('(orientation: landscape)').addEventListener('change', applyOrientationLayout);

    // Hidden operator buttons:
    // top-left = quit early / DNF
    // top-right = NIRS baseline video
    createHiddenOperatorButtons();

    appState.currentScreenName = 'ageSelectionScreen';
    updateBackupRecoveryButton();
    
    preloadAnimationFrames();
    console.log('[APP] Initialization complete');
});

console.log('[APP] Script loaded - ECITT Adult Tasks PWA ready');
