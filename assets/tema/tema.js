// TEMA do guia de Age of Empires II: DE — "O Painel da Árvore" (conceito 5, docs/pranchas/conceito-5.html).
// A interface do jogo manda: a página é a árvore de tecnologia (Eras, edifícios, nós a pesquisar),
// e a tapeçaria entra como a crônica do avanço: a faixa das 20 cenas bordadas e a costura que fecha no nó pesquisado.
// Cada função recebe os dados de uma peça e devolve o HTML; contrato em references/motor.md da skill.

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const links = fs => fs.map(f => f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.rotulo)}</a>` : `<span>${esc(f.rotulo)}</span>`).join(' · ');
const ROMANO = n => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'][n - 1] || String(n);
// As quatro Eras do jogo como faixas de progresso
const ERAS = [['Era das', 'Trevas', 0], ['Era', 'Feudal', 25], ['Era dos', 'Castelos', 50], ['Era', 'Imperial', 75]];

export default {
  cores: { dark: '#0e131b', light: '#ebe3d0' },

  // ---------------------------------------------------------------- casca: a barra de pedra do topo
  casca: ({ links: items, marca, rodape }) => ({
    topo: `<div class="barra">
 <a class="marca" href="index.html"><span class="marca-ic" aria-hidden="true">♜</span><span>${esc(marca)}</span></a>
 ${items.length > 1 ? `<button type="button" class="botao-menu" data-g="abrir-menu" aria-expanded="false">☰</button>
 <nav class="nav" data-g="nav" aria-label="Navegação principal">${items.map(l => `<a href="${l.href}"${l.atual ? ' aria-current="page"' : ''}>${esc(l.rotulo)}</a>`).join('')}</nav>` : ''}
 <button type="button" class="botao-tema" data-g="alternar-tema"><span class="so-escuro">☀ Manual</span><span class="so-claro">☾ Sala de guerra</span></button>
</div>`,
    rodape: `<p>${rodape}</p>`,
  }),

  // ---------------------------------------------------------------- conquista: um nó da árvore
  conquista: c => `<article class="no" data-g="conquista" id="ach-${esc(c.id)}">
 <div class="no-icone"><img src="${c.icone}" alt="" width="68" height="68" loading="lazy" decoding="async"></div>
 <div class="no-texto">
  <h3>${c.nome}</h3>
  <p class="no-desc"${c.spoiler ? ' data-g-spoiler' : ''}>${c.desc ? `“${c.desc}”` : 'Conquista oculta'}</p>
  ${c.perdivel ? `<p class="no-perdivel"><b>⚠ Perdível:</b> ${c.perdivel}</p>` : ''}
  <p class="no-dica"${c.spoiler ? ' data-g-spoiler' : ''}>${c.dica}</p>
  ${c.junto.length ? `<p class="no-extra"><b>Pesquise junto:</b> ${c.junto.map(j => `<a href="${j.href}">${j.nome}</a>`).join(', ')}</p>` : ''}
  <div class="no-tags">
   <span class="rar">${c.raridade.rotulo} · ${c.raridade.pct}</span>
   ${c.dificuldade ? `<span title="Dificuldade: ${c.dificuldade.rotulo}" aria-label="Dificuldade ${c.dificuldade.n} de 5">${'◆'.repeat(c.dificuldade.n)}${'◇'.repeat(5 - c.dificuldade.n)}</span>` : ''}
   ${c.tempo ? `<span>⧗ ${c.tempo}</span>` : ''}${c.online ? '<span>Online</span>' : ''}${c.solo ? '<span>Só 1 jogador</span>' : ''}${c.spoiler ? '<span>Spoiler</span>' : ''}
  </div>
  ${c.linhaFontes}
 </div>
 <label class="pesquisar"><input type="checkbox" data-id="${esc(c.id)}"><span class="g-sr">Pesquisar ${c.nome}</span></label>
</article>`,

  // ---------------------------------------------------------------- capítulo: um edifício da árvore
  capitulo: c => `<section class="edificio" data-g="capitulo" id="${esc(c.id)}">
 <header class="edificio-cab" data-g="cabeca">
  <span class="edificio-ic" aria-hidden="true">${ROMANO(c.n)}</span>
  <div><h2>${c.titulo}</h2><p>${c.subtitulo}</p></div>
  <span class="edificio-cnt"><span data-g="contagem">0/${c.total}</span><small>pesquisadas</small></span>
  <span class="edificio-seta" aria-hidden="true">▾</span>
 </header>
 <div class="edificio-corpo" data-g="corpo">
  ${c.nota ? `<p class="edificio-nota">${c.nota}</p>` : ''}
  <div class="nos">${c.cartoes}</div>
 </div>
</section>`,

  // ---------------------------------------------------------------- resumo e roteiro
  resumo: r => {
    // a barra de recursos do topo mostra os mesmos números do resumo
    const rec = { dificuldade: r.dificuldade ? `${r.dificuldade}/10` : '', horas: r.horas || '' };
    Object.entries(rec).forEach(([k, v]) => document.querySelectorAll(`[data-rec="${k}"]`).forEach(el => { el.textContent = v; el.closest('span').hidden = !v; }));
    return `<dl class="placas">
 ${[['Dificuldade', r.dificuldade && `${r.dificuldade}/10`], ['Tempo para o 100%', r.horas], ['Jogadas', r.jogadas], ['Perdíveis', r.perdiveis],
    ['Online', r.online], ['Nível de dificuldade', r.nivel]].filter(([, v]) => v !== undefined && v !== '' && v !== null)
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
</dl>${r.resumo ? `<p class="resumo-texto">${r.resumo}</p>` : ''}`;
  },
  roteiro: passos => `<ol class="ordem">${passos.map((p, i) => `<li><span class="ordem-n" aria-hidden="true">${ROMANO(i + 1)}</span><div><strong>${p.titulo}</strong><p>${p.texto}</p>${p.capitulo ? `<a href="${p.capitulo}">Ir ao edifício →</a>` : ''}</div></li>`).join('')}</ol>`,

  // ---------------------------------------------------------------- fontes: a biblioteca
  linhaFontes: fs => fs.length ? `<p class="no-fontes">Fontes: ${links(fs)}</p>` : '',
  fontes: lista => `<ul class="biblio">${lista.map(s => `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.titulo)}</a>` : `<strong>${esc(s.titulo)}</strong>`}${s.sobre ? `: ${s.sobre}` : ''}${s.usos ? ` <small>(${s.usos} dicas)</small>` : ''}</li>`).join('')}</ul>`,
  confirmar: pontos => `<ul class="biblio">${pontos.map(p => `<li>${p.texto}${p.fontes.length ? ` <small>${links(p.fontes)}</small>` : ''}</li>`).join('')}</ul>`,

  // ---------------------------------------------------------------- progresso: Eras, faixa de cenas e molduras por raridade
  progresso: p => {
    document.querySelectorAll('[data-feitas]').forEach(el => { el.textContent = `${p.feitas}/${p.total}`; });
    document.querySelectorAll('[data-pct]').forEach(el => { el.textContent = p.pct + '%'; });
    if (p.capitulos) document.querySelectorAll('[data-rec="edificios"]').forEach(el => { el.textContent = p.capitulos.length; });
    const atual = ERAS.filter(([, , min]) => p.pct >= min).length - 1;
    document.querySelectorAll('[data-era]').forEach((el, i) => { el.toggleAttribute('data-passada', i < atual); el.toggleAttribute('data-atual', i === atual); });
    document.querySelectorAll('[data-era-nome]').forEach(el => { el.textContent = ERAS[atual][0] + ' ' + ERAS[atual][1]; });
    // A faixa da tapeçaria: uma cena por capítulo, montada uma vez a partir dos capítulos da página
    const faixa = document.querySelector('.cenas');
    if (faixa && p.capitulos) {
      if (!faixa.children.length) {
        faixa.innerHTML = p.capitulos.map((c, i) => {
          const h2 = document.querySelector(`#${CSS.escape(c.id)} h2`);
          return `<a class="cena" href="#${c.id}" data-cena="${c.id}" title="Cena ${ROMANO(i + 1)}: ${esc(h2 ? h2.textContent : c.id)}"><span>${ROMANO(i + 1)}</span></a>`;
        }).join('');
      }
      const prox = p.capitulos.find(c => c.feitas < c.total);
      p.capitulos.forEach(c => {
        const el = faixa.querySelector(`[data-cena="${CSS.escape(c.id)}"]`);
        if (!el) return;
        el.style.setProperty('--g-progresso', c.total ? c.feitas / c.total : 0);
        el.toggleAttribute('data-bordada', c.total > 0 && c.feitas === c.total);
        el.toggleAttribute('data-atual', c === prox);
      });
    }
    (p.raridade || []).forEach(r => {
      document.querySelectorAll(`[data-moldura="${r.chave}"] b`).forEach(el => { el.textContent = `${r.feitas}/${r.total}`; });
    });
  },
};
