# Próximos passos (passagem de sessão — 13/10/2026)

## Estado
- Post em curso: `posts/2026-10-13-erasmus-mitos-vs-realidade/` (v2: poster com objetos 3D, slides 1 e 8 animados). Canva (fiel): https://www.canva.com/d/BPgZbWACAH1Tyx8
- A equipa pediu: **antes de refazer, ver TODOS os designs de https://www.canva.com/p/kingup/** (e as coleções) e o **perfil do Instagram @marketingharry** (enquadramento e dicas), e fazer algo do mesmo género.
- A sessão anterior não tinha acesso de rede a canva.com / instagram.com. A equipa vai abrir o Network access do ambiente.

## Na nova sessão
1. Confirmar acesso: `curl -sI https://www.canva.com/p/kingup/` e `https://www.instagram.com/marketingharry/`.
2. Abrir as páginas com o Chromium (Playwright), fazer scroll a tudo e capturar cada design → `docs/research/inspiracao/kingup/` e `docs/research/inspiracao/marketingharry/` (só para análise interna; não publicar).
3. Escrever a análise em `docs/research/design-inspiracao.md`: grelha, enquadramento, tamanhos de título, posição/escala dos objetos, número de palavras por slide, uso de cor, CTAs, padrões de capa e de slide final.
4. Traduzir os padrões em layouts/tokens novos no motor (`templates/partials/`), sem sair do brand kit (cores 60/30/10, Thunder/Euclid/Instrument Serif).
5. Com canva.com aberto: gerar objetos 3D hiper-realistas com `mcp__Canva__generate-image` (`docs/prompts-3d.md`) e descarregá-los para `assets/3d/` — substituem os renders three.js quando forem melhores.
6. Refazer o carrossel «Erasmus+: mitos vs realidade» (factos já validados em `legenda.md`), QA, PDF fiel → Canva.
7. Todas as perguntas à equipa: **AskUserQuestion**.
