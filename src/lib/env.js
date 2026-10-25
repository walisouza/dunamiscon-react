// Efeitos de desktop usam Lenis e Three.js; telas de toque mantêm o vídeo nativo.
export const DESKTOP_EFFECTS =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Arquivos de public/ (imagens, vídeos, fontes). BASE_URL respeita o `base` do
// vite.config, então o site funciona na raiz do domínio ou numa subpasta.
export const asset = (path) => import.meta.env.BASE_URL + path;

// Repassa os parâmetros da URL da página (utm_*, etc.) para os links de compra,
// como o script "Append query parameters to all links" fazia na versão HTML.
const pageParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

export function withQuery(href) {
    if (!pageParams.toString() || !/^https?:/i.test(href)) return href;
    const url = new URL(href);
    pageParams.forEach((value, key) => url.searchParams.set(key, value));
    return url.toString();
}

export const TICKET_URL = 'https://www.e-inscricao.com/event/dunamismovement/dnmscon26';
export const POWERUP_URL = 'https://www.e-inscricao.com/dunamismovement/pupdnmscon26#payment-information-section';
export const RECAP_VIDEO_URL = 'https://www.youtube.com/embed/RYDVXNaIJc0?autoplay=1';
