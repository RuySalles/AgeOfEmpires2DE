// TEMA deste guia: o front-end ÚNICO, desenhado a partir da direção de arte do jogo.
// TEMA-ESQUELETO — apague esta linha quando o tema existir (o validador avisa enquanto ela estiver aqui).
//
// Cada função recebe os DADOS de uma peça e devolve o HTML dela. Tudo que não for definido aqui
// cai no renderizador neutro de assets/motor/padrao.js (feio de propósito: não é um modelo de visual).
// O contrato (o que cada função recebe e os ganchos data-g que o HTML precisa manter) está
// documentado em padrao.js e em references/motor.md da skill.
//
// Exemplo de como sobrescrever uma peça:
//   conquista: c => `<article data-g="conquista" id="ach-${c.id}"> ... <input type="checkbox" data-id="${c.id}"> ... </article>`,
//   progresso: p => { /* desenhe o progresso do seu jeito: p.feitas, p.total, p.pct, p.raridade */ },

export default {
  // Cor da barra do navegador no celular em cada tema (igual ao fundo de cada tema em tema.css)
  cores: { dark: '#202020', light: '#f4f4f4' },
};
