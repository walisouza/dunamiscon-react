import { LocalizedImg, T } from '../i18n/I18nProvider';
import { CtaButton } from './common';
import { asset } from '../lib/env';

// As quatro linhas grandes são arte (SVG em PT, webp traduzido em EN/ES).
const ARTS = [
    {
        src: 'assets/imagens/textos/preletores nacionais e internacionais.svg',
        alt: 'Preletores nacionais e internacionais',
        name: 'preletores',
        en: 'National and international speakers',
        es: 'Oradores nacionales y internacionales',
    },
    { src: 'assets/imagens/textos/multipalcos.svg', alt: 'Multi palcos', name: 'multipalcos', en: 'Multiple stages', es: 'Múltiples escenarios' },
    { src: 'assets/imagens/textos/stands interativos.svg', alt: 'Stands interativos', name: 'stands', en: 'Interactive booths', es: 'Stands interactivos' },
    { src: 'assets/imagens/textos/sala profetica.svg', alt: 'Sala profética', name: 'sala-profetica', en: 'Prophetic room', es: 'Sala profética' },
];

const translated = (name, en, es) => ({
    en: { src: asset(`assets/imagens/en/${name}.webp?v=2`), alt: en },
    es: { src: asset(`assets/imagens/es/${name}.webp?v=2`), alt: es },
});

export default function Espera() {
    return (
        <section className="espera">
            <div className="espera-inner">
                <T as="p" k="espera.pre" className="espera-pre" />
                <img src={asset('assets/imagens/logo-dunamiscon-nav-desktop.png')} alt="Dunamis Con '26" className="espera-logo"
                     loading="lazy" decoding="async" width="374" height="23" />

                <ul className="espera-list">
                    {ARTS.map((art) => (
                        <li className="espera-item" key={art.name}>
                            <LocalizedImg className="espera-art" src={asset(art.src)} alt={art.alt}
                                          i18n={translated(art.name, art.en, art.es)} loading="lazy" decoding="async" />
                        </li>
                    ))}
                    {/* "e muito mais..": em PT é texto; em EN/ES o CSS troca pela arte. */}
                    <li className="espera-item espera-mais-linha">
                        <T k="espera.e" className="espera-e" />
                        <T k="espera.muito" className="espera-muito" />
                        <T k="espera.mais" className="espera-mais" />
                        <LocalizedImg
                            className="espera-art espera-mais-art"
                            src={asset('assets/imagens/en/muito-mais.webp')}
                            alt="And much more"
                            i18n={{
                                en: { src: asset('assets/imagens/en/muito-mais.webp'), alt: 'And much more' },
                                es: { src: asset('assets/imagens/es/muito-mais.webp?v=2'), alt: 'Y mucho más' },
                            }}
                            loading="lazy" decoding="async" width="1400" height="333"
                        />
                    </li>
                </ul>

                <CtaButton href="#setores" />
            </div>
        </section>
    );
}
