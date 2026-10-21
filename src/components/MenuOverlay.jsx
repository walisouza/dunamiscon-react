import { useEffect } from 'react';
import { T, useI18n } from '../i18n/I18nProvider';
import { asset } from '../lib/env';
import { scrollToTarget, startScroll, stopScroll } from '../lib/scroll';
import { disableMouseDistortion } from '../lib/distortionControl';

const LINKS = [
    { href: '#sobre', k: 'nav.about' },
    { href: '#setores', k: 'nav.tickets' },
    { href: '#lineup', k: 'nav.lineup' },
    { href: '#faq', k: 'nav.faq' },
];

const LANG_OPTIONS = [
    { code: 'pt', label: 'Português' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
];

export default function MenuOverlay({ open, onClose }) {
    const { lang, setLang, t } = useI18n();

    useEffect(() => {
        if (!open) return;
        stopScroll();
        disableMouseDistortion();
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            startScroll();
        };
    }, [open, onClose]);

    const goTo = (e, href) => {
        e.preventDefault();
        const target = document.getElementById(href.slice(1));
        onClose();
        // Espera o menu sair da tela antes de rolar.
        if (target) setTimeout(() => scrollToTarget(target, { duration: 1.2 }), 300);
    };

    return (
        <div className={'menu-overlay' + (open ? ' is-open' : '')} id="menuOverlay" aria-hidden={!open}>
            <div className="menu-overlay-header">
                <div className="menu-overlay-logo">
                    <img src={asset('assets/imagens/logo-reduzido.png')} alt="DC 26" className="nav-logo-img" />
                </div>
                <button className="menu-close-btn" aria-label={t('aria.close')} onClick={onClose}>
                    <img src={asset('assets/imagens/close-menu.png')} alt="Fechar" />
                </button>
            </div>
            <nav className="menu-overlay-nav">
                {LINKS.map((link) => (
                    <a key={link.href} href={link.href} className="menu-overlay-link" onClick={(e) => goTo(e, link.href)}>
                        <T k={link.k} />
                    </a>
                ))}
            </nav>

            <div className="menu-overlay-lang">
                <T k="menu.language" className="menu-overlay-lang-label" />
                <div className="menu-lang-options">
                    {LANG_OPTIONS.map((opt) => (
                        <button
                            key={opt.code}
                            type="button"
                            className={'menu-lang-option' + (lang === opt.code ? ' is-active' : '')}
                            aria-current={lang === opt.code ? 'true' : 'false'}
                            onClick={() => setLang(opt.code)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
