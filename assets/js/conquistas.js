// Página de conquistas (index.html): monta os cards a partir de data/conquistas.json e cuida do checklist.
// Para mudar dicas, capítulos ou textos, edite data/conquistas.json — não este arquivo.
import { $, esc, lines, pad2, loadJSON, loadError, flash, store, read, readJSON, forget } from './lib/util.js';
import { renderLayout } from './lib/layout.js';
import { createChecklist, storeAsMap, collapsible } from './lib/checklist.js';
import { sourceIndex, srcLinks, renderSources } from './lib/fontes.js';
import { exportSave, importSave, initMoreMenu } from './lib/save.js';
import { PREFIX, HAS_ROTA } from './guia.config.js';

// Chaves de armazenamento — NÃO alterar depois de publicar, para manter o progresso já salvo.
const KEY = PREFIX + '-achievements-v1';
const FILTER_KEY = PREFIX + '-achievements-filter-v1';
const VIEW_KEY = PREFIX + '-achievements-view-v1';   // capítulos abertos/fechados na mão: { "capitulo-id": "open" | "closed" }
const SPOILER_KEY = PREFIX + '-spoilers-v1';

// Faixas de raridade pela % global da Steam
const RARITY = [[8, 'epic', 'Épica'], [15, 'rare', 'Rara'], [30, 'uncommon', 'Incomum'], [Infinity, 'common', 'Comum']];
const rarity = p => RARITY.find(([max]) => p < max);
const pct = p => p.toFixed(1).replace('.', ',') + '%';
const roman = n => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][n - 1] || String(n);
const DIFF = ['', 'Muito fácil', 'Fácil', 'Média', 'Difícil', 'Muito difícil'];

let data, fontes, rota = null;
try {
  [data, fontes] = await Promise.all([loadJSON('data/conquistas.json'), loadJSON('data/fontes.json')]);
  if (HAS_ROTA) rota = await loadJSON('data/rota.json').catch(() => null);
} catch (err) { renderLayout('conquistas'); loadError($('emptyState'), err); throw err; }

// Partes da rota (para o menu) e onde mora cada tarefa (para os links "Na rota")
const parts = [{ id: 'jornada', title: (rota && rota.mainTitle) || 'Jornada' }];
const taskInfo = {};
(rota ? rota.stages : []).forEach((st, i) => {
  if (st.part) parts.push({ id: st.part.id, title: st.part.title });
  st.tasks.forEach(t => { taskInfo[t.id] = { stage: i + 1, title: t.title }; });
});
renderLayout('conquistas', rota ? parts : []);
const srcIdx = sourceIndex(fontes);
const ach = data.achievements;

// =====================================================================
// RENDERIZAÇÃO
// =====================================================================
const strip = html => html.replace(/<[^>]+>/g, '');
const tpl = {
  diff: n => `<span class="diff" title="Dificuldade: ${DIFF[n]}" aria-label="Dificuldade: ${DIFF[n]}">${'●'.repeat(n)}<i>${'●'.repeat(5 - n)}</i></span>`,
  together: ids => `<span class="ach-extra"><b>Faça junto com:</b> ${ids.map(id => `<a href="#ach-${esc(id)}">${ach[id] ? ach[id].name : id}</a>`).join(', ')}</span>`,
  rota: ids => `<span class="ach-extra"><b>Na rota:</b> ${ids.map(id => taskInfo[id]
    ? `<a href="rota.html#${esc(id)}">etapa ${pad2(taskInfo[id].stage)} · ${esc(strip(taskInfo[id].title))}</a>` : esc(id)).join(', ')}</span>`,
  card: id => {
    const a = ach[id];
    const [, rc, rl] = rarity(a.pct);
    const spoil = a.spoiler || a.hidden;
    return `<label class="ach${spoil ? ' has-spoiler' : ''}" id="ach-${esc(id)}" data-rarity="${rc}"${a.missable ? ' data-missable="1"' : ''}>
 <input type="checkbox" data-id="${esc(id)}">
 <span class="ach-icon"><img src="assets/achievements/${id.toLowerCase()}.jpg" alt="" width="64" height="64" loading="lazy" decoding="async"></span>
 <span class="ach-copy">
  <span class="ach-name">${a.name}</span>
  <span class="ach-desc${spoil ? ' spoil' : ''}">${a.desc ? `“${a.desc}”` : 'Conquista oculta'}</span>
  ${a.missable ? `<span class="ach-missable"><b>⚠ Perdível:</b> ${a.missable === true ? 'pode ser perdida; veja a dica.' : a.missable}</span>` : ''}
  <span class="ach-tip${spoil ? ' spoil' : ''}">${a.tip}</span>
  ${a.together && a.together.length ? tpl.together(a.together) : ''}
  ${a.rota && a.rota.length ? tpl.rota(a.rota) : ''}
  <span class="meta"><span class="rar ${rc}">${rl} · ${pct(a.pct)}</span>${a.difficulty ? tpl.diff(a.difficulty) : ''}${a.time ? `<span class="tag">⏱ ${a.time}</span>` : ''}${a.solo ? '<span class="tag">Só 1 jogador</span>' : ''}${a.online ? '<span class="tag c-info">Online</span>' : ''}${spoil ? '<span class="tag spoil-tag">Spoiler</span>' : ''}</span>
  ${srcLinks(a.sources, srcIdx)}
 </span>
</label>`;
  },
  chapter: (c, i) => `<section class="chapter" id="${esc(c.id)}">
 <header class="chapter-head"><span class="chapter-num">${roman(i + 1)}</span><div><h2>${c.title}</h2><p>${c.subtitle}</p></div><span class="chapter-count">0/${c.achievements.length}</span></header>
 ${c.note ? `<div class="callout chapter-note">${c.note}</div>` : ''}
 <div class="grid">${lines(c.achievements.map(tpl.card))}</div>
</section>`,
  stat: (label, value, cls = '') => `<div class="ov-stat${cls}"><span>${label}</span><strong>${value}</strong></div>`,
};

function render() {
  $('chapters').innerHTML = lines(data.chapters.map(tpl.chapter));
  const ids = Object.keys(ach);
  $('achCount').textContent = ids.length;
  if (!rota) $('rotaLink').hidden = true;

  // {pct100}: % da conquista de 100% (completion), ou da mais rara como aproximação
  const done100 = ach[data.completion] || ids.map(id => ach[id]).sort((a, b) => a.pct - b.pct)[0];
  $('intro').innerHTML = (data.intro || '').replace('{pct100}', done100 ? pct(done100.pct) : '?');
  const [y, m, d] = data.updated.split('-');
  $('panelNote').textContent = `Raridade = % global de jogadores da Steam que desbloquearam, coletada em ${d}/${m}/${y}.`;

  const ov = data.overview;
  if (ov) {
    const missables = ids.filter(id => ach[id].missable).length;
    $('ovStats').innerHTML = [
      ov.difficulty && tpl.stat('Dificuldade', `${ov.difficulty}/10`),
      ov.hours && tpl.stat('Tempo para 100%', ov.hours),
      ov.playthroughs && tpl.stat('Jogadas', ov.playthroughs),
      tpl.stat('Perdíveis', missables, missables ? ' warn' : ''),
      ov.online && tpl.stat('Online', ov.online),
      ov.gameDifficulty && tpl.stat('Nível de dificuldade', ov.gameDifficulty),
    ].filter(Boolean).join('');
    $('ovSummary').innerHTML = ov.summary || '';
    $('overview').hidden = false;
  }
  if (data.roadmap && data.roadmap.length) {
    $('roadmapList').innerHTML = lines(data.roadmap.map(s => `<li><strong>${s.title}</strong><span>${s.text}</span>`
      + `${s.chapter ? `<a href="#${esc(s.chapter)}" class="road-link">Ver capítulo →</a>` : ''}${s.rota ? `<a href="rota.html#${esc(s.rota)}" class="road-link">Ver na rota →</a>` : ''}</li>`));
    $('roadmap').hidden = false;
  }

  const usage = {};
  ids.forEach(id => (ach[id].sources || []).forEach(s => { usage[s] = (usage[s] || 0) + 1; }));
  renderSources(fontes, usage);
}
render();

// =====================================================================
// COMPORTAMENTO
// =====================================================================
const boxes = [...document.querySelectorAll('.ach input[data-id]')];
const chapters = [...document.querySelectorAll('.chapter')];
const ring = $('ringFill'), C = 2 * Math.PI * 52;
ring.style.strokeDasharray = C;
const state = { filter: 'all', missable: false };

const list = createChecklist({
  boxes, groups: chapters, countSelector: '.chapter-count',
  itemOf: b => b.closest('.ach'),
  ...storeAsMap(KEY),
  keep: b => (state.filter === 'all' || (state.filter === 'done') === b.checked) && (!state.missable || b.closest('.ach').dataset.missable),
  emptyState: $('emptyState'),
  afterFilter: q => { if (q || state.missable) chapters.forEach(c => { if (!c.hidden) collapse.show(c, false); }); else collapse.refresh(); },
  onUpdate: () => {
    const { done, total } = list.stats();
    $('ringPct').textContent = (total ? Math.round(done / total * 100) : 0) + '%';
    $('ringSub').textContent = `${done}/${total}`;
    ring.style.strokeDashoffset = C * (1 - (total ? done / total : 0));
    RARITY.forEach(([, r]) => {
      const s = list.stats(boxes.filter(b => b.closest('.ach').dataset.rarity === r));
      $('r-' + r).textContent = `${s.done}/${s.total}`;
    });
  },
});

// Capítulos: os concluídos se fecham sozinhos, salvo escolha do usuário
const view = readJSON(VIEW_KEY, {});
const collapse = collapsible({
  groups: chapters, headSelector: '.chapter-head',
  isCollapsed: c => view[c.id] ? view[c.id] === 'closed' : c.classList.contains('complete'),
  onToggle: (c, closed) => { view[c.id] = closed ? 'closed' : 'open'; store(VIEW_KEY, JSON.stringify(view)); },
});
boxes.forEach(b => b.addEventListener('change', () => { if (!list.query) collapse.refresh(); }));

// Ir até uma conquista (Próxima pendente, links "Faça junto com", endereço #ach-ID)
function goTo(card) {
  if (card.hidden) { $('searchInput').value = ''; list.clearQuery(); state.missable = false; syncMissable(); setFilter('all', true); }
  collapse.show(card.closest('.chapter'), false);
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  flash(card);
}
$('continueBtn').addEventListener('click', () => {
  const next = boxes.find(b => !b.checked);
  if (next) goTo(next.closest('.ach'));
});
function fromHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  const el = h && document.getElementById(h);
  if (!el) return;
  if (el.classList.contains('ach')) goTo(el);
  else if (el.classList.contains('chapter')) { collapse.show(el, false); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}
window.addEventListener('hashchange', fromHash);

// --- Filtros, busca, perdíveis, spoilers ---
function setFilter(f, persist) {
  state.filter = f;
  document.querySelectorAll('.segmented button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
  if (persist) store(FILTER_KEY, f);
  list.filter();
}
document.querySelectorAll('.segmented button').forEach(b => b.addEventListener('click', () => setFilter(b.dataset.filter, true)));
$('searchInput').addEventListener('input', e => list.setQuery(e.target.value));
const syncMissable = () => $('missableBtn').setAttribute('aria-pressed', String(state.missable));
$('missableBtn').addEventListener('click', () => { state.missable = !state.missable; syncMissable(); list.filter(); });
if (!document.querySelector('[data-missable]')) $('missableBtn').hidden = true;

const setSpoilers = on => {
  document.body.classList.toggle('show-spoilers', on);
  $('spoilerBtn').setAttribute('aria-pressed', String(on));
  store(SPOILER_KEY, on ? '1' : '0');
};
$('spoilerBtn').addEventListener('click', () => setSpoilers(!document.body.classList.contains('show-spoilers')));
if (!document.querySelector('.has-spoiler')) $('spoilerBtn').hidden = true;

// --- Menu ⋯ ---
initMoreMenu($('moreMenu'));
$('printBtn').addEventListener('click', () => window.print());
$('exportBtn').addEventListener('click', exportSave);
$('importBtn').addEventListener('click', importSave);
$('resetBtn').addEventListener('click', () => {
  if (confirm('Deseja limpar todas as conquistas marcadas?')) { list.reset(); forget(KEY); collapse.refresh(); }
});

// --- Início ---
const savedFilter = read(FILTER_KEY);
setSpoilers(read(SPOILER_KEY) === '1');
setFilter(savedFilter === 'pending' || savedFilter === 'done' ? savedFilter : 'all', false);
list.update();
collapse.refresh();
fromHash();
