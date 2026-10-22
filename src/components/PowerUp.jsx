import { T } from '../i18n/I18nProvider';
import { DesktopTicketButton, MobileTicketButton } from './common';
import { asset, POWERUP_URL } from '../lib/env';

const ITEMS = [
    { k: 'powerup.i1', price: 'R$99' },
    { k: 'powerup.i2', price: 'R$30' },
    { k: 'powerup.i3', price: 'R$05' },
    { k: 'powerup.i4', price: 'R$20' },
    { k: 'powerup.i5', price: 'R$89' },
];

export default function PowerUp() {
    return (
        <section className="powerup">
            <div className="powerup-inner">
                <div className="powerup-logo">
                    <img src={asset('assets/imagens/titulo-power-up.png')} alt="POWER-UP" width="756" height="630" loading="lazy" decoding="async" />
                </div>
                <div className="powerup-content">
                    <T as="p" k="powerup.desc" className="powerup-desc" />
                    <ul className="powerup-list">
                        {ITEMS.map((item) => (
                            <li className="powerup-item" key={item.k}>
                                <T k={item.k} className="powerup-item-name" />
                                <span className="powerup-item-price">{item.price}</span>
                            </li>
                        ))}
                    </ul>

                    <section className="total">
                        <div className="total-row">
                            <T as="div" k="powerup.without" className="powerup-bundle-label" />
                            <span className="powerup-old-price">R$243</span>
                        </div>
                        <div className="total-row">
                            <div className="powerup-bundle-group">
                                <T as="div" k="powerup.all" className="powerup-bundle-label" />
                                <T as="div" k="powerup.with" className="powerup-bundle-label-2" />
                            </div>
                            <span className="powerup-new-price">R$119</span>
                        </div>
                    </section>
                </div>
                <MobileTicketButton href={POWERUP_URL} />
            </div>

            <DesktopTicketButton href={POWERUP_URL} />
        </section>
    );
}
