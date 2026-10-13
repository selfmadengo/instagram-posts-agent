# Brand kits de projetos

A Selfmade tem **dois níveis de identidade**:

| Tipo de post | Brand kit | Cores | Fontes |
|---|---|---|---|
| Genérico da Selfmade (marca, sócios, dicas, mitos…) | `brand/tokens.css` | Preto Azulado + **Vermelho-Self** + branco | Thunder · Euclid Square · Instrument Serif |
| Projeto específico (ex.: European Youth Capitals for Democracy) | `brand/projects/<id>/brand.css` | Preto Azulado + branco + **cores do projeto (sem vermelho)** | fontes do projeto |

## Como funciona
- No `post.json`: `"meta": { "brand": "eyc" }` → cada slide recebe a classe `brand-eyc`.
- O `brand.css` do projeto **redefine as variáveis de acento** do motor (`--c-red*`, `--rgb-red*`, `--c-red-tint-*`) e as fontes (`--f-body`, `--f-display`, `--f-accent`). Assim todos os componentes mudam de cor sem tocar no motor.
- Objetos 3D com detalhes vermelhos: `python3 scripts/recolor-accent.py <in.png|pasta> <out.png|pasta> <hue>`. Exemplo: hue 155 para o azul EYC. Guardar como `assets/3d/<id>-*.png`.
- Logótipos da Selfmade e dos financiadores ficam **inalterados**.

## Kits existentes
### `eyc`: European Youth Capitals for Democracy (DiscoverEU Ação Inclusiva)
Fonte: post original instagram.com/p/DWUG-LmDCCz e infopack (Canva DAG5pHQ54I4).
- Fundo: Preto Azulado com céu estrelado (escuro) e "mapa GO" claro (`--c-paper`).
- Acento: **azul** `#2a5cb0` (com degradê `#3d7dca` → `#1d4a94`) e **amarelo** `#ffcb05` (destaques sobre escuro). Azul profundo `#12306b`.
- Títulos: **Pokemon Solid** amarela com contorno azul (`.pk-title`). Texto: **Montserrat** (400–800).
- Tema: Pokémon GO (missões, XP, cartão de treinador, mapa com pins, inventário).
