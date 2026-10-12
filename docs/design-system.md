# Selfmade — Design System (as 6 decisões)

Este documento junta o **brand kit da Selfmade** (`brand/branding-selfmade.pdf`, `brand/SOP-BRAND-KIT.docx`) com as **regras de direção de arte** definidas pela equipa. Tudo o que está aqui está implementado em `brand/tokens.css` e `templates/partials/slide.css`.

---

## 0. Design tokens

### Marca
- **Personalidade**: aventureira, jovem, confiável, empreendedora ("mobilidade internacional e empreendedorismo").
- **Público**: jovens 16–30 (Portugal, região do Fundão/Beira Interior) + parceiros institucionais.
- **Motivo de marca**: o **avião** do logótipo (marcador da barra de progresso) e as **órbitas/meridianos** do globo (arcos de fundo).

### Cor — regra 60 / 30 / 10 do brand kit
| Token | HEX | Uso | Contraste |
|---|---|---|---|
| `--c-bg` Preto Azulado | `#030e14` | Fundos (60 %) | — |
| `--c-red` Vermelho-Self | `#9d0b0e` | Elementos: painéis, CTA, esferas, faixas (30 %) | Branco sobre vermelho **8,4:1** ✓ |
| `--c-white` Branco | `#ffffff` | Letras (10 %) | Branco sobre fundo **19,5:1** ✓ |
| `--c-red-light` Vermelho-Self Luz | `#f0444a` | **Só** texto/ícones vermelhos sobre fundo escuro | **5,2:1** ✓ |
| `--c-muted` | `#a3b1ba` | Texto secundário em fundo escuro | 8,9:1 ✓ |
| `--c-surface` | `#0b1a23` | Cartões/painéis | — |
| `--c-paper` / `--c-ink` | `#f4f2ef` / `#030e14` | Slides claros de ritmo | Vermelho-Self sobre papel 7,5:1 ✓ |

> ⚠️ **Decisão importante:** o Vermelho-Self `#9d0b0e` sobre o fundo `#030e14` tem só **2,3:1** — falha WCAG mesmo para texto grande. Por isso **nunca** se escreve texto em `#9d0b0e` sobre fundo escuro: usa-se `#f0444a` (Vermelho-Self Luz) ou põe-se texto branco **dentro** de um elemento vermelho.
>
> ℹ️ O PDF diz `#9d0b0e` e o SOP diz `#991C18`. O logótipo usa `#9e0a0e` → adotámos **`#9d0b0e`**.

### Tipografia
| Papel | Fonte | Peso | Notas |
|---|---|---|---|
| **Títulos** | Thunder (LC) | Bold 700 / Black 900 | Caixa alta, line-height 0,88, tracking −1 % |
| **Parágrafos** | Euclid Square | Regular 400 / Medium 500 / SemiBold 600 | line-height 1,45 |
| **Destaques** | Instrument Serif | Itálico 400 | 1–3 palavras por peça |

Escala (canvas 1080): micro 32 · small 36 · body 40 · lead 50 · h3 72 · h2 120 · h1 190 · mega 230 px.

### Sistemas
- **Espaçamento** (base 4): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. **Margem** do canvas: 72 px (6,7 %).
- **Raios**: 8 (badges) · 16 (cartões) · 24 (painéis) · pill (botões, chips).
- **Elevação**: sm `0 1 2` · md `0 8 24` · lg `0 24 64` — sempre para baixo.
- **Motion**: 100 / 200 / 300 ms, cenas 450 ms, easing `cubic-bezier(.2,.8,.2,1)`.
- **Formatos**: Post/carrossel **1080×1440 (3:4)** · Story/Reel **1080×1920 (9:16)** · YouTube 16:9 · Banner YT 2560×1440 (safe 1546×423) · Flyers A3/A4 · Lona 150×50.

---

## Decisão 1 — Tamanho e espaço
- Texto mínimo **32 px** (3 % de 1080). Legal ≥ 22 px.
- Margens ≥ **72 px**. Em 9:16: nada importante nos **12 % de cima (230 px)** e **20 % de baixo (384 px)**.
- CTA ≥ 48 px de altura (o nosso pill tem 96 px), padding horizontal 64.
- **Um ponto focal** por slide; ordem de leitura clara em 3 s.
- Espaço entre grupos > espaço dentro do grupo.

## Decisão 2 — Tipo e copy
- Título ≥ 3× o corpo (190 vs 40 px).
- Máx. 2 famílias + 1 de destaque (Thunder + Euclid + Instrument Serif itálico, este só 1–3 palavras).
- CTAs = **verbo + objeto**: "Ver vagas abertas", "Comenta EUROPA", "Guarda este guia". Nunca "Clica aqui" / "Saber mais".
- Títulos dizem **o que o jovem ganha** ("Viajar pela Europa quase de graça"), não o nome interno do projeto.
- Motion: cada bloco de texto no ecrã ≥ 0,3 s/palavra, mín. 1,5 s. Pensado para **som desligado**.

## Decisão 3 — Contraste
- Texto ≥ 4,5:1; texto grande ≥ 3:1; ícones/contornos ≥ 3:1 (`npm run contrast` verifica os pares dos tokens).
- Texto sobre fotografia → **sempre** scrim/gradiente (`.bg-image::after`).
- CTA principal: gradiente satinado (#b0181b → #9d0b0e → #870709), rim 1 px, label branco 8,4:1.
- Nunca só cor como sinal: no "Mito vs Real" há ✗/✓ + rótulo de texto.
- Testar em tons de cinzento: `node scripts/contact-sheet.mjs posts/<pasta> --gray`.

## Decisão 4 — Profundidade
- 3 camadas: fundo → superfície (cartões) → elevado (objeto 3D / CTA).
- Luz vem de cima (rim 1 px branco 50 %), sombra cai para baixo. **Sombras em letras e elementos** (brand kit).
- **Um único destaque com brilho** por peça (`.card.key`, o pill do CTA ou o objeto herói).
- Carrosséis alternam fundos: **escuro → claro → superfície → claro → escuro…**, nunca dois escuros seguidos; CTA final em vermelho.

## Decisão 5 — Detalhe e forma
- Só raios da escala; aninhado = exterior − padding.
- Botões, chips, tags = pill.
- **Um** conjunto de ícones (estilo Lucide, traço 2 px) — `ICONS` em `engine.js`. 1 ícone por elemento.
- Logótipo: área de proteção = altura do "S"; nunca esticar, recolorir fora das versões oficiais (branco/vermelho/preto) ou aplicar efeitos.
- **Logos da Selfmade, programas e parceiros sempre presentes e em contraste com o fundo** (brand kit).
- Imagens em rácios fixos e com o raio dos cartões; fotografia real > banco de imagens.

## Decisão 6 — Motion e ritmo
- Uma ideia de movimento por cena; **gancho em 1–3 s**; CTA final parado ≥ 2 s (o renderizador garante ≥ 4 s na última cena).
- Entradas ease-out; reveal = fade + subida 8 px, 300 ms, stagger 60 ms. Ênfase (pulso no rim) **só no CTA**.
- Fallback sem movimento: os PNG estáticos do mesmo post (`npm run render`).
- Estático: fluxo diagonal título → prova → CTA; mesmos pontos de ancoragem em todos os slides (topbar, margem, barra de progresso).

---

## Exceções deliberadas (documentadas)
1. **Títulos em CAIXA ALTA** — a regra geral pede *sentence case*, mas o brand kit usa Thunder em caixa alta e é uma fonte display condensada desenhada para isso. Limitado a títulos ≤ 8 palavras; corpo sempre em *sentence case*.
2. **Eyebrows em caixa alta** com tracking +22 % (permitido pela regra, ≥ 12 px).

## Checklist final (QA) — antes de entregar
- [ ] Só tokens, sem valores soltos  
- [ ] Texto ≥ 32 px, margens 72 px, zonas seguras 9:16  
- [ ] Contraste 4,5 / 3 verificado (`npm run contrast`)  
- [ ] Um acento por componente, um destaque por peça  
- [ ] Todos os CTAs = verbo + objeto  
- [ ] Um ponto focal; leitura clara em 3 s  
- [ ] Todos os formatos verificados (3:4 e 9:16)  
- [ ] Motion: gancho, tempos, CTA final ≥ 2 s, fallback estático  
- [ ] Funciona em tons de cinzento  
- [ ] Logos Selfmade/parceiros + menção UE quando o projeto é financiado  
