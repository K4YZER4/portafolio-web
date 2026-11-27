const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const LIVE_SVG_URL = 'https://raw.githubusercontent.com/K4YZER4/K4YZER4/main/assets/code-city.svg';
let liveActivityPromise = null;

function parseSvgActivity(svgText) {
  const byDate = new Map();
  for (const match of svgText.matchAll(/<title>(\d{4}-\d{2}-\d{2}):\s*(\d+)/g)) {
    byDate.set(match[1], Number(match[2]));
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

function fetchLiveActivity() {
  if (!liveActivityPromise) {
    liveActivityPromise = fetch(LIVE_SVG_URL, { cache: 'no-store' })
      .then((res) => (res.ok ? res.text() : ''))
      .then((svgText) => {
        const parsed = parseSvgActivity(svgText);
        return parsed.length ? parsed : null;
      })
      .catch(() => null);
  }
  return liveActivityPromise;
}

function getActivityData() {
  return [...document.querySelectorAll('.activitysvg title')].map((title) => {
    const match = title.textContent.match(/^(.*?):\s*(\d+)/);
    return match ? { date: match[1], count: Number(match[2]) } : null;
  }).filter(Boolean);
}

function updateSummaryMetrics(documentView, data) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const active = data.filter((item) => item.count > 0).length;
  const cards = documentView?.querySelectorAll('.metrics .metric strong');
  if (cards && cards.length >= 2) {
    cards[0].textContent = String(total);
    cards[1].textContent = String(active);
  }
  return { total, active };
}

function renderRadar() {
  if (location.hash.slice(1) !== 'activity') return;
  const documentView = document.getElementById('document');
  const oldSection = documentView?.querySelector('.section:has(.activitysvg)');
  if (!oldSection || oldSection.dataset.radarReady === 'true') return;

  let data = getActivityData();
  if (!data.length) return;
  const { total, active } = updateSummaryMetrics(documentView, data);
  oldSection.outerHTML = `<div class="radar-card"><div class="canvas-wrap" id="radarWrap"><div class="hud-telemetry"><div>ORBITAL ARRAY: <strong>52 WEEKS / 7 DAYS</strong></div><div>SYSTEM: <strong>GITHUB CONTRIBUTION SONAR</strong></div></div><div class="hud-scanner-info"><div>SCAN DATE: <strong id="scanDate">---</strong></div><div>ANGULAR COORD: <strong id="scanAngle">0°</strong></div></div><canvas id="radarCanvas"></canvas><div class="radar-tooltip" id="radarTip"></div></div><div class="card-bottom"><div class="stat-group"><span>Range: <strong id="radarRange">${data[0].date} — ${data.at(-1).date}</strong></span><span>Contributions: <strong id="radarTotal">${total}</strong></span><span>Active days: <strong id="radarActive">${active} / ${data.length}</strong></span></div><div class="legend"><span>0</span><span class="legend-dot" style="background:#202020"></span><span class="legend-dot" style="background:#777"></span><span class="legend-dot" style="background:#bbb"></span><span class="legend-dot" style="background:#fff;box-shadow:0 0 6px #fff8"></span><span>10+ commits</span></div></div></div>`;

  const wrap = document.getElementById('radarWrap');
  const canvas = document.getElementById('radarCanvas');
  const tip = document.getElementById('radarTip');
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, dpr = 1, sweep = -Math.PI / 2, nodes = [], mouse = { x: -1000, y: -1000 };

  function resize() {
    if (!wrap.isConnected) return;
    dpr = window.devicePixelRatio || 1;
    width = wrap.clientWidth;
    height = wrap.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const centerX = width / 2, centerY = height / 2;
    const maxRadius = Math.min(width, height) * .38;
    const minRadius = maxRadius * .28;
    const step = (maxRadius - minRadius) / 6;
    nodes = data.map((item, index) => {
      const angle = -Math.PI / 2 + (index / data.length) * Math.PI * 2;
      const radius = minRadius + (index % 7) * step;
      return { ...item, angle, x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius, radius };
    });
  }

  function draw() {
    if (!canvas.isConnected) return;
    const centerX = width / 2, centerY = height / 2;
    const maxRadius = Math.min(width, height) * .38;
    const minRadius = maxRadius * .28;
    const step = (maxRadius - minRadius) / 6;
    sweep += .012;
    if (sweep > Math.PI * 1.5) sweep = -Math.PI * .5;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255,255,255,.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - maxRadius * 1.25, centerY); ctx.lineTo(centerX + maxRadius * 1.25, centerY);
    ctx.moveTo(centerX, centerY - maxRadius * 1.25); ctx.lineTo(centerX, centerY + maxRadius * 1.25); ctx.stroke();
    for (let i = 0; i < 7; i += 1) { ctx.beginPath(); ctx.arc(centerX, centerY, minRadius + i * step, 0, Math.PI * 2); ctx.strokeStyle = i === 0 || i === 6 ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.045)'; ctx.stroke(); }
    ctx.beginPath(); ctx.arc(centerX, centerY, maxRadius + 18, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.stroke();
    for (let degree = 0; degree < 360; degree += 5) { const angle = degree * Math.PI / 180; const major = degree % 30 === 0; const inner = maxRadius + 18; const outer = inner + (major ? 8 : 4); ctx.beginPath(); ctx.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner); ctx.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer); ctx.strokeStyle = major ? 'rgba(255,255,255,.32)' : 'rgba(255,255,255,.1)'; ctx.stroke(); }
    ctx.font = '9px ui-monospace,monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    data.forEach((item, index) => { if (index === 0 || item.date.slice(5, 7) !== data[index - 1].date.slice(5, 7)) { const angle = -Math.PI / 2 + (index / data.length) * Math.PI * 2; ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillText(MONTHS[Number(item.date.slice(5, 7)) - 1], centerX + Math.cos(angle) * (maxRadius + 34), centerY + Math.sin(angle) * (maxRadius + 34)); } });
    const normalizedSweep = (sweep + Math.PI * 2) % (Math.PI * 2);
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 1.1); gradient.addColorStop(0, 'rgba(255,255,255,.12)'); gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient; ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.arc(centerX, centerY, maxRadius * 1.1, sweep - .35, sweep); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(centerX + Math.cos(sweep) * (maxRadius + 28), centerY + Math.sin(sweep) * (maxRadius + 28)); ctx.strokeStyle = 'rgba(255,255,255,.65)'; ctx.stroke();
    nodes.forEach((node) => { const angle = (node.angle - normalizedSweep + Math.PI * 2) % (Math.PI * 2); const nearBeam = angle < .08 || angle > Math.PI * 2 - .08; const radius = node.count ? 2 + Math.sqrt(node.count / 32) * 5 : 1.4; ctx.beginPath(); ctx.arc(node.x, node.y, radius + (nearBeam ? 2 : 0), 0, Math.PI * 2); ctx.fillStyle = node.count ? (nearBeam ? '#fff' : '#bdbdbd') : 'rgba(255,255,255,.13)'; ctx.shadowBlur = nearBeam && node.count ? 12 : 0; ctx.shadowColor = '#fff'; ctx.fill(); ctx.shadowBlur = 0; });
    const hit = nodes.find((node) => Math.hypot(node.x - mouse.x, node.y - mouse.y) < 13);
    if (hit) { tip.innerHTML = `<strong>${hit.count} contributions</strong><div>${hit.date}</div>`; tip.style.left = `${hit.x}px`; tip.style.top = `${hit.y}px`; tip.classList.add('visible'); } else tip.classList.remove('visible');
    const scanDate = nodes.reduce((closest, node) => Math.abs(((node.angle - normalizedSweep + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < Math.abs(((closest.angle - normalizedSweep + Math.PI * 3) % (Math.PI * 2)) - Math.PI) ? node : closest, nodes[0]);
    document.getElementById('scanDate').textContent = scanDate.date; document.getElementById('scanAngle').textContent = `${Math.round(normalizedSweep * 180 / Math.PI)}°`;
    requestAnimationFrame(draw);
  }
  canvas.addEventListener('mousemove', (event) => { const rect = canvas.getBoundingClientRect(); mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top }; });
  canvas.addEventListener('mouseleave', () => { mouse = { x: -1000, y: -1000 }; });
  new ResizeObserver(resize).observe(wrap); resize(); draw();

  fetchLiveActivity().then((liveData) => {
    if (!liveData || !wrap.isConnected) return;
    data = liveData;
    const stats = updateSummaryMetrics(documentView, data);
    const rangeEl = document.getElementById('radarRange');
    const totalEl = document.getElementById('radarTotal');
    const activeEl = document.getElementById('radarActive');
    if (rangeEl) rangeEl.textContent = `${data[0].date} — ${data.at(-1).date}`;
    if (totalEl) totalEl.textContent = String(stats.total);
    if (activeEl) activeEl.textContent = `${stats.active} / ${data.length}`;
    resize();
  });
}

const radarObserver = new MutationObserver(renderRadar);
radarObserver.observe(document.body, { childList: true, subtree: true });
renderRadar();
