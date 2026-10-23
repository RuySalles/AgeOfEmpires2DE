// Configuração do guia: identidade, chaves de salvamento e textos fixos do topo e do rodapé.
// Conteúdo (conquistas, rota, fontes) fica em data/*.json, não aqui.

// Prefixo de TODAS as chaves salvas no navegador (progresso, tema, filtros).
// Nunca mude depois de publicar: quem já usa o site perderia o progresso.
// Se mudar antes de publicar, mude também em assets/js/theme-init.js.
export const PREFIX = 'aoe2';

export const GAME = 'Age of Empires II: Definitive Edition';
export const BRAND = 'AoE II · Guia 100%';      // nome curto no topo (ex.: "Middle-earth field guide")
export const BRANDMARK = '♜';          // símbolo dentro do losango do topo
export const ORNAMENT = 'TREVAS ✦ FEUDAL ✦ CASTELOS ✦ IMPERIAL';            // linha decorativa no topo das páginas (ex.: runas); vazio = nenhuma

// Cor da barra do navegador no celular: igual ao --bg de cada tema em base.css
export const THEME_COLOR = { dark: '#0f1114', light: '#efe5cf' };

// Esta guia tem rota de aceleração (rota.html)? Se não tiver, apague rota.html e data/rota.json.
export const HAS_ROTA = false;

export const FOOTER = `${GAME} · Guia comunitário não oficial. Nomes, marcas e ícones de conquistas pertencem aos seus respectivos proprietários. `
  + 'Esta página não é afiliada nem endossada pelos donos do jogo nem pela Valve.';
