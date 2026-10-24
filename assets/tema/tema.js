// TEMA do guia de Age of Empires II: DE — "A Tapeçaria" (conceito 3, docs/pranchas/conceito-3.html).
// O guia é uma tapeçaria bordada, como a de Bayeux: os capítulos são cenas de uma faixa,
// cada conquista é um retalho de linho e marcar é "bordar" (a costura tracejada fecha).
// Cada função recebe os dados de uma peça e devolve o HTML; contrato em references/motor.md da skill.

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fios = fs => fs.map(f => f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.rotulo)}</a>` : `<span>${esc(f.rotulo)}</span>`).join(' · ');
const ROMANO = n => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'][n - 1] || String(n);
const LAS = { epic: 'Anil', rare: 'Sálvia', uncommon: 'Ocre', common: 'Terracota' };   // a lã de cada raridade

export default {
  cores: { dark: '#16110c', light: '#d9cdb2' },

  // ---------------------------------------------------------------- casca: a barra bordada do topo
  casca: ({ links, marca, rodape }) => ({
    topo: `<div class="barra">
 <a class="marca" href="index.html"><span class="marca-no" aria-hidden="true">✚</span><span>${esc(marca)}</span></a>
 ${links.length > 1 ? `<button type="button" class="botao-menu" data-g="abrir-menu" aria-expanded="false">☰</button>
 <nav class="nav" data-g="nav" aria-label="Navegação principal">${links.map(l => `<a href="${l.href}"${l.atual ? ' aria-current="page"' : ''}>${esc(l.rotulo)}</a>`).join('')}</nav>` : ''}
 <button type="button" class="botao-tema" data-g="alternar-tema" aria-label="Alternar tema"><span class="so-escuro">☀ Linho cru</span><span class="so-claro">☾ Luz de tocha</span></button>
</div>`,
    rodape: `<div class="barra-rodape" aria-hidden="true"></div><p>${rodape}</p>`,
  }),

  // ---------------------------------------------------------------- conquista: um retalho de linho
  conquista: c => `<article class="retalho" data-g="conquista" id="ach-${esc(c.id)}">
 <div class="retalho-cab">
  <img src="${c.icone}" alt="" width="56" height="56" loading="lazy" decoding="async">
  <h3>${c.nome}</h3>
 </div>
 <p class="retalho-desc"${c.spoiler ? ' data-g-spoiler' : ''}>${c.desc ? `“${c.desc}”` : 'Conquista oculta'}</p>
 ${c.perdivel ? `<p class="retalho-perdivel"><b>Fio solto:</b> ${c.perdivel}</p>` : ''}
 <p class="retalho-dica"${c.spoiler ? ' data-g-spoiler' : ''}>${c.dica}</p>
 ${c.junto.length ? `<p class="retalho-extra"><b>Borde junto:</b> ${c.junto.map(j => `<a href="${j.href}">${j.nome}</a>`).join(', ')}</p>` : ''}
 <div class="retalho-fios">
  <span class="la">${LAS[c.raridade.chave]} · ${c.raridade.rotulo} · ${c.raridade.pct}</span>
  ${c.dificuldade ? `<span title="Dificuldade: ${c.dificuldade.rotulo}">dificuldade ${c.dificuldade.n}/5</span>` : ''}
  ${c.tempo ? `<span>${c.tempo}</span>` : ''}${c.online ? '<span>online</span>' : ''}${c.solo ? '<span>só 1 jogador</span>' : ''}
  ${c.spoiler ? '<span>spoiler</span>' : ''}
 </div>
 ${c.linhaFontes}
 <label class="agulha"><input type="checkbox" data-id="${esc(c.id)}"><span class="g-sr">Bordar ${c.nome}</span></label>
</article>`,

  // ---------------------------------------------------------------- capítulo: uma cena da tapeçaria
  capitulo: c => `<section class="cena" data-g="capitulo" id="${esc(c.id)}">
 <header class="cena-cab" data-g="cabeca">
  <span class="cena-num" aria-hidden="true">${ROMANO(c.n)}</span>
  <div><small class="legenda">Cena ${ROMANO(c.n)} · <span data-g="contagem">0/${c.total}</span> bordadas</small>
   <h2>${c.titulo}</h2><p>${c.subtitulo}</p></div>
  <span class="cena-seta" aria-hidden="true">▾</span>
 </header>
 <div class="cena-corpo" data-g="corpo">
  ${c.nota ? `<p class="cena-nota">${c.nota}</p>` : ''}
  <div class="retalhos">${c.cartoes}</div>
 </div>
</section>`,

  // ---------------------------------------------------------------- resumo e roteiro
  resumo: r => `<dl class="etiquetas">
 ${[['Dificuldade', r.dificuldade && `${r.dificuldade}/10`], ['Tempo para o 100%', r.horas], ['Jogadas', r.jogadas], ['Fios soltos (perdíveis)', r.perdiveis],
    ['Online', r.online], ['Nível de dificuldade', r.nivel]].filter(([, v]) => v !== undefined && v !== '' && v !== null)
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
</dl>${r.resumo ? `<p class="resumo-texto">${r.resumo}</p>` : ''}`,
  roteiro: passos => `<ol class="roteiro">${passos.map((p, i) => `<li><span class="roteiro-n" aria-hidden="true">${ROMANO(i + 1)}</span><div><strong>${p.titulo}</strong><p>${p.texto}</p>${p.capitulo ? `<a href="${p.capitulo}">Ir à cena →</a>` : ''}</div></li>`).join('')}</ol>`,

  // ---------------------------------------------------------------- fontes: as notas do bordador
  linhaFontes: fs => fs.length ? `<p class="retalho-fontes">Fontes: ${fios(fs)}</p>` : '',
  fontes: lista => `<ul class="notas">${lista.map(s => `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.titulo)}</a>` : `<strong>${esc(s.titulo)}</strong>`}${s.sobre ? `: ${s.sobre}` : ''}${s.usos ? ` <small>(${s.usos} dicas)</small>` : ''}</li>`).join('')}</ul>`,
  confirmar: pontos => `<ul class="notas">${pontos.map(p => `<li>${p.texto}${p.fontes.length ? ` <small>${fios(p.fontes)}</small>` : ''}</li>`).join('')}</ul>`,

  // ---------------------------------------------------------------- progresso: o fio da barra, as cenas e as meadas de lã
  progresso: p => {
    document.querySelectorAll('[data-feitas]').forEach(el => { el.textContent = `${p.feitas}/${p.total}`; });
    document.querySelectorAll('[data-pct]').forEach(el => { el.textContent = p.pct + '%'; });
    // A faixa de cenas: montada uma vez a partir dos capítulos da página
    const faixa = document.querySelector('.cenas');
    if (faixa && p.capitulos) {
      if (!faixa.children.length) {
        faixa.innerHTML = p.capitulos.map((c, i) => {
          const h2 = document.querySelector(`#${CSS.escape(c.id)} h2`);
          return `<a class="mini-cena" href="#${c.id}" data-cena="${c.id}" title="Cena ${ROMANO(i + 1)}: ${esc(h2 ? h2.textContent : c.id)}"><span>${ROMANO(i + 1)}</span></a>`;
        }).join('');
      }
      const atual = p.capitulos.find(c => c.feitas < c.total);
      p.capitulos.forEach(c => {
        const el = faixa.querySelector(`[data-cena="${CSS.escape(c.id)}"]`);
        if (!el) return;
        el.style.setProperty('--g-progresso', c.total ? c.feitas / c.total : 0);
        el.toggleAttribute('data-bordada', c.total > 0 && c.feitas === c.total);
        el.toggleAttribute('data-atual', c === atual);
      });
    }
    (p.raridade || []).forEach(r => {
      document.querySelectorAll(`[data-meada="${r.chave}"]`).forEach(el => {
        el.querySelector('b').textContent = `${r.feitas}/${r.total}`;
        el.style.setProperty('--g-progresso', r.total ? r.feitas / r.total : 0);
      });
    });
  },
};
