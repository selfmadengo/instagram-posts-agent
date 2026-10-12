# Design — análise de inspiração e tendências

## Referências pedidas
- **@marketingharry** (Instagram) — exemplo no SOP: `brand/reference-marketingharry-example.png`.
- **canva.com/p/kingup** (criador Canva).

> Nota: o ambiente de trabalho não consegue abrir instagram.com nem canva.com (bloqueados pela política de rede), por isso a análise baseia-se no exemplo do SOP e no que está descrito no brand kit. Se quiseres uma análise mais funda, coloca 5–10 capturas de ecrã em `docs/research/inspiracao/` e o agente atualiza este ficheiro.

### O que torna o estilo "marketingharry" tão eficaz (exemplo "Instagram HOOKS ARE DEAD")
1. **Hierarquia em 3 níveis, lida em < 2 s**: assinatura pequena no topo ("Social Media Marketing | @handle") → *eyebrow* com tracking muito aberto ("I N S T A G R A M") → **título gigante condensado** em caixa alta que ocupa a largura toda.
2. **Uma palavra com gradiente** (magenta→laranja) = o único destaque. O resto a preto. → Para a Selfmade: **uma palavra em gradiente Vermelho-Self Luz**.
3. **Objeto 3D hiper-realista** (caveira + cobras) **por baixo do título, a sobrepô-lo ligeiramente**, com sombra de contacto. É o "pattern interrupt" que para o scroll e cria curiosidade. → É exatamente a regra do brand kit Selfmade ("elementos 3D/realistas, abaixo do texto, a sobrepô-lo um pouco, com degradês").
4. **Afirmação contrária/provocadora** ("Hooks are dead") → gera curiosidade e comentários.
5. **Fundo limpo** e muito espaço vazio à volta do ponto focal.
6. Foto/avatar do autor discreto no canto → pessoa real = confiança.

### Tradução para a Selfmade
| Harry | Selfmade |
|---|---|
| Fundo branco | Fundo **Preto Azulado #030e14** (60 %), com slides claros de ritmo |
| Gradiente magenta→laranja | Gradiente **#ff6b6f → #f0444a → #e2333a** (vermelho da marca, versão legível em fundo escuro) |
| Fonte condensada black | **Thunder Bold** |
| Eyebrow sans tracking aberto | **Euclid Square SemiBold**, tracking +22 % |
| — | **Instrument Serif Itálico** para 1–3 palavras de "voz humana" (*quase*, *de volta*) |
| Objeto 3D surreal | Objetos 3D realistas de viagem/mobilidade: avião, globo, passaporte, mala, bilhete de embarque, mapa, bandeira UE, foguetão (empreendedorismo) |
| Avatar do autor | Ícone do logótipo + @handle no topo de cada slide |

## Tendências 2026 relevantes
- Elementos **3D esculpidos/táteis**, tipografia expressiva, composições em camadas ([Picsart — design trends 2026](https://picsart.com/blog/design-trends-2026/)).
- Cada slide funciona **como um poster** isolado; preto profundo + acento neon/saturado para contraste ([exemplo](https://freelancehunt.com/en/showcase/work/design-instagram-carousel-for-creative-media/2040604.html)).
- Ponto focal nos **60 % centrais**; a UI do Instagram pode tapar até 15 % em baixo/direita ([MyPost — hook design](https://www.trymypost.com/blog/instagram-carousel-hook-design-principles-2026)).
- Consistência de marca (mesmas cores/fontes) + contraste forte para mobile ([PostNitro](https://postnitro.ai/blog/post/instagram-carousel-design)).

## Elementos 3D — como obter
1. **Banco de assets** em `assets/3d/` (PNG transparente, ≥ 1600 px). Nomes: `aviao-branco.png`, `globo-europa.png`, `passaporte.png`, `mala-viagem.png`, `bilhete-embarque.png`, `foguetao.png`…
2. **Geração por IA** (Canva AI — ligado nesta conta e testado com sucesso). Prompt-base em `docs/prompts-3d.md`. Limitação atual: o contentor não consegue descarregar ficheiros de canva.com → ou se autoriza o domínio na rede do ambiente, ou se descarrega à mão para `assets/3d/`.
3. Sem asset: o template usa o **"orb" da marca** (globo do logótipo em esfera vermelha com volume, luz de cima e sombra para baixo).
