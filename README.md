# Age of Empires II: Definitive Edition — Guia de conquistas

Guia comunitário com **todas as conquistas da Steam** (dica de cada uma, perdíveis, raridade, roteiro do 100%) e uma **rota** na ordem que economiza tempo.

- Conquistas: https://ruysalles.github.io/AgeOfEmpires2DE/
- Rota: https://ruysalles.github.io/AgeOfEmpires2DE/rota.html

O site é estático (GitHub Pages, sem build). O **conteúdo** fica em arquivos JSON e o **layout** em HTML/CSS/JS. Para mudar um texto, você só mexe no JSON.

## Estrutura

```
index.html              página de conquistas (a "casca": topo e recipientes vazios)
rota.html               página da rota (idem; opcional)
data/
  conquistas.json       ← conquistas: capítulos, dicas, perdíveis, roteiro, resumo do 100%
  rota.json             ← rota: etapas, tarefas, etiquetas, materiais, marcos
  fontes.json           ← fontes citadas pelas dicas e tarefas + pontos a confirmar
  ids.lock.json         IDs já publicados (proteção do progresso salvo; veja abaixo)
assets/
  css/base.css          TEMA (tokens claro/escuro, fontes), topo, menu, componentes comuns
  css/conquistas.css    estilos só das conquistas
  css/rota.css          estilos só da rota (inclui a peça dos marcos, .marco)
  js/guia.config.js     nome do jogo, marca, prefixo das chaves salvas, rodapé, HAS_ROTA
  js/theme-init.js      aplica o tema antes de pintar a tela (evita "piscar")
  js/lib/*.js           util, layout (topo/menu/rodapé), checklist, fontes, save (exportar/importar)
  js/conquistas.js      monta as conquistas a partir de data/conquistas.json
  js/rota.js            monta a rota a partir de data/rota.json
  achievements/*.jpg    ícones das conquistas (nome = id da Steam em minúsculas)
tools/
  validate.py           confere os dados (roda no GitHub a cada push)
  steam_importar.py     traz conquistas, nomes em PT-BR e ícones da Steam (sem chave)
  update_steam.py       atualiza as % das conquistas (roda toda segunda no GitHub)
  gerar_og.py           gera a imagem de compartilhamento a partir de tools/og/og-image.html
.github/workflows/      as automações
```

## ⚠️ Regra de ouro: nunca mude, apague ou reaproveite um ID

O progresso de cada visitante fica salvo no navegador dele, ligado ao **id** de cada item (`t1`, `t2`… na rota; o id da Steam nas conquistas).

- **Tarefa nova** → use o próximo número livre, mesmo que ela fique no meio da rota. A ordem na tela é a ordem no JSON, não o número.
- **Tarefa que não vale mais** → de preferência, mude o texto e mantenha o id.
- **Tarefa que precisa sair** → apague-a da rota e acrescente o id em `aposentados` no `data/ids.lock.json`. Id aposentado nunca volta a ser usado.
- Para registrar IDs novos: `python tools/validate.py --lock`.

O prefixo das chaves no navegador (`PREFIX` em `assets/js/guia.config.js`) também nunca muda depois de publicar.

## Como editar

Dá para editar direto no GitHub (abra o arquivo → lápis → "Commit changes"). O validador roda sozinho; se o check ficar vermelho, a mensagem diz o que corrigir. Campos de texto aceitam HTML simples: `<em>`, `<strong>`, `<b>`, `<a href="...">` e `<br>`.

### Conquistas (`data/conquistas.json`)

| Campo | O que é |
|---|---|
| `name`, `desc`, `pct`, `hidden` | Vêm da Steam (`steam_importar.py`); `pct` é atualizado toda semana |
| `tip` | A dica de como conseguir (obrigatória, escrita à mão) |
| `missable` | `true` ou um texto dizendo **quando** ela se perde (ex.: "só antes do capítulo 5") |
| `difficulty` | 1 a 5 |
| `time` | tempo estimado, em texto (ex.: `"~10 min"`, `"2–3 h"`) |
| `together` | ids de conquistas para fazer junto ("Faça junto com") |
| `rota` | ids de tarefas da rota onde ela sai ("Na rota") |
| `sources` | ids de `fontes.json` usados na dica |
| `spoiler` | `true` borra a descrição e a dica até o visitante pedir (conquistas `hidden` já vêm borradas) |
| `solo`, `online` | selos "Só 1 jogador" / "Online" |

Topo da página: `intro` (aceita `{pct100}`), `completion` (id da conquista "100%", se houver), `overview` (dificuldade 1–10, horas, jogadas, online, nível de dificuldade do jogo, resumo) e `roadmap` (passos do roteiro, com `chapter` e/ou `rota` opcionais). Capítulos: `chapters[...]` define ordem e agrupamento; toda conquista em exatamente um capítulo.

### Rota (`data/rota.json`)

- `tagTypes`: os tipos de etiqueta do jogo (`type`, `label`, `color` = accent/info/warm/ok/danger/special). Com `flow`, o tipo vira um passo do "Como ler a rota"; com `explain`, vai para a legenda.
- `stages[...]`: `title`, `subtitle`, `tag`, `tasks` obrigatórios; `note` explica **por que** a etapa vem ali. `"part": {"id", "title", "text"}` abre uma nova aba a partir daquela etapa.
- Tarefas: `id`, `title`, `desc`, `tags`, e opcionais `materials` (`["chave", n]`, do catálogo `materials`) e `sources`.
- `milestones`: marcos que acendem no painel do topo quando a tarefa `unlock` é marcada (ex.: os Red Bricks do LEGO).

### Fontes (`data/fontes.json`)

`sources`: `id`, `title`, `short` (nome curto nas dicas), `url`, `about` (o que essa fonte confirmou). `confirm`: divergências entre fontes, dizendo quem afirma o quê.

## Rodar localmente

As páginas carregam os JSON via `fetch`, então **não abrem com duplo clique**. Na pasta do projeto:

```bash
python -m http.server 8000
```

E abra http://localhost:8000 (no Windows, se `python` não existir, use `py`). Antes de commitar: `python tools/validate.py`.

## Automações (GitHub Actions)

| Workflow | Quando | O que faz |
|---|---|---|
| **Validar dados** | a cada push e pull request | roda `tools/validate.py` |
| **Atualizar porcentagens da Steam** | segundas, 06:00 (Brasília), ou manual | roda `tools/update_steam.py`; se alguma % mudou, faz commit |

Se a atualização semanal falhar por permissão: **Settings → Actions → General → Workflow permissions → Read and write**.

## Imagem de compartilhamento

`python tools/gerar_og.py` (com Chrome ou Edge instalado e `pip install pillow`) gera `og-image-N.jpg` com nome novo, troca as tags nas páginas e apaga a antiga. Regere quando os números ou o visual mudarem.

## Fontes do conteúdo

Os guias consultados estão listados no fim de cada página e cada dica cita as suas. As dicas foram resumidas com palavras próprias. Age of Empires II: Definitive Edition é marca de seus respectivos donos; este é um guia comunitário não oficial.
