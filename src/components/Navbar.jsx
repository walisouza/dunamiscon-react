import { useEffect, useRef, useState } from 'react';
import { T, useI18n } from '../i18n/I18nProvider';
import { AnchorLink } from './common';
import { asset } from '../lib/env';

const LANG_OPTIONS = [
    { code: 'pt', label: 'Português' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
];

export default function Navbar({ menuOpen, onOpenMenu }) {
    const { lang, setLang, t } = useI18n();
    const [scrolled, setScrolled] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const switcherRef = useRef(null);

    // Vazada no topo, ganha fundo depois que a página rola (o CSS só aplica o
    // fundo no desktop).
    useEffect(() => {
        const update = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', update, { passive: true });
        update();
        return () => window.removeEventListener('scroll', update);
    }, []);

    // Dropdown de idioma fecha ao clicar fora ou com Esc.
    useEffect(() => {
        if (!langOpen) return;
        const onClick = (e) => {
            if (!switcherRef.current?.contains(e.target)) setLangOpen(false);
        };
        const onKey = (e) => { if (e.key === 'Escape') setLangOpen(false); };
        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('click', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [langOpen]);

    return (
        <nav className={'navbar' + (scrolled ? ' is-scrolled' : '')}>
            <div className="nav-logo">
                <img src={asset('assets/gifs/logo-reduzido-menu.gif')} alt="DC 26" className="nav-logo-img nav-logo-mobile" />
                <img src={asset('assets/imagens/logo-dunamiscon-nav-desktop.png')} alt="DC 26" className="nav-logo-img nav-logo-desktop" />
            </div>
            <div className="nav-desktop-links">
                <AnchorLink href="#setores" className="nav-desktop-link"><T k="nav.tickets" /></AnchorLink>
                <AnchorLink href="#sobre" className="nav-desktop-link"><T k="nav.about" /></AnchorLink>
                <AnchorLink href="#lineup" className="nav-desktop-link"><T k="nav.lineup" /></AnchorLink>
                <AnchorLink href="#faq" className="nav-desktop-link"><T k="nav.faq" /></AnchorLink>
            </div>
            <div className="nav-right">
                <div className={'lang-switcher' + (langOpen ? ' is-open' : '')} ref={switcherRef}>
                    <button
                        className="lang-btn"
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={langOpen}
                        aria-label={t('aria.lang')}
                        onClick={() => setLangOpen((open) => !open)}
                    >
                        <svg className="lang-globe" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
                            <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
                            <line x1="3.2" y1="9" x2="20.8" y2="9" stroke="currentColor" strokeWidth="1.8" />
                            <line x1="3.2" y1="15" x2="20.8" y2="15" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        <span className="lang-current">{lang.toUpperCase()}</span>
                    </button>
                    <ul className="lang-menu" role="menu">
                        {LANG_OPTIONS.map((opt) => (
                            <li key={opt.code}>
                                <button
                                    type="button"
                                    className={'lang-option' + (lang === opt.code ? ' is-active' : '')}
                                    role="menuitem"
                                    aria-current={lang === opt.code ? 'true' : 'false'}
                                    onClick={() => { setLang(opt.code); setLangOpen(false); }}
                                >
                                    <span className="lang-code">{opt.code.toUpperCase()}</span>{opt.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="menu-icon">
                    <button
                        className={'nav-menu-btn' + (menuOpen ? ' is-active' : '')}
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                        onClick={onOpenMenu}
                    >
                        <span className="r1"></span>
                        <span className="r2"></span>
                        <span className="r3"></span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
