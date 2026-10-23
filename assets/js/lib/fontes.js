// Fontes e pontos a confirmar (data/fontes.json), compartilhados pelas duas páginas.
// Cada dica/tarefa cita as fontes pelo "id"; aqui elas viram links curtos e a lista completa.
import { $, esc, lines } from './util.js';

export function sourceIndex(fontes) {
  return Object.fromEntries((fontes.sources || []).map(s => [s.id, s]));
}

// Linha curta "Fontes: IGN · Steam (guia 100%)" para o fim de uma dica
export function srcLinks(ids, index) {
  if (!ids || !ids.length) return '';
  const links = ids.map(id => {
    const s = index[id];
    if (!s) return '';
    const label = esc(s.short || s.title);
    return s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${label}</a>` : `<span>${label}</span>`;
  }).filter(Boolean);
  return links.length ? `<span class="src-line">Fontes: ${links.join(' · ')}</span>` : '';
}

// Lista completa no fim da página, com quantas dicas usam cada fonte
export function renderSources(fontes, usage = {}) {
  const src = fontes.sources || [], confirm = fontes.confirm || [];
  const index = sourceIndex(fontes);
  $('sourceList').innerHTML = lines(src.map(s => {
    const title = s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>` : `<strong>${esc(s.title)}</strong>`;
    const n = usage[s.id] || 0;
    return `<li>${title}${s.about ? `: <span class="src-about">${s.about}</span>` : ''}${n ? ` <span class="src-used">(${n})</span>` : ''}</li>`;
  }));
  $('sourceCount').textContent = src.length;
  $('confirmList').innerHTML = lines(confirm.map(c => `<li>${c.text}${c.sources ? ' ' + srcLinks(c.sources, index) : ''}</li>`));
  $('confirmCount').textContent = confirm.length;
  if (!confirm.length) $('confirmFold').hidden = true;
}
