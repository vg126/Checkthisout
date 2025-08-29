const section = document.getElementById('analysisSection');
const container = document.getElementById('analysisResults');

export function showAnalysis() {
    section.classList.remove('hidden');
}

export function hideAnalysis() {
    section.classList.add('hidden');
    container.innerHTML = '';
}

export function renderAnalysisResult(data) {
    const analysisElement = document.createElement('div');
    const botColor = data.bot === 1 ? 'border-blue-400' : 'border-green-400';
    const botName = data.bot === 1 ? 'Bot 1' : 'Bot 2';

    analysisElement.className = `bg-gray-700 rounded-lg p-4 border-l-4 ${botColor}`;

    const scoreColor = data.score >= 80 ? 'text-green-400' : data.score >= 60 ? 'text-yellow-400' : 'text-red-400';

    analysisElement.innerHTML = `
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-semibold">🤖 ${botName} Analysis Result</h3>
                    <span class="text-2xl font-bold ${scoreColor}">${data.score}/100</span>
                </div>
                <div class="space-y-3 text-sm">
                    <div>
                        <div class="text-gray-400 mb-1">Original Prompt:</div>
                        <div class="text-gray-300 text-xs bg-gray-800 p-2 rounded">${data.originalPrompt}</div>
                    </div>
                    <div>
                        <div class="text-gray-400 mb-1">Analysis:</div>
                        <div class="text-gray-300 text-xs">${data.analysis}</div>
                    </div>
                    ${data.improvedPrompt ? `
                    <div>
                        <div class="text-gray-400 mb-1">Improved Prompt:</div>
                        <div class="text-gray-300 text-xs bg-gray-800 p-2 rounded">${data.improvedPrompt}</div>
                    </div>
                    ` : ''}
                </div>
            `;

    container.appendChild(analysisElement);
}
