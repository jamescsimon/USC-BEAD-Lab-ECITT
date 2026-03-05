/**
 * ECITT Data Management Module
 * Handles CSV generation, local storage, and data export
 */

class DataManager {
    constructor() {
        this.sessionData = [];
        this.participantId = '';
        this.sessionStart = null;
        this.testName = 'AdultUnified';
    }

    /**
     * Initialize a new session
     */
    startSession(participantId) {
        this.participantId = participantId;
        this.sessionStart = new Date();
        this.sessionData = [];
        console.log(`[DATA] Session started for ${participantId}`);
    }

    /**
     * Log a telemetry event
     */
    logEvent(eventData) {
        const timestamp = new Date().toISOString();
        const record = {
            TestDate: this.formatDate(this.sessionStart),
            StartTimestamp: this.formatTimestamp(this.sessionStart),
            ResponserName: this.participantId,
            ControllerName: 'Self_Administered',
            Section: eventData.section || 'Unknown',
            Stimuli: eventData.stimuli || 'n/a',
            InvokedBy: eventData.invokedBy || 'n/a',
            Accuracy: eventData.accuracy !== undefined ? eventData.accuracy : 'n/a',
            ProjectName: 'ECITT_PWA',
            TestSetName: 'AdultTasks',
            TestName: eventData.testName || this.testName,
            TrialsRemaining: eventData.trialsRemaining !== undefined ? eventData.trialsRemaining : 'n/a',
            ReactionTime: eventData.reactionTime || 'n/a',
            Timestamp: timestamp
        };

        this.sessionData.push(record);
        console.log(`[DATA] Event logged:`, record);
    }

    /**
     * Mark session as Did Not Finish
     */
    markDNF(currentTrial, totalTrials) {
        const completedTrials = currentTrial - 1;
        const remainingTrials = totalTrials - currentTrial + 1;
        
        // Log DNF event
        this.logEvent({
            section: 'DNF',
            stimuli: 'SessionIncomplete',
            invokedBy: 'System',
            accuracy: 'n/a',
            trialsRemaining: remainingTrials
        });

        console.log(`[DATA] Session marked as DNF: ${completedTrials}/${totalTrials} trials completed`);
    }

    /**
     * Generate CSV content from session data
     */
    generateCSV() {
        if (this.sessionData.length === 0) {
            return null;
        }

        // CSV Header
        const headers = [
            'TestDate',
            'StartTimestamp',
            'ResponserName',
            'ControllerName',
            'Section',
            'Stimuli',
            'InvokedBy',
            'Accuracy',
            'ProjectName',
            'TestSetName',
            'TestName',
            'TrialsRemaining',
            'ReactionTime',
            'Timestamp'
        ];

        // Build CSV rows
        const rows = this.sessionData.map(record => {
            return headers.map(header => {
                const value = record[header];
                // Escape commas and quotes in values
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });

        // Combine header and rows
        return [headers.join(','), ...rows].join('\n');
    }

    /**
     * Download CSV file
     */
    downloadCSV() {
        const csv = this.generateCSV();
        if (!csv) {
            console.error('[DATA] No data to download');
            return;
        }

        const filename = `ECITT_${this.participantId}_${this.formatFilestamp(this.sessionStart)}.csv`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        
        // Create download link
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log(`[DATA] CSV downloaded: ${filename}`);
        }
    }

    /**
     * Save session data to localStorage
     */
    saveToLocalStorage() {
        try {
            const key = `ecitt_session_${this.participantId}_${this.sessionStart.getTime()}`;
            const data = {
                participantId: this.participantId,
                sessionStart: this.sessionStart.toISOString(),
                testName: this.testName,
                records: this.sessionData
            };
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`[DATA] Session saved to localStorage: ${key}`);
        } catch (error) {
            console.error('[DATA] Failed to save to localStorage:', error);
        }
    }

    /**
     * Load session data from localStorage
     */
    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data);
                this.participantId = parsed.participantId;
                this.sessionStart = new Date(parsed.sessionStart);
                this.testName = parsed.testName;
                this.sessionData = parsed.records;
                console.log(`[DATA] Session loaded from localStorage: ${key}`);
                return true;
            }
        } catch (error) {
            console.error('[DATA] Failed to load from localStorage:', error);
        }
        return false;
    }

    /**
     * Get all saved sessions from localStorage
     */
    getSavedSessions() {
        const sessions = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ecitt_session_')) {
                sessions.push(key);
            }
        }
        return sessions;
    }

    /**
     * Clear all session data
     */
    clearSession() {
        this.sessionData = [];
        this.participantId = '';
        this.sessionStart = null;
        console.log('[DATA] Session cleared');
    }

    /**
     * Get session statistics
     */
    getStats() {
        if (this.sessionData.length === 0) {
            return null;
        }

        const trialEvents = this.sessionData.filter(r => 
            r.Section === 'PromptScreen' && r.Accuracy !== 'n/a'
        );

        const totalTrials = trialEvents.length;
        const correctTrials = trialEvents.filter(r => r.Accuracy === 1 || r.Accuracy === '1').length;
        const accuracy = totalTrials > 0 ? ((correctTrials / totalTrials) * 100).toFixed(1) : 0;

        // Calculate average reaction time
        const reactionTimes = trialEvents
            .map(r => parseFloat(r.ReactionTime))
            .filter(rt => !isNaN(rt) && rt > 0);
        
        const avgReactionTime = reactionTimes.length > 0
            ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
            : 0;

        return {
            totalTrials,
            correctTrials,
            accuracy,
            avgReactionTime
        };
    }

    /**
     * Format date as YYYY-MM-DD
     */
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Format timestamp as H[hour]:M[minute]:S[second].[millisecond]
     */
    formatTimestamp(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const millis = String(date.getMilliseconds()).padStart(4, '0');
        return `H${hours}:M${minutes}:S${seconds}.${millis}`;
    }

    /**
     * Format timestamp for filenames
     */
    formatFilestamp(date) {
        return date.toISOString().replace(/[:.]/g, '-').replace('T', '_').split('Z')[0];
    }
}

// Create global instance
const dataManager = new DataManager();
