// Text Reveal — linha por linha: cada palavra ganha um span e cada linha uma
// barra que varre o texto quando o parágrafo entra na tela.
import { ScrollTrigger } from '../lib/scroll';

const SELECTOR = '.about p, .about-desktop p, .cant-miss-sub, .powerup-desc';

function wrapWords(el) {
    const words = [];
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const parts = node.textContent.split(/(\s+)/);
            const frag = document.createDocumentFragment();
            parts.forEach((part) => {
                if (!part || /^\s+$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                } else {
                    const inner = document.createElement('span');
                    inner.className = 'reveal-word-inner';
                    inner.textContent = part;
                    words.push(inner);
                    frag.appendChild(inner);
                }
            });
            node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(processNode);
        }
    }
    Array.from(el.childNodes).forEach(processNode);
    return words;
}

function buildLineBars(el, words) {
    const elRect = el.getBoundingClientRect();
    const lines = [];
    let lastTop = null;

    words.forEach((word) => {
        const top = Math.round(word.getBoundingClientRect().top);
        if (lastTop === null || Math.abs(top - lastTop) > 3) {
            lines.push({ top, words: [word] });
            lastTop = top;
        } else {
            lines[lines.length - 1].words.push(word);
        }
    });

    lines.forEach((line, i) => {
        const delay = `${i * 0.35}s`;
        const rect = line.words[0].getBoundingClientRect();

        // Set clip-path delay for all words on this line
        line.words.forEach((w) => w.style.setProperty('--word-delay', delay));

        // One bar per line
        const bar = document.createElement('span');
        bar.className = 'reveal-line-bar';
        bar.style.top = `${rect.top - elRect.top - 2}px`;
        bar.style.height = `${rect.height + 4}px`;
        bar.style.setProperty('--line-delay', delay);
        el.appendChild(bar);
    });
}

export function initReveal() {
    const revealEls = document.querySelectorAll(SELECTOR);
    const revealWordsMap = new Map();
    const revealTriggers = new WeakSet();
    const triggers = [];
    const pendingReveals = new Set();
    let revealInitScheduled = false;
    let destroyed = false;

    // As barras são posicionadas em px absolutos calculados uma única vez. Quando o
    // texto refluía (rotação do iPad, resize, troca de idioma) a quantidade e a
    // altura das linhas mudavam e as barras antigas ficavam soltas. Reconstrói.
    function rebuildLineBars() {
        revealWordsMap.forEach((words, el) => {
            el.querySelectorAll('.reveal-line-bar').forEach((bar) => bar.remove());
            // Num elemento já revelado as barras já varreram e sumiram; recriá-las
            // dispararia o barSweep de novo, então só limpa as obsoletas.
            if (el.classList.contains('is-revealed')) return;
            // .about e .about-desktop se revezam por breakpoint, então metade da
            // lista está sempre em display:none. Medir escondido devolve rect zero:
            // todas as palavras caíam numa "linha" só e o elemento ganhava uma barra
            // fantasma de 4px. Só mede o que está no layout.
            if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return;
            // A troca de idioma substitui o HTML interno; refaz os spans traduzidos.
            if (words.length && !words[0].isConnected) {
                words = wrapWords(el);
                revealWordsMap.set(el, words);
            }
            buildLineBars(el, words);
        });
    }

    function queueReveal(el) {
        pendingReveals.add(el);
        if (revealInitScheduled) return;
        revealInitScheduled = true;
        document.fonts.ready.then(() => requestAnimationFrame(() => {
            if (destroyed) return;
            pendingReveals.forEach((item) => {
                if (!item.isConnected || revealWordsMap.has(item)) return;
                item.classList.add('reveal-wrap');
                revealWordsMap.set(item, wrapWords(item));
            });
            pendingReveals.clear();
            rebuildLineBars();
            revealWordsMap.forEach((_, item) => {
                if (revealTriggers.has(item)) return;
                revealTriggers.add(item);
                triggers.push(ScrollTrigger.create({
                    trigger: item,
                    start: 'top 55%',
                    once: true,
                    onEnter: () => item.classList.add('is-revealed'),
                }));
            });
            ScrollTrigger.refresh();
            revealInitScheduled = false;
        }));
    }

    let observer = null;
    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);
                queueReveal(entry.target);
            });
        }, { rootMargin: '75% 0px' });
        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach(queueReveal);
    }

    return {
        rebuild: rebuildLineBars,
        destroy() {
            destroyed = true;
            if (observer) observer.disconnect();
            triggers.forEach((t) => t.kill());
        },
    };
}
