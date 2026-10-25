// ── Three.js Hero Distortion
// Escolhe o vídeo que o CSS realmente exibe neste breakpoint, em vez de
// repetir o valor do breakpoint aqui — os limites do CSS são 1024/1440 e
// um número fixo aqui deixava o iPad em landscape lendo um <video> com
// display:none (hero preto).
export function initHeroDistortion(THREE, { hero, canvas, desktopVideo, mobileVideo }) {
    const isVisible = (el) => el && getComputedStyle(el).display !== 'none';
    const video = isVisible(desktopVideo) ? desktopVideo : mobileVideo;
    if (!canvas || !video || !hero) {
        if (video) video.style.opacity = '1';
        return () => {};
    }

    const W = () => hero.offsetWidth;
    const H = () => hero.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W(), H());

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

    const tex = new THREE.VideoTexture(video);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    const mat = new THREE.ShaderMaterial({
        uniforms: {
            uTex: { value: tex },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uStr: { value: 0 },
            uAspect: { value: W() / H() },
        },
        vertexShader: vert,
        fragmentShader: frag,
    });

    scene.add(new THREE.Mesh(geo, mat));

    const tMouse = new THREE.Vector2(0.5, 0.5);
    const cMouse = new THREE.Vector2(0.5, 0.5);
    let tStr = 0;
    let cStr = 0;

    const onMove = (e) => {
        const r = hero.getBoundingClientRect();
        tMouse.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
        tStr = 1;
    };
    const onLeave = () => { tStr = 0; };
    const onTouchMove = (e) => {
        const t = e.touches[0];
        const r = hero.getBoundingClientRect();
        tMouse.set((t.clientX - r.left) / r.width, 1 - (t.clientY - r.top) / r.height);
        tStr = 1;
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    hero.addEventListener('touchmove', onTouchMove, { passive: true });
    hero.addEventListener('touchend', onLeave);

    let rafId = 0;
    function tick() {
        rafId = requestAnimationFrame(tick);
        cMouse.lerp(tMouse, 0.06);
        cStr += (tStr - cStr) * 0.06;
        mat.uniforms.uMouse.value.copy(cMouse);
        mat.uniforms.uStr.value = cStr;
        tex.needsUpdate = true;
        renderer.render(scene, camera);
        if (video.readyState >= 2) canvas.classList.add('is-ready');
    }
    tick();

    const onResize = () => {
        renderer.setSize(W(), H());
        mat.uniforms.uAspect.value = W() / H();
    };
    window.addEventListener('resize', onResize);

    return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', onResize);
        hero.removeEventListener('mousemove', onMove);
        hero.removeEventListener('mouseleave', onLeave);
        hero.removeEventListener('touchmove', onTouchMove);
        hero.removeEventListener('touchend', onLeave);
        tex.dispose();
        mat.dispose();
        geo.dispose();
        renderer.dispose();
    };
}
