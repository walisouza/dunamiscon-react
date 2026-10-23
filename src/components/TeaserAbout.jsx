import { LocalizedImg, T } from '../i18n/I18nProvider';
import { CtaButton, DesktopTicketButton } from './common';
import { asset } from '../lib/env';

const GALERIA = [
    { src: '1.png', w: 368, h: 534 },
    { src: '2.png', w: 363, h: 358 },
    { src: '3.png', w: 324, h: 227 },
    { src: '4.png', w: 372, h: 301 },
    { src: '6.webp', w: 503, h: 652 },
    { src: '7.webp', w: 432, h: 617 },
    { src: '8.png', w: 436, h: 227 },
    { src: '9.webp', w: 539, h: 424 },
];

const ABOUT_KEYS = ['about.p1', 'about.p2', 'about.p3', 'about.p4', 'about.p5', 'about.p6', 'about.p7'];

// A arte "foi incrível" em EN/ES é a mesma no mobile e no desktop.
const FOI_INCRIVEL_I18N = {
    en: { src: asset('assets/imagens/en/foi-incrivel.webp') },
    es: { src: asset('assets/imagens/es/foi-incrivel.webp') },
};

// Galeria 3D + texto "sobre". No desktop ficam lado a lado (a galeria fica presa
// enquanto o texto rola — ver effects/galeria.js); no mobile, um embaixo do outro.
export default function TeaserAbout() {
    return (
        <div className="teaser-about-wrapper">
            <section id="sobre" className="video-teaser">
                {/* mobile: SVG diagonal | desktop: PNG */}
                <LocalizedImg src={asset('assets/imagens/foi-incrivel.svg')} i18n={FOI_INCRIVEL_I18N}
                              className="video-teaser-bg video-teaser-bg-mobile" loading="lazy" decoding="async" />
                <LocalizedImg src={asset('assets/imagens/texto-video-foi-incrivel.webp')} i18n={FOI_INCRIVEL_I18N}
                              className="video-teaser-bg video-teaser-bg-desktop" loading="lazy" decoding="async"
                              width="991" height="1165" />
                <div className="galeria-stage">
                    {GALERIA.map((img) => (
                        <div className="galeria-card" key={img.src}>
                            <img src={asset('assets/imagens/galeria/' + img.src)} alt="" loading="lazy" decoding="async"
                                 width={img.w} height={img.h} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ABOUT DESKTOP (coluna direita — visível só no desktop) */}
            <div className="about-desktop">
                {ABOUT_KEYS.map((k) => <T as="p" key={k} k={k} className="about-text" />)}
                <DesktopTicketButton />
            </div>

            {/* ABOUT SECTION (mobile/tablet) */}
            <section className="about" id="sobre-mobile">
                <div className="about-inner">
                    {ABOUT_KEYS.map((k) => <T as="p" key={k} k={k} className="about-text" />)}
                    <CtaButton href="#setores" />
                </div>
            </section>
        </div>
    );
}
