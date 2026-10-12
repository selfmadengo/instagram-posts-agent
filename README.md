# Selfmade — Agente de posts de Instagram

Sistema para criar posts de Instagram **altamente conversivos** para a **Associação Selfmade** (Mobilidade Internacional e Empreendedorismo): carrosséis 3:4, Stories e **Reels em motion graphics**, sempre dentro do brand kit e das 6 regras de design.

O "cérebro" do agente está em [`CLAUDE.md`](CLAUDE.md). Abre este repositório no **Claude Code** e pede, por exemplo:

> Cria um carrossel sobre as vagas do intercâmbio em Itália (15–22 de novembro, 18–25 anos, candidaturas até dia 30, link na bio).

> Faz um reel de 15 s a anunciar o workshop de empreendedorismo de sábado.

> Prepara o plano de conteúdo de novembro.

## Estrutura
```
CLAUDE.md                     instruções do agente (papel, fluxo, regras)
.claude/skills/               criar-carrossel · criar-reel · criar-story · legenda-instagram · qa-design · plano-conteudo
brand/
  tokens.css · fonts.css      design tokens (cores, tipos, espaços, motion) — fonte única de verdade
  fonts/                      Thunder · Euclid Square (não versionadas — ver fonts/README.md) · Instrument Serif
  logos/                      Selfmade (vermelho/branco, ícone e logótipo) + partners/
  branding-selfmade.pdf       brand kit original
  SOP-BRAND-KIT.docx          SOP original
docs/
  design-system.md            as 6 decisões aplicadas à Selfmade + checklist QA
  content-playbook.md         ganchos, CTAs, pilares, legendas, cadência, métricas
  post-json.md                esquema dos posts (layouts e campos)
  prompts-3d.md               prompts para gerar objetos 3D realistas
  research/                   pesquisa Instagram 2026 + análise de design/inspiração
templates/                    motor HTML/CSS dos slides (carrossel, story, reel)
scripts/
  render.mjs                  post.json → PNG (1080×1440 ou 1080×1920)
  render-video.mjs            post.json → MP4 em motion graphics (frame a frame, determinístico)
  contact-sheet.mjs           folha de revisão (+ teste em tons de cinzento)
  contrast.mjs                verificação de contraste WCAG
assets/3d · photos · icons    banco de objetos 3D, fotos reais e ícones
posts/AAAA-MM-DD-slug/        um post por pasta: post.json · legenda.md · export/
```

## Comandos
```bash
npm install                                   # uma vez (Playwright; usa o Chromium do sistema)
node scripts/render.mjs posts/<pasta>         # PNGs
node scripts/render-video.mjs posts/<pasta>   # MP4 (precisa de ffmpeg)
node scripts/contact-sheet.mjs posts/<pasta> [--gray]
node scripts/contrast.mjs
```

## Exemplos
- `posts/2026-10-12-erasmus-intercambios-exemplo/` — carrossel de 8 slides + legenda.
- `posts/2026-10-12-reel-erasmus-exemplo/` — Reel 15,6 s em motion graphics.

> Os exemplos servem para demonstrar o sistema: validar factos, handle e textos de financiamento antes de publicar.

## Licenças das fontes
Thunder e Euclid Square são fontes comerciais: **não estão no git** (o repositório é público). Instalação: [`brand/fonts/README.md`](brand/fonts/README.md). Instrument Serif é SIL OFL.
