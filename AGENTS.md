# Instruções para IAs — Age of Empires II: Definitive Edition (guia de conquistas)

Fonte única de instruções para qualquer IA neste repositório. `CLAUDE.md` apenas importa este arquivo.
Este guia foi criado com a skill **guia-conquistas**; os padrões completos (voz, tema, fontes) estão nela.

## Regras que não se quebram
- **IDs são eternos.** Conquistas usam o id da Steam; tarefas usam `tN` com o próximo número livre. Nunca renomeie, apague ou reaproveite; para tirar uma tarefa, aposente o id em `data/ids.lock.json`. O `PREFIX` de `assets/js/guia.config.js` e as chaves `-v1` também nunca mudam.
- **Conteúdo só nos JSON** (`data/`). HTML é casca; JS monta. Texto novo não entra no HTML (exceto o topo criativo de cada página).
- **Toda dica e tarefa cita fontes** (`sources`, ids de `data/fontes.json`). Divergência entre fontes vai para `confirm`, dizendo quem afirma o quê. Nunca copie texto das fontes: resuma com palavras próprias.
- **Tema escuro e claro sempre**, só com tokens de `assets/css/base.css`; cor nova = token novo nos dois temas. Contraste mínimo 4,5:1. Celular primeiro (375 px sem rolagem lateral, alvos de 44 px).
- **`python tools/validate.py` termina com 0 erros** antes de qualquer commit. Avisos são lacunas de conteúdo: resolva ou explique.

## Como trabalhar
- Rodar: `py -m http.server 8000` (ou o preview "site" de `.claude/launch.json`) e conferir as duas páginas nos dois temas e em 375 px.
- Conquistas novas na Steam: `python tools/steam_importar.py` (mantém o que foi escrito à mão).
- Mudou números ou visual: `python tools/gerar_og.py`.
- Reestruturação grande: antes, backup em `backups/AAAA-MM-DD_HH-MM/` (zip + LEIA-ME com commit e como restaurar) e uma tag git local; depois, trabalhe em fases ("Phase 1: … (no visual change)").
- Commits em inglês, com corpo explicando o quê e o porquê; diga quando IDs e chaves de progresso não mudaram.
