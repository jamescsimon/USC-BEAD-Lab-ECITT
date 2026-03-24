/**
 * ECITT Data Management Module
 * Handles CSV generation, local storage, and data export
 */

class DataManager {
    constructor() {
        this.sessionData = [];
        this.participantId = '';
        this.sessionStart = null;
        this.testName = 'Adult';
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
        const now = new Date();

        // Use the caller-provided section when present. Avoid brittle remapping
        // based on partial stimuli strings (e.g. "red dot, blue buttons") which
        // produced incorrect Top/Bottom mappings previously.
        let sectionStarted = eventData.section || '';

        // Keep legacy handling for a few known aliases if necessary
        if (!sectionStarted && eventData.sectionAlias) {
            // optional alias mapping support
            sectionStarted = eventData.sectionAlias;
        }

        // Main screens we care about in the CSV. Include DNF so it can appear in exports.
        const mainScreens = [
            'TaskStart',
            'PromptScreen',
            'TopTrialScreen',
            'BottomTrialScreen',
            'ControlTrialScreen',
            'ReadyScreen',
            'TaskEnd',
            'DNF'
        ];

        // Only log main screen transitions (caller should provide the correct section)
        if (mainScreens.includes(sectionStarted)) {
            const record = {
                ParticipantName: this.participantId,
                TestName: eventData.testName || this.testName,
                TrialName: eventData.trialName || this.currentTrialName || '',
                SectionStarted: sectionStarted,
                Stimuli: eventData.stimuli || '',
                InvokedBy: eventData.invokedBy || '',
                Accuracy: eventData.accuracy !== undefined ? eventData.accuracy : 'n/a',
                TrialsRemaining: eventData.trialsRemaining !== undefined ? eventData.trialsRemaining : 'n/a',
                StartTimestamp: this.formatSoleScreenTimestamp(now),
                Duration: '' // Will be calculated in generateCSV
            };
            this.sessionData.push(record);
            console.log(`[DATA] Event logged:`, record);
        } else {
            // If not a main screen, we still store it in sessionData as a telemetry item
            // (optional) — comment out if you want to keep only main screens in memory.
            // this.sessionData.push({ meta: eventData, ts: now.toISOString() });
            console.log(`[DATA] Ignored non-main-screen event:`, eventData);
        }
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
        const headers = [
            'ParticipantName',
            'TestName',
            'TrialName',
            'SectionStarted',
            'Stimuli',
            'InvokedBy',
            'Accuracy',
            'TrialsRemaining',
            'StartTimestamp',
            'Duration'
        ];
        // Helper to parse SoleScreenExample StartTimestamp
        function parseTimestamp(ts) {
            // ts format: YYYY-MM-DD@Hhh:Mmm:Sss.mmm
            const match = ts && ts.match(/^(\d{4}-\d{2}-\d{2})@H(\d{2}):M(\d{2}):S(\d{2})\.(\d{3})$/);
            if (!match) return null;
            const [_, date, h, m, s, ms] = match;
            // Parse as local time (do NOT append 'Z')
            return new Date(`${date}T${h}:${m}:${s}.${ms}`);
        }
        // Only include main screen transitions + DNF for CSV rows
        const mainScreens = [
            'TaskStart',
            'PromptScreen',
            'TopTrialScreen',
            'BottomTrialScreen',
            'ControlTrialScreen',
            'ReadyScreen',
            'TaskEnd',
            'DNF'
        ];
        const filtered = this.sessionData.filter(r => mainScreens.includes(r.SectionStarted));
        const rows = filtered.map((record, idx) => {
            const mapped = { ...record };
            // Calculate Duration using next main screen event
            const currTs = parseTimestamp(mapped.StartTimestamp);
            let nextTs = null;
            if (idx < filtered.length - 1) {
                const nextStart = filtered[idx + 1].StartTimestamp;
                nextTs = parseTimestamp(nextStart);
            }
            if (currTs && nextTs) {
                const diffMs = nextTs - currTs;
                const minutes = Math.floor(diffMs / 60000);
                const seconds = Math.floor((diffMs % 60000) / 1000);
                const ms = Math.floor(diffMs % 1000);
                mapped.Duration = `${minutes}M:${String(seconds).padStart(2, '0')}S:${String(ms).padStart(3, '0')}MS`;
            } else {
                mapped.Duration = '0M:00S:001MS';
            }
            return headers.map(header => {
                const value = mapped[header] !== undefined ? mapped[header] : '';
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });
        return [headers.join(','), ...rows].join('\n');
    }

    /**
     * Format timestamp for SoleScreenExample CSV
     * YYYY-MM-DD@Hhh:Mmm:Sss.mmm
     */
    formatSoleScreenTimestamp(date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const millis = String(date.getMilliseconds()).padStart(3, '0');
        return `${yyyy}-${mm}-${dd}@H${hours}:M${minutes}:S${seconds}.${millis}`;
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
        if (!this.sessionData || this.sessionData.length === 0) {
            return null;
        }

        // Consider only completed trial rows (TopTrialScreen and BottomTrialScreen)
        const trialEvents = this.sessionData.filter(r => 
            r.SectionStarted === 'TopTrialScreen' || r.SectionStarted === 'BottomTrialScreen'
        );

        const totalTrials = trialEvents.length;
        const correctTrials = trialEvents.filter(r => r.Accuracy === 1 || r.Accuracy === '1').length;
        const accuracy = totalTrials > 0 ? ((correctTrials / totalTrials) * 100).toFixed(1) : 0;

        // If ReactionTime was ever recorded as a property on records, use it.
        // Otherwise skip RT calculation (your current CSV doesn't include RT per row).
        const reactionTimes = trialEvents
            .map(r => {
                // support either ReactionTime or RT if present
                if (r.ReactionTime !== undefined) return parseFloat(r.ReactionTime);
                if (r.RT !== undefined) return parseFloat(r.RT);
                return NaN;
            })
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
        const millis = String(date.getMilliseconds()).padStart(3, '0'); 
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
