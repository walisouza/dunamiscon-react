import { useState } from 'react';
import { T } from '../i18n/I18nProvider';

const TOTAL = 23;
const VISIBLE = 8; // as demais ficam no "Clique aqui e Saiba Mais"

function FaqItem({ n, open, onToggle }) {
    return (
        <div className="faq-item">
            <button className="faq-question" aria-expanded={open} onClick={onToggle}>
                <T k={`faq.q${n}`} />
                <svg className="faq-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <T as="div" k={`faq.a${n}`} className={'faq-answer' + (open ? ' is-open' : '')} />
        </div>
    );
}

export default function Faq() {
    const [openItem, setOpenItem] = useState(null); // acordeão: uma aberta por vez
    const [showMore, setShowMore] = useState(false);

    const item = (n) => (
        <FaqItem key={n} n={n} open={openItem === n} onToggle={() => setOpenItem(openItem === n ? null : n)} />
    );
    const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

    return (
        <section id="faq" className="faq">
            <h2 className="faq-title">faq</h2>
            <div className="faq-inner">
                <div className="faq-list">
                    {range(1, VISIBLE).map(item)}

                    <div className={'faq-more' + (showMore ? ' is-open' : '')} id="faqMore" aria-hidden={!showMore}>
                        {range(VISIBLE + 1, TOTAL).map(item)}
                    </div>

                    <button className="faq-toggle-btn" id="faqToggleBtn" aria-expanded={showMore} onClick={() => setShowMore(!showMore)}>
                        <T k={showMore ? 'faq.less' : 'faq.more'} className="faq-toggle-label" />
                        <svg className="faq-toggle-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
