// ── Particle Dissolve ────────────────────────────────────────────────────
// Ao entrar na tela, a seção nasce coberta por uma cor sólida que se desfaz em
// pixels conforme o scroll avança (e volta a se fechar no scroll para cima).
import { ScrollTrigger } from '../lib/scroll';
import { gNoise } from './noise';

function setupDissolve(selector, fillColor, PX) {
    const section = document.querySelector(selector);
    if (!section) return null;

    let canvas = null;
    let ctx = null;
    let pixels = [];
    let pointer = 0;
    let lastProgress = -1;

    function build(startFull) {
        if (canvas) canvas.remove();

        const W = section.offsetWidth;
        const H = Math.min(section.offsetHeight, window.innerHeight * 1.05);
        const cols = Math.ceil(W / PX);
        const rows = Math.ceil(H / PX);

        canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        Object.assign(canvas.style, {
            position: 'absolute', top: '0', left: '0',
            width: '100%', height: H + 'px',
            zIndex: '10', pointerEvents: 'none',
        });
        section.appendChild(canvas);
        ctx = canvas.getContext('2d');

        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, W, H);

        pixels = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const nx = c / cols;
                const ny = r / rows;
                const n1 = gNoise(nx * 7 + 0.5, ny * 7 + 0.3);
                const n2 = gNoise(nx * 22 + 1.7, ny * 22 + 0.9);
                const raw = n1 * 0.55 + n2 * 0.25 + Math.random() * 0.20;
                pixels.push({ x: c * PX, y: r * PX, t: raw, color: fillColor });
            }
        }
        pixels.sort((a, b) => a.t - b.t);

        const t0 = pixels[0].t;
        const tRange = pixels[pixels.length - 1].t - t0;
        pixels.forEach((p) => { p.t = (p.t - t0) / tRange; });

        if (startFull) {
            pointer = pixels.length;
            ctx.clearRect(0, 0, W, H);
            lastProgress = 1;
        } else {
            pointer = 0;
            lastProgress = 0;
        }
    }

    function render(progress) {
        if (!canvas) return;
        progress = Math.max(0, Math.min(1, progress));
        if (Math.abs(progress - lastProgress) < 0.0003) return;

        if (progress > lastProgress) {
            while (pointer < pixels.length && pixels[pointer].t <= progress) {
                const p = pixels[pointer++];
                ctx.clearRect(p.x, p.y, PX, PX);
            }
        } else {
            while (pointer > 0 && pixels[pointer - 1].t > progress) {
                pointer--;
                const p = pixels[pointer];
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, PX, PX);
            }
        }
        lastProgress = progress;
    }

    function destroy() {
        if (canvas) { canvas.remove(); canvas = null; }
        pixels = [];
        pointer = 0;
        lastProgress = -1;
    }

    const st = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'top 10%',
        scrub: 1,
        onEnter: () => build(false),
        onEnterBack: () => build(true),
        onLeave: () => destroy(),
        onLeaveBack: () => destroy(),
        onUpdate: (self) => render(self.progress),
    });

    return () => { st.kill(); destroy(); };
}

export function initDissolves() {
    const PX = window.innerWidth < 768 ? 6 : 4;
    const cleanups = [
        setupDissolve('.lineup', '#DCDDD5', PX),
        setupDissolve('.cant-miss', '#D2FF03', PX),
        setupDissolve('.faq', '#ff5e00', PX),
    ].filter(Boolean);
    return () => cleanups.forEach((fn) => fn());
}
