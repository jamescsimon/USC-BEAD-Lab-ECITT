/**
 * Screen switching
 * (split from app.js; load order is set in index.html)
 */

// ===== SCREEN MANAGEMENT =====

function showScreen(screenName) {
    Object.values(elements).forEach(el => {
        if (el && el.classList && el.classList.contains('screen')) {
            el.classList.remove('active');
        }
    });

    if (!elements[screenName]) {
        console.error(`[APP] Screen not found: ${screenName}`);
        return;
    }

    elements[screenName].classList.add('active');
    appState.currentScreenName = screenName;
    
    updateBackupRecoveryButton();
    
    console.log(`[APP] Showing screen: ${screenName}`);
}
