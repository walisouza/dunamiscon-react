// ── Three.js Mouse Distortion — reaplicado nas fotos/vídeos das dobras
// (recap, galeria, line-up, ingressos, caravana, moments), com um único
// canvas/renderer compartilhado que "teleporta" para o elemento em hover.
import { registerDistortionDisabler } from '../lib/distortionControl';

const TARGETS = [
    '.recap-video-thumb',
    '.caravana-photo img',
    '.moments-video',
    '.galeria-card img',
    '.ticket-card img',
    '.lineup-card-img',
].join(', ');

export function initMouseDistortion(THREE) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};

    const targets = document.querySelectorAll(TARGETS);
    if (!targets.length) return () => {};

    const canvas = document.createElement('canvas');
    canvas.className = 'distort-webgl';
    document.body.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geo = new THREE.PlaneGeometry(2, 2);

    const vert = `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `;
    const frag = `
        uniform sampler2D uTex;
        uniform vec2      uMouse;
        uniform float     uStr;
        uniform float     uAspect;
        varying vec2 vUv;
        void main() {
            vec2 uv   = vUv;
            vec2 diff = uv - uMouse;
            diff.x   *= uAspect;
            float d   = length(diff);
            float fall= 1.0 - smoothstep(0.0, 0.28, d);
            uv       += normalize(diff + 0.001) * fall * uStr * -0.07;
            gl_FragColor = texture2D(uTex, clamp(uv, 0.0, 1.0));
        }
    `;

    const mat = new THREE.ShaderMaterial({
        uniforms: {
            uTex: { value: null },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uStr: { value: 0 },
            uAspect: { value: 1 },
        },
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
    });
    scene.add(new THREE.Mesh(geo, mat));

    const textureCache = new Map();
    function getTexture(el) {
        if (textureCache.has(el)) return textureCache.get(el);
        let tex;
        if (el.tagName === 'VIDEO') {
            tex = new THREE.VideoTexture(el);
        } else {
            // O <img> vai para um canvas 2D e de lá para uma CanvasTexture.
            // new THREE.Texture(<img>) não subia para a GPU (medido: o shader lia
            // preto/transparente), o que deixava este canvas todo transparente
            // por cima da foto. Pelo canvas 2D o upload é determinístico.
            const buf = document.createElement('canvas');
            tex = new THREE.CanvasTexture(buf);

            // O buffer tem a proporção da CAIXA do elemento, não a da imagem, e a
            // foto é desenhada dentro dele respeitando object-fit/object-position.
            // O shader mapeia a textura sobre a caixa inteira: desenhar a imagem
            // crua aqui a esticava (é o caso do .lineup-card-img, que na página
            // aparece com object-fit:contain e ancorado embaixo).
            const desenhar = () => {
                const nw = el.naturalWidth || el.width;
                const nh = el.naturalHeight || el.height;
                if (!nw || !nh) return;

                const r = el.getBoundingClientRect();
                const dpr = Math.min(devicePixelRatio, 2);
                const W = Math.max(1, Math.round(r.width * dpr));
                const H = Math.max(1, Math.round(r.height * dpr));
                if (buf.width !== W || buf.height !== H) { buf.width = W; buf.height = H; }

                const cs = getComputedStyle(el);
                const fit = cs.objectFit || 'fill';

                let dw = W;
                let dh = H;
                if (fit === 'contain' || fit === 'scale-down' || fit === 'cover') {
                    const escala = fit === 'cover'
                        ? Math.max(W / nw, H / nh)
                        : Math.min(W / nw, H / nh);
                    dw = nw * escala;
                    dh = nh * escala;
                }

                // object-position decide para que lado sobra o espaço restante.
                const fracao = (v) => {
                    if (v === 'left' || v === 'top') return 0;
                    if (v === 'right' || v === 'bottom') return 1;
                    if (v && v.endsWith('%')) return parseFloat(v) / 100;
                    return 0.5;
                };
                const pos = (cs.objectPosition || '50% 50%').split(/\s+/);

                const ctx = buf.getContext('2d');
                ctx.clearRect(0, 0, W, H);
                ctx.drawImage(el, (W - dw) * fracao(pos[0]), (H - dh) * fracao(pos[1]), dw, dh);
                tex.needsUpdate = true;
            };

            tex.__redesenhar = desenhar;
            if (el.complete && (el.naturalWidth || 0) > 0) desenhar();
            else el.addEventListener('load', desenhar, { once: true });
        }
        // Sem marcar colorSpace de propósito: marcada como sRGB, a textura é lida
        // já convertida para linear, e como este shader escreve gl_FragColor
        // direto (ShaderMaterial não aplica a conversão de saída), o valor linear
        // ia parar no canvas como se fosse sRGB — a imagem ganhava contraste no
        // hover. Sem a marcação os bytes passam intactos.
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        textureCache.set(el, tex);
        return tex;
    }

    function syncMask(el) {
        const cs = getComputedStyle(el);
        const raw = (cs.maskImage && cs.maskImage !== 'none') ? cs.maskImage
            : (cs.webkitMaskImage && cs.webkitMaskImage !== 'none') ? cs.webkitMaskImage
                : null;
        canvas.style.maskImage = raw || 'none';
        canvas.style.webkitMaskImage = raw || 'none';
        if (raw) {
            canvas.style.maskSize = '100% 100%';
            canvas.style.webkitMaskSize = '100% 100%';
            canvas.style.maskRepeat = 'no-repeat';
            canvas.style.webkitMaskRepeat = 'no-repeat';
            canvas.style.maskPosition = 'center';
            canvas.style.webkitMaskPosition = 'center';
        }
        canvas.style.borderRadius = (cs.borderRadius && cs.borderRadius !== '0px') ? cs.borderRadius : '0';
    }

    let lastW = 0;
    let lastH = 0;
    function positionCanvas(el) {
        const r = el.getBoundingClientRect();
        canvas.style.left = r.left + 'px';
        canvas.style.top = r.top + 'px';
        if (Math.round(r.width) !== lastW || Math.round(r.height) !== lastH) {
            lastW = Math.round(r.width);
            lastH = Math.round(r.height);
            renderer.setSize(r.width, r.height);
            mat.uniforms.uAspect.value = r.width / r.height;
        }
    }

    let activeTarget = null;
    const tMouse = new THREE.Vector2(0.5, 0.5);
    const cMouse = new THREE.Vector2(0.5, 0.5);
    let tStr = 0;
    let cStr = 0;
    let rafRunning = false;
    let rafId = 0;

    function activate(el) {
        activeTarget = el;
        const tex = getTexture(el);
        // Redesenha a cada hover: a caixa do elemento muda com o breakpoint e o
        // buffer é dimensionado a partir dela.
        if (tex.__redesenhar) tex.__redesenhar();
        mat.uniforms.uTex.value = tex;
        syncMask(el);
        positionCanvas(el);
        canvas.classList.add('is-active');
        tStr = 1;
        startLoop();
    }

    function deactivate(el) {
        tStr = 0;
        setTimeout(() => {
            if (activeTarget === el && cStr < 0.01) {
                canvas.classList.remove('is-active');
                activeTarget = null;
            }
        }, 260);
    }

    registerDistortionDisabler(() => {
        tStr = 0;
        cStr = 0;
        activeTarget = null;
        canvas.classList.remove('is-active');
    });

    const bindings = [];
    targets.forEach((el) => {
        // .lineup-card-img e .galeria-card img têm pointer-events:none no CSS, e
        // elemento sem pointer-events nunca recebe mouseenter — nesses dois o
        // efeito jamais disparava. Escuta no ancestral mais próximo que de fato
        // recebe o ponteiro, continuando a usar a <img> como textura e moldura.
        let host = el;
        while (host.parentElement && getComputedStyle(host).pointerEvents === 'none') {
            host = host.parentElement;
        }

        const onEnter = () => activate(el);
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            tMouse.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
        };
        const onLeave = () => deactivate(el);
        host.addEventListener('mouseenter', onEnter);
        host.addEventListener('mousemove', onMove);
        host.addEventListener('mouseleave', onLeave);
        bindings.push([host, onEnter, onMove, onLeave]);
    });

    function startLoop() {
        if (rafRunning) return;
        rafRunning = true;
        tick();
    }

    function tick() {
        if (!activeTarget && cStr < 0.001) {
            rafRunning = false;
            return;
        }
        rafId = requestAnimationFrame(tick);
        if (activeTarget) positionCanvas(activeTarget);
        cMouse.lerp(tMouse, 0.15);
        cStr += (tStr - cStr) * 0.15;
        mat.uniforms.uMouse.value.copy(cMouse);
        mat.uniforms.uStr.value = cStr;
        if (activeTarget && activeTarget.tagName === 'VIDEO' && mat.uniforms.uTex.value) {
            mat.uniforms.uTex.value.needsUpdate = true;
        }
        renderer.render(scene, camera);
    }

    return () => {
        cancelAnimationFrame(rafId);
        registerDistortionDisabler(null);
        bindings.forEach(([host, onEnter, onMove, onLeave]) => {
            host.removeEventListener('mouseenter', onEnter);
            host.removeEventListener('mousemove', onMove);
            host.removeEventListener('mouseleave', onLeave);
        });
        textureCache.forEach((tex) => tex.dispose());
        mat.dispose();
        geo.dispose();
        renderer.dispose();
        canvas.remove();
    };
}
