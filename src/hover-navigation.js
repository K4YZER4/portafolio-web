const tree = document.getElementById('tree');
let hoverTimer;

function openOnHover(element) {
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => {
    if (element.matches('summary')) {
      const folder = element.closest('details');
      if (folder) folder.open = true;
      return;
    }

    if (element.matches('a.file') && !element.classList.contains('active')) {
      element.click();
    }
  }, 120);
}

tree?.addEventListener('pointerover', (event) => {
  if (event.pointerType === 'touch') return;
  const target = event.target.closest('summary, a.file');
  if (target && tree.contains(target)) openOnHover(target);
});

tree?.addEventListener('pointerleave', () => clearTimeout(hoverTimer));
