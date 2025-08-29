export function showAlert(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

export function copyTextToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value || element.textContent;
    return navigator.clipboard.writeText(text).then(() => {
        showAlert('Text copied to clipboard!');
    }).catch(err => {
        showAlert('Failed to copy: ' + err.message);
    });
}

export function transferText(fromId, toId) {
    const fromElement = document.getElementById(fromId);
    const toElement = document.getElementById(toId);
    const text = fromElement.value || fromElement.textContent;

    if (toElement.tagName === 'TEXTAREA' || toElement.tagName === 'INPUT') {
        toElement.value = text;
    } else {
        toElement.textContent = text;
    }

    showAlert(`Text transferred from ${fromId} to ${toId}!`);
}

export async function downloadAllImages(images) {
    if (!images || images.length === 0) {
        showAlert('No images to download.');
        return;
    }

    showAlert(`Downloading ${images.length} images...`);

    for (let i = 0; i < images.length; i++) {
        try {
            const imageData = images[i];
            const response = await fetch(imageData.url);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `generated_image_${i + 1}_${imageData.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error(`Failed to download image ${i + 1}:`, error);
        }
    }

    showAlert('All images downloaded successfully!');
}

export async function saveState(state) {
    try {
        const stateJson = JSON.stringify(state, null, 2);
        try {
            await navigator.clipboard.writeText(stateJson);
            showAlert('State saved to clipboard! Use "Import State" to restore later.');
        } catch (clipboardError) {
            const textArea = document.createElement('textarea');
            textArea.value = stateJson;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showAlert('State saved to clipboard! Use "Import State" to restore later.');
                } else {
                    throw new Error('Copy command failed');
                }
            } catch (execError) {
                showStateCopyModal(stateJson);
            } finally {
                document.body.removeChild(textArea);
            }
        }
    } catch (error) {
        showAlert('Failed to save state: ' + error.message);
    }
}

export function showStateCopyModal(stateJson) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-96">
            <h3 class="text-lg font-semibold text-white mb-4">Copy State Manually</h3>
            <p class="text-gray-300 mb-3">Automatic clipboard copy failed. Please manually copy the text below:</p>
            <textarea readonly class="w-full h-48 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm resize-none font-mono" id="manualCopyText">${stateJson}</textarea>
            <div class="flex justify-end space-x-3 mt-4">
                <button id="selectAllBtn" class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded">Select All</button>
                <button id="closeModal" class="px-4 py-2 text-gray-400 hover:bg-gray-700 rounded">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const textarea = modal.querySelector('#manualCopyText');
    const selectAllBtn = modal.querySelector('#selectAllBtn');
    const closeBtn = modal.querySelector('#closeModal');

    selectAllBtn.addEventListener('click', () => {
        textarea.focus();
        textarea.select();
    });

    const closeModal = () => modal.remove();
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    setTimeout(() => {
        textarea.focus();
        textarea.select();
    }, 100);
}

export function showImportDialog(onImport) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96">
            <h3 class="text-lg font-semibold text-white mb-4">Import State</h3>
            <textarea id="importTextarea" class="w-full h-48 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm resize-none font-mono" placeholder="Paste your saved state JSON here..."></textarea>
            <div class="flex justify-end space-x-3 mt-4">
                <button id="cancelImport" class="px-4 py-2 text-gray-400 hover:bg-gray-700 rounded">Cancel</button>
                <button id="confirmImport" class="px-4 py-2 bg-primary text-white hover:bg-purple-700 rounded">Import</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const textarea = modal.querySelector('#importTextarea');
    const cancelBtn = modal.querySelector('#cancelImport');
    const confirmBtn = modal.querySelector('#confirmImport');

    textarea.focus();

    const closeModal = () => modal.remove();
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    confirmBtn.addEventListener('click', () => {
        try {
            const stateJson = textarea.value.trim();
            if (!stateJson) {
                showAlert('Please paste a valid state JSON.');
                return;
            }
            const state = JSON.parse(stateJson);
            onImport(state);
            closeModal();
        } catch (error) {
            showAlert('Invalid JSON format: ' + error.message);
        }
    });
}

export function downloadState(state) {
    try {
        const stateJson = JSON.stringify(state, null, 2);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const blob = new Blob([stateJson], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `face-perfectionist-state-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showAlert('State downloaded as JSON file!');
    } catch (error) {
        showAlert('Failed to download state: ' + error.message);
    }
}

export function uploadState(onImport) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const stateJson = e.target.result;
                const state = JSON.parse(stateJson);
                onImport(state);
            } catch (error) {
                showAlert('Invalid JSON file: ' + error.message);
            }
        };
        reader.onerror = () => {
            showAlert('Failed to read file');
        };
        reader.readAsText(file);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

export function downloadAllResponses(bot1Response, bot2Response, prompt1, prompt2) {
    const responses = [];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    if (bot1Response && bot1Response.trim()) {
        responses.push(`# Bot 1 Response\n\n${bot1Response}\n\n---\n\n`);
    }

    if (bot2Response && bot2Response.trim()) {
        responses.push(`# Bot 2 Response\n\n${bot2Response}\n\n---\n\n`);
    }

    if (prompt1 && prompt1.trim()) {
        responses.push(`# Main Prompt 1\n\n${prompt1}\n\n---\n\n`);
    }

    if (prompt2 && prompt2.trim()) {
        responses.push(`# Main Prompt 2\n\n${prompt2}\n\n---\n\n`);
    }

    if (responses.length === 0) {
        showAlert('No responses to download. Generate some content first!');
        return;
    }

    const markdownContent = `# Face Perfectionist Session\n\nGenerated: ${new Date().toLocaleString()}\n\n---\n\n${responses.join('')}`;
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `face-perfectionist-responses-${timestamp}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showAlert(`Downloaded ${responses.length} responses as markdown!`);
}
