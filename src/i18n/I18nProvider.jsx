/* =============================================================
   DUNAMIS CON '26 — i18n (PT-BR / EN / ES)
   O português fica em pt.json e já vem no bundle; EN e ES são baixados
   só quando escolhidos (import dinâmico).
   ============================================================= */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PT from './pt.json';

const STORAGE_KEY = 'dc26-lang';
export const LANGS = ['pt', 'en', 'es'];
const HTML_LANG = { pt: 'pt-BR', en: 'en', es: 'es' };

const LOADERS = {
    en: () => import('./en.json'),
    es: () => import('./es.json'),
};

function initialLang() {
    const param = new URLSearchParams(window.location.search).get('lang');
    if (param && LANGS.includes(param.toLowerCase().slice(0, 2))) {
        return param.toLowerCase().slice(0, 2);
    }
    let stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* sem storage */ }
    if (stored && LANGS.includes(stored)) return stored;

    const nav = (navigator.language || 'pt').toLowerCase();
    if (nav.startsWith('pt')) return 'pt';
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('en')) return 'en';
    return 'pt';
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
    const [lang, setLangState] = useState('pt');
    const [packs, setPacks] = useState({ pt: { dict: PT, bios: {} } });
    const packsRef = useRef(packs);
    const requestRef = useRef(0);

    const setLang = useCallback((next, persist = true) => {
        const selected = LANGS.includes(next) ? next : 'pt';
        const request = ++requestRef.current;

        const commit = () => {
            if (request !== requestRef.current) return;
            setLangState(selected);
            if (persist) {
                try { localStorage.setItem(STORAGE_KEY, selected); } catch (e) { /* sem storage */ }
            }
        };

        if (packsRef.current[selected]) return commit();
        LOADERS[selected]()
            .then((mod) => {
                const pack = mod.default || mod;
                packsRef.current = { ...packsRef.current, [selected]: pack };
                setPacks(packsRef.current);
                commit();
            })
            .catch(() => {
                if (request === requestRef.current) setLangState('pt');
            });
    }, []);

    useEffect(() => { setLang(initialLang()); }, [setLang]);

    // O CSS usa html[data-lang] (ex.: arte do "e muito mais" em EN/ES).
    useEffect(() => {
        document.documentElement.lang = HTML_LANG[lang];
        document.documentElement.setAttribute('data-lang', lang);
    }, [lang]);

    const value = useMemo(() => {
        const pack = packs[lang];
        const t = (key) => {
            if (pack && typeof pack.dict[key] === 'string') return pack.dict[key];
            return PT[key] || '';
        };
        const bio = (key, ptBio) => (pack && pack.bios && pack.bios[key]) || ptBio;
        return { lang, setLang, t, bio };
    }, [lang, packs, setLang]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    return useContext(I18nContext);
}

// Textos traduzidos carregam marcação (<span class="highlight">, <br>, <p>…),
// por isso entram como HTML — o conteúdo vem só dos dicionários do projeto.
export function T({ k, as: Tag = 'span', ...rest }) {
    const { t } = useI18n();
    return <Tag {...rest} dangerouslySetInnerHTML={{ __html: t(k) }} />;
}

// Artes com texto: cada idioma aponta para o seu arquivo; sem versão, fica a de PT.
export function LocalizedImg({ src, alt = '', i18n = {}, ...rest }) {
    const { lang } = useI18n();
    const variant = i18n[lang] || {};
    return <img src={variant.src || src} alt={variant.alt || alt} {...rest} />;
}
