import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { CtaButton } from './common';
import { asset } from '../lib/env';
import { LINEUP } from '../data/lineup';

export default function Lineup({ onOpenBio }) {
    const { bio } = useI18n();
    const trackRef = useRef(null);

    const scrollByCard = (dir) => {
        const track = trackRef.current;
        const card = track?.querySelector('.lineup-card');
        if (!card) return;
        const amount = card.offsetWidth + parseInt(getComputedStyle(track).gap || 10, 10);
        track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };

    // Drag-to-scroll (desktop)
    useEffect(() => {
        const track = trackRef.current;
        let dragging = false;
        let startX = 0;
        let startScroll = 0;

        const onDown = (e) => {
            dragging = true;
            startX = e.pageX;
            startScroll = track.scrollLeft;
            track.style.scrollSnapType = 'none';
        };
        const onUp = () => {
            if (!dragging) return;
            dragging = false;
            track.style.scrollSnapType = '';
        };
        const onMove = (e) => {
            if (!dragging) return;
            track.scrollLeft = startScroll - (e.pageX - startX);
        };

        track.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('mousemove', onMove);
        return () => {
            track.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('mousemove', onMove);
        };
    }, []);

    const open = (item) => onOpenBio(bio(item.key, item.bio));

    return (
        <section id="lineup" className="lineup">
            <div className="lineup-inner">
                <h2 className="lineup-heading">lineup</h2>
                <div className="lineup-carousel">
                    <div className="lineup-grid" ref={trackRef}>
                        {LINEUP.map((item) => (
                            <article
                                key={item.key}
                                className="lineup-card has-bio"
                                role="button"
                                tabIndex={0}
                                onClick={() => open(item)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(item); }}
                            >
                                <img className="lineup-card-img" src={asset(item.img)} alt={item.alt}
                                     loading="lazy" decoding="async" width="756" height="1071" />
                            </article>
                        ))}
                    </div>
                    <div className="lineup-nav">
                        <button className="lineup-btn lineup-prev" aria-label="Anterior" onClick={() => scrollByCard(-1)}>&#8592;</button>
                        <button className="lineup-btn lineup-next" aria-label="Próximo" onClick={() => scrollByCard(1)}>&#8594;</button>
                    </div>
                </div>
                <CtaButton />
            </div>
        </section>
    );
}
