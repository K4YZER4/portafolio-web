const technologies = [
  ['JavaScript', 'Backend', 'javascript'], ['TypeScript', 'Backend', 'typescript'], ['Node.js', 'Backend', 'nodedotjs'], ['NestJS', 'Backend', 'nestjs'], ['Express', 'Backend', 'express'],
  ['PostgreSQL', 'Datos y ORM', 'postgresql'], ['Prisma', 'Datos y ORM', 'prisma'], ['Supabase', 'Datos y ORM', 'supabase'], ['Neon', 'Datos y ORM', 'neon'],
  ['Jest', 'Testing', 'jest'], ['Swagger / OpenAPI', 'Testing', 'swagger'],
  ['Docker', 'Cloud', 'docker'], ['Docker Compose', 'Cloud', 'docker'], ['AWS', 'Cloud', 'aws'], ['Render', 'Cloud', 'render'], ['Vercel', 'Cloud', 'vercel'],
  ['Git', 'Herramientas', 'git'], ['GitHub', 'Herramientas', 'github'], ['GitHub Actions', 'Herramientas', 'githubactions'],
];

const groups = ['Todos', ...new Set(technologies.map(([, group]) => group))];

function logoUrl(slug) {
  if (slug === 'aws') return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHRleHQgeD0iMSIgeT0iMTQiIGZpbGw9IiNlNmVkZjMiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9ImJvbGQiPmF3czwvdGV4dD48cGF0aCBkPSJNMyAxN1ExMiAyMiAyMSAxNk0xOCAxNmgzdjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U2ZWRmMyIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48L3N2Zz4=';
  return `https://cdn.simpleicons.org/${slug}/DCE2EB`;
}

function bindStackControls(documentView) {
  documentView.querySelectorAll('[data-stack-group]').forEach((button) => {
    button.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return;
      documentView.dataset.stackEnhanced = 'false';
      renderStack(button.dataset.stackGroup);
    });
    button.addEventListener('click', () => {
      documentView.dataset.stackEnhanced = 'false';
      renderStack(button.dataset.stackGroup);
    });
  });
  documentView.querySelectorAll('.stack-logo').forEach((image) => {
    image.addEventListener('error', () => {
      image.hidden = true;
      image.nextElementSibling.hidden = false;
    });
  });
}

function renderStack(category = 'Todos') {
  const documentView = document.getElementById('document');
  if (!documentView || location.hash.slice(1) !== 'stack') return;
  const stackWindow = documentView.querySelector('.stack-canvas');
  const codebox = documentView.querySelector('.codebox');
  if (!stackWindow && !codebox) return;
  if (stackWindow && documentView.dataset.stackEnhanced === 'true') return;
  const paper = documentView.querySelector('.paper');
  if (!paper) return;

  const filtered = category === 'Todos' ? technologies : technologies.filter(([, group]) => group === category);
  if (stackWindow) {
    const scrollTop = documentView.scrollTop;
    const scrollLeft = documentView.scrollLeft;
    const tabs = stackWindow.querySelector('.stack-tabs');
    const grid = stackWindow.querySelector('.stack-grid');
    const count = stackWindow.querySelector('.stack-count');
    tabs.innerHTML = groups.map((group) => `<button type="button" class="${group === category ? 'active' : ''}" data-stack-group="${group}" aria-pressed="${group === category}">${group}</button>`).join('');
    grid.innerHTML = filtered.map(([name, , slug]) => `<div class="stack-tech"><span class="stack-logo-wrap"><img class="stack-logo" src="${logoUrl(slug)}" alt="" width="20" height="20" loading="lazy" /><span class="stack-missing" hidden aria-hidden="true">◇</span></span><span>${name}</span></div>`).join('');
    count.textContent = `${filtered.length} tecnologías / ${category}`;
    documentView.scrollTop = scrollTop;
    documentView.scrollLeft = scrollLeft;
    requestAnimationFrame(() => {
      documentView.scrollTop = scrollTop;
      documentView.scrollLeft = scrollLeft;
    });
    bindStackControls(documentView);
    documentView.dataset.stackEnhanced = 'true';
    return;
  }

  paper.innerHTML = `<div class="filelabel">stack.json<span class="tag">JSON</span></div><div class="eyebrow">CONFIG / STACK.JSON</div><h1>Mi stack<br><em>de trabajo.</em></h1><section class="stack-section"><div class="stack-canvas"><div class="stack-panel"><nav class="stack-tabs" aria-label="Filtrar tecnologías">${groups.map((group) => `<button type="button" class="${group === category ? 'active' : ''}" data-stack-group="${group}" aria-pressed="${group === category}">${group}</button>`).join('')}</nav><div class="stack-grid">${filtered.map(([name, , slug]) => `<div class="stack-tech"><span class="stack-logo-wrap"><img class="stack-logo" src="${logoUrl(slug)}" alt="" width="20" height="20" loading="lazy" /><span class="stack-missing" hidden aria-hidden="true">◇</span></span><span>${name}</span></div>`).join('')}</div><div class="stack-count" role="status" aria-live="polite">${filtered.length} tecnologías / ${category}</div></div></div></section>`;
  bindStackControls(documentView);
  documentView.dataset.stackEnhanced = 'true';
}

const observer = new MutationObserver(() => renderStack());
observer.observe(document.body, { childList: true, subtree: true });
renderStack();
