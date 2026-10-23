import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { asset, RECAP_VIDEO_URL } from '../lib/env';
import { startScroll, stopScroll } from '../lib/scroll';
import { disableMouseDistortion } from '../lib/distortionControl';

const HACK_CHARS = ['D', 'C', '2', '6'];
const PIXEL_SIZE = 5;

// Tela preta pixelada com "DC26" que se desfaz ao abrir o modal.
function spawnParticles(targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const w = Math.ceil(rect.width);
    const h = Math.ceil(rect.height);
    const cols = Math.ceil(w / PIXEL_SIZE);
    const rows = Math.ceil(h / PIXEL_SIZE);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.style.cssText = 'position:absolute;inset:0;z-index:9;pointer-events:none;';
    const ctx = canvas.getContext('2d');

    // Build schedule sorted by delay
    const schedule = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            schedule.push({
                x: c * PIXEL_SIZE,
                y: r * PIXEL_SIZE,
                delay: Math.random() * 1000,
                char: Math.random() < 0.18 ? HACK_CHARS[Math.floor(Math.random() * HACK_CHARS.length)] : null,
            });
        }
    }
    schedule.sort((a, b) => a.delay - b.delay);

    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, w, h);
    ctx.font = `bold ${PIXEL_SIZE}px "Courier New"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    schedule.forEach((p) => {
        if (p.char) {
            ctx.fillStyle = '#D2FF03';
            ctx.fillRect(p.x, p.y, PIXEL_SIZE, PIXEL_SIZE);
            ctx.fillStyle = '#0A0A0A';
            ctx.fillText(p.char, p.x + PIXEL_SIZE / 2, p.y + PIXEL_SIZE / 2);
        }
    });

    targetEl.appendChild(canvas);

    const startTime = performance.now();
    let pointer = 0;

    function tick(now) {
        const elapsed = now - startTime;
        while (pointer < schedule.length && schedule[pointer].delay <= elapsed) {
            const p = schedule[pointer++];
            ctx.clearRect(p.x, p.y, PIXEL_SIZE, PIXEL_SIZE);
        }
        if (pointer < schedule.length) requestAnimationFrame(tick);
        else setTimeout(() => canvas.remove(), 100);
    }
    requestAnimationFrame(tick);
}

export default function VideoModal({ open, onClose }) {
    const { t } = useI18n();
    const contentRef = useRef(null);
    const [src, setSrc] = useState('');

    useEffect(() => {
        if (!open) return;
        stopScroll();
        disableMouseDistortion();
        spawnParticles(contentRef.current);
        // O iframe só recebe o vídeo depois que o modal apareceu.
        const timer = setTimeout(() => setSrc(RECAP_VIDEO_URL), 300);
        return () => {
            clearTimeout(timer);
            setSrc('');
            startScroll();
        };
    }, [open]);

    return (
        <div className={'video-modal' + (open ? ' is-open' : '')} id="videoModal" aria-hidden={!open}>
            <div className="video-modal-backdrop" id="videoModalBackdrop" onClick={onClose}></div>
            <div className="video-modal-content" ref={contentRef}>
                <button className="video-modal-close" id="videoModalClose" aria-label={t('aria.close')} onClick={onClose}>
                    <img src={asset('assets/imagens/close-menu.png')} alt="Fechar" loading="lazy" decoding="async" width="128" height="87" />
                </button>
                <div className="video-modal-iframe-wrap">
                    <iframe id="videoModalIframe" src={src} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen title="Recap 2025"></iframe>
                </div>
            </div>
        </div>
    );
}
