import { useEffect } from 'react';
import { T } from '../i18n/I18nProvider';
import { AnchorLink } from './common';
import { asset } from '../lib/env';

const ELFSIGHT_SRC = 'https://elfsightcdn.com/platform.js';

export default function Footer() {
    // Feed do Instagram (Elfsight): o script procura o container na página, então
    // só entra depois que o React montou o rodapé.
    useEffect(() => {
        if (document.querySelector(`script[src="${ELFSIGHT_SRC}"]`)) return;
        const script = document.createElement('script');
        script.src = ELFSIGHT_SRC;
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <footer className="footer">
            <div className="footer-inner">
                {/* Logo: mobile gif / desktop png */}
                <img src={asset('assets/gifs/logo-banner-mobile.webp')} alt="Dunamis Con 26" className="footer-logo footer-logo-mobile"
                     loading="lazy" decoding="async" width="675" height="900" />
                <img src={asset('assets/imagens/logotipo-dunamiscon-desktop-footer.png')} alt="Dunamis Con" className="footer-logo footer-logo-desktop"
                     loading="lazy" decoding="async" width="1815" height="65" />

                {/* Duas colunas desktop */}
                <div className="footer-columns">
                    {/* Col esquerda: frase + nav + social */}
                    <div className="footer-col-left">
                        <T as="p" k="footer.quote" className="footer-quote" />

                        <nav className="footer-nav">
                            <AnchorLink href="#sobre" className="footer-nav-link"><T k="nav.about" /></AnchorLink>
                            <AnchorLink href="#lineup" className="footer-nav-link"><T k="nav.lineup" /></AnchorLink>
                            <AnchorLink href="#setores" className="footer-nav-link"><T k="nav.tickets" /></AnchorLink>
                            <AnchorLink href="#faq" className="footer-nav-link"><T k="nav.faq" /></AnchorLink>
                        </nav>

                        <div className="footer-social">
                            <a href="https://instagram.com/dunamismovement" target="_blank" rel="noopener" className="footer-social-link" aria-label="Instagram">
                                <svg width="30" height="44" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.247 2.242 1.31 3.608.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.31 3.608-.975.975-2.242 1.247-3.608 1.31-1.265.058-1.645.069-4.849.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.31-.975-.975-1.247-2.242-1.31-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.31-3.608.975-.975 2.242-1.247 3.608-1.31C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                            </a>
                            <a href="https://tiktok.com/@dunamismovement" target="_blank" rel="noopener" className="footer-social-link" aria-label="TikTok">
                                <svg width="38" height="44" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" /></svg>
                            </a>
                            <a href="https://www.youtube.com/@DunamisMovement_" target="_blank" rel="noopener" className="footer-social-link" aria-label="YouTube">
                                <svg width="38" height="44" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </a>
                            <a href="https://facebook.com/thedunamismovement" target="_blank" rel="noopener" className="footer-social-link" aria-label="Facebook">
                                <img src={asset('assets/imagens/facebook-logo.svg')} alt="Facebook" width="30" height="44" loading="lazy" decoding="async" />
                            </a>
                        </div>
                    </div>

                    {/* Col direita: feed Instagram (Elfsight) */}
                    <div className="footer-col-right">
                        <div className="elfsight-app-a2c13acc-7c14-496b-89a8-1dae2308e3b6" data-elfsight-app-lazy></div>
                    </div>
                </div>

                <T as="small" k="footer.copy" className="footer-copy" />
            </div>
        </footer>
    );
}
