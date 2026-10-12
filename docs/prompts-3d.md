# Prompts para elementos 3D / realistas

Regra do brand kit: **elementos 3D/realistas, colocados por baixo do texto e a sobrepô-lo um pouco, com degradês e sombras**.

## Prompt-base (Canva AI / outro gerador)
```
Photorealistic 3D render of {OBJETO}, {ÂNGULO}, dramatic studio lighting from above,
soft contact shadow below, subtle deep red rim light (#9d0b0e), high detail, product-shot style,
isolated on pure solid black background (#030e14), no text, no logos, centered, generous empty space around
```
Depois: remover fundo → PNG transparente ≥ 1600 px → `assets/3d/<nome>.png`.

## Biblioteca sugerida
| Nome do ficheiro | {OBJETO} |
|---|---|
| `aviao-branco.png` | a glossy white commercial airplane flying diagonally upward |
| `globo-europa.png` | a realistic Earth globe showing Europe, soft clouds |
| `passaporte.png` | an open burgundy passport with colourful stamps |
| `mala-viagem.png` | a vintage red hard-shell suitcase with travel stickers |
| `bilhete-embarque.png` | a floating boarding pass ticket, slightly bent |
| `foguetao.png` | a small glossy red-and-white rocket launching (entrepreneurship) |
| `lampada.png` | a glowing glass light bulb (ideas) |
| `bandeira-ue.png` | a waving European Union flag on a short pole |
| `mapa-dobrado.png` | a folded paper map of Europe with a red pin |
| `megafone.png` | a glossy red megaphone (announcements / vagas) |
| `calendario.png` | a 3D desk calendar with a red circled date (prazos) |

## Uso no post.json
```json
"visual": { "type": "image", "src": "assets/3d/aviao-branco.png", "width": 900, "bottom": 140, "float": true }
```
Sem asset disponível: `"visual": { "type": "orb", "size": 820, "bottom": -360 }` (globo da marca em esfera 3D).
