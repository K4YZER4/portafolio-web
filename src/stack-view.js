const technologies = [
  ['TypeScript', 'Backend', 'typescript'], ['JavaScript', 'Backend', 'javascript'], ['Node.js', 'Backend', 'nodedotjs'], ['NestJS', 'Backend', 'nestjs'], ['Express', 'Backend', 'express'], ['Socket.IO', 'Backend', 'socketdotio'], ['Zod', 'Backend', 'zod'], ['Stripe', 'Backend', 'stripe'],
  ['PostgreSQL', 'Data & ORM', 'postgresql'], ['Prisma', 'Data & ORM', 'prisma'], ['Supabase', 'Data & ORM', 'supabase'], ['Neon', 'Data & ORM', 'neon'],
  ['Jest', 'Testing & Docs', 'jest'], ['Swagger / OpenAPI', 'Testing & Docs', 'swagger'],
  ['Docker', 'Cloud & Infra', 'docker'], ['Docker Compose', 'Cloud & Infra', 'docker'], ['Nginx', 'Cloud & Infra', 'nginx'], ['AWS', 'Cloud & Infra', 'aws'], ['Render', 'Cloud & Infra', 'render'], ['Vercel', 'Cloud & Infra', 'vercel'],
  ['Git', 'Tools', 'git'], ['GitHub', 'Tools', 'github'], ['GitHub Actions', 'Tools', 'githubactions'],
];

const groups = ['All', ...new Set(technologies.map(([, group]) => group))];

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

function renderStack(category = 'All') {
  const documentView = document.getElementById('document');
  if (!documentView || location.hash.slice(1) !== 'stack') return;
  const stackWindow = documentView.querySelector('.stack-canvas');
  const codebox = documentView.querySelector('.codebox');
  if (!stackWindow && !codebox) return;
  if (stackWindow && documentView.dataset.stackEnhanced === 'true') return;
  const paper = documentView.querySelector('.paper');
  if (!paper) return;

  const filtered = category === 'All' ? technologies : technologies.filter(([, group]) => group === category);
  if (stackWindow) {
    const scrollTop = documentView.scrollTop;
    const scrollLeft = documentView.scrollLeft;
    const tabs = stackWindow.querySelector('.stack-tabs');
    const grid = stackWindow.querySelector('.stack-grid');
    const count = stackWindow.querySelector('.stack-count');
    tabs.innerHTML = groups.map((group) => `<button type="button" class="${group === category ? 'active' : ''}" data-stack-group="${group}" aria-pressed="${group === category}">${group}</button>`).join('');
    grid.innerHTML = filtered.map(([name, , slug]) => `<div class="stack-tech"><span class="stack-logo-wrap"><img class="stack-logo" src="${logoUrl(slug)}" alt="" width="20" height="20" loading="lazy" /><span class="stack-missing" hidden aria-hidden="true">◇</span></span><span>${name}</span></div>`).join('');
    count.textContent = `${filtered.length} technologies / ${category}`;
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

  paper.innerHTML = `<h1>My tech<br><em>stack.</em></h1><section class="stack-section"><div class="stack-canvas"><div class="stack-panel"><nav class="stack-tabs" aria-label="Filter technologies">${groups.map((group) => `<button type="button" class="${group === category ? 'active' : ''}" data-stack-group="${group}" aria-pressed="${group === category}">${group}</button>`).join('')}</nav><div class="stack-grid">${filtered.map(([name, , slug]) => `<div class="stack-tech"><span class="stack-logo-wrap"><img class="stack-logo" src="${logoUrl(slug)}" alt="" width="20" height="20" loading="lazy" /><span class="stack-missing" hidden aria-hidden="true">◇</span></span><span>${name}</span></div>`).join('')}</div><div class="stack-count" role="status" aria-live="polite">${filtered.length} technologies / ${category}</div></div></div></section>`;
  bindStackControls(documentView);
  documentView.dataset.stackEnhanced = 'true';
}

const observer = new MutationObserver(() => renderStack());
observer.observe(document.body, { childList: true, subtree: true });
renderStack();
