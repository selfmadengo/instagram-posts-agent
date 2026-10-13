# Esquema do `post.json`

```jsonc
{
  "meta": {
    "format": "carousel",          // carousel (1080×1440) | story | reel (1080×1920)
    "handle": "@selfmade_ngo",
    "pillar": "Oportunidades",     // ver docs/content-playbook.md
    "goal": "Partilhas + comentários",
    "output": "reel.mp4",          // só vídeo (opcional)
    "audio": "assets/audio/x.mp3", // só vídeo (opcional)
    "swipeLabel": "Arrasta"        // texto da dica de swipe no slide 1
  },
  "slides": [ /* 1 objeto por slide / cena */ ]
}
```

## Markup de texto (em qualquer campo de texto)
| Markup | Resultado | Regra |
|---|---|---|
| `==palavra==` | destaque principal (gradiente vermelho / sublinhado no tema vermelho) | **1 por peça** |
| `*palavra*` | Instrument Serif itálico | 1–3 palavras |
| `**palavra**` | semibold | etiquetas, info-chave |
| `\n` | nova linha (títulos) | títulos auto-ajustam à largura |

## Campos comuns a todos os slides
- `layout` (obrigatório): `cover`, `statement`, `list`, `compare`, `steps`, `stat`, `quote`, `cta`
- `theme` (opcional): `dark`, `surface`, `light`, `red` — por omissão é automático (ritmo escuro/claro, CTA final vermelho)
- `background` (opcional): imagem de fundo (caminho relativo à raiz) — recebe scrim automático
- `visual` (opcional): `{ "type": "image", "src": "assets/3d/x.png", "width": 900, "bottom": 120, "float": true }` ou `{ "type": "orb", "size": 820, "bottom": -360 }`
- `duration` (só vídeo, segundos)

## Layouts
| Layout | Campos | Quando |
|---|---|---|
| `cover` | `eyebrow`, `title`, `subtitle`, `size` | Slide 1 / gancho |
| `statement` | `eyebrow`, `title`, `body`, `size` | Afirmação forte, 2.º gancho, transição |
| `stat` | `eyebrow`, `value`, `label`, `body`, `source` | Número de impacto (com fonte!) |
| `compare` | `title`, `bad{label,items[]}`, `good{label,items[]}` | Mito vs realidade, bom vs mau |
| `steps` | `title`, `steps[{title,text}]` | Tutorial, processo, linha temporal (3–5 passos) |
| `list` | `title`, `items[{title,text,icon,key}]` | Compilação (3–4 por slide). `icon`: check, x, bookmark, send, arrow, plane, globe, users, calendar, euro, pin, bulb, rocket, star, message, link, clock, briefcase |
| `quote` | `quote`, `name`, `role`, `photo` | Testemunho **real e aprovado** |
| `cta` | `eyebrow`, `title`, `body`, `button`, `saveShare`, `partners[]`, `partnersNote` | Último slide |
