---
name: criar-reel
description: Cria um Reel (ou story animada) em motion graphics 1080×1920 para a Selfmade, renderizado para MP4 frame a frame. Usar quando pedirem reel, vídeo, motion graphics, animação ou story animada.
---

# Criar Reel em motion graphics

Regras (Decisão 6 + pesquisa 2026):
- **Gancho ≤ 1,5 s** — cena 1 = `cover` com a promessa/contradição + objeto 3D/`orb` a entrar ("pop").
- **8–25 s** no total para alcance (até 60 s em tutoriais). Nunca > 3 min.
- 1 ideia de movimento por cena; texto legível 2× (≥ 0,3 s/palavra, mín. 1,5 s); **som desligado** tem de funcionar.
- Última cena = CTA parado ≥ 2 s (o renderizador dá ≥ 4 s se `duration` não for definido).
- Sem marcas de água; áudio em tendência é adicionado **na app** (ou `meta.audio` se tivermos licença).

Passos:
1. Brief + 3 ganchos (ver `criar-carrossel` passos 2–3). Para testar ganchos: gera 2 versões da cena 1 e publica uma como **Trial Reel**.
2. `posts/AAAA-MM-DD-slug/post.json` com `"format": "reel"` e `"output": "reel.mp4"`. 4–6 cenas, `duration` por cena.
3. `node scripts/render.mjs posts/<pasta>` (frames estáticos = fallback sem movimento + capa) e `node scripts/render-video.mjs posts/<pasta>` (demora ~15 s de render por segundo de vídeo; correr em background).
4. QA: extrai frames com `ffmpeg -ss <t> -i export/reel.mp4 -frames:v 1 frame.png` (ex.: 0.3 s, meio de cada cena, fim) e verifica zonas seguras (nada importante nos 230 px de cima nem nos 384 px de baixo).
5. Capa do Reel: usar `export/slide-01.png` (conteúdo dentro do recorte 3:4 central da grelha).
6. Legenda com skill `legenda-instagram` (+ sugestão de áudio e de texto para o 1.º comentário).

Para um carrossel **misto** (imagem + vídeo, o formato com maior engagement): cria um `post.json` com `"format": "carousel"` só com o slide a animar e corre `render-video.mjs` — exporta MP4 1080×1440.
