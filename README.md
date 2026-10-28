# Dunamis Con '26 — React

Versão em React (Vite) da landing page que antes era `home/` em HTML, CSS e JS.

## Comandos

```bash
npm install      # primeira vez
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # gera a pasta dist/ para publicar
npm run preview  # serve o dist/ localmente para conferir o build
```

O conteúdo de `dist/` é estático: dá para subir no mesmo lugar onde o HTML
antigo estava hospedado (raiz do domínio ou subpasta).

## Onde fica cada coisa

| O quê | Onde |
|---|---|
| Seções da página | `src/components/` (uma por dobra, na ordem de `src/App.jsx`) |
| Line-up (fotos e bios em PT) | `src/data/lineup.js` |
| Ingressos (imagens, alt, tamanhos) | `src/data/tickets.js` |
| Textos em PT / EN / ES | `src/i18n/pt.json`, `en.json`, `es.json` |
| Artes traduzidas (espera, mapa, foi incrível) | props `i18n` do `LocalizedImg` nos componentes |
| CSS | `src/styles/site.css` (era o `stylev2.css`), `critical.css`, `lineup-desktop.css` |
| Animações (galeria 3D, reveal, dissolve, WebGL) | `src/effects/` |
| Imagens, vídeos e fontes | `public/assets/` |

## Traduções

Os textos ficam nos três JSON com as mesmas chaves (`about.p1`, `faq.q3`…).
Podem conter HTML (`<span class="highlight">`, `<br>`), que é renderizado como está.
As bios do line-up em EN/ES ficam em `bios` dentro de `en.json`/`es.json`.

## Observações

- Lenis e Three.js só são baixados em telas com mouse, como no original.
- Os parâmetros da URL (`utm_*` etc.) são repassados para os links externos de compra.

## Rodando localmente

```bash
npm install
npm run dev     # servidor de desenvolvimento (Vite)
npm run build   # build de produção em dist/
```
