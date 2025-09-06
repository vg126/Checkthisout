export default class ResponsePanel {
  constructor(root, options = {}) {
    this.root = root;
    this.contentEl = root.querySelector('.response-content');
    this.copyBtn = root.querySelector('.copy-btn');
    this.transferBtn = root.querySelector('.transfer-btn');
    this.collapseBtn = root.querySelector('.collapse-btn');
    this.onTransfer = options.onTransfer;

    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.copy());
    }
    if (this.transferBtn) {
      this.transferBtn.addEventListener('click', () => this.transfer());
    }
    if (this.collapseBtn) {
      this.collapseBtn.addEventListener('click', () => this.toggleCollapse());
    }
  }

  setContent(text) {
    if (this.contentEl) {
      this.contentEl.textContent = text;
    }
  }

  copy() {
    const text = this.contentEl ? this.contentEl.textContent : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  transfer() {
    const text = this.contentEl ? this.contentEl.textContent : '';
    if (typeof this.onTransfer === 'function') {
      this.onTransfer(text);
    }
  }

  toggleCollapse() {
    this.root.classList.toggle('collapsed');
  }
}
