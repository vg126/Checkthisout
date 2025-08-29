import { multimodalModels } from '../data/models.js';

export function createModelSelector(botNumber, dom, showAlert) {
  const dropdown = dom[`multimodalDropdown${botNumber}`];
  const menu = dom[`multimodalMenu${botNumber}`];
  const arrow = dom[`multimodalArrow${botNumber}`];
  const selected = dom[`multimodalSelected${botNumber}`];

  const state = { isOpen: false, value: selected.textContent };
  let onOpenCallback = () => {};

  function buildMenu() {
    menu.innerHTML = '';
    Object.entries(multimodalModels).forEach(([category, models]) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'dropdown-category';
      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'px-3 py-2 text-xs font-semibold text-gray-400 bg-gray-600 border-b border-gray-500';
      categoryHeader.textContent = `📁 ${category}`;
      categoryDiv.appendChild(categoryHeader);

      if (Array.isArray(models)) {
        models.forEach(model => {
          const item = document.createElement('div');
          item.className = 'dropdown-item px-4 py-2 text-sm hover:bg-gray-600 cursor-pointer border-b border-gray-600';
          item.textContent = model;
          item.addEventListener('click', () => selectModel(model));
          categoryDiv.appendChild(item);
        });
      } else {
        Object.entries(models).forEach(([subcategory, submodels]) => {
          const subDiv = document.createElement('div');
          subDiv.className = 'dropdown-subcategory';
          const subHeader = document.createElement('div');
          subHeader.className = 'px-5 py-1 text-xs font-medium text-gray-300 bg-gray-650 border-b border-gray-600';
          subHeader.textContent = `📂 ${subcategory}`;
          subDiv.appendChild(subHeader);
          submodels.forEach(model => {
            const item = document.createElement('div');
            item.className = 'dropdown-item px-6 py-2 text-sm hover:bg-gray-600 cursor-pointer border-b border-gray-600';
            item.textContent = model;
            item.addEventListener('click', () => selectModel(model));
            subDiv.appendChild(item);
          });
          categoryDiv.appendChild(subDiv);
        });
      }
      menu.appendChild(categoryDiv);
    });
  }

  function open() {
    onOpenCallback();
    buildMenu();
    menu.classList.remove('hidden');
    arrow.classList.add('rotate-180');
    state.isOpen = true;
  }

  function close() {
    menu.classList.add('hidden');
    arrow.classList.remove('rotate-180');
    state.isOpen = false;
  }

  function toggle() {
    if (state.isOpen) {
      close();
    } else {
      open();
    }
  }

  function selectModel(model) {
    selected.textContent = model;
    state.value = model;
    close();
    if (showAlert) showAlert(`Selected ${model} for Bot ${botNumber}`);
  }

  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !dropdown.contains(e.target)) {
      close();
    }
  });

  return {
    getSelectedModel: () => state.value,
    setSelectedModel: (model) => {
      selected.textContent = model;
      state.value = model;
    },
    close,
    onOpen: (cb) => {
      onOpenCallback = cb;
    }
  };
}

