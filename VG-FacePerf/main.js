import ResponsePanel from './components/responsePanel.js';

const bot1PanelEl = document.getElementById('bot1-panel');
const bot2PanelEl = document.getElementById('bot2-panel');

const bot1Panel = new ResponsePanel(bot1PanelEl, {
  onTransfer: (text) => console.log('Bot 1 transfer:', text)
});

const bot2Panel = new ResponsePanel(bot2PanelEl, {
  onTransfer: (text) => console.log('Bot 2 transfer:', text)
});

bot1Panel.setContent('');
bot2Panel.setContent('');

export { bot1Panel, bot2Panel };
