/**
 * Video recording and CSV/video download
 * (split from app.js; load order is set in index.html)
 */

// ===== RECORDING =====

let mediaRecorder = null;
let recordedChunks = [];
let mediaStream = null;
let recordedMimeType = '';
let recordingFinalizing = false;

function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('[REC] getUserMedia not supported on this device/context');
        return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then(stream => {
            mediaStream = stream;
            const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')
                ? 'video/mp4;codecs=avc1'
                : MediaRecorder.isTypeSupported('video/mp4')
                    ? 'video/mp4'
                    : 'video/webm';
            recordedMimeType = mimeType;
            mediaRecorder = new MediaRecorder(stream, { mimeType });
            recordedChunks = [];
            mediaRecorder.ondataavailable = e => {
                if (e.data && e.data.size > 0) recordedChunks.push(e.data);
            };
            mediaRecorder.start(1000);
            console.log('[REC] Recording started, mimeType:', mimeType);
        })
        .catch(err => {
            console.warn('[REC] Camera access denied or unavailable:', err.name, err.message);
        });
}

function removeCsvDownloadLinks() {
    const existing =
        document.getElementById('csvDownloadLinksBox');

    if (existing) {
        existing.remove();
    }
}

function showCsvDownloadLinks() {
    removeCsvDownloadLinks();

    const eventCSV =
        dataManager.generateCSV();

    const trialCSV =
        dataManager.generateTrialCSV();

    if (!eventCSV && !trialCSV) {
        alert('No CSV data is available yet.');
        return;
    }

    const box =
        document.createElement('div');

    box.id = 'csvDownloadLinksBox';

    box.style.position = 'fixed';
    box.style.left = '50%';
    box.style.bottom = '20px';
    box.style.transform = 'translateX(-50%)';
    box.style.zIndex = '1000002';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.gap = '10px';
    box.style.alignItems = 'center';
    box.style.backgroundColor = 'rgba(255,255,255,0.98)';
    box.style.padding = '14px';
    box.style.border = '3px solid black';
    box.style.borderRadius = '12px';

    const title =
        document.createElement('div');

    title.textContent =
        'Tap each CSV file to save';

    title.style.fontSize = '18px';
    title.style.fontWeight = 'bold';
    title.style.color = 'black';

    box.appendChild(title);

    const participant =
        dataManager.participantId ||
        appState.participantId ||
        'unknown';

    const makeLink = (csvText, filename, label) => {
        const blob =
            new Blob(
                [csvText],
                { type: 'text/csv;charset=utf-8;' }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement('a');

        link.href = url;
        link.download = filename;
        link.textContent = label;

        link.style.fontSize = '20px';
        link.style.padding = '12px 18px';
        link.style.backgroundColor = 'black';
        link.style.color = 'white';
        link.style.borderRadius = '8px';
        link.style.textDecoration = 'none';
        link.style.display = 'block';
        link.style.textAlign = 'center';
        link.style.minWidth = '230px';

        return link;
    };

    if (eventCSV) {
        box.appendChild(
            makeLink(
                eventCSV,
                `ECITT_${participant}_events.csv`,
                'Download Events CSV'
            )
        );
    }

    if (trialCSV) {
        box.appendChild(
            makeLink(
                trialCSV,
                `ECITT_${participant}_trials.csv`,
                'Download Trials CSV'
            )
        );
    }

    const closeBtn =
        document.createElement('button');

    closeBtn.textContent = 'Hide CSV links';

    closeBtn.style.fontSize = '16px';
    closeBtn.style.padding = '8px 12px';
    closeBtn.style.backgroundColor = 'white';
    closeBtn.style.color = 'black';
    closeBtn.style.border = '1px solid black';
    closeBtn.style.borderRadius = '6px';

    closeBtn.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        removeCsvDownloadLinks();
    });

    box.appendChild(closeBtn);

    document.body.appendChild(box);
}

function downloadCSVOnly() {
    try {
        dataManager.saveToLocalStorage();

        // iPad-safe: show visible CSV links instead of relying on automatic download.
        showCsvDownloadLinks();

    } catch (err) {
        alert(
            `CSV link creation failed, but backup should still be saved: ${err.message}`
        );

        console.error('[DATA] CSV link creation failed:', err);
    }
}

function downloadVideoOnly() {
    if (recordingFinalizing) {
        alert('Video is still finalizing. Wait a few seconds and press Download Video again.');
        return;
    }

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        recordingFinalizing = true;

        alert('Stopping and finalizing video. Press Download Video again in a few seconds if the download does not start.');

        mediaRecorder.addEventListener('stop', () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(t => t.stop());
                mediaStream = null;
            }

            mediaRecorder = null;
            recordingFinalizing = false;

            setTimeout(() => {
                downloadVideoOnly();
            }, 500);
        }, { once: true });

        try {
            mediaRecorder.requestData();
        } catch (e) {}

        mediaRecorder.stop();
        return;
    }

    if (!recordedChunks || recordedChunks.length === 0) {
        alert(
            'No video data is available. The CSV backup is still safe, but the iPad may not have finalized the video.'
        );
        console.warn('[REC] No video data available');
        return;
    }

    const mimeType = recordedMimeType || 'video/webm';
    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';

    const blob =
        new Blob(recordedChunks, { type: mimeType });

    const filename =
        `ECITT_${dataManager.participantId}_${dataManager.formatFilestamp(dataManager.sessionStart)}.${ext}`;

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement('a');

    link.href = url;
    link.download = filename;
    link.textContent = 'Download video file';
    link.style.position = 'fixed';
    link.style.left = '50%';
    link.style.bottom = '20px';
    link.style.transform = 'translateX(-50%)';
    link.style.zIndex = '1000002';
    link.style.fontSize = '22px';
    link.style.padding = '14px 20px';
    link.style.backgroundColor = 'white';
    link.style.color = 'black';
    link.style.border = '3px solid black';
    link.style.borderRadius = '10px';

    document.body.appendChild(link);

    link.click();

    setTimeout(() => {
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }

        URL.revokeObjectURL(url);
    }, 30000);

    console.log('[REC] Video download prepared:', filename);
}

// Stops the recorder and auto-downloads both files (used on DNF)
function stopAndAutoDownload() {
    dataManager.saveToLocalStorage();

    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        downloadVideoOnly();
        return;
    }
    mediaRecorder.addEventListener('stop', () => {
        if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
        mediaRecorder = null;
        downloadVideoOnly();
    }, { once: true });
    mediaRecorder.stop();
}

// Stops the recorder without downloading (used on normal end — user presses buttons)
function stopRecording() {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        return;
    }

    recordingFinalizing = true;

    mediaRecorder.addEventListener('stop', () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(t => t.stop());
            mediaStream = null;
        }

        mediaRecorder = null;
        recordingFinalizing = false;

        console.log('[REC] Recording finalized');
    }, { once: true });

    try {
        mediaRecorder.requestData();
    } catch (e) {}

    mediaRecorder.stop();
}

function cleanupRecording() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
        mediaStream = null;
    }
    mediaRecorder = null;
    recordedChunks = [];
    recordedMimeType = '';
    recordingFinalizing = false;
}
