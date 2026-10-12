---
name: criar-story
description: Cria Stories de Instagram (1080×1920) para a Selfmade — anúncios de vagas, contagens decrescentes, sondagens, bastidores. Usar quando pedirem story ou stories.
---

# Criar Stories

- Formato 9:16 com `"format": "story"`. Zonas seguras: nada importante nos 12 % de cima e 20 % de baixo (é aí que ficam os stickers de link/sondagem/pergunta — **deixa esse espaço vazio de propósito** e indica no `legenda.md` qual sticker colocar e onde).
- 1 mensagem por story; sequências de 3–5 stories: gancho → info → sticker de interação → CTA (link).
- Layouts úteis: `statement` (anúncio), `stat` (contagem decrescente "3 dias"), `steps`, `cta`.
- Render: `node scripts/render.mjs posts/<pasta>`; animado: `node scripts/render-video.mjs posts/<pasta>` (≤ 15 s por story).
- Sugere sempre o sticker (sondagem, quiz, pergunta, link, contagem decrescente) — aumentam a relação com a conta.
