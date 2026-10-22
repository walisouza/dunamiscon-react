import { LocalizedImg, T } from '../i18n/I18nProvider';
import { DesktopTicketButton, MobileTicketButton } from './common';
import { asset, TICKET_URL, withQuery } from '../lib/env';
import { TICKET_GROUPS } from '../data/tickets';

// "Já entendeu que não pode ficar de fora" + mapa + setores.
export default function Tickets() {
    return (
        <section className="cant-miss">
            <div className="cant-miss-overlay">
                <T as="p" k="cant.pre" className="cant-miss-pre" />
                <T as="h2" k="cant.cant" className="nao-pode" />
                <T as="h2" k="cant.title" className="cant-miss-title" />
                <T as="p" k="cant.post" className="cant-miss-post" />
                <T as="p" k="cant.sub" className="cant-miss-sub" />

                {/* MAPA */}
                <div className="mapa">
                    <LocalizedImg
                        src={asset('assets/imagens/mapa.webp')}
                        alt="Mapa"
                        i18n={{
                            en: { src: asset('assets/imagens/en/mapa.webp'), alt: 'Map' },
                            es: { src: asset('assets/imagens/es/mapa.webp'), alt: 'Mapa' },
                        }}
                        loading="lazy" decoding="async" width="990" height="582"
                    />
                </div>

                {/* SETORES */}
                <div id="setores" className="setores">
                    {TICKET_GROUPS.map((group) => (
                        <div className="lote-group" key={group.sector}>
                            <T as="h3" k="tickets.batch" className="lote-heading" />
                            <div className="lote-row">
                                {group.cards.map((card) => (
                                    <a key={card.img} className="ticket-card" href={withQuery(TICKET_URL)} target="_blank" rel="noopener">
                                        <img src={asset(card.img)} alt={card.alt} loading="lazy" decoding="async" width={card.w} height={card.h} />
                                    </a>
                                ))}
                            </div>
                            <T as="h4" k={group.sector} className="lote-sector-label" />
                        </div>
                    ))}

                    <MobileTicketButton />
                </div>
                <DesktopTicketButton />
            </div>
        </section>
    );
}
