import { T } from '../i18n/I18nProvider';
import { CtaButton } from './common';
import { asset } from '../lib/env';

export default function Caravana() {
    return (
        <section className="caravana">
            <T as="h2" k="caravana.heading" className="caravana-heading" />
            <T as="p" k="caravana.subtitle" className="caravana-subtitle" />

            <div className="caravana-body">
                <div className="caravana-photo">
                    <img src={asset('assets/imagens/foto caravana.webp?v=2')} alt="Grupo de amigos em caravana para a Dunamis Con"
                         loading="lazy" decoding="async" width="1050" height="798" />
                </div>
                <div className="caravana-text">
                    <T as="p" k="caravana.p1" />
                    <T as="p" k="caravana.p2" />
                    <T as="p" k="caravana.p3" />
                </div>
            </div>

            <CtaButton k="cta.caravana" className="caravana-btn" />
        </section>
    );
}
