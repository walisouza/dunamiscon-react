import { useEffect, useLayoutEffect, useRef } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { asset } from '../lib/env';
import { disableMouseDistortion } from '../lib/distortionControl';
import { gNoise } from '../effects/noise';

const FILL = '#0A0A0A';

// Modal genérico de biografia: o cartão aparece "dissolvendo" uma tela preta
// pixelada. `bio` é { name, p1, p2 } já no idioma atual; continua preenchido
// depois de fechar para o texto não sumir durante o fade-out.
export default function BioModal({ bio, open, onClose }) {
    const { t } = useI18n();
    const cardRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.body.style.overflow = 'hidden';
        disableMouseDistortion();
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    // Mede o cartão já com o texto novo, antes de pintar.
    useLayoutEffect(() => {
        if (!open) return;
        const card = cardRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const PX = window.innerWidth < 768 ? 6 : 4;

        const W = card.offsetWidth;
        const H = card.offsetHeight;
        canvas.width = W;
        canvas.height = H;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.fillStyle = FILL;
        ctx.fillRect(0, 0, W, H);

        const pixels = [];
        const cols = Math.ceil(W / PX);
        const rows = Math.ceil(H / PX);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const nx = c / cols;
                const ny = r / rows;
                const n1 = gNoise(nx * 7 + 0.5, ny * 7 + 0.3);
                const n2 = gNoise(nx * 22 + 1.7, ny * 22 + 0.9);
                const raw = n1 * 0.55 + n2 * 0.25 + Math.random() * 0.20;
                pixels.push({ x: c * PX, y: r * PX, t: raw });
            }
        }
        pixels.sort((a, b) => a.t - b.t);
        const t0 = pixels[0].t;
        const tRange = pixels[pixels.length - 1].t - t0;
        pixels.forEach((p) => { p.t = (p.t - t0) / tRange; });

        const DURATION = 1400;
        const start = performance.now();
        let pointer = 0;
        let rafId = 0;
        function tick(now) {
            const progress = Math.min((now - start) / DURATION, 1);
            while (pointer < pixels.length && pixels[pointer].t <= progress) {
                const p = pixels[pointer++];
                ctx.clearRect(p.x, p.y, PX, PX);
            }
            if (progress < 1) rafId = requestAnimationFrame(tick);
        }
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [bio, open]);

    const p1 = bio ? '<strong class="bio-name">' + (bio.name || '') + '</strong> ' + (bio.p1 || '') : '';
    const p2 = bio ? bio.p2 || '' : '';

    return (
        <div className={'bio-modal' + (open ? ' is-open' : '')} id="bioModal" aria-hidden={!open}>
            <div className="bio-modal-backdrop" onClick={onClose}></div>
            <div className="bio-modal-wrap">
                <div className="bio-modal-shadow"></div>
                <div className="bio-modal-card" ref={cardRef}>
                    <img src={asset('assets/imagens/bg-bio.png')} alt="" className="bio-modal-bg" aria-hidden="true"
                         loading="lazy" decoding="async" width="996" height="1195" />
                    <canvas className="bio-modal-canvas" ref={canvasRef}></canvas>
                    <div className="bio-modal-content">
                        <button className="bio-modal-close" aria-label={t('aria.close')} onClick={onClose}>&#x2715;</button>
                        <p className="bio-modal-text" dangerouslySetInnerHTML={{ __html: p1 }} />
                        <p className="bio-modal-text bio-modal-text--em bio-modal-p2" dangerouslySetInnerHTML={{ __html: p2 }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
