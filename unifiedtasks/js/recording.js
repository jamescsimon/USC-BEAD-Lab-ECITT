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

let csvDownloadUrls = [];

function removeCsvDownloadLinks() {
    csvDownloadUrls.forEach(url => URL.revokeObjectURL(url));
    csvDownloadUrls = [];

    [elements.endCsvDownloads, elements.dnfCsvDownloads].forEach(container => {
        if (container) container.innerHTML = '';
    });
}

// Puts "Events CSV" and "Trials CSV" download links on the end and DNF screens.
// They are real <a download> links (not scripted clicks) so iPad saves each file on a single tap.
function showCsvDownloadLinks() {
    removeCsvDownloadLinks();

    // keep the local-storage backup current whenever the files are offered
    dataManager.saveToLocalStorage();

    const eventCSV = dataManager.generateCSV();
    const trialCSV = dataManager.generateTrialCSV();

    if (!eventCSV && !trialCSV) {
        alert('No CSV data is available yet.');
        return;
    }

    const participant =
        dataManager.participantId ||
        appState.participantId ||
        'unknown';

    const makeLink = (csvText, filename, label) => {
        const url = URL.createObjectURL(new Blob([csvText], { type: 'text/csv;charset=utf-8;' }));
        csvDownloadUrls.push(url);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.textContent = label;
        link.className = 'download-button';
        return link;
    };

    [elements.endCsvDownloads, elements.dnfCsvDownloads].forEach(container => {
        if (!container) return;

        if (eventCSV) {
            container.appendChild(makeLink(eventCSV, `ECITT_${participant}_events.csv`, 'Events CSV'));
        }
        if (trialCSV) {
            container.appendChild(makeLink(trialCSV, `ECITT_${participant}_trials.csv`, 'Trials CSV'));
        }
    });
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
