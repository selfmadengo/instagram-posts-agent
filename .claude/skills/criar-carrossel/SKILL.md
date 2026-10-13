---
name: criar-carrossel
description: Cria um carrossel de Instagram (1080×1440, 7–10 slides) para a Associação Selfmade, do brief ao PNG final e legenda. Usar quando pedirem um post, carrossel, publicação de feed ou "post para o Instagram".
---

# Criar carrossel Selfmade

1. **Lê** `CLAUDE.md`, `docs/content-playbook.md` e `docs/design-system.md` (se ainda não estiverem em contexto).
2. **Brief** — confirma: tema, objetivo (alcance/guardados/leads), CTA, link/palavra-chave, datas/vagas reais, se é projeto financiado (UE). Pergunta o que faltar **com `AskUserQuestion`**; não inventes factos.
3. **3 ganchos** para o slide 1 (contradição, número, promessa+objeção, pergunta direta…). Escolhe 1 e justifica em 1 linha. O slide 2 tem de ser um 2.º gancho (o Instagram re-serve a partir dele).
4. **Estrutura** (SOP): 1 capa · 2–3 exemplo/interesse · 4–5 diagrama (`compare`/`steps`) · 6–9 prático (`list`/`steps`/`quote`) · último `cta`.
5. Cria a pasta `posts/AAAA-MM-DD-slug/` a partir de `posts/_template/post.json`. Esquema: `docs/post-json.md`.
   - Capa com `visual` (asset 3D de `assets/3d/` ou `orb`).
   - 1 só `==destaque==` por peça; `*itálico*` 1–3 palavras; títulos ≤ 8 palavras.
   - CTA = verbo + objeto; palavra-chave nos comentários quando o objetivo é leads.
   - Último slide: logos de parceiros/programa (`brand/logos/partners/`) + "Cofinanciado pela União Europeia" se aplicável.
6. **Render**: `node scripts/render.mjs posts/<pasta>` → `node scripts/contact-sheet.mjs posts/<pasta>`.
7. **QA**: corre a skill `qa-design` (abrir PNGs, corrigir, re-render).
8. **Legenda**: skill `legenda-instagram` → `posts/<pasta>/legenda.md`.
9. **Canva**: `node scripts/export-pdf.mjs posts/<pasta>` e importar como design editável (ver "Envio para o Canva" no CLAUDE.md).
10. **Entrega**: tokens usados · ficheiros · regra (1–6) cumprida por elemento-chave · exceções deliberadas.
