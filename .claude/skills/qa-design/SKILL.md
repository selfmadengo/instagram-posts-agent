---
name: qa-design
description: Revisão de qualidade visual e estratégica de um post Selfmade antes de entregar (as 6 decisões de design + checklist Instagram). Usar sempre depois de renderizar e quando pedirem revisão/crítica de um design.
---

# QA de design

1. Abre cada PNG de `posts/<pasta>/export/` com Read (e `_contact-sheet.png`, `_contact-sheet-gray.png` — gerar com `node scripts/contact-sheet.mjs posts/<pasta> [--gray]`).
2. Verifica, slide a slide:
   - [ ] Ponto focal único; leitura clara em 3 s (eyebrow → título → apoio).
   - [ ] Nada fora das margens de 72 px; nada cortado; sem sobreposições indesejadas (acentos vs eyebrow, texto vs objeto 3D — o objeto pode tocar a parte de baixo do título, nunca tapar palavras).
   - [ ] Texto ≥ 32 px; títulos ≥ 3× corpo; sem linhas órfãs de 1 palavra no corpo.
   - [ ] Contraste: texto vermelho em fundo escuro só `#f0444a`; texto sobre foto com scrim. Em cinzento ainda se lê.
   - [ ] 1 destaque por peça; 1 brilho (key) por peça; ícones de um só conjunto.
   - [ ] Ritmo de fundos: nunca 2 escuros seguidos; CTA final destacado.
   - [ ] CTA = verbo + objeto; logos Selfmade + parceiros + menção UE quando aplicável.
   - [ ] 9:16: zonas seguras (230 px topo / 384 px base) livres.
   - [ ] Estratégia: slide 1 promete um ganho claro; slide 2 é 2.º gancho; há motivo para **enviar** a alguém.
3. Corrige no `post.json` (ou, se for um problema do sistema, em `templates/partials/slide.css` / `engine.js` — sem quebrar os outros layouts), re-renderiza e repete.
4. No fim, reporta: o que foi verificado, o que foi corrigido, exceções deliberadas.
