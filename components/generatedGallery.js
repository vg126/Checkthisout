class GeneratedGallery {
  constructor(rootSelector) {
    this.root = typeof rootSelector === 'string' ? document.querySelector(rootSelector) : rootSelector;
    if (!this.root) {
      throw new Error('GeneratedGallery requires a valid root element or selector');
    }
    this.generatedImages = [];
    this.render();
  }

  // Adds an image to the gallery and re-renders
  addImage(src, name) {
    this.generatedImages.push({ src, name });
    this.render();
  }

  // Re-renders the gallery DOM
  render() {
    // Clear existing content
    this.root.innerHTML = '';

    this.generatedImages.forEach((img, index) => {
      const container = document.createElement('div');
      const imageEl = document.createElement('img');
      imageEl.src = img.src;
      imageEl.alt = img.name || `Generated Image ${index + 1}`;
      imageEl.style.maxWidth = '100%';
      container.appendChild(imageEl);
      this.root.appendChild(container);
    });
  }

  // Downloads all images in the gallery sequentially
  downloadAll() {
    this.generatedImages.forEach((img, index) => {
      const link = document.createElement('a');
      link.href = img.src;
      link.download = img.name || `generated-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Clears the gallery and underlying array
  clear() {
    this.generatedImages = [];
    this.render();
  }
}

export default GeneratedGallery;
