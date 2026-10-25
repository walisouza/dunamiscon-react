// ── Lenis smooth scroll + GSAP ScrollTrigger ────────────────────────────────
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESKTOP_EFFECTS } from './env';

gsap.registerPlugin(ScrollTrigger);

// iOS/iPadOS toggles the address bar during scroll, which fires resize events
// that make ScrollTrigger recalc pinned sections mid-scroll (the galeria pin
// stutters because of this). Ignoring small mobile/tablet resizes fixes it.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

let lenis = null;
let lenisPromise = null;
let previousOverflow = '';

// Lenis só entra no desktop, e só é baixado lá (import dinâmico).
export function initSmoothScroll() {
    if (!DESKTOP_EFFECTS) return Promise.resolve(null);
    if (lenisPromise) return lenisPromise;
    lenisPromise = import('lenis')
        .then(({ default: Lenis }) => {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothTouch: false,
                syncTouch: true,
            });
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
            return lenis;
        })
        .catch(() => null);
    return lenisPromise;
}

export function scrollToTarget(target, { offset = 0, duration } = {}) {
    if (!target) return;
    if (lenis) {
        lenis.scrollTo(target, duration ? { offset, duration } : { offset });
        return;
    }
    window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top + offset,
        behavior: 'smooth',
    });
}

export function stopScroll() {
    if (lenis) return lenis.stop();
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
}

export function startScroll() {
    if (lenis) return lenis.start();
    document.documentElement.style.overflow = previousOverflow;
}
