let logEntries = [];

const logSection = document.getElementById('logSection');
const logContent = document.getElementById('logContent');
const logToggleBtn = document.getElementById('logToggleBtn');
const logArrow = document.getElementById('logArrow');
const clearLogBtn = document.getElementById('clearLogBtn');

function addLogEntry(action, botNumber, data = {}) {
  try {
    const timestamp = new Date().toLocaleString();
    const entry = {
      id: Date.now() + Math.random(),
      timestamp,
      action,
      bot: botNumber,
      data
    };

    logEntries.push(entry);
    displayLogEntry(entry);

    console.log(`[${timestamp}] ${action}${botNumber ? ` (Bot ${botNumber})` : ''}:`, data);
  } catch (e) {
    console.error('Logging failed:', e);
  }
}

function displayLogEntry(entry) {
  try {
    const emptyMessage = document.getElementById('emptyLogMessage');
    if (emptyMessage) {
      emptyMessage.style.display = 'none';
    }

    const logElement = document.createElement('div');
    const botColor = entry.bot === 1
      ? 'border-blue-400 text-blue-400'
      : entry.bot === 2
        ? 'border-green-400 text-green-400'
        : 'border-gray-400 text-gray-400';

    const botName = entry.bot ? `Bot ${entry.bot}` : 'System';
    const isError = entry.action.toLowerCase().includes('error') ||
                   entry.data.error ||
                   entry.data.status === 'error';

    const bgColor = isError ? 'bg-red-900/20 border-red-500' : 'bg-gray-700';
    logElement.className = `${bgColor} rounded-lg p-4 mb-3 border-l-4 ${botColor}`;

    let content = `
      <div class="flex justify-between items-center mb-2">
        <h4 class="font-semibold ${entry.bot ? botColor.split(' ')[1] : 'text-gray-300'}">${entry.action} ${entry.bot ? `(${botName})` : ''}</h4>
        <span class="text-xs text-gray-500">${entry.timestamp}</span>
      </div>
      <div class="text-sm text-gray-300 space-y-2">
    `;

    Object.entries(entry.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        let displayValue = value;
        if (typeof value === 'object') {
          displayValue = JSON.stringify(value, null, 2);
        }
        content += `<div><span class="text-gray-400">${key}:</span> <span class="font-mono text-xs">${displayValue}</span></div>`;
      }
    });

    content += '</div>';
    logElement.innerHTML = content;

    logContent.insertBefore(logElement, logContent.firstChild);

    const entries = logContent.querySelectorAll('div[class*="bg-gray-700"], div[class*="bg-red-900"]');
    if (entries.length > 50) {
      entries[entries.length - 1].remove();
    }
  } catch (e) {
    console.error('Failed to display log entry:', e);
  }
}

function clearLog() {
  logEntries = [];
  const entries = logContent.querySelectorAll('div[class*="bg-gray-700"], div[class*="bg-red-900"]');
  entries.forEach(entry => entry.remove());

  const emptyMessage = document.getElementById('emptyLogMessage');
  if (emptyMessage) {
    emptyMessage.style.display = 'block';
  }

  window.showAlert?.('Interaction log cleared.');
}

function toggleLog() {
  if (logSection.classList.contains('hidden')) {
    logSection.classList.remove('hidden');
    logArrow.textContent = '▲';
  } else {
    logSection.classList.add('hidden');
    logArrow.textContent = '▼';
  }
}

logToggleBtn?.addEventListener('click', toggleLog);
clearLogBtn?.addEventListener('click', clearLog);

export { addLogEntry, toggleLog };
