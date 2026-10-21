import { forwardRef, useEffect, useRef } from 'react';
import { T } from '../i18n/I18nProvider';
import { scrollToTarget } from '../lib/scroll';
import { TICKET_URL, withQuery } from '../lib/env';

// Âncoras internas rolam via Lenis (com folga para a navbar fixa).
export function AnchorLink({ href, onClick, children, ...rest }) {
    const handleClick = (e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            scrollToTarget(target, { offset: -80 });
        }
    };
    return <a href={href} onClick={handleClick} {...rest}>{children}</a>;
}

// Botão verde "GARANTA SEU INGRESSO" — para âncora interna ou link externo.
export function CtaButton({ href = TICKET_URL, k = 'cta.ticket', className = '' }) {
    const cls = ('btn-cta ' + className).trim();
    const label = <T k={k} className="btn-cta-text" />;
    if (href.startsWith('#')) return <AnchorLink href={href} className={cls}>{label}</AnchorLink>;
    return <a href={withQuery(href)} target="_blank" className={cls}>{label}</a>;
}

// Botão da versão mobile (texto com outra classe).
export function MobileTicketButton({ href = TICKET_URL }) {
    return (
        <a className="btn-mobile" href={withQuery(href)} target="_blank">
            <T k="cta.ticket" className="btn-cta-text-mobile" />
        </a>
    );
}

export function DesktopTicketButton({ href = TICKET_URL }) {
    return (
        <section className="btn-ticket-desktop">
            <CtaButton href={href} />
        </section>
    );
}

// O React não escreve o atributo `muted` no HTML (só a propriedade), e sem o
// atributo o Safari/iOS recusa o autoplay. Aqui ele é garantido antes do play().
export const AutoVideo = forwardRef(function AutoVideo({ children, ...rest }, ref) {
    const localRef = useRef(null);
    const setRefs = (el) => {
        localRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
    };
    useEffect(() => {
        const video = localRef.current;
        if (!video) return;
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute('muted', '');
        const playing = video.play();
        if (playing && playing.catch) playing.catch(() => {});
    }, []);
    return (
        <video ref={setRefs} autoPlay muted loop playsInline {...rest}>
            {children}
        </video>
    );
});
