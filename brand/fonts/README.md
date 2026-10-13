# Fontes

| Fonte | Pasta | Licença | No git? |
|---|---|---|---|
| Thunder (títulos) | `thunder/` | Comercial | **Não** — repositório público |
| Euclid Square (parágrafos) | `euclid-square/` | Comercial | **Não** — repositório público |
| Instrument Serif (destaques) | `instrument-serif/` | SIL OFL | Sim |

## Instalar as fontes comerciais (uma vez por máquina/sessão)
Estão no Google Drive da Selfmade: **Branding Selfmade → Fontes** (`THUNDER/`, `euclid-square/`).

Ficheiros necessários (o CSS usa os `.woff2`):
```
brand/fonts/thunder/Thunder-MediumLC.woff2
brand/fonts/thunder/Thunder-SemiBoldLC.woff2
brand/fonts/thunder/Thunder-BoldLC.woff2
brand/fonts/thunder/Thunder-BlackLC.woff2          (Fonts/Web-TT/ no zip THUNDER)
brand/fonts/euclid-square/EuclidSquare-Light.woff2
brand/fonts/euclid-square/EuclidSquare-Regular.woff2
brand/fonts/euclid-square/EuclidSquare-Italic.woff2
brand/fonts/euclid-square/EuclidSquare-Medium.woff2
brand/fonts/euclid-square/EuclidSquare-SemiBold.woff2
brand/fonts/euclid-square/EuclidSquare-Bold.woff2
```
No Claude Code: pede *"instala as fontes da marca a partir do Drive"* — o agente usa o conector Google Drive para as descarregar para estas pastas. Sem as fontes, os renders usam fontes de recurso (o resultado **não** fica conforme a marca).

> Se tornares o repositório **privado** e a licença o permitir, podes remover estas linhas do `.gitignore` e versionar as fontes.
